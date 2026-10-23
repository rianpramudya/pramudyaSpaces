import type { MetadataRoute } from 'next';
import { getPublicContent } from '@/lib/repository';
import { publicSitemap } from '@/lib/seo';

// Reflect publication changes without caching draft or unpublished project URLs.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { records } = await getPublicContent();
  return publicSitemap(records);
}
