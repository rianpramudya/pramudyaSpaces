import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';
import { textValue } from '@/lib/model';
import { notFound } from 'next/navigation';
import { getPublicContent } from '@/lib/repository';
import { Portfolio } from '@/components/portfolio';
export const dynamic='force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const content = await getPublicContent();
  const project = content.records.find(entry => entry.kind === 'project' && entry.id === id);
  if (!project) notFound();
  return publicPageMetadata(
    `/projects/${encodeURIComponent(project.id)}`,
    project.title,
    textValue(project.data, 'description') || `Studi kasus ${project.title} oleh Rian Pramudya: kontribusi, teknologi, proses, dan hasil proyek.`,
  );
}
export default async function Project({params}:{params:Promise<{id:string}>}){const {id}=await params;const content=await getPublicContent();if(!content.records.some(e=>e.kind==='project'&&e.id===id))notFound();return <Portfolio initial={content} projectId={id}/>;}
