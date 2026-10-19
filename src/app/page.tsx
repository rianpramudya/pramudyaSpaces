import type { Metadata } from 'next';
import { getPublicContent } from '@/lib/repository';
import { Portfolio } from '@/components/portfolio';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{try{const {profile}=await getPublicContent();return {title:profile.name||'Portfolio',description:profile.summary||'Profil profesional dan karya pilihan.',openGraph:{title:profile.name||'Portfolio',description:profile.summary}};}catch{return {title:'Portfolio'};}}
export default async function Home(){const content=await getPublicContent();return <Portfolio initial={content}/>;}
