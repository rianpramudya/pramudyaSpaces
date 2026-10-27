import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ExperienceSection} from '../src/components/sections/experience-section';
import type {Entry} from '../src/lib/model';
const make=(id:string,kind:string,data:Record<string,unknown>={},published=true):Entry=>({id,kind,title:`Title ${id}`,position:0,published,data});
const experiences=[make('work','experience',{organization:'Public office',start:'2025',end:'2026',description:'A genuine responsibility',bullets:['A genuine contribution'],related_project_ids:['project','draft'],related_certificate_ids:['certificate']}),make('organization','experience',{organization:'Student association',start:'2024',current:true})];
const projects=[make('project','project',{technologies:['Laravel']}),make('draft','project',{},false)];
const certificates=[make('certificate','certificate')];
function render(en=false){return renderToStaticMarkup(React.createElement(ExperienceSection,{experiences,projects,certificates,title:'Journey',en}));}
test('experience selector exposes each CMS record and initially shows exactly one detail panel',()=>{
 const html=render();
 assert.equal((html.match(/class="experience-choice"/g)||[]).length,2);
 assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
 assert.equal((html.match(/class="experience-chapter"[^>]*hidden=""/g)||[]).length,1);
 for(const value of ['Public office','Student association','A genuine responsibility','A genuine contribution','Sekarang'])assert.ok(html.includes(value),value);
});
test('experience presentation preserves only public project/certificate evidence and translated controls',()=>{
 const html=render(true);
 assert.ok(html.includes('href="/projects/project"'));
 assert.ok(html.includes('href="#certificate-certificate"'));
 assert.ok(!html.includes('href="/projects/draft"'));
 assert.ok(html.includes('Choose an experience'));
 assert.ok(html.includes('Present'));
 assert.ok(html.includes('Project overview'));
});
