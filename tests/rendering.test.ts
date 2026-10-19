import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Portfolio } from '../src/components/portfolio';
import { emptyProfile,type PublicContent } from '../src/lib/model';
test('guest renders CMS content without registration or account settings',()=>{
 const content:PublicContent={profile:{...emptyProfile,published:true,name:'CMS Owner',headline:'CMS Headline',summary:'CMS summary'},records:[{id:'a',kind:'project',title:'CMS Project',published:true,position:0,data:{description:'Real project'}}],documents:[]};
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:content}));
 assert.ok(html.includes('CMS Owner'));assert.ok(html.includes('CMS Project'));assert.ok(html.includes('CMS summary'));
 assert.ok(!html.includes('/admin/register'));assert.ok(!html.includes('/admin/settings'));
});
test('optional services and CV button absent when no published data',()=>{
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:{profile:emptyProfile,records:[],documents:[]}}));
 assert.ok(!html.includes('id="services"'));assert.ok(!html.includes('Unduh CV'));assert.ok(html.includes('Profil sedang disiapkan'));
 assert.match(html,/<h1[^>]*>Nama Anda<\/h1>/);
});
test('reference-inspired profile keeps public status and guestbook action in the playful status rail',()=>{
 const content:PublicContent={profile:{...emptyProfile,published:true,name:'Rian Pramudya Amanda',headline:'Full Stack Developer',location:'Jambi, ID',status:'open'},records:[],documents:[]};
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:content}));
 assert.ok(html.includes('class="site-status-rail" role="group" aria-label="Status profil"'));
 assert.ok(html.includes('aria-label="Status profil"'));
 assert.ok(html.includes('Open to work'));
 assert.ok(html.includes('Jambi, ID'));
 assert.ok(html.includes('aria-label="Buka buku tamu"'));
});
test('spatial identity leads into a dedicated play desk and chibi heroes remain available',()=>{
 const content:PublicContent={profile:{...emptyProfile,published:true,name:'Rian Pramudya Amanda'},records:[{id:'skill',kind:'skill',title:'UI/UX',published:true,position:0,data:{category:'Design'}}],documents:[]};
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:content}));
 const blocks=html.indexOf('class="skill-blocks"');const title=html.indexOf('<h1 class="hero-name');
 assert.ok(title>=0&&blocks>title);
 assert.ok(html.includes('class="sculpture-stage sculpture-hero"'));
 assert.ok(html.includes('id="playground"'));
 assert.ok(html.includes('Putar objek'));
 assert.ok(html.includes('href="#skills"'));
 assert.ok(html.includes('aria-label="Sapa Spider-Man"'));
 assert.ok(html.includes('aria-label="Sapa Gwen"'));
 assert.ok(html.indexOf('class="arcade-lane')>html.indexOf('</main>'));
 assert.ok(!html.includes('arcade-avatar'));
});

test('published education, languages and achievements have public presentation, drafts remain hidden',()=>{
 const record=(kind:string,title:string,published=true)=>({id:title,kind,title,published,position:0,data:{degree:'Informatika',gpa:'3.49 / 4.00',level:'Professional',description:'CMS description'}});
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:{profile:{...emptyProfile,published:true,name:'Owner'},documents:[],records:[record('education','University'),record('language','English'),record('achievement','Award'),record('education','Private education',false),record('project','Private project',false)]}}));
 assert.ok(html.includes('University'));assert.ok(html.includes('English'));assert.ok(html.includes('Award'));assert.ok(!html.includes('Private education'));assert.ok(!html.includes('Private project'));assert.ok(html.includes('id="background"'));
});
test('custom section titles remain consistent between navigation and heading',()=>{
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:{profile:{...emptyProfile,published:true,name:'Owner',headline:'A long professional headline',section_copy:{projects_title:'Karya pilihan'}},documents:[],records:[]}}));assert.match(html,/href="#projects"[^>]*>Karya pilihan<\/a>/);assert.ok(html.includes('<h2>Karya pilihan'));assert.ok(html.includes('class="hero-role"'));
});
test('home exposes project exhibition and archive link instead of stacked project cards',()=>{
 const content:PublicContent={profile:{...emptyProfile,published:true,name:'Owner'},documents:[],records:[{id:'project',kind:'project',title:'Visible',position:0,published:true,data:{}},{id:'draft',kind:'project',title:'Hidden draft',position:1,published:false,data:{}}]};
 const home=renderToStaticMarkup(React.createElement(Portfolio,{initial:content}));assert.ok(home.includes('Galeri proyek pilihan'));assert.ok(home.includes('href="/projects"'));assert.ok(!home.includes('project-showcase'));assert.ok(!home.includes('Hidden draft'));
 const archive=renderToStaticMarkup(React.createElement(Portfolio,{initial:content,archive:true}));assert.ok(archive.includes('Arsip karya.'));assert.ok(archive.includes('Terbaru'));assert.ok(archive.includes('Terlama'));assert.ok(!archive.includes('Hidden draft'));assert.ok(archive.includes('Tanggal belum diisi'));assert.ok(archive.includes('href="/#about"'));
});
test('empty archive remains usable and project detail links back to all-project archive',()=>{
 const initial={profile:emptyProfile,records:[],documents:[]};const archive=renderToStaticMarkup(React.createElement(Portfolio,{initial,archive:true}));assert.ok(archive.includes('Belum ada proyek yang cocok.'));
 const detail=renderToStaticMarkup(React.createElement(Portfolio,{initial:{...initial,records:[{id:'p',kind:'project',title:'Case',position:0,published:true,data:{}}]},projectId:'p'}));assert.ok(detail.includes('href="/projects"'));
});

test('spatial redesign keeps every published project fact and exposes valid play/navigation anchors',()=>{
 const initial:PublicContent={profile:{...emptyProfile,published:true,name:'AnExtremelyLongUnbrokenProfileName',summary:'Original biography',photo:'owner.png',featured_cv:'cv'},records:[{id:'p',kind:'project',published:true,position:0,title:'Real project',data:{context:'Actual problem',result:'Actual outcome',bullets:['Actual contribution'],technologies:['TypeScript'],media:['cover.png']}},{id:'private',kind:'skill',published:false,position:1,title:'Private skill',data:{}}],documents:[{id:'cv',title:'Published CV',format:'ats',path:'cv.pdf',published:true,created_at:''}]};
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial}));
 for(const fact of ['Original biography','Actual problem','Actual outcome','Actual contribution','TypeScript','AnExtremelyLongUnbrokenProfileName'])assert.ok(html.includes(fact),fact);
 assert.ok(!html.includes('Private skill'));assert.ok(html.includes('Unduh CV'));assert.ok(html.includes('href="#playground"'));assert.ok(html.includes('id="playground"'));assert.ok(html.includes('href="/projects/p"'));assert.ok(html.includes('portrait-atelier'));
});

test('immersive rooms preserve section content and give archive and case-study distinct presentations',()=>{
 const record=(kind:string,title:string,data:Record<string,unknown>={})=>({id:kind,kind,title,data,published:true,position:0});
 const initial:PublicContent={profile:{...emptyProfile,published:true,name:'Owner',summary:'Biography from CMS'},documents:[],records:[record('project','A project',{context:'A real brief',result:'A real result',bullets:['A real contribution']}),record('skill','A tool',{category:'Tools'}),record('service','A service',{description:'A service description'}),record('experience','A role',{description:'A work description'}),record('education','A university'),record('certificate','A credential')]};
 const home=renderToStaticMarkup(React.createElement(Portfolio,{initial}));
 for(const room of ['portrait','education','skills','service','journey','credential','play','contact'])assert.ok(home.includes(`data-room="${room}"`),room);
 for(const content of ['Biography from CMS','A project','A tool','A service description','A work description','A university','A credential'])assert.ok(home.includes(content),content);
 const archive=renderToStaticMarkup(React.createElement(Portfolio,{initial,archive:true}));assert.ok(archive.includes('data-page="gallery"'));assert.ok(archive.includes('data-room="archive"'));assert.ok(archive.includes('Terbaru'));
 const detail=renderToStaticMarkup(React.createElement(Portfolio,{initial,projectId:'project'}));assert.ok(detail.includes('data-page="case-study"'));assert.ok(detail.includes('data-room="case"'));for(const fact of ['A real brief','A real result','A real contribution'])assert.ok(detail.includes(fact),fact);
});

test('personal opening derives its monogram, portrait and positioning from the CMS',()=>{
 const initial:PublicContent={profile:{...emptyProfile,published:true,name:'Dewi Putri',headline:'CMS professional focus',location:'CMS city',photo:'cms-face.png'},records:[],documents:[]};const html=renderToStaticMarkup(React.createElement(Portfolio,{initial}));
 assert.ok(html.includes('data-experience="personal-monogram"'));assert.ok(html.includes('hero-given-name'));assert.ok(html.includes('Monogram identitas DP'));assert.ok(html.includes('CMS professional focus'));assert.ok(html.includes('CMS city'));assert.ok(html.includes('cms-face.png'));assert.ok(!html.includes('chrome-knot'));assert.ok(!html.includes('>Rian<'));
});

test('about portrait atelier preserves CMS biography, real photo and published CV',()=>{
 const initial:PublicContent={profile:{...emptyProfile,published:true,name:'Dewi Putri',headline:'Systems developer',summary:'First paragraph.\n\nA separate paragraph from CMS.',photo:'dewi.png',photo_alt:'Dewi at work',featured_cv:'cv'},records:[],documents:[{id:'cv',title:'My CV',path:'resume.pdf',published:true,format:'ats',created_at:''}]};
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial}));const about=html.slice(html.indexOf('id="about"'),html.indexOf('id="playground"'));
 for(const fact of ['data-experience="portrait-atelier"','First paragraph.','A separate paragraph from CMS.','dewi.png','Dewi at work','Unduh CV','resume.pdf?download=1','atelier-owner'])assert.ok(about.includes(fact),fact);
 assert.ok(!about.includes('hero-details'));assert.ok(!about.includes('portrait-caption'));
});
test('about works without a photo, biography or CV and never invents owner facts',()=>{
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:{profile:emptyProfile,records:[],documents:[]}}));
 assert.ok(html.includes('Profil sedang disiapkan'));assert.ok(html.includes('portrait-atelier-empty'));assert.ok(!html.includes('Sudut pandang potret'));assert.ok(!html.includes('Unduh CV'));assert.ok(!html.includes('>Rian<'));
});

test('immersive hero exposes CMS tech tags, CMS contribution scope, bilingual static content and safe play access',()=>{
 const initial:PublicContent={profile:{...emptyProfile,published:true,name:'Rian Pramudya Amanda',headline:'Full Stack Developer',summary:'Machine learning and computer vision',location:'Bandung',photo:'owner.png'},records:[{id:'p',kind:'project',title:'Project',published:true,position:0,data:{technologies:['Python','TypeScript']}},{id:'s',kind:'skill',title:'Python',published:true,position:0,data:{}},{id:'hidden',kind:'project',title:'Secret',published:false,position:0,data:{technologies:['Private tool']}}],documents:[]};
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial}));const hero=html.slice(html.indexOf('id="home"'),html.indexOf('id="projects"'));
 for(const value of ['hero-floor-grid','hero-film-grain','hero-tech-tags','Python','TypeScript','hero-stats','6.9175° S','polaroid-tape','hero-photo-badge','hero-letter-rise','href="#playground"','ML Engineer','Computer Vision'])assert.ok(hero.includes(value),value);
 assert.ok(!hero.includes('Private tool'));assert.ok(hero.includes('data-quality="static"'));assert.ok(hero.includes('aria-label="Rian Pramudya Amanda"'));assert.ok(hero.includes('Tampilan statis'));
});

test('hero English presentation retains the same CMS identity and navigation',async()=>{
 const {HeroExperience}=await import('../src/components/hero-experience');const html=renderToStaticMarkup(React.createElement(HeroExperience,{profile:{...emptyProfile,name:'Dewi Putri',headline:'A CMS headline',location:'Another city',status:'open'},records:[],en:true,sectionCount:7}));
 for(const text of ['Identity monogram DP','Static view','View work','Contact','01 / 07','Open to work'])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('6.9175'));assert.ok(!html.includes('ML Engineer'));assert.ok(!html.includes('>Rian<'));
});
