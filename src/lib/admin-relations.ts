import {type Entry,listValue} from './model';
import {selectedProjects} from './project-relations';
import {projectsUsingSkill} from './workspace-content';
import {serviceProjects} from './presentation';
export function relatedWorkPreview(entry:Entry,projects:Entry[]) {
  if(entry.kind==='skill')return projectsUsingSkill(entry,projects);
  if(entry.kind==='service')return serviceProjects(entry,projects);
  return selectedProjects(entry,projects)||[];
}
export function projectConnections(project:Entry,records:Entry[]) {
  return records.filter(entry=>['skill','service','experience','education','certificate','achievement'].includes(entry.kind)).flatMap(entry=>{
    const manual=Array.isArray(entry.data.related_project_ids);
    const connected=manual?listValue(entry.data,'related_project_ids').includes(project.id):relatedWorkPreview(entry,[{...project,published:true}]).length>0;
    return connected?[{entry,mode:manual?'manual' as const:'auto' as const}]:[];
  });
}
