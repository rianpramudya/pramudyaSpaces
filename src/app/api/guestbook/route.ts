import { api,HttpError,rateLimit,readJson } from '@/lib/http';
import { currentUser,isOwner,serviceClient } from '@/lib/supabase';
import { canWriteGuestbook,guestbookName } from '@/lib/guestbook-auth';
import { oauthProviders } from '@/lib/oauth-providers';
import { guestbookSchema } from '@/lib/validation';
export async function GET(request:Request){return api(request,async()=>{
 const page=Math.max(0,Math.min(1000,Number(new URL(request.url).searchParams.get('page'))||0));
 const db=serviceClient();const {data,error,count}=await db.from('guestbook').select('id,name,avatar,body,reply,created_at,reply_updated_at',{count:'exact'}).eq('hidden',false).order('created_at',{ascending:false}).range(page*20,page*20+19);
 if(error)throw new HttpError(503,'Buku tamu belum tersedia.');const user=await currentUser();
 const owner=user?await isOwner(user.id):false;
 const {data:profile}=owner?await db.from('profile').select('name').maybeSingle():{data:null};
 return {messages:data,total:count,providers:await oauthProviders(),user:user?{name:guestbookName(user,owner,profile?.name||''),isOwner:owner,canWrite:canWriteGuestbook(user,owner)}:null,hasMore:(page+1)*20<(count||0)};
});}
export async function POST(request:Request){return api(request,async()=>{
 const user=await currentUser();const owner=user?await isOwner(user.id):false;
 if(!user||!canWriteGuestbook(user,owner))throw new HttpError(401,'Pengunjung perlu masuk dengan GitHub atau Google. Admin cukup menggunakan akun pemilik.');
 const {body}=guestbookSchema.parse(await readJson(request));await rateLimit(request,'guestbook',3,60,user.id);await rateLimit(request,'guestbook-day',20,86400,user.id);
 const rawAvatar=String(user.user_metadata.avatar_url||user.user_metadata.picture||'');const avatar=/^https:\/\//.test(rawAvatar)?rawAvatar.slice(0,2000):'';
 const db=serviceClient();const {data:profile}=owner?await db.from('profile').select('name').maybeSingle():{data:null};
 const {error}=await db.from('guestbook').insert({user_id:user.id,name:guestbookName(user,owner,profile?.name||''),avatar,body});
 if(error)throw new HttpError(503,'Pesan gagal dikirim.');return {ok:true};
});}
