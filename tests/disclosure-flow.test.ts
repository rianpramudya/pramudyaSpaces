import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Portfolio} from '../src/components/portfolio';
import {emptyProfile,type Entry} from '../src/lib/model';
test('supporting chapters retain all published CMS facts inside native disclosures',()=>{
 const entry=(kind:string,title:string):Entry=>({id:kind,kind,title,published:true,position:0,data:{description:title+' description'}});
 const html=renderToStaticMarkup(React.createElement(Portfolio,{initial:{profile:{...emptyProfile,name:'Actual owner'},documents:[],records:[entry('project','Product proof'),entry('experience','Work proof'),entry('skill','Technical proof'),entry('education','Academic proof'),entry('certificate','Credential proof'),entry('service','Service proof')]}}));
 for(const text of ['Product proof','Work proof','Technical proof','Academic proof','Credential proof','Service proof'])assert.ok(html.includes(text),text);
 assert.ok(html.indexOf('id="projects"')<html.indexOf('id="journey"'));assert.ok(html.indexOf('id="journey"')<html.indexOf('id="background"'));assert.ok(html.indexOf('id="playground"')<html.indexOf('id="contact"'));
 for(const id of ['background','certificates','services','playground']){const section=html.slice(html.indexOf(`id="${id}"`));assert.match(section,/^id="[^\"]+"[^>]*><details data-section-disclosure="true"><summary>/);}
 assert.ok(!html.includes('data-section-disclosure="true" open=""'));
});
