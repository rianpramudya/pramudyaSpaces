import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';
import {getPublicContent} from '@/lib/repository';
import {Portfolio} from '@/components/portfolio';
export const dynamic='force-dynamic';
export const metadata: Metadata = publicPageMetadata(
  '/projects',
  'Proyek dan Studi Kasus',
  'Jelajahi proyek dan studi kasus Rian Pramudya dalam pengembangan web full stack, machine learning, dan computer vision.',
);
export default async function Projects(){return <Portfolio initial={await getPublicContent()} archive/>;}
