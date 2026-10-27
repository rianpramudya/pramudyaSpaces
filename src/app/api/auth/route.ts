import { timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { oauthProviders } from '@/lib/oauth-providers';
import { ownerResetMatches,authSite } from '@/lib/auth-policy';
import { api,HttpError,rateLimit,readJson } from '@/lib/http';
import { sessionClient,serviceClient,requireOwner,isOwner } from '@/lib/supabase';
const credentials=z.object({email:z.email(),password:z.string().min(12).max(128)});
export async function POST(request:Request) {return api(request,async()=>{
 const input=await readJson(request); const action=input.action;
 const client=await sessionClient();
 if(action==='logout'){const {error}=await client.auth.signOut();if(error)throw new HttpError(400,'Tidak dapat keluar.');return {ok:true};}
 if(action==='oauth'){
  await rateLimit(request,'oauth',10,60);
  const provider=z.enum(['google','github']).parse(input.provider);
  const providers=await oauthProviders();if(providers[provider]!==true)throw new HttpError(503,`${provider==='github'?'GitHub':'Google'} belum tersedia untuk buku tamu. Admin perlu melengkapi konfigurasi provider.`);
  const site=process.env.SITE_URL;if(!site)throw new HttpError(503,'Alamat website belum diatur.');
  const {data,error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:`${authSite(request.url,site,request.headers.get('host')||undefined)}/auth/callback?next=${encodeURIComponent('/?guestbook=1')}`}});
  if(error||!data.url)throw new HttpError(503,'Login sosial belum tersedia.');return {url:data.url};
 }
 if(action==='reset'){
  await rateLimit(request,'reset',3,3600);
  const email=z.email().parse(input.email);const site=process.env.SITE_URL;
  if(!site)throw new HttpError(503,'Alamat website belum diatur.');
  const db=serviceClient();const {data:owner}=await db.from('owners').select('user_id').maybeSingle();
  const current=owner?await db.auth.admin.getUserById(owner.user_id):null;
  if(ownerResetMatches(email,current?.data.user?.email)) await client.auth.resetPasswordForEmail(email,{redirectTo:`${site}/auth/callback?next=/admin/settings`});
  return {ok:true,message:'Jika email terdaftar sebagai pemilik, tautan pemulihan akan dikirim.'};
 }
 if(action==='settings'){
  await requireOwner(); const update:z.infer<typeof credentials>|{email?:string;password?:string}={};
  if(input.email)update.email=z.email().parse(input.email);
  if(input.password)update.password=credentials.shape.password.parse(input.password);
  if(!update.email&&!update.password)throw new HttpError(400,'Isi email atau password baru.');
  const {error}=await client.auth.updateUser(update);
  if(error)throw new HttpError(400,'Perubahan akun gagal. Periksa password atau email.');
  return {ok:true,message:update.email?'Periksa email lama dan baru untuk mengonfirmasi perubahan.':'Password berhasil diperbarui.'};
 }
 if(action==='register'){
  await rateLimit(request,'setup',5,3600);
  const parsed=credentials.parse(input);
  const expected=process.env.ADMIN_SETUP_TOKEN||'';const provided=typeof input.token==='string'?input.token:'';
  const valid=expected.length>=32 && Buffer.byteLength(expected)===Buffer.byteLength(provided) && timingSafeEqual(Buffer.from(expected),Buffer.from(provided));
  if(!valid||parsed.email.toLowerCase()!==process.env.OWNER_EMAIL?.toLowerCase())throw new HttpError(403,'Email atau kode penyiapan tidak valid.');
  const db=serviceClient();const {count,error:ownerError}=await db.from('owners').select('*',{count:'exact',head:true});
  if(ownerError)throw new HttpError(503,'Skema database belum siap.');
  if(count)throw new HttpError(409,'Akun pemilik sudah dibuat. Gunakan halaman masuk.');
  const {data,error}=await db.auth.admin.createUser({email:parsed.email,password:parsed.password,email_confirm:true});
  if(error||!data.user)throw new HttpError(400,'Akun tidak dapat dibuat. Email mungkin sudah digunakan.');
  const claim=await db.from('owners').insert({singleton:true,user_id:data.user.id});
  if(claim.error){await db.auth.admin.deleteUser(data.user.id);throw new HttpError(409,'Penyiapan telah selesai pada permintaan lain. Gunakan halaman masuk.');}
  const signIn=await client.auth.signInWithPassword(parsed);if(signIn.error) return {ok:true,redirect:'/admin/login'};
  return {ok:true,redirect:'/admin'};
 }
 if(action==='login'){
  await rateLimit(request,'login',10,900);
  const parsed=z.object({email:z.email(),password:z.string().min(1).max(128)}).parse(input);
  const {data,error}=await client.auth.signInWithPassword(parsed);
  if(error||!await isOwner(data.user?.id)){await client.auth.signOut();throw new HttpError(401,'Email atau password pemilik tidak cocok.');}
  return {ok:true,redirect:'/admin'};
 }
 throw new HttpError(400,'Aksi akun tidak valid.');
});}
