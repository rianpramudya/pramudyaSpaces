import test from 'node:test';import assert from 'node:assert/strict';
import {catalogProjects,projectDate} from '../src/lib/project-catalog';
const record=(id:string,date='',position=0,published=true)=>({id,kind:'project',title:id,published,position,data:{date,technologies:['React']},updated_at:'2099-01-01'});
test('sort uses project dates and keeps undated projects last, independent of edit time',()=>{
 const rows=[record('old','2024-06',1),record('undated','',0),record('new','2026-01-02',2)];
 assert.deepEqual(catalogProjects(rows,{sort:'newest'}).map(e=>e.id),['new','old','undated']);assert.deepEqual(catalogProjects(rows,{sort:'oldest'}).map(e=>e.id),['old','new','undated']);
});
test('catalog excludes drafts and other kinds while combining search and technology',()=>{
 const rows=[record('visible'),record('draft','',0,false),{...record('skill'),kind:'skill'}];
 assert.equal(catalogProjects(rows,{query:'VIS',technology:'React'}).length,1);assert.equal(catalogProjects(rows,{technology:'PHP'}).length,0);
});
test('date parsing rejects impossible dates and accepts year, month and full date',()=>{
 assert.equal(projectDate('2024-02-30'),null);assert.equal(projectDate('2025-13'),null);assert.equal(projectDate('2026-02-29'),null);assert.ok(projectDate('2024-02-29'));assert.ok(projectDate('2025'));assert.ok(projectDate('2025-06'));assert.equal(projectDate('September 2026'),null);
});
