import type { MetadataRoute } from 'next';
import { PUBLIC_SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/auth'] },
    sitemap: `${PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
