import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {WorksWheel} from '../src/components/ui/works-wheel';
const entry={id:'a',title:'Proyek CMS',href:'/projects/a',description:'Kontribusi dari CMS',technologies:['TypeScript']};
test('wheel keeps real project navigation and accessible reading without requiring artwork',()=>{
 const html=renderToStaticMarkup(React.createElement(WorksWheel,{items:[entry],en:false,label:'Galeri proyek pilihan'}));
 assert.ok(html.includes('Kontribusi dari CMS'));assert.ok(html.includes('href="/projects/a"'));assert.ok(html.includes('works-wheel-placeholder'));assert.ok(html.includes('aria-pressed="true"'));assert.ok(!html.includes('role="listbox"'));
});
test('empty wheel offers publication guidance without invalid active descendants',()=>{
 const html=renderToStaticMarkup(React.createElement(WorksWheel,{items:[],en:false,label:'Galeri'}));assert.ok(html.includes('setelah diterbitkan'));assert.ok(!html.includes('aria-activedescendant'));
});
