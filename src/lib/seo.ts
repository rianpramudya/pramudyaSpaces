import type { Metadata, MetadataRoute } from 'next';
import type { Entry } from './model';

// Canonicals must stay on production even when SITE_URL points to a local auth preview.
export const PUBLIC_SITE_URL = 'https://pramudyaspaces.vercel.app';
export const SITE_NAME = 'pramudyaSpaces';
export const SEO_TITLE = 'Rian Pramudya | Full Stack Developer & ML Engineer';
export const SEO_DESCRIPTION = 'Portofolio Rian Pramudya: proyek pengembangan web full stack, machine learning, dan computer vision. Jelajahi karya, pengalaman, dan kontak.';

export function publicPageMetadata(path: string, title: string, description: string): Metadata {
  const url = `${PUBLIC_SITE_URL}${path === '/' ? '' : path}`;
  const summary = description.replace(/\s+/g, ' ').trim().slice(0, 180) || SEO_DESCRIPTION;
  return {
    title,
    description: summary,
    alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'id_ID', siteName: SITE_NAME, title, description: summary, url },
  };
}

export function publicSitemap(records: readonly Entry[]): MetadataRoute.Sitemap {
  const projects = records.filter(entry => entry.kind === 'project' && entry.published);
  return [
    { url: PUBLIC_SITE_URL },
    { url: `${PUBLIC_SITE_URL}/projects` },
    ...[...new Set(projects.map(project => project.id))].map(id => ({
      url: `${PUBLIC_SITE_URL}/projects/${encodeURIComponent(id)}`,
    })),
  ];
}
