import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
const env=Object.fromEntries((await readFile('.env.local','utf8')).split('\n').filter(l=>l.includes('=')).map(l=>{const at=l.indexOf('=');return [l.slice(0,at),l.slice(at+1)];}));
assert.ok(env.GEMINI_API_KEY,'Isi GEMINI_API_KEY sebelum tes ini.');
const db=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false}});
const base=env.SITE_URL;const id=crypto.randomUUID();const draftId=crypto.randomUUID();const marker=`PRIVATE_QA_${crypto.randomUUID()}`;const translationId=`en:entry:${id}`;
async function call(path:string,body?:unknown){const r=await fetch(`${base}${path}`,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(35000)});return {status:r.status,data:await r.json()};}
try{
 const inserted=await db.from('entries').insert([{id,kind:'service',title:'Pengembangan aplikasi web',published:true,position:99999,data:{description:'Membangun aplikasi web dengan TypeScript.'}},{id:draftId,kind:'certificate',title:marker,published:false,position:99999,data:{description:'Private QA certificate'}}]);
 assert.equal(inserted.error,null);console.log('Temporary public and draft QA fixtures created.');
 const chat=await call('/api/chat',{message:'Layanan apa yang tersedia?',language:'id',session:crypto.randomUUID(),history:[]});
 assert.equal(chat.status,200,String(chat.data.error||'Chatbot failed'));assert.ok(chat.data.answer.includes('TypeScript')||/aplikasi|web/i.test(chat.data.answer));assert.ok(!chat.data.answer.includes(marker));console.log('PASS Indonesian chatbot answers from published CMS facts.');
 const translation=await call('/api/translate');assert.equal(translation.status,200);assert.equal(translation.data.fallback,false,'Provider translation used fallback.');
 const entry=translation.data.content.records.find((record:{id:string})=>record.id===id);assert.ok(entry);assert.match(entry.data.description,/TypeScript/);assert.match(entry.data.description,/web|application|build|develop/i);assert.ok(!JSON.stringify(translation.data).includes(marker));console.log('PASS automatic English translation preserves technology and excludes draft.');
 const row=await db.from('translations').select('*').eq('id',translationId).single();assert.ok(row.data);assert.equal(row.error,null);const timestamp=row.data.updated_at;
 const cached=await call('/api/translate');assert.equal(cached.data.fallback,false);const cachedRow=await db.from('translations').select('updated_at').eq('id',translationId).single();assert.equal(cachedRow.data?.updated_at,timestamp);console.log('PASS second English request reuses persisted cache.');
 const overrideText='Reviewed English description: building web applications with TypeScript.';
 const correction=await db.from('translations').update({override:{records:[{id,title:'Web application development',data:{description:overrideText}}]}}).eq('id',translationId);assert.equal(correction.error,null);
 const corrected=await call('/api/translate');assert.equal(corrected.data.content.records.find((record:{id:string})=>record.id===id).data.description,overrideText);console.log('PASS admin override is used instead of automatic translation.');
 const english=await call('/api/chat',{message:'Which language is used for the web development service?',language:'en',session:crypto.randomUUID(),history:[]});assert.equal(english.status,200,String(english.data.error||'English chatbot failed'));assert.match(english.data.answer,/TypeScript/);assert.ok(!english.data.answer.includes(marker));console.log('PASS English chatbot uses available public translation.');
 const unknown=await call('/api/chat',{message:'Apa nama sertifikat yang masih draft dan belum dipublikasikan?',language:'id',session:crypto.randomUUID(),history:[]});assert.equal(unknown.status,200,String(unknown.data.error||'Unknown-facts check failed'));assert.ok(!unknown.data.answer.includes(marker));console.log('PASS chatbot does not reveal draft certificate.');
 console.log('AI integration checks passed: 6.');
}finally{
 await db.from('entries').delete().in('id',[id,draftId]);await db.from('translations').delete().eq('id',translationId);console.log('Temporary AI QA fixtures removed.');
}
