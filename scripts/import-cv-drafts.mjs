import {createClient} from '@supabase/supabase-js';
import {readFileSync,writeFileSync} from 'node:fs';
process.loadEnvFile('.env.local');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false}});
const prepared=JSON.parse(readFileSync('docs/cv-content-prepared.json','utf8'));
const {data:profile,error:pError}=await db.from('profile').select('*').eq('id','main').single();if(pError)throw new Error(pError.message);
const {data:existing,error:eError}=await db.from('entries').select('*');if(eError)throw new Error(eError.message);
writeFileSync('/tmp/pramudya-before-cv-import.json',JSON.stringify({profile,entries:existing},null,2),{mode:0o600});
const additions=prepared.records.filter(r=>!existing.some(e=>e.kind===r.kind&&e.title.toLowerCase()===r.title.toLowerCase()));
for(const r of additions){r.published=false;r.position+=Math.max(-1,...existing.filter(e=>e.kind===r.kind).map(e=>e.position))+1;}
if(additions.length){const result=await db.from('entries').insert(additions);if(result.error)throw new Error(result.error.message);}
const {data:verified,error:vError}=await db.from('entries').select('kind,title,published');if(vError)throw new Error(vError.message);
const counts={};for(const e of verified)counts[e.kind]=(counts[e.kind]||0)+1;
console.log(JSON.stringify({insertedDrafts:additions.length,counts,publicProfileUnchanged:true,publishedEntries:verified.filter(e=>e.published).length}));
