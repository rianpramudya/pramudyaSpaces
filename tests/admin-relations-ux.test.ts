import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ProjectPicker} from '../src/components/admin/project-picker';
import {ProjectConnections} from '../src/components/admin/project-connections';
import {projectConnections,relatedWorkPreview} from '../src/lib/admin-relations';
import type {Entry} from '../src/lib/model';
const project:Entry={id:'p',kind:'project',title:'Portal',position:0,published:true,data:{technologies:['Laravel']}};
const entry=(id:string,kind:string,title:string,data:Record<string,unknown>={},published=true):Entry=>({id,kind,title,data,published,position:0});
test('automatic preview uses the same matching as the public page and explicit empty selections stay empty',()=>{
  const skill=entry('s','skill','Laravel');
  assert.deepEqual(relatedWorkPreview(skill,[project]).map(p=>p.id),['p']);
  assert.deepEqual(relatedWorkPreview({...skill,data:{related_project_ids:[]}},[project]),[]);
  assert.deepEqual(relatedWorkPreview(skill,[{...project,published:false}]),[]);
  assert.deepEqual(relatedWorkPreview(entry('e','education','School'),[project]),[]);
});
test('relationship picker offers three explicit modes and a published-work preview',()=>{
  const html=renderToStaticMarkup(React.createElement(ProjectPicker,{data:{},entry:entry('s','skill','Laravel'),projects:[project],automatic:true,onChange:()=>{}}));
  for(const label of ['Otomatis','Pilih sendiri','Tanpa hubungan','Akan tampil di website','Portal'])assert.ok(html.includes(label),label);
  const none=renderToStaticMarkup(React.createElement(ProjectPicker,{data:{related_project_ids:[]},entry:entry('s','skill','Laravel',{related_project_ids:[]}),projects:[project],automatic:true,onChange:()=>{}}));
  assert.match(none,/<option value="none" selected="">/);
  assert.ok(none.includes('Tidak ada karya terkait yang ditampilkan'));
});
test('reverse project connections include manual and automatic references without treating technology labels as permanent skill IDs',()=>{
  const records=[entry('s','skill','Laravel'),entry('e','experience','Developer',{related_project_ids:['p']},false),entry('other','skill','React'),entry('none','skill','Laravel',{related_project_ids:[]})];
  const found=projectConnections(project,records);
  assert.deepEqual(found.map(row=>[row.entry.id,row.mode]),[['s','auto'],['e','manual']]);
  const html=renderToStaticMarkup(React.createElement(ProjectConnections,{project,records}));
  assert.ok(html.includes('/admin/skill?edit=s'));
  assert.ok(html.includes('/admin/experience?edit=e'));
  assert.ok(html.includes('Draft'));
  assert.ok(!html.includes('React'));
});
