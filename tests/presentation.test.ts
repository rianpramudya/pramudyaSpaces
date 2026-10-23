import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {type Entry} from '../src/lib/model';
import {hasConceptMedia,serviceProjects} from '../src/lib/presentation';
import {ProjectCover} from '../src/components/projects/project-cover';
import {StudioServices} from '../src/components/sections/services-studio';
import {CredentialGallery} from '../src/components/sections/credential-gallery';
const entry=(id:string,kind:string,data:Record<string,unknown>={},published=true):Entry=>({id,kind,title:id,published,position:0,data});

test('authored dummy labels get editorial covers while real screenshots remain intact',()=>{
 const concept=entry('Portal','project',{alt:'Ilustrasi dummy, bukan screenshot asli.',media:['uploads/dummy.png'],role:'Developer',technologies:['Laravel 11']});
 assert.ok(hasConceptMedia(concept));const html=renderToStaticMarkup(React.createElement(ProjectCover,{entry:concept,en:false}));
 for(const text of ['Portal','Sampul konsep','Developer','Laravel 11'])assert.ok(html.includes(text),text);assert.ok(!html.includes('<img'));assert.ok(!html.includes('uploads/dummy.png'));
 const actual=entry('Real product','project',{alt:'Actual application screenshot',media:['uploads/product.webp']});const real=renderToStaticMarkup(React.createElement(ProjectCover,{entry:actual,en:true}));assert.ok(real.includes('/api/media/uploads/product.webp'));assert.ok(real.includes('Actual application screenshot'));assert.ok(!real.includes('Concept cover'));
 const missing=renderToStaticMarkup(React.createElement(ProjectCover,{entry:entry('No image','project'),en:true}));assert.ok(missing.includes('Project overview'));assert.ok(!missing.includes('src=""'));
});
test('related service work uses published authored topics, including actual contribution notes',()=>{
 const api=entry('API integration','service',{description:'Integrasi API'}),ai=entry('AI prototype','service');
 const projects=[entry('Logistics','project',{bullets:['Built a RESTful API']}),entry('Skin analysis','project',{role:'Computer Vision'}),entry('Unrelated','project',{description:'A personal portfolio'}),entry('Draft','project',{description:'API'},false)];
 assert.deepEqual(serviceProjects(api,projects).map(x=>x.id),['Logistics']);assert.deepEqual(serviceProjects(ai,projects).map(x=>x.id),['Skin analysis']);
 assert.equal(serviceProjects(entry('Other','service'),projects).length,0);
});
test('service selector preserves every service and its details, without exposing draft project evidence',()=>{
 const html=renderToStaticMarkup(React.createElement(StudioServices,{services:[entry('Web service (dummy)','service',{description:'Build a website',bullets:['Full service scope']}),entry('AI service','service',{description:'Second authored description'})],projects:[entry('Public project','project',{role:'Web developer'}),entry('Private project','project',{role:'Web developer'},false)],en:true}));
 for(const text of ['Web service (dummy)','AI service','Full service scope','Second authored description','Public project','aria-expanded="true"','Related by topic','href="#contact"'])assert.ok(html.includes(text),text);assert.ok(!html.includes('Private project'));
});
test('dummy certificate illustrations remain explicitly described and accessible via preview action',()=>{
 const html=renderToStaticMarkup(React.createElement(CredentialGallery,{certificates:[entry('Actual course title','certificate',{issuer:'Issuer',media:['uploads/demo.png'],alt:'Gambar dummy, bukan dokumen asli.'})],en:true,onPreview:()=>{}}));
 for(const text of ['Actual course title','Issuer','Learning record','not the original document','View illustration','Preview Actual course title'])assert.ok(html.includes(text),text);assert.ok(!html.includes('<img'));
});
