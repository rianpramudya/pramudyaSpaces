import { notFound } from 'next/navigation';
import { getPublicContent } from '@/lib/repository';
import { Portfolio } from '@/components/portfolio';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const content=await getPublicContent();const project=content.records.find(p=>p.kind==='project'&&p.id===id);return {title:project?.title||'Proyek',description:String(project?.data.description||'')};}
export default async function Project({params}:{params:Promise<{id:string}>}){const {id}=await params;const content=await getPublicContent();if(!content.records.some(e=>e.kind==='project'&&e.id===id))notFound();return <Portfolio initial={content} projectId={id}/>;}
