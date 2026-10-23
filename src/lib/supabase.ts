import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { HttpError } from './http-error';
export function configured() { return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_SECRET_KEY); }
export function serviceClient() {
 if(!configured()) throw new Error('Database belum terhubung. Lengkapi konfigurasi Supabase.');
 return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
}
export async function sessionClient() {
 if(!configured()) throw new Error('Autentikasi belum terhubung.');
 const store=await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{
  cookies:{getAll:()=>store.getAll(),setAll:(values)=>{try{values.forEach(({name,value,options})=>store.set(name,value,options));}catch{/* Server components cannot write cookies; proxy refreshes. */}}},
 });
}
export async function currentUser() {
 if(!configured()) return null;
 const client=await sessionClient(); const {data,error}=await client.auth.getUser();
 if(error) return null;
 return data.user;
}
export async function isOwner(userId?:string) {
 if(!userId || !configured()) return false;
 const {data,error}=await serviceClient().from('owners').select('user_id').eq('user_id',userId).maybeSingle();
 return !error && Boolean(data);
}
export async function requireOwner() {
 const user=await currentUser(); if(!user || !await isOwner(user.id)) throw new HttpError(403,'Akses hanya untuk pemilik.'); return user;
}
