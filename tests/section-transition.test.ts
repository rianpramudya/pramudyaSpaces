import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Portfolio} from '../src/components/portfolio';
import {SectionTransition} from '../src/components/section-transition';
import {emptyProfile,type Entry} from '../src/lib/model';
test('transitions follow visible CMS sections and skip chapters without published content',()=>{
 const records:Entry[]=[{id:'draft',kind:'education',title:'Private university',published:false,position:0,data:{}}];
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:{profile:emptyProfile,records,documents:[]}}));
 const pairs=[...html.matchAll(/data-from="([^"]+)" data-to="([^"]+)"/g)].map(match=>[match[1],match[2]]);
 assert.deepEqual(pairs,[['home','projects'],['projects','about'],['about','playground'],['playground','contact'],['contact','footer']]);
 assert.ok(!html.includes('Private university'));
});
test('light and dark backgrounds have independent matching rules without text overlays',()=>{
 const bridge=renderToStaticMarkup(React.createElement(SectionTransition,{from:'home',to:'projects'}));
 assert.ok(bridge.includes('aria-hidden="true"'));assert.ok(bridge.includes('--blend-from-light:var(--black)'));assert.ok(bridge.includes('--blend-to-light:var(--white)'));
 assert.ok(bridge.includes('--blend-to-dark:var(--gray1)'));
 const same=renderToStaticMarkup(React.createElement(SectionTransition,{from:'background',to:'services'}));
 assert.ok(same.includes('data-light-match="true"'));assert.ok(same.includes('data-dark-match="true"'));
 const conditional=renderToStaticMarkup(React.createElement(SectionTransition,{from:'projects',to:'about'}));
 assert.ok(conditional.includes('data-light-match="false"'));assert.ok(conditional.includes('data-dark-match="true"'));
});
test('project archive and case study blend into the footer without home transitions',()=>{
 const initial={profile:emptyProfile,documents:[],records:[{id:'project',kind:'project',title:'CMS project',published:true,position:0,data:{}}]};
 for(const options of [{archive:true},{projectId:'project'}]){
  const html=renderToStaticMarkup(React.createElement(Portfolio,{initial,...options}));
  assert.ok(html.includes('data-from="page" data-to="footer"'));
  assert.ok(!html.includes('data-from="home"'));
 }
});
