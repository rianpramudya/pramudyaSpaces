import {selectedProjects} from './project-relations';
import {type Entry,listValue,textValue} from './model';

// A project is evidence for a technology only when its authored stack names it.
export function projectsUsingSkill(skill:Entry,projects:Entry[]){
 const selected=selectedProjects(skill,projects);if(selected!==undefined)return selected;
 const normalize=(value:string)=>value.toLocaleLowerCase('en').replace(/[^a-z0-9+#.]/g,'');
 const name=normalize(skill.title);
 return projects.filter(p=>p.published&&p.kind==='project'&&listValue(p.data,'technologies').some(t=>{
  const technology=normalize(t.replace(/\s+v?\d+(?:\.\d+)*$/,''));
  return name!==''&&(technology===name||normalize(t)===name);
 }));
}
export function skillGroups(skills:Entry[]){
 const groups=new Map<string,Entry[]>();
 for(const skill of skills){if(!skill.published||skill.kind!=='skill')continue;const category=textValue(skill.data,'category')||'Skills';groups.set(category,[...(groups.get(category)||[]),skill]);}
 return [...groups].map(([name,items])=>({name,items}));
}
