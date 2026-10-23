import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {type Entry,emptyProfile} from '../src/lib/model';
import {selectedProjects} from '../src/lib/project-relations';
import {serviceProjects} from '../src/lib/presentation';
import {projectsUsingSkill} from '../src/lib/workspace-content';
import {entrySchema} from '../src/lib/validation';
import {projectPublicContent,translatePublicContent} from '../src/lib/content';
import {RelatedWorkLinks} from '../src/components/related-work-links';
import {ProjectPicker} from '../src/components/admin/project-picker';
import {AdminDashboard} from '../src/components/admin/dashboard';
import {EntryEditor} from '../src/components/admin/entry-editor';
import {ContentMap,CollectionGuide} from '../src/components/admin/content-map';
import {EducationFolio} from '../src/components/sections/education-folio';import {CredentialGallery} from '../src/components/sections/credential-gallery';
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
const entry=(id:string,kind:string,title:string,data:Record<string,unknown>={},published=true):Entry=>({id,kind,title,data,published,position:0});
const projects=[entry(a,'project','Portal',{technologies:['Laravel']}),entry(b,'project','Private',{},false)];
test('manual project relations preserve order and ignore drafts, deleted records, wrong kinds and duplicates',()=>{
 const other=entry('wrong','skill','Other');
 assert.deepEqual(selectedProjects(entry('s','service','Service',{related_project_ids:[b,a,'missing',a,'wrong']}),[...projects,other])?.map(p=>p.id),[a]);
 assert.equal(selectedProjects(entry('old','skill','Legacy'),projects),undefined);
 assert.deepEqual(selectedProjects(entry('none','skill','None',{related_project_ids:[]}),projects),[]);
});
test('manual selection overrides both automatic matchers including an intentionally empty selection',()=>{
 const service=entry('service','service','Website'),skill=entry('skill','skill','Laravel');
 assert.equal(projectsUsingSkill(skill,projects).length,1);
 assert.deepEqual(projectsUsingSkill({...skill,data:{related_project_ids:[]}},projects),[]);
 assert.deepEqual(serviceProjects({...service,data:{related_project_ids:[a]}},projects).map(p=>p.id),[a]);
 assert.deepEqual(projectsUsingSkill({...skill,title:'Different',data:{related_project_ids:[a]}},projects).map(p=>p.id),[a]);
});
test('entry save validation retains explicit relations, deduplicates and rejects invalid or oversized lists',()=>{
 const input={kind:'service',title:'Build',published:false,position:0,data:{description:'Keep me',related_project_ids:[a,a,b]}};
 const saved=entrySchema.parse(JSON.parse(JSON.stringify(input)));assert.deepEqual(saved.data.related_project_ids,[a,b]);assert.equal(saved.data.description,'Keep me');
 assert.equal(entrySchema.safeParse({...input,data:{related_project_ids:['not-an-id']}}).success,false);
 assert.equal(entrySchema.safeParse({...input,data:{related_project_ids:Array(31).fill(a)}}).success,false);
 assert.equal(entrySchema.parse({...input,data:{description:'Legacy'}}).data.related_project_ids,undefined);
});
test('public related work links and learning sections expose only published selected projects',()=>{
 const selected=entry('school','education','School',{related_project_ids:[a,b]}),cert=entry('cert','certificate','Course',{related_project_ids:[a,b]});
 for(const html of [renderToStaticMarkup(React.createElement(RelatedWorkLinks,{entry:selected,projects,en:false})),renderToStaticMarkup(React.createElement(EducationFolio,{education:[selected],languages:[],achievements:[],projects,en:false})),renderToStaticMarkup(React.createElement(CredentialGallery,{certificates:[cert],projects,en:false,onPreview:()=>{}}))]){assert.ok(html.includes(`/projects/${a}`));assert.ok(!html.includes('Private'));assert.ok(html.includes('Karya terkait'));}
 assert.equal(renderToStaticMarkup(React.createElement(RelatedWorkLinks,{entry:{...selected,data:{}},projects,en:true})), '');
});
test('admin content map leads to source editors and project picker exposes drafts without publishing them',()=>{
 const html=renderToStaticMarkup(React.createElement(ContentMap,{content:{profile:emptyProfile,records:projects,documents:[]}}));for(const value of ['/admin/profile','/admin/project','/admin/service','/admin/skill','1 terbit','1 draft'])assert.ok(html.includes(value),value);
 const picker=renderToStaticMarkup(React.createElement(ProjectPicker,{data:{related_project_ids:[a]},projects,automatic:true,onChange:()=>{}}));for(const value of ['Hubungkan dengan karya','Pilih proyek sendiri','Private · Draft','checked=""','1/30 dipilih'])assert.ok(picker.includes(value),value);
 const guide=renderToStaticMarkup(React.createElement(CollectionGuide,{kind:'service',records:[entry('s','service','Build',{related_project_ids:[a]})]}));assert.ok(guide.includes('/#services'));assert.ok(guide.includes('1 konten'));
});

test('public CMS projection and translation preserve manual selection without exposing draft project IDs',()=>{
 const record=entry('service','service','Build',{related_project_ids:[a,b,'missing',a]});
 const content=projectPublicContent({...emptyProfile,published:true},[...projects,record]);
 const published=content.records.find(e=>e.id==='service')!;assert.deepEqual(published.data.related_project_ids,[a]);
 const translated=translatePublicContent(content,{records:[{id:'service',title:'Translated',data:{related_project_ids:[b]}}]});
 assert.deepEqual(translated.records.find(e=>e.id==='service')?.data.related_project_ids,[a]);
 assert.deepEqual(selectedProjects(published,content.records)?.map(e=>e.id),[a]);
 const removed=projectPublicContent({...emptyProfile,published:true},[record]);assert.deepEqual(removed.records[0].data.related_project_ids,[]);
});

test('admin dashboard and all relationship editors render with the preserved publishing controls',()=>{
 const initial={profile:emptyProfile,records:projects,documents:[],connected:true};
 for(const tab of ['dashboard','project','service','skill','experience','education','certificate','achievement']){
  const html=renderToStaticMarkup(React.createElement(AdminDashboard,{initial,tab,accountEmail:'owner@example.com'}));
  assert.ok(html.includes('Studio konten'));assert.ok(html.includes('admin-navigation'));
  assert.ok(html.includes(tab==='dashboard'?'Peta halaman utama':'Tampil di halaman utama'));
 }
 for(const kind of ['service','skill','experience','education','certificate','achievement'] as const){
  const html=renderToStaticMarkup(React.createElement(EntryEditor,{kind,projects,entry:entry('test',kind,'Example',{related_project_ids:[a]},false),onClose:()=>{},onSaved:async()=>{},notify:()=>{}}));
  for(const value of ['Hubungkan dengan karya','Portal','Simpan draft','Terbitkan konten'])assert.ok(html.includes(value),kind+': '+value);
 }
});
