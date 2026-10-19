import { bulkPublicationSchema,updatePublication } from '@/lib/bulk-publication';
import { kinds } from '@/lib/model';
import { api,readJson,HttpError } from '@/lib/http';
import { requireOwner,sessionClient } from '@/lib/supabase';
import { getContent } from '@/lib/repository';
import { profileSchema,entrySchema,sectionDescriptionSchema } from '@/lib/validation';
import { z } from 'zod';
export async function GET(request:Request){return api(request,async()=>{await requireOwner();return getContent();});}
export async function POST(request:Request){return api(request,async()=>{
 await requireOwner();const input=await readJson(request);const db=await sessionClient();
 if(input.type==='reorder'){
  const {id,kind,direction}=z.object({id:z.uuid(),kind:z.enum(kinds),direction:z.enum(['up','down'])}).parse(input);
  const {error}=await db.rpc('reorder_entry',{entry_id:id,entry_kind:kind,move_direction:direction});
  if(error)throw new HttpError(409,'Urutan belum berubah. Muat ulang daftar dan coba kembali.');return {ok:true};
 }
 if(input.type==='publish-many'){
  const {ids,published}=bulkPublicationSchema.parse(input);const kind=z.enum(kinds).parse(input.kind);
  const count=await updatePublication(db,'entries',ids,published,kind);return {ok:true,count};
 }
 if(input.type==='section-copy'){
  const {key,value}=sectionDescriptionSchema.parse(input);
  const current=await db.from('profile').select('section_copy').eq('id','main').single();if(current.error)throw new HttpError(400,'Pengantar gagal dimuat.');
  const {error}=await db.from('profile').update({section_copy:{...current.data.section_copy,[key]:value},updated_at:new Date().toISOString()}).eq('id','main');if(error)throw new HttpError(400,'Pengantar gagal disimpan.');return {ok:true};
 }
 if(input.type==='letter'){
  const letter=profileSchema.pick({letter_recipient:true,letter_role:true,letter_body:true}).parse(input.value);
  const {error}=await db.from('profile').update({...letter,updated_at:new Date().toISOString()}).eq('id','main');
  if(error)throw new HttpError(400,'Surat gagal disimpan.');return {ok:true};
 }
 if(input.type==='profile'){
  const profile=profileSchema.parse(input.value);
  const {error}=await db.from('profile').upsert({...profile,updated_at:new Date().toISOString()});
  if(error)throw new HttpError(400,'Profil gagal disimpan.');return {ok:true};
 }
 if(input.type==='entry'){
  const entry=entrySchema.parse(input.value);const {data,error}=await db.from('entries').upsert({...entry,updated_at:new Date().toISOString()}).select().single();
  if(error)throw new HttpError(400,'Konten gagal disimpan.');return {ok:true,entry:data};
 }
 if(input.type==='delete'){
  const id=z.uuid().parse(input.id);const {error}=await db.from('entries').delete().eq('id',id);if(error)throw new HttpError(400,'Konten gagal dihapus.');return {ok:true};
 }
 throw new HttpError(400,'Jenis konten tidak valid.');
});}
