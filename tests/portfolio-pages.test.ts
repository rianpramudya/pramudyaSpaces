import test from 'node:test';
import assert from 'node:assert/strict';
import {pageHref,pageForHash,resolvePortfolioPage} from '../src/lib/portfolio-pages';
const nav=[['home','Beranda'],['about','Tentang'],['background','Pendidikan'],['projects','Proyek'],['certificates','Sertifikat'],['contact','Kontak']];
test('portfolio page URLs preserve a shareable section and validate public chapters',()=>{
 assert.equal(pageHref('home'),'/portofolio');
 assert.equal(pageHref('about'),'/portofolio?page=about');
 assert.equal(resolvePortfolioPage(undefined,nav),'home');
 assert.equal(resolvePortfolioPage('about',nav),'about');
 assert.equal(resolvePortfolioPage('admin',nav),null);
 assert.equal(resolvePortfolioPage('skills',nav),null);
});
test('cross-section anchors select the corresponding page including certificate backlinks',()=>{
 assert.equal(pageForHash('#about',nav),'about');
 assert.equal(pageForHash('#certificate-123',nav),'certificates');
 assert.equal(pageForHash('#main',nav),null);
 assert.equal(pageForHash('#unknown',nav),null);
 assert.equal(pageForHash('#certificate-123',nav.filter(([id])=>id!=='certificates')),null);
});

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {StudioHome} from '../src/components/studio-home';
import {Portfolio} from '../src/components/portfolio';
import {emptyProfile,type Entry} from '../src/lib/model';
const records=['education','experience','project','skill','certificate','service'].map((kind):Entry=>({id:kind,kind,title:`Public ${kind}`,published:true,position:0,data:{category:'Tools'}}));
const content={profile:{...emptyProfile,name:'Owner'},records,documents:[]};
test('page mode mounts just the requested chapter while scroll mode retains the complete ordered page',()=>{
 for(const page of ['home','about','background','journey','projects','skills','certificates','services','playground','contact']){
  const html=renderToStaticMarkup(React.createElement(StudioHome,{content,language:'id',page,onCertificate:()=>{}}));
  assert.deepEqual([...html.matchAll(/<section id="([^"]+)"/g)].map(match=>match[1]),[page],page);
 }
 const scroll=renderToStaticMarkup(React.createElement(StudioHome,{content,language:'en',onCertificate:()=>{}}));
 assert.deepEqual([...scroll.matchAll(/<section id="([^"]+)"/g)].map(match=>match[1]),['home','about','background','journey','projects','skills','certificates','services','playground','contact']);
});
test('paged presentation exposes working next/previous URLs and does not repeat the cinematic footer',()=>{
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:content,page:'background'}));
 assert.ok(html.includes('data-page-mode="pages"'));
 assert.ok(html.includes('href="/portofolio?page=about" rel="prev"'));
 assert.ok(html.includes('href="/portofolio?page=journey" rel="next"'));
 assert.ok(html.includes('href="/#background"'));
 assert.ok(!html.includes('class="site-footer studio-footer"'));
 assert.ok(!html.includes('class="cinematic-chapters"'));
});

test('chapter navigation focuses its heading rather than outlining the entire section',async()=>{
 const {focusChapterHeading}=await import('../src/lib/portfolio-pages');
 let sectionFocused=false,headingFocused=false;
 const heading={tabIndex:0,focus:(options:{preventScroll:boolean})=>{assert.equal(options.preventScroll,true);headingFocused=true;}};
 const section={querySelector:(selector:string)=>{assert.equal(selector,'h1,h2,h3');return heading;},focus:()=>{sectionFocused=true;}} as unknown as HTMLElement;
 focusChapterHeading(section);
 assert.equal(heading.tabIndex,-1);
 assert.ok(headingFocused);
 assert.equal(sectionFocused,false);
 assert.doesNotThrow(()=>focusChapterHeading({querySelector:()=>null} as unknown as HTMLElement));
});
