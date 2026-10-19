import { NextResponse } from 'next/server';
import { requireOwner,sessionClient,serviceClient } from '@/lib/supabase';
import { api,failure,originCheck,HttpError,readJson } from '@/lib/http';
import { validateUpload } from '@/lib/validation';
import { getContent } from '@/lib/repository';
export async function GET(request:Request){return api(request,async()=>{await requireOwner();const {data,error}=await (await sessionClient()).from('media').select('*').order('created_at',{ascending:false});if(error)throw new HttpError(503,'Media gagal dimuat.');return {media:data};});}
export async function POST(request:Request){try{
 originCheck(request);await requireOwner();
 if(Number(request.headers.get('content-length')||0)>11*1024*1024)throw new HttpError(413,'Berkas terlalu besar.');
 const form=await request.formData();const file=form.get('file');if(!(file instanceof File))throw new HttpError(400,'Pilih berkas.');
 if(file.size>10*1024*1024)throw new HttpError(413,'Berkas terlalu besar.');
 const bytes=new Uint8Array(await file.arrayBuffer());const ext=validateUpload(bytes,file.type,file.size);const path=`uploads/${crypto.randomUUID()}.${ext}`;
 const db=await sessionClient();const upload=await db.storage.from('portfolio').upload(path,bytes,{contentType:file.type,upsert:false});
 if(upload.error)throw new HttpError(400,'Upload gagal. Periksa konfigurasi Storage.');
 const saved=await db.from('media').insert({path,name:file.name.slice(0,240),mime:file.type,size:file.size});
 if(saved.error){await db.storage.from('portfolio').remove([path]);throw new HttpError(400,'Informasi media gagal disimpan.');}
 return NextResponse.json({path,name:file.name,mime:file.type});
 }catch(error){return failure(error);}}
export async function DELETE(request:Request){return api(request,async()=>{
 await requireOwner();const {path}=await readJson(request);if(typeof path!=='string')throw new HttpError(400,'Path tidak valid.');
 const content=await getContent();const referenced=content.profile.photo===path||content.documents.some(d=>d.path===path)||content.records.some(e=>Array.isArray(e.data.media)&&e.data.media.includes(path));
 if(referenced)throw new HttpError(409,'Media masih digunakan. Lepaskan dari konten atau dokumen terlebih dahulu.');
 const db=await sessionClient();const {error}=await db.storage.from('portfolio').remove([path]);if(error)throw new HttpError(400,'Media gagal dihapus.');
 const removed=await db.from('media').delete().eq('path',path);if(removed.error)throw new HttpError(400,'Informasi media gagal dihapus.');return {ok:true};
});}
