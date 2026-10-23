import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {VisitorDock} from '../src/components/visitor-dock';
import {emptyProfile} from '../src/lib/model';

test('visitor dock exposes guestbook and assistant directly',()=>{
 const html=renderToStaticMarkup(React.createElement(VisitorDock,{profile:{...emptyProfile,name:'Rian'},language:'id',onPanel:()=>{}}));
 const quick=html.slice(html.indexOf('class="dock-quick-actions"'));
 assert.ok(quick.includes('Buka buku tamu'));assert.ok(quick.includes('Buka asisten AI'));
 assert.ok(!html.includes('<details'));assert.ok(!html.includes('Studio'));
});

test('dock remains fixed and provides two equal mobile action columns without a popover',()=>{
 const css=readFileSync(new URL('../src/app/studio.css',import.meta.url),'utf8');
 const base=css.match(/\.studio-site \.visitor-dock\{([^}]+)\}/)?.[1]||'';
 assert.match(base,/position:fixed/);assert.match(base,/display:flex/);
 assert.ok(css.includes('grid-template-columns:minmax(0,1fr) minmax(0,1fr)'));
 assert.ok(!css.includes('dock-content'));assert.ok(!css.includes('visitor-dock>details'));
});
