import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server.js';
import { config as proxyConfig } from '../src/proxy';
import robots from '../src/app/robots';
import { publicSitemap, publicPageMetadata, PUBLIC_SITE_URL } from '../src/lib/seo';
import type { Entry } from '../src/lib/model';

const project: Entry = { id: '11111111-1111-4111-8111-111111111111', kind: 'project', title: 'Karya publik', published: true, position: 0, data: { private_note: 'SECRET_FIXTURE' } };

test('sitemap contains real public routes and published projects without draft or private data', () => {
  const sitemap = publicSitemap([
    project, project,
    { ...project, id: 'draft', published: false },
    { ...project, id: 'education', kind: 'education' },
  ]);
  assert.deepEqual(sitemap.map(entry => entry.url), [PUBLIC_SITE_URL, `${PUBLIC_SITE_URL}/projects`, `${PUBLIC_SITE_URL}/projects/${project.id}`]);
  assert.ok(!JSON.stringify(sitemap).includes('SECRET_FIXTURE'));
  assert.deepEqual(publicSitemap([]).map(entry => entry.url), [PUBLIC_SITE_URL, `${PUBLIC_SITE_URL}/projects`]);
});

test('public page metadata has a unique production canonical and matching Indonesian Open Graph fields', () => {
  const path = `/projects/${project.id}`;
  const metadata = publicPageMetadata(path, project.title, '  Sebuah karya\n pengembangan web.  ');
  assert.equal(metadata.alternates?.canonical, `${PUBLIC_SITE_URL}${path}`);
  assert.equal(metadata.openGraph?.url, `${PUBLIC_SITE_URL}${path}`);
  assert.equal(metadata.openGraph?.locale, 'id_ID');
  assert.equal(metadata.description, 'Sebuah karya pengembangan web.');
  assert.equal(metadata.openGraph?.description, metadata.description);
});

test('robots permits public routes and references only the production sitemap', () => {
  const rules = robots();
  assert.deepEqual(rules.rules, { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/auth'] });
  assert.equal(rules.sitemap, `${PUBLIC_SITE_URL}/sitemap.xml`);
});

test('SEO endpoints and the unchanged Google verification file bypass the auth proxy', () => {
  for (const path of ['/', '/projects', '/sitemap.xml', '/robots.txt', '/google2e0088a0eb377ab5.html']) {
    assert.equal(unstable_doesMiddlewareMatch({ config: proxyConfig, url: `${PUBLIC_SITE_URL}${path}` }), false, path);
  }
  for (const path of ['/admin', '/api/public', '/auth/callback']) {
    assert.equal(unstable_doesMiddlewareMatch({ config: proxyConfig, url: `${PUBLIC_SITE_URL}${path}` }), true, path);
  }
  assert.equal(readFileSync('public/google2e0088a0eb377ab5.html', 'utf8').trim(), 'google-site-verification: google2e0088a0eb377ab5.html');
});
