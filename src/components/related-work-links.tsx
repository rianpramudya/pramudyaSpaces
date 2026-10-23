import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {type Entry} from '@/lib/model';
import {selectedProjects} from '@/lib/project-relations';
export function RelatedWorkLinks({entry,projects,en}:{entry:Entry;projects:Entry[];en:boolean}){
 const related=selectedProjects(entry,projects);if(!related?.length)return null;
 return <div className="related-work-links"><span>{en?'Related work':'Karya terkait'}</span>{related.map(project=><Link href={`/projects/${project.id}`} key={project.id}>{project.title}<ArrowUpRight size={14}/></Link>)}</div>;
}
