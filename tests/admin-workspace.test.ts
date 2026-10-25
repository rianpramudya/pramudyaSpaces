import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Overview} from '../src/components/admin/overview';
import {emptyProfile} from '../src/lib/model';
import {installUnsavedGuard,requestAdminExit} from '../src/components/admin/use-unsaved-changes';
test('empty workspace directs owner to profile and does not invent pending content',()=>{
 const html=renderToStaticMarkup(React.createElement(Overview,{content:{profile:emptyProfile,records:[],documents:[]}}));
 assert.ok(html.includes('Ceritakan tentang Anda'));assert.ok(html.includes('Tidak ada draft tertunda.'));assert.ok(!html.includes('?edit='));
});
test('draft shortcut opens its actual record and excludes published entries',()=>{
 const html=renderToStaticMarkup(React.createElement(Overview,{content:{profile:emptyProfile,documents:[],records:[{id:'draft-id',kind:'project',title:'Unfinished',position:0,published:false,data:{}},{id:'public-id',kind:'project',title:'Public',position:1,published:true,data:{}}]}}));
 assert.ok(html.includes('/admin/project?edit=draft-id'));assert.ok(!html.includes('?edit=public-id'));assert.ok(html.includes('Unfinished'));
});
test('complete portfolio offers maintenance rather than repeatedly requesting setup',()=>{
 const html=renderToStaticMarkup(React.createElement(Overview,{content:{profile:{...emptyProfile,name:'Owner',headline:'Developer',summary:'Bio',photo:'photo.png',published:true,featured_cv:'cv'},documents:[{id:'cv',title:'CV',format:'ats',path:'cv.pdf',published:true,created_at:''}],records:[{id:'p',kind:'project',title:'Project',position:0,published:true,data:{}}]}}));
 assert.ok(html.includes('Kelola karya'));assert.ok(html.includes('Ada karya baru?'));
});
test('edit guard cancels logout before session mutation and protects pending uploads',()=>{
 const names=['window','document','location','history'] as const;const descriptors=names.map(name=>Object.getOwnPropertyDescriptor(globalThis,name));
 const target=new EventTarget();let confirmations=0;const pushed:unknown[]=[];
 Object.assign(target,{confirm:()=>{confirmations++;return false;}});
 Object.defineProperties(globalThis,{window:{value:target,configurable:true},document:{value:new EventTarget(),configurable:true},location:{value:{href:'http://localhost/admin/profile'},configurable:true},history:{value:{state:{tree:'editor'},pushState:(...args:unknown[])=>pushed.push(args)},configurable:true}});
 try{
  const cleanup=installUnsavedGuard(true,false)!;
  assert.equal(requestAdminExit(),false);assert.equal(confirmations,1);
  target.dispatchEvent(new Event('popstate'));assert.equal(pushed.length,1);assert.deepEqual((pushed[0] as unknown[])[0],{tree:'editor'});cleanup();
  assert.equal(requestAdminExit(),true);
  const uploading=installUnsavedGuard(false,true)!;assert.equal(requestAdminExit(),false);assert.equal(confirmations,2);uploading();
 }finally{names.forEach((name,index)=>{if(descriptors[index])Object.defineProperty(globalThis,name,descriptors[index]!);else Reflect.deleteProperty(globalThis,name);});}
});
