import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {EducationFolio} from '../src/components/sections/education-folio';import {CredentialGallery} from '../src/components/sections/credential-gallery';
import {StudioWorkspace} from '../src/components/sections/skills-workspace';
import {type Entry} from '../src/lib/model';
const entry=(id:string,kind:string,data:Record<string,unknown>={}):Entry=>({id,kind,title:id,data,published:true,position:0});

test('academic folio preserves degree, GPA, full contributions, languages and dummy labels',()=>{
 const html=renderToStaticMarkup(React.createElement(EducationFolio,{education:[entry('University','education',{degree:'Informatics',start:'2022',end:'2026',gpa:'3.49 / 4.00',description:'Actual education',bullets:['Full contribution']})],languages:[entry('English','language',{level:'Prediction 640',description:'Actual assessment'})],achievements:[entry('Award (dummy)','achievement',{date:'2026',description:'Explicit dummy note',bullets:['Actual milestone detail'],url:'https://example.com/proof'})],en:false}));
 for(const text of ['University','Informatics','3.49 / 4.00','Full contribution','English','Prediction 640','Actual assessment','Award (dummy)','Explicit dummy note','Actual milestone detail','https://example.com/proof'])assert.ok(html.includes(text),text);
 assert.ok(html.includes('<details>'));assert.ok(!html.includes('studio-background-grid'));
});
test('credential archive lists every document and keeps descriptions and missing images safe',()=>{
 const certificates=[entry('First credential','certificate',{media:['uploads/cert.webp'],issuer:'Issuer',date:'2026',description:'First details',credential:'ID-123'}),entry('Second credential','certificate',{description:'Second details'})];
 const html=renderToStaticMarkup(React.createElement(CredentialGallery,{certificates,en:true,onPreview:()=>{}}));
 for(const text of ['First credential','Second credential','Issuer','2026','ID-123','First details','Second details','aria-pressed="true"','View document','aria-controls='])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('src=""'));
 const fallback=renderToStaticMarkup(React.createElement(CredentialGallery,{certificates:[certificates[1]],en:true,onPreview:()=>{}}));assert.ok(fallback.includes('credential-no-image'));assert.ok(!fallback.includes('<img'));
 assert.equal(renderToStaticMarkup(React.createElement(CredentialGallery,{certificates:[],en:true,onPreview:()=>{}})),'');
});
test('workspace exposes categories and a real linked project without invented proficiency metrics',()=>{
 const html=renderToStaticMarkup(React.createElement(StudioWorkspace,{skills:[entry('Laravel','skill',{category:'Backend'}),entry('Figma','skill',{category:'Design'})],projects:[entry('Portal','project',{technologies:['Laravel 11'],media:['uploads/portal.webp']})],en:true}));
 for(const text of ['role="tablist"','aria-selected="true"','role="tabpanel"','Laravel','Design','Used in this project','href="/projects/Portal"'])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('%'));assert.ok(!html.includes('progressbar'));
});
