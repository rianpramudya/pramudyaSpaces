import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
const env=Object.fromEntries((await readFile('.env.local','utf8')).split('\n').filter(line=>line.includes('=')).map(line=>{const at=line.indexOf('=');return [line.slice(0,at),line.slice(at+1)];}));
const base=env.SITE_URL;
const db=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false}});
const anon=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}});
const tag=crypto.randomUUID();const email=`qa-${tag}@example.com`;const password=`Test-${tag}!`;
const {data:existingOwner,error:ownerError}=await db.from('owners').select('user_id').maybeSingle();
if(ownerError)throw new Error('Database belum dapat diakses.');if(existingOwner)throw new Error('Integration check memerlukan database tanpa akun pemilik. Tidak mengubah akun yang ada.');
const original=await db.from('profile').select('*').eq('id','main').single();assert.ok(original.data);
let cookie='';let userId='';let projectId='';let inboxId='';let documentId='';const assets:string[]=[];const translationIds:string[]=[];
let assertions=0;const check=(name:string,fn:()=>void)=>{fn();assertions++;console.log(`PASS ${name}`);};
async function call(path:string,body?:unknown,authenticated=true,method?:string){
 const response=await fetch(`${base}${path}`,{method:method||(body?'POST':'GET'),headers:{...(body?{'Content-Type':'application/json'}:{}),...(authenticated&&cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined,redirect:'manual'});
 if(path==='/api/auth'){const values=response.headers.getSetCookie();if(values.length)cookie=values.map(v=>v.split(';')[0]).join('; ');}
 let value:Record<string,any>={};try{value=await response.json();}catch{}
 return {status:response.status,value,response};
}
try{
 const denied=await call('/api/admin/content',undefined,false);check('anonymous admin API returns 403',()=>assert.equal(denied.status,403));
 const redirect=await fetch(`${base}/admin`,{redirect:'manual'});check('admin page redirects without session',()=>assert.equal(redirect.status,307));
 const publicHtml=await (await fetch(base)).text();check('guest has no register/account controls',()=>{assert.ok(!publicHtml.includes('/admin/register'));assert.ok(!publicHtml.includes('/admin/settings'));});
 const created=await db.auth.admin.createUser({email,password,email_confirm:true});assert.ok(created.data.user,created.error?.message||'QA user creation failed');userId=created.data.user.id;
 const claimed=await db.from('owners').insert({user_id:userId});assert.equal(claimed.error,null);
 const login=await call('/api/auth',{action:'login',email,password});check('owner login sets session cookies',()=>{assert.equal(login.status,200);assert.ok(cookie.includes('auth-token'));});
 const content=await call('/api/admin/content');check('owner reads CMS',()=>assert.equal(content.status,200));
 const profile={...content.value.profile,name:`QA Owner ${tag}`,headline:'Pengembang',summary:'Test summary',section_copy:{projects_title:'CMS editorial title',contact_description:'CMS contact description'},email:'private-qa@example.com',phone:'0812345',show_email:false,show_phone:false,published:true,socials:[]};
 const save=await call('/api/admin/content',{type:'profile',value:profile});check('owner saves profile',()=>assert.equal(save.status,200));
 const projected=await call('/api/public',undefined,false);check('public contacts filtered',()=>{assert.equal(projected.value.profile.email,'');assert.equal(projected.value.profile.phone,'');assert.equal(projected.value.profile.name,profile.name);assert.equal(projected.value.profile.section_copy.projects_title,'CMS editorial title');});
 const other=await db.auth.admin.createUser({email:`visitor-${tag}@example.com`,password,email_confirm:true});assert.ok(other.data.user);const visitorId=other.data.user.id;
 try{
 const visitor=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}});await visitor.auth.signInWithPassword({email:`visitor-${tag}@example.com`,password});
 const rls=await visitor.from('profile').select('*');check('non-owner RLS reads no profile',()=>assert.deepEqual(rls.data,[]));
 const write=await visitor.from('entries').insert({kind:'project',title:'Forbidden'});check('non-owner RLS cannot write CMS',()=>assert.ok(write.error));
 const limits=await visitor.rpc('consume_limit',{limit_key:'forbidden',maximum:100,window_seconds:60});check('visitor cannot bypass rate limits RPC',()=>assert.ok(limits.error));
 const guest=await call('/api/guestbook',{body:'Password-only user cannot post'},false);check('guestbook requires social login',()=>assert.equal(guest.status,401));
 }finally{await db.auth.admin.deleteUser(visitorId);}
 const anonRead=await anon.from('profile').select('*');check('anon direct table has no private access',()=>assert.ok(anonRead.error||anonRead.data?.length===0));
 const uploadForm=new FormData();uploadForm.set('file',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64')],{type:'image/png'}),'test.png');
 const uploadResponse=await fetch(`${base}/api/admin/media`,{method:'POST',headers:{Cookie:cookie},body:uploadForm});const upload=await uploadResponse.json();check('owner uploads private image',()=>assert.equal(uploadResponse.status,200));const imagePath=upload.path;assets.push(imagePath);
 const mediaPrivate=await fetch(`${base}/api/media/${imagePath}`);check('unreferenced image denied publicly',()=>assert.equal(mediaPrivate.status,404));
 const entry=await call('/api/admin/content',{type:'entry',value:{kind:'project',title:`QA project ${tag}`,position:0,published:false,data:{description:'QA project description',media:[imagePath],role:'Developer',technologies:['TypeScript'],bullets:['Original project contribution.']}}});assert.equal(entry.status,200);projectId=entry.value.entry.id;
 const draft=await call('/api/public',undefined,false);check('draft project absent from public data',()=>assert.ok(!draft.value.records.some((e:any)=>e.id===projectId)));
 const published=await call('/api/admin/content',{type:'entry',value:{...entry.value.entry,published:true}});check('owner publishes project',()=>assert.equal(published.status,200));
 const imagePublic=await fetch(`${base}/api/media/${imagePath}`);check('published reference grants public image',()=>{assert.equal(imagePublic.status,200);assert.equal(imagePublic.headers.get('content-type'),'image/png');});
 const publicProject=await fetch(`${base}/projects/${projectId}`);check('published project URL works',()=>assert.equal(publicProject.status,200));
 const removeUsed=await call('/api/admin/media',{path:imagePath},true,'DELETE');check('referenced media deletion rejected',()=>assert.equal(removeUsed.status,409));
 const message=await call('/api/contact',{name:'QA Visitor',email,subject:`QA ${tag}`,message:'Contact integration test message.',website:''},false);check('contact persists to Inbox',()=>assert.equal(message.status,200));
 const inbox=await call('/api/admin/inbox');const found=inbox.value.messages.find((m:any)=>m.subject===`QA ${tag}`);assert.ok(found);inboxId=found.id;
 const marked=await call('/api/admin/inbox',{id:inboxId,status:'read'});check('admin marks Inbox read',()=>assert.equal(marked.status,200));
 const unsafe=await fetch(`${base}/api/admin/content`,{method:'POST',headers:{Cookie:cookie,Origin:'https://evil.example','Content-Type':'application/json'},body:JSON.stringify({type:'profile',value:profile})});check('cross-origin write denied',()=>assert.equal(unsafe.status,403));
 const generate=await call('/api/admin/documents',{action:'generate',format:'ats'});check('ATS PDF generation succeeds',()=>assert.equal(generate.status,200));
 const afterGenerate=await call('/api/admin/content');const doc=afterGenerate.value.documents.find((d:any)=>d.title.includes(profile.name));assert.ok(doc);documentId=doc.id;assets.push(doc.path);
 const privatePdf=await fetch(`${base}/api/media/${doc.path}`);check('generated PDF private by default',()=>assert.equal(privatePdf.status,404));
 const ownerPdf=await fetch(`${base}/api/media/${doc.path}`,{headers:{Cookie:cookie}});const pdf=Buffer.from(await ownerPdf.arrayBuffer());check('owner PDF download valid',()=>{assert.equal(ownerPdf.status,200);assert.equal(pdf.subarray(0,5).toString(),'%PDF-');});
 await call('/api/admin/documents',{action:'publish',id:doc.id,published:true});const featured=await call('/api/admin/documents',{action:'feature',id:doc.id});check('admin selects published featured CV',()=>assert.equal(featured.status,200));
 const publicPdf=await fetch(`${base}/api/media/${doc.path}`);check('explicitly published PDF publicly accessible',()=>assert.equal(publicPdf.status,200));
 const translationId=`en:qa:${tag}`;translationIds.push(translationId);
 await db.from('translations').insert({id:translationId,source_hash:'a',automatic:{},override:{reviewed:'preserved'}});
 await db.rpc('cache_translation',{translation_id:translationId,translation_hash:'a',translation_auto:{changed:true}});
 const preserved=await db.from('translations').select('override').eq('id',translationId).single();check('translation cache preserves concurrent matching override',()=>assert.deepEqual(preserved.data?.override,{reviewed:'preserved'}));
 const chat=await call('/api/chat',{message:'Apa proyek yang dikerjakan?',language:'id',session:crypto.randomUUID(),history:[]},false);if(!env.GEMINI_API_KEY)check('missing AI provider returns clear failure',()=>{assert.equal(chat.status,503);assert.ok(String(chat.value.error).includes('kontak'));});else check('chatbot responds using configured provider',()=>{assert.equal(chat.status,200);assert.ok(chat.value.answer);});
 const limitKey=`qa:${tag}`;
 const [l1,l2]=await Promise.all([db.rpc('consume_limit',{limit_key:limitKey,maximum:1,window_seconds:60}),db.rpc('consume_limit',{limit_key:limitKey,maximum:1,window_seconds:60})]);check('atomic rate limit admits exactly one concurrent call',()=>assert.equal([l1.data,l2.data].filter(Boolean).length,1));await db.from('request_limits').delete().eq('key',limitKey);
 const newEmail=`changed-${tag}@example.com`;await db.auth.admin.updateUserById(userId,{email:newEmail});
 const reset=await call('/api/auth',{action:'reset',email:newEmail},false);check('password reset endpoint accepts changed owner address',()=>assert.equal(reset.status,200));
 const logout=await call('/api/auth',{action:'logout'});check('owner can logout',()=>assert.equal(logout.status,200));
 console.log(`Integration assertions passed: ${assertions}`);
}finally{
 if(projectId)await db.from('entries').delete().eq('id',projectId);
 if(inboxId)await db.from('inbox').delete().eq('id',inboxId);
 if(documentId)await db.from('documents').delete().eq('id',documentId);
 if(translationIds.length)await db.from('translations').delete().in('id',translationIds);
 if(assets.length){await db.storage.from('portfolio').remove(assets);await db.from('media').delete().in('path',assets);}
 if(original.data)await db.from('profile').upsert(original.data);
 if(userId){await db.from('owners').delete().eq('user_id',userId);await db.auth.admin.deleteUser(userId);}
 console.log('Temporary QA data removed.');
}
