import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
const env=Object.fromEntries((await readFile('.env.local','utf8')).split('\n').filter(l=>l.includes('=')).map(l=>{const p=l.indexOf('=');return[l.slice(0,p),l.slice(p+1)];}));
const db=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false}});
const {data:owner}=await db.from('owners').select('user_id').maybeSingle();if(owner)throw new Error('Akun pemilik sudah ada. Tes penyiapan tidak dijalankan.');
const email=`bootstrap-${crypto.randomUUID()}@example.com`;const password=`Qa-${crypto.randomUUID()}`;let id='';
const base='http://127.0.0.1:3101';const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3101'],{env:{...process.env,...env,SITE_URL:base,OWNER_EMAIL:email},stdio:'ignore'});
try{
 for(let i=0;i<40;i++){try{const r=await fetch(`${base}/admin/register`);if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 async function register(token:string,requestedEmail=email){const response=await fetch(`${base}/api/auth`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'register',email:requestedEmail,password,token})});return {status:response.status,headers:response.headers,data:await response.json()};}
 const invalid=await register('incorrect');assert.equal(invalid.status,403);console.log('PASS invalid setup code denied');
 const wrongEmail=await register(env.ADMIN_SETUP_TOKEN,'wrong@example.com');assert.equal(wrongEmail.status,403);console.log('PASS setup restricts designated owner email');
 const valid=await register(env.ADMIN_SETUP_TOKEN);assert.equal(valid.status,200);assert.ok(valid.headers.getSetCookie().length);console.log('PASS hidden registration creates owner and session');
 const row=await db.from('owners').select('user_id').single();assert.ok(row.data);id=row.data.user_id;
 const duplicate=await register(env.ADMIN_SETUP_TOKEN);assert.equal(duplicate.status,409);console.log('PASS second owner registration rejected');
}finally{
 child.kill('SIGTERM');
 if(!id){const result=await db.auth.admin.listUsers();id=result.data.users.find(u=>u.email===email)?.id||'';}
 if(id){await db.from('owners').delete().eq('user_id',id);await db.auth.admin.deleteUser(id);}
 console.log('Bootstrap QA account removed.');
}
