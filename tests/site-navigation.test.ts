import test from 'node:test';
import assert from 'node:assert/strict';
import {siteNavigation} from '../src/lib/site-navigation';
import type {Entry} from '../src/lib/model';
const entry=(kind:string,published=true):Entry=>({id:kind,title:kind,kind,published,position:0,data:{}});
test('navigation follows the page order with background directly after about in both languages',()=>{
 const records=['project','education','service','experience','skill','certificate'].map(kind=>entry(kind));
 for(const en of [false,true])assert.deepEqual(siteNavigation(records,en).map(([id])=>id),['home','about','background','journey','projects','skills','certificates','services','playground','contact']);
});
test('optional sections exclude drafts and include background for languages or achievements',()=>{
 assert.ok(!siteNavigation([entry('education',false)],false).some(([id])=>id==='background'));
 for(const kind of ['language','achievement'])assert.ok(siteNavigation([entry(kind)],false).some(([id])=>id==='background'));
 assert.equal(siteNavigation([],false).find(([id])=>id==='about')?.[1],'Tentang');
});


test('portfolio mode excludes the game from every navigation order in both languages',()=>{
 const records=['project','education','service','experience','skill','certificate'].map(kind=>entry(kind));
 for(const en of [false,true]){
  const nav=siteNavigation(records,en,'pages');
  assert.deepEqual(nav.map(([id])=>id),['home','about','background','journey','projects','skills','certificates','services','contact']);
  assert.equal(nav.at(-2)?.[0],'services');
  assert.ok(siteNavigation(records,en).some(([id])=>id==='playground'));
 }
});
