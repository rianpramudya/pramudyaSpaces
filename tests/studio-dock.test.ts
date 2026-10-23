import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {VisitorDock} from '../src/components/visitor-dock';
import {emptyProfile} from '../src/lib/model';

test('visitor launcher exposes guestbook and assistant outside the closed Studio panel',()=>{
 const html=renderToStaticMarkup(React.createElement(VisitorDock,{profile:{...emptyProfile,name:'Rian'},language:'id',onPanel:()=>{}}));
 const quick=html.slice(html.indexOf('class="dock-quick-actions"'));
 assert.ok(quick.includes('Buka buku tamu'));assert.ok(quick.includes('Buka asisten AI'));
 assert.ok(html.includes('aria-expanded="false"'));assert.ok(html.includes('aria-controls='));
 assert.ok(!html.includes('<details open'));
});

test('dock layout owns its positioning and native disclosure visibility after retired theme removal',()=>{
 const css=readFileSync(new URL('../src/app/studio.css',import.meta.url),'utf8');
 const base=css.match(/\.studio-site \.visitor-dock\{([^}]+)\}/)?.[1]||'';
 assert.match(base,/display:flex/);
 const panel=css.match(/\.studio-site \.visitor-dock \.dock-content\{([^}]+)\}/)?.[1]||'';
 assert.match(panel,/position:absolute/);assert.match(panel,/display:none/);assert.match(panel,/max-height:/);assert.match(panel,/overflow:auto/);
 assert.ok(css.includes('.studio-site .visitor-dock>details[open]>.dock-content{display:block'));
 assert.ok(!/\.studio-site \.visitor-dock \.dock-quick-actions\{[^}]*display:none/.test(css));
});
