import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ProjectTheatre} from '../src/components/project-theatre';
import {projectStageItems} from '../src/lib/project-theatre';
test('project theatre preserves case study facts, readable fallback and native navigation',()=>{
 const items=projectStageItems([{id:'actual',kind:'project',title:'Actual project',published:true,position:0,data:{description:'CMS description',context:'CMS context',result:'CMS outcome',bullets:['CMS contribution'],media:['actual.png'],technologies:['TypeScript']}}]);
 const html=renderToStaticMarkup(React.createElement(ProjectTheatre,{items,en:false}));for(const fact of ['Actual project','CMS description','CMS context','CMS outcome','CMS contribution','TypeScript'])assert.ok(html.includes(fact),fact);
 assert.ok(html.includes('<canvas'));assert.ok(html.includes('project-display-fallback'));assert.ok(html.includes('href="/projects/actual"'));assert.ok(html.includes('href="/projects"'));assert.ok(html.includes('aria-pressed="true"'));assert.ok(!html.includes('works-wheel'));
});
test('empty project theatre has guidance and archive access, without a canvas',()=>{
 const html=renderToStaticMarkup(React.createElement(ProjectTheatre,{items:[],en:false}));assert.ok(html.includes('setelah diterbitkan'));assert.ok(html.includes('href="/projects"'));assert.ok(!html.includes('<canvas'));
});
