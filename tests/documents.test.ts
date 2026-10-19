import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCareerSections } from '../src/lib/career-data';
import { emptyProfile, type Entry } from '../src/lib/model';
test('ATS maps all CV sections from CMS including education and organization',()=>{
 const make=(kind:string,title:string,data:Record<string,unknown>):Entry=>({id:kind,kind,title,data,position:0,published:false});
 const entries=[make('skill','Python',{category:'Backend'}),make('experience','Developer',{type:'work',organization:'Office',bullets:['Built an API']}),make('education','University',{degree:'Informatics',gpa:'3.49 / 4.00'}),make('experience','Staff',{type:'organization',organization:'HIMA'}),make('certificate','TOEFL',{credential:'123',issuer:'Course'})];
 const sections=buildCareerSections({...emptyProfile,name:'Rian'},entries);
 assert.ok(sections.some(s=>s.title==='EDUCATION'&&s.items.some(i=>i.meta.includes('3.49'))));
 assert.ok(sections.some(s=>s.title==='ORGANIZATIONAL EXPERIENCE'&&s.items.some(i=>i.title==='Staff')));
 assert.ok(sections.some(s=>s.title==='CERTIFICATIONS'&&s.items.some(i=>i.lines.some(l=>l.includes('123')))));
});
test('empty sections omitted and source bullets preserved verbatim',()=>{
 const sections=buildCareerSections({...emptyProfile},[{id:'a',kind:'project',title:'Project',data:{bullets:['Exact words.']},position:0,published:false}]);
 assert.equal(sections.length,1);assert.deepEqual(sections[0].items[0].lines,['Exact words.']);
});
test('CV preserves language proficiency entered in CMS',()=>{
 const sections=buildCareerSections(emptyProfile,[{id:'lang',kind:'language',title:'English',published:false,position:0,data:{level:'Professional working proficiency'}}]);
 assert.ok(JSON.stringify(sections).includes('Professional working proficiency'));
});
