import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {type Entry,emptyProfile} from '../src/lib/model';
import {selectedCertificates,certificateFromHash,certificateConnections} from '../src/lib/certificate-relations';
import {entrySchema} from '../src/lib/validation';
import {projectPublicContent,translatePublicContent} from '../src/lib/content';
import {EntryEditor} from '../src/components/admin/entry-editor';
import {RelatedCertificates} from '../src/components/related-certificates';
import {ExperienceSection} from '../src/components/sections/experience-section';
import {EducationFolio} from '../src/components/sections/education-folio';
import {CredentialGallery} from '../src/components/sections/credential-gallery';
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002',c='00000000-0000-4000-8000-000000000003';
const record=(id:string,kind:string,title:string,data:Record<string,unknown>={},published=true):Entry=>({id,kind,title,data,published,position:0});
const certificates=[record(a,'certificate','Sertifikat HIMA IF 1'),record(b,'certificate','Sertifikat HIMA IF 2'),record(c,'certificate','Private credential',{},false)];
const experience=record('experience','experience','HIMA IF',{related_certificate_ids:[a,b,c,'missing',a]});
test('certificate selection preserves authored order and omits draft, deleted, wrong-kind and duplicate IDs',()=>{
  assert.deepEqual(selectedCertificates(experience,[...certificates,record('missing','project','Wrong kind')]).map(e=>e.id),[a,b]);
  assert.deepEqual(selectedCertificates(record('none','language','English'),certificates),[]);
});
test('save validation retains certificate links alongside work links and rejects invalid or excessive IDs',()=>{
  const input={kind:'language',title:'English',published:false,position:0,data:{level:'Assessment',related_project_ids:[a],related_certificate_ids:[a,a,b]}};
  const saved=entrySchema.parse(JSON.parse(JSON.stringify(input)));
  assert.deepEqual(saved.data.related_certificate_ids,[a,b]);assert.deepEqual(saved.data.related_project_ids,[a]);
  assert.equal(entrySchema.safeParse({...input,data:{related_certificate_ids:['invalid']}}).success,false);
  assert.equal(entrySchema.safeParse({...input,data:{related_certificate_ids:Array(31).fill(a)}}).success,false);
});
test('public projection and translation never reveal draft certificate IDs or replace authored relationships',()=>{
  const publicContent=projectPublicContent({...emptyProfile,published:true},[experience,...certificates]);
  assert.deepEqual(publicContent.records.find(e=>e.id==='experience')?.data.related_certificate_ids,[a,b]);
  const translated=translatePublicContent(publicContent,{records:[{id:'experience',title:'Translated',data:{related_certificate_ids:[c]}}]});
  assert.deepEqual(translated.records.find(e=>e.id==='experience')?.data.related_certificate_ids,[a,b]);
  const unpublished=projectPublicContent({...emptyProfile,published:true},[experience,...certificates.map(e=>({...e,published:false}))]);
  assert.deepEqual(unpublished.records[0].data.related_certificate_ids,[]);
});
test('experience, language and education editors offer existing certificates; certificate editors show backlinks',()=>{
  const handlers={onClose:()=>{},onSaved:async()=>{},notify:()=>{}};
  for(const kind of ['experience','language','education'] as const){
    const html=renderToStaticMarkup(React.createElement(EntryEditor,{kind,entry:record('source',kind,'Source',{related_certificate_ids:[a,b]}),records:certificates,...handlers}));
    for(const text of ['Sertifikat pendukung','Sertifikat HIMA IF 1','Sertifikat HIMA IF 2','Private credential · Draft','2/30'])assert.ok(html.includes(text),kind+': '+text);
  }
  const html=renderToStaticMarkup(React.createElement(EntryEditor,{kind:'certificate',entry:certificates[0],records:[experience,...certificates],...handlers}));
  assert.ok(html.includes('/admin/experience?edit=experience'));
});
test('public source sections render exact certificate targets and no private credentials',()=>{
  const language=record('lang','language','English',{related_certificate_ids:[b,c]});
  const education=record('school','education','University',{related_certificate_ids:[a]});
  for(const html of [renderToStaticMarkup(React.createElement(RelatedCertificates,{entry:experience,certificates,en:false})),renderToStaticMarkup(React.createElement(ExperienceSection,{experiences:[experience],projects:[],certificates,title:'Experience',en:false})),renderToStaticMarkup(React.createElement(EducationFolio,{education:[education],languages:[language],achievements:[],certificates,en:true}))]){
    assert.ok(html.includes(`#certificate-${a}`));assert.ok(!html.includes('Private credential'));
  }
  const gallery=renderToStaticMarkup(React.createElement(CredentialGallery,{certificates:certificates.slice(0,2),en:false,onPreview:()=>{}}));
  assert.ok(gallery.includes(`id="certificate-${b}"`));
  assert.ok(gallery.includes(`id="certificate-${b}" tabindex="-1"`));
});
test('hash selection resolves only existing published certificates and reverse links retain source status',()=>{
  assert.equal(certificateFromHash(`#certificate-${b}`,certificates)?.id,b);
  assert.equal(certificateFromHash(`#certificate-${c}`,certificates),undefined);
  assert.equal(certificateFromHash('#certificate-unknown',certificates),undefined);
  const linked=certificateConnections(certificates[0],[experience,{...experience,id:'draft-source',published:false},record('wrong','project','Not a source',{related_certificate_ids:[a]})]);
  assert.deepEqual(linked.map(e=>[e.id,e.published]),[['experience',true],['draft-source',false]]);
});
