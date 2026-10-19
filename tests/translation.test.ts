import test from 'node:test';
import assert from 'node:assert/strict';
import { translationSegments,applyTranslationRows } from '../src/lib/translation-segments';
import { emptyProfile,type PublicContent } from '../src/lib/model';
test('editing one project retains overrides for unchanged profile and other projects',()=>{
 const content:PublicContent={profile:{...emptyProfile,published:true,headline:'Pengembang'},records:[{id:'a',kind:'project',title:'A',published:true,position:0,data:{description:'Lama'}},{id:'b',kind:'service',title:'Layanan',published:true,position:1,data:{description:'Tetap'}}],documents:[]};
 const segments=translationSegments(content);const rows=segments.map(s=>({id:s.id,source_hash:s.hash,automatic:s.value,override:s.id==='en:entry:b'?{records:[{id:'b',title:'Reviewed service',data:{description:'Reviewed description'}}]}:s.id==='en:profile:headline'?{profile:{headline:'Reviewed headline'}}:null}));
 const updated={...content,records:content.records.map(r=>r.id==='a'?{...r,data:{description:'Baru'}}:r)};
 const result=applyTranslationRows(updated,rows);
 assert.equal(result.records.find(r=>r.id==='b')?.title,'Reviewed service');assert.equal(result.profile.headline,'Reviewed headline');assert.equal(result.records.find(r=>r.id==='a')?.data.description,'Baru');
});
