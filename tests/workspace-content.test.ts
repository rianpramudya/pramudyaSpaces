import test from 'node:test';
import assert from 'node:assert/strict';
import {projectsUsingSkill,skillGroups} from '../src/lib/workspace-content';
import {type Entry} from '../src/lib/model';
const entry=(id:string,kind:string,title:string,data:Record<string,unknown>={},published=true):Entry=>({id,kind,title,data,published,position:0});

test('workspace evidence matches authored technology names and versions, without substring claims',()=>{
 const skill=entry('skill','skill','Laravel');
 const projects=[entry('yes','project','Portal',{technologies:['Laravel 11']}),entry('case','project','API',{technologies:['laravel']}),entry('no','project','Other',{technologies:['Laravelish']}),entry('empty','project','Laravel'),entry('private','project','Draft',{technologies:['Laravel']},false)];
 assert.deepEqual(projectsUsingSkill(skill,projects).map(x=>x.id),['yes','case']);
 assert.equal(projectsUsingSkill(entry('soft','skill','Leadership'),projects).length,0);
 assert.equal(projectsUsingSkill(entry('empty','skill',''),projects).length,0);
 assert.equal(projectsUsingSkill(entry('c','skill','C++'),[entry('cpp','project','Cpp',{technologies:['C++']}),entry('c','project','C',{technologies:['C']})]).length,1);
});
test('workspace categories preserve CMS order and exclude unpublished or unrelated records',()=>{
 const groups=skillGroups([entry('a','skill','PHP',{category:'Backend'}),entry('b','skill','Figma',{category:'Design'}),entry('c','skill','Python',{category:'Backend'}),entry('d','skill','Private',{category:'Secret'},false),entry('e','project','Other'),entry('f','skill','General')]);
 assert.deepEqual(groups.map(g=>[g.name,g.items.map(x=>x.title)]),[['Backend',['PHP','Python']],['Design',['Figma']],['Skills',['General']]]);
});
