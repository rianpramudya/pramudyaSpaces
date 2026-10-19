import { api,readJson,HttpError } from '@/lib/http';
import { requireOwner,sessionClient } from '@/lib/supabase';
import { getEnglishContent } from '@/lib/translation';
import { getPublicContent } from '@/lib/repository';
import { sourceFingerprint,translationInput,translatePublicContent } from '@/lib/content';
import { translationSegments,applyTranslationRows,type TranslationRow } from '@/lib/translation-segments';
export async function GET(request:Request){return api(request,async()=>{
 await requireOwner();const content=await getPublicContent();const source=translationInput(content);const {data,error}=await (await sessionClient()).from('translations').select('*').like('id','en:%');if(error)throw new HttpError(503,'Terjemahan gagal dimuat.');
 const rows=data as TranslationRow[];const complete=translationSegments(content).every(s=>rows.some(row=>row.id===s.id&&row.source_hash===s.hash));const hash=sourceFingerprint(source);
 return {source,translation:rows.length?{source_hash:complete?hash:'stale',override:translationInput(applyTranslationRows(content,rows)),automatic:null}:null,hash};
});}
export async function POST(request:Request){return api(request,async()=>{
 await requireOwner();const input=await readJson(request);if(input.action==='generate')return getEnglishContent();
 const content=await getPublicContent();const hash=sourceFingerprint(translationInput(content));
 if(input.hash!==hash)throw new HttpError(409,'Konten sumber telah berubah. Muat ulang sebelum menyimpan koreksi.');
 const translated=translatePublicContent(content,input.value);const overrides=translationSegments(translated);const source=translationSegments(content);
 const rows=source.map(segment=>({id:segment.id,source_hash:segment.hash,override:overrides.find(s=>s.id===segment.id)?.value||segment.value,updated_at:new Date().toISOString()}));
 const {error}=await (await sessionClient()).from('translations').upsert(rows);if(error)throw new HttpError(400,'Koreksi gagal disimpan.');return {ok:true};
});}
