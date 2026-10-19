import { adminMessageQuerySchema,messageSearchFilter } from '@/lib/admin-message-policy';
import { api,HttpError,readJson } from '@/lib/http';
import { requireOwner,sessionClient } from '@/lib/supabase';
import { z } from 'zod';
export async function GET(request:Request){return api(request,async()=>{
 await requireOwner();const params=new URL(request.url).searchParams;const {page,search,status}=adminMessageQuerySchema.parse(Object.fromEntries(params));
 let query=(await sessionClient()).from('guestbook').select('*',{count:'exact'}).order('created_at',{ascending:false}).order('id',{ascending:false});
 if(search)query=query.or(messageSearchFilter(search,true));
 
 const {data,error,count}=await query.range(page*50,page*50+49);if(error)throw new HttpError(503,'Buku tamu gagal dimuat.');return {messages:data,total:count||0,hasMore:(page+1)*50<(count||0)};
});}

export async function POST(request:Request){return api(request,async()=>{
 const user=await requireOwner();const input=z.object({id:z.uuid(),reply:z.string().trim().max(2000).optional(),remove:z.boolean().optional()}).parse(await readJson(request));const db=await sessionClient();
 const {data:message}=await db.from('guestbook').select('user_id').eq('id',input.id).single();
 if(input.remove&&message?.user_id===user.id)throw new HttpError(400,'Pesan pemilik tidak termasuk aksi hapus pesan pengunjung.');
 const {error}=input.remove?await db.from('guestbook').delete().eq('id',input.id):await db.from('guestbook').update({reply:input.reply||'',reply_updated_at:new Date().toISOString()}).eq('id',input.id);
 if(error)throw new HttpError(400,'Pesan gagal diperbarui.');return {ok:true};
});}
