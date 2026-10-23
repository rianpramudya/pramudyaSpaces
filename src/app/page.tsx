import type { Metadata } from 'next';
import { getPublicContent } from '@/lib/repository';
import { Portfolio } from '@/components/portfolio';
import { SEO_TITLE, SEO_DESCRIPTION, publicPageMetadata } from '@/lib/seo';
export const dynamic='force-dynamic';
export const metadata: Metadata = {
  ...publicPageMetadata('/', SEO_TITLE, SEO_DESCRIPTION),
  title: { absolute: SEO_TITLE },
};
export default async function Home(){const content=await getPublicContent();return <Portfolio initial={content}/>;}
