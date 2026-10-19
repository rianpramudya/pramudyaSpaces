import { bulkPublicationSchema,updatePublication } from '@/lib/bulk-publication';
import { api,HttpError,readJson } from '@/lib/http';
import { requireOwner,sessionClient } from '@/lib/supabase';
import { getContent } from '@/lib/repository';
import { sourceFingerprint } from '@/lib/content';
import { renderCareerPDF } from '@/lib/career-pdf';
import { z } from 'zod';
export const runtime='nodejs';
export async function POST(request:Request){return api(request,async()=>{
 await requireOwner();const input=await readJson(request);const db=await sessionClient();
 if(input.action==='publish-many'){
  const {ids,published}=bulkPublicationSchema.parse(input);const count=await updatePublication(db,'documents',ids,published);return {ok:true,count};
 }
 if(input.action==='generate'){
  const format=z.enum(['ats','creative','letter']).parse(input.format);const {profile,records}=await getContent();
  if(!profile.name)throw new HttpError(400,'Isi nama profil terlebih dahulu.');
  if(format==='letter'&&!profile.letter_body)throw new HttpError(400,'Isi surat lamaran di form dokumen terlebih dahulu.');
  const buffer=await renderCareerPDF(profile,records,format);const path=`uploads/${crypto.randomUUID()}.pdf`;
  const {error}=await db.storage.from('portfolio').upload(path,buffer,{contentType:'application/pdf'});if(error)throw new HttpError(503,'PDF gagal diunggah.');
  const title=`${format==='ats'?'CV ATS':format==='creative'?'CV Kreatif':'Surat Lamaran'} – ${profile.name}`;
  const saved=await db.from('documents').insert({title,format,path,published:false,source_hash:sourceFingerprint({profile,records})});
  if(saved.error){await db.storage.from('portfolio').remove([path]);throw new HttpError(503,'Dokumen gagal disimpan.');}
  return {ok:true};
 }
 if(input.action==='upload'){
  const parsed=z.object({path:z.string().regex(/^uploads\/[a-f0-9-]+\.pdf$/),title:z.string().trim().min(1).max(240)}).parse(input);
  const {data}=await db.from('media').select('path,mime').eq('path',parsed.path).single();if(!data||data.mime!=='application/pdf')throw new HttpError(400,'Pilih PDF yang sudah diunggah.');
  const {error}=await db.from('documents').insert({...parsed,format:'upload'});if(error)throw new HttpError(400,'Dokumen gagal ditambahkan.');return {ok:true};
 }
 const id=z.uuid().parse(input.id);
 if(input.action==='publish'){
  const published=z.boolean().parse(input.published);const {error}=await db.from('documents').update({published}).eq('id',id);if(error)throw new HttpError(400,'Publikasi gagal.');return {ok:true};
 }
 if(input.action==='feature'){
  const {data}=await db.from('documents').select('*').eq('id',id).single();if(!data?.published||data.format==='letter')throw new HttpError(400,'CV unggulan harus diterbitkan dan bukan surat lamaran.');
  const {error}=await db.from('profile').update({featured_cv:id,updated_at:new Date().toISOString()}).eq('id','main');if(error)throw new HttpError(400,'CV unggulan gagal disimpan.');return {ok:true};
 }
 if(input.action==='delete'){
  const {data}=await db.from('documents').select('path').eq('id',id).single();if(!data)throw new HttpError(404,'Dokumen tidak ditemukan.');
  const removed=await db.from('documents').delete().eq('id',id);if(removed.error)throw new HttpError(400,'Dokumen gagal dihapus.');
  await db.from('profile').update({featured_cv:''}).eq('id','main').eq('featured_cv',id);
  const {data:media}=await db.from('media').select('path').eq('path',data.path).maybeSingle();if(!media)await db.storage.from('portfolio').remove([data.path]);return {ok:true};
 }
 throw new HttpError(400,'Aksi dokumen tidak valid.');
});}
