import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Portfolio} from '../src/components/portfolio';
import {StudioHome} from '../src/components/studio-home';
import {emptyProfile,type PublicContent,type Entry} from '../src/lib/model';
const entry=(kind:string,title:string,data:Record<string,unknown>={},published=true):Entry=>({id:kind+'-'+title,kind,title,data,published,position:0});
const render=(content:PublicContent,options={})=>renderToStaticMarkup(React.createElement(Portfolio,{initial:content,...options}));
const empty={profile:emptyProfile,records:[],documents:[]};
test('studio renders CMS identity and published projects without exposing admin navigation',()=>{
 const html=render({...empty,profile:{...emptyProfile,published:true,name:'CMS Owner',headline:'CMS focus',summary:'CMS summary'},records:[entry('project','CMS Project',{description:'Real description'})]});
 for(const value of ['CMS Owner','CMS summary','CMS Project','Real description','studio-site'])assert.ok(html.includes(value),value);
 assert.ok(!html.includes('/admin/register'));assert.ok(!html.includes('/admin/settings'));
});
test('empty studio remains readable without broken images, services or invented personal facts',()=>{
 const html=render(empty);assert.ok(html.includes('Profil sedang disiapkan'));assert.ok(html.includes('Proyek yang diterbitkan'));assert.ok(!html.includes('id="services"'));assert.ok(!html.includes('Unduh CV'));assert.ok(!html.includes('src=""'));assert.ok(!html.includes('>Rian<'));
});
test('photographic hero uses the CMS grayscale/reveal pair and retires the 3D initials',()=>{
 const html=render({...empty,profile:{...emptyProfile,name:'Dewi Putri',headline:'Software engineer',hero_photo:'uploads/base.webp',hero_reveal_photo:'uploads/reveal.webp',hero_photo_alt:'Owner on stairs'}});
 assert.ok(html.includes('data-experience="liquid-portrait"'));assert.ok(html.includes('/api/media/uploads/base.webp'));assert.ok(html.includes('Owner on stairs'));assert.ok(html.includes('fetchPriority="high"'));assert.ok(!html.includes('sculpture-stage'));assert.ok(!html.includes('Putar objek'));assert.ok(!html.includes('Simbol identitas RPA'));
});
test('hero falls back to the managed profile photo when a dedicated hero is not selected',()=>{
 const html=render({...empty,profile:{...emptyProfile,name:'Owner',photo:'uploads/profile.webp',photo_alt:'CMS photo'}});assert.ok(html.includes('/api/media/uploads/profile.webp'));assert.ok(html.includes('alt="CMS photo"'));
});
test('studio order places metrics between hero and about and navigation follows the page',()=>{
 const records=['project','experience','skill','education','language','achievement','certificate','service'].map(kind=>entry(kind,'CMS '+kind,{description:'Description '+kind,category:'Tools'}));
 const html=render({...empty,records});let previous=-1;
 for(const id of ['home','about','background','journey','projects','skills','certificates','services','playground','contact']){const current=html.indexOf(`id="${id}"`);assert.ok(current>previous,id);previous=current;}
 for(const record of records)assert.ok(html.includes(record.title),record.title);
 assert.ok(html.includes('studio-create-band'));
 const metrics=html.indexOf('class="studio-stats studio-shell"');
 assert.ok(metrics>html.indexOf('id="home"') && metrics<html.indexOf('id="about"'));
 assert.equal(html.split('class="studio-stats studio-shell"').length-1,1);
 const chapters=html.match(/<nav class="cinematic-chapters"[^>]*>(.*?)<\/nav>/s)?.[1] || '';
 const order=['home','about','background','journey','projects','skills','certificates','services','playground','contact'];
 assert.deepEqual([...chapters.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]),order);
 const primary=html.match(/<nav class="studio-primary-nav"[^>]*>(.*?)<\/nav>/s)?.[1] || '';
 assert.deepEqual([...primary.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]),['home','about','projects','services','contact']);
});
test('draft projects, skills, education and credentials stay hidden throughout the studio',()=>{
 const html=render({...empty,records:['project','skill','education','certificate'].map(kind=>entry(kind,'Private '+kind,{technologies:['Secret technology']},false))});assert.ok(!html.includes('Private '));assert.ok(!html.includes('Secret technology'));assert.ok(!html.includes('id="background"'));assert.ok(!html.includes('id="certificates"'));
});
test('selected work links to full case studies and a searchable sortable archive',()=>{
 const records=[entry('project','Visible',{date:'2025',role:'Engineer',technologies:['TypeScript']})];const html=render({...empty,records});assert.ok(html.includes('studio-gallery'));assert.ok(html.includes('href="/projects/project-Visible"'));assert.ok(html.includes('href="/projects"'));
 const archive=render({...empty,records},{archive:true});for(const value of ['Terbaru','Terlama','2025','href="/#about"'])assert.ok(archive.includes(value),value);
});
test('full project evidence remains accessible in the case study',()=>{
 const project=entry('project','Actual project',{context:'Actual problem',result:'Actual outcome',bullets:['Actual contribution'],technologies:['TypeScript'],description:'Actual description'});
 const html=render({...empty,records:[project]},{projectId:project.id});for(const fact of ['Actual problem','Actual outcome','Actual contribution','Actual description','TypeScript','href="/projects"'])assert.ok(html.includes(fact),fact);
});
test('biography keeps every CMS paragraph and exposes only the published featured CV',()=>{
 const profile={...emptyProfile,name:'Dewi',summary:'First paragraph.\n\nSecond CMS paragraph.',featured_cv:'cv'};
 const html=render({...empty,profile,documents:[{id:'cv',title:'My CV',path:'uploads/resume.pdf',published:true,format:'ats',created_at:''}]});for(const fact of ['First paragraph.','Second CMS paragraph.','Unduh CV','resume.pdf?download=1'])assert.ok(html.includes(fact),fact);assert.ok(html.includes('studio-biography'));
});
test('contact visibility and professional links respect CMS settings',()=>{
 const profile={...emptyProfile,name:'Owner',email:'private@example.com',phone:'+621234',show_email:false,show_phone:false,socials:[{label:'Code profile',url:'https://example.com/code'}]};const html=render({...empty,profile});assert.ok(!html.includes('private@example.com'));assert.ok(!html.includes('tel:+621234'));assert.ok(html.includes('https://example.com/code'));
 const publicHtml=render({...empty,profile:{...profile,show_email:true,show_phone:true}});assert.ok(publicHtml.includes('mailto:private@example.com'));assert.ok(publicHtml.includes('tel:+621234'));
});
test('runner, guestbook and AI remain available after Studio removal',()=>{
 const html=render({...empty,profile:{...emptyProfile,name:'Rian',status:'open',location:'CMS city'},records:[entry('skill','TypeScript')]});for(const value of ['runner-game','id="playground"','Buka buku tamu','Buka asisten AI','Terbuka untuk bekerja','CMS city'])assert.ok(html.includes(value),value);assert.match(html,/<details class="studio-play-panel"><summary>/);assert.ok(html.includes('Istirahat sambil bermain'));assert.ok(!html.includes('arcade-lane'));assert.ok(!html.includes('dock-content'));
});
test('English studio uses the same CMS content and working page anchors',()=>{
 const html=renderToStaticMarkup(React.createElement(StudioHome,{content:{...empty,profile:{...emptyProfile,name:'Dewi',headline:'Engineer',summary:'CMS biography'},records:[entry('service','CMS service')]},language:'en',onCertificate:()=>{}}));for(const value of ['Dewi','CMS biography','CMS service','View work','Send message','href="#projects"','id="playground"'])assert.ok(html.includes(value),value);assert.ok(!html.includes('Lumora'));assert.ok(!html.includes('200+ brands'));
});
test('empty archive and normal case-study routes remain usable',()=>{
 assert.ok(render(empty,{archive:true}).includes('Belum ada proyek yang cocok.'));const project=entry('project','Case');const html=render({...empty,records:[project]},{projectId:project.id});assert.ok(html.includes('data-page="case-study"'));assert.ok(html.includes('href="/projects"'));
});

test('focused gallery lists every published project and exposes keyboard instructions and case detail',()=>{
 const records=Array.from({length:6},(_,i)=>entry('project',`Project ${i}`,{description:'Managed summary',role:'Developer',technologies:['TypeScript']}));
 const html=render({...empty,records});
 for(const item of records)assert.ok(html.includes(item.title),item.title);
 for(const value of ['aria-roledescription="karusel"','Gunakan tombol panah kiri dan kanan','Proses, kontribusi &amp; hasil','aria-pressed="true"','Proyek berikutnya','06'])assert.ok(html.includes(value),value);
 assert.ok(!html.includes('studio-project-grid'));
});

test('about restores the original managed formal photo independently from the hero pair',()=>{
 const html=render({...empty,profile:{...emptyProfile,name:'Owner',photo:'uploads/original-formal.jpg',photo_alt:'Original formal portrait',hero_photo:'uploads/hero.webp',hero_reveal_photo:'uploads/color.webp',summary:'Full CMS biography'}});
 const about=html.slice(html.indexOf('id="about"'),html.indexOf('id="projects"'));
 for(const value of ['studio-formal-frame','/api/media/uploads/original-formal.jpg','Original formal portrait','Full CMS biography','studio-create-band'])assert.ok(about.includes(value),value);
 assert.ok(!about.includes('uploads/hero.webp'));assert.ok(!about.includes('create-tile'));
});

test('formal portrait has no empty or invented image when the CMS profile photo is unset',()=>{
 const html=render({...empty,profile:{...emptyProfile,name:'Owner',hero_photo:'uploads/hero.webp'}});
 const about=html.slice(html.indexOf('id="about"'),html.indexOf('id="projects"'));
 assert.ok(about.includes('studio-portrait-empty'));assert.ok(!about.includes('<img'));assert.ok(!about.includes('src=""'));
});

test('contact renders one usable form inline and all contact entry points remain native anchors',()=>{
 const html=render({...empty,profile:{...emptyProfile,name:'Owner',email:'hello@example.com',show_email:true}});
 const section=html.slice(html.indexOf('id="contact"'),html.indexOf('</main>'));
 assert.equal((section.match(/<form\b/g)||[]).length,1);
 assert.ok(section.includes('method="post"'));
 for(const field of ['name','email','subject','message','website'])assert.ok(section.includes(`name="${field}"`),field);
 for(const text of ['Kirim pesan','mailto:hello@example.com','studio-contact-compose'])assert.ok(section.includes(text),text);
 assert.ok(!section.includes('<dialog'));assert.ok(!html.includes('Ceritakan yang ingin Anda bangun.'));
 assert.ok((html.match(/href="#contact"/g)||[]).length>=3);
});
