import {getPublicContent} from '@/lib/repository';
import {Portfolio} from '@/components/portfolio';
export const dynamic='force-dynamic';
export async function generateMetadata(){const {profile}=await getPublicContent();return {title:'Semua proyek',description:`Arsip proyek dan studi kasus ${profile.name||'portofolio'}.`};}
export default async function Projects(){return <Portfolio initial={await getPublicContent()} archive/>;}
