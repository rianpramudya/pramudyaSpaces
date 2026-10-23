import {type Entry,listValue} from './model';
/** undefined retains automatic legacy matching; [] explicitly means no linked work. */
export function selectedProjects(entry:Pick<Entry,'data'>,projects:Entry[]):Entry[]|undefined{
 if(!Array.isArray(entry.data.related_project_ids))return undefined;
 const available=new Map(projects.filter(project=>project.kind==='project'&&project.published).map(project=>[project.id,project]));
 return [...new Set(listValue(entry.data,'related_project_ids'))].flatMap(id=>{const project=available.get(id);return project?[project]:[];});
}
