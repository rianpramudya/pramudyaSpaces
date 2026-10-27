'use client';
import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ArrowDown, ArrowLeft, Plus } from 'lucide-react';
import type { Profile, Entry } from '@/lib/model';
import { mediaURL } from '@/lib/client-api';
import { CinematicSurface } from '@/components/cinematic-surface';
import { LiquidPortrait } from '@/components/liquid-portrait';
import { StudioButton } from '@/components/ui/studio-button';
function HeroFeature({ projects, en }: { projects: Entry[]; en: boolean }) {
  const [index, setIndex] = useState(0),
    entry = projects[index % Math.max(1, projects.length)];
  if (!entry) return null;
  return (
    <aside className="studio-hero-feature">
      <div className="hero-feature-top">
        <div className="hero-feature-mark">
          <img src="/brand/rpa-symbol.svg" width={45} height={45} alt="" />
        </div>
        <div className="hero-feature-reading" key={entry.id}>
          <span>{en ? 'A glimpse of my work' : 'Sekilas karya saya'}</span>
          <Link href={`/projects/${entry.id}`}>
            {entry.title}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <div className="hero-feature-bottom">
        <div className="hero-feature-dots" aria-hidden="true">
          {projects.map((p, i) => (
            <i key={p.id} className={i === index % projects.length ? 'active' : ''} />
          ))}
        </div>
        <div>
          <button
            type="button"
            aria-label={en ? 'Previous project' : 'Proyek sebelumnya'}
            onClick={() => setIndex((v) => (v - 1 + projects.length) % projects.length)}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            aria-label={en ? 'Next project' : 'Proyek berikutnya'}
            onClick={() => setIndex((v) => (v + 1) % projects.length)}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function HeroSection({
  profile: p,
  photo,
  reveal,
  projects,
  technologies,
  en,
  pageMode = false,
}: {
  profile: Profile;
  photo: string;
  reveal: string;
  projects: Entry[];
  technologies: string[];
  en: boolean;
  pageMode?: boolean;
}) {
  const name = p.name.split(' ')[0] || p.wordmark || 'SPACES',
    headline =
      p.headline || (en ? 'Ideas, thoughtfully built.' : 'Ide, dibangun dengan sepenuh hati.');
  return (
    <section id="home" className="studio-hero" data-experience="liquid-portrait">
      <CinematicSurface themeAware />
      {photo && (
        <LiquidPortrait
          base={mediaURL(photo)}
          reveal={reveal ? mediaURL(reveal) : undefined}
          alt={p.hero_photo_alt || p.photo_alt || p.name}
        />
      )}
      <div className="studio-hero-vignette" aria-hidden="true" />
      <div className="studio-hero-watermark" aria-hidden="true">
        {name}
      </div>
      <div className="studio-shell studio-hero-content">
        <div className="studio-hero-copy">
          <p className="studio-eyebrow">
            <span className="studio-status-dot" />
            {p.name || 'PramudyaSpaces'}
            {p.status !== 'hidden' && (
              <span className="hero-availability">
                {p.status === 'open'
                  ? (en ? 'Open to work' : 'Terbuka untuk bekerja')
                  : en
                    ? 'Currently building'
                    : 'Sedang berkarya'}
              </span>
            )}
          </p>
          <h1 aria-label={headline}>
            {headline.split(/\s+/).map((word, i) => (
              <span className="studio-title-word" aria-hidden="true" key={i}>
                {[...word].map((char, j) => (
                  <span
                    className="cinematic-letter"
                    key={j}
                    style={{ '--char-index': i * 5 + j } as CSSProperties}
                  >
                    {char}
                  </span>
                ))}{' '}
              </span>
            ))}
          </h1>
          <div className="studio-hero-actions">
            <StudioButton href="#contact">{en ? 'Let’s talk' : 'Mari berdiskusi'}</StudioButton>
            <a className="button studio-button outline" href="#projects">
              {en ? 'View work' : 'Lihat karya'}
              <span>
                <ArrowRight size={20} />
              </span>
            </a>
          </div>
          <a className="hero-reading-mode" href={pageMode ? '/' : '/portofolio'}>
            {pageMode ? (en ? 'Explore the full scrolling site' : 'Jelajahi versi scroll') : (en ? 'Prefer one page at a time?' : 'Ingin menjelajah per halaman?')}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="studio-hero-aside">
          <HeroFeature projects={projects.slice(0, 3)} en={en} />
          {technologies.length > 0 && (
            <div className="studio-hero-tools">
              <p>{en ? 'Tools behind the work' : 'Di balik karya saya'}</p>
              <div>
                {technologies.slice(0, 6).map((t) => (
                  <span key={t}>
                    <Plus size={12} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="studio-hero-status studio-shell">
        <span>{p.location || 'PramudyaSpaces'}</span>
        <span>
          {en
            ? 'A little curiosity. A lot of building.'
            : 'Sedikit rasa ingin tahu. Banyak hal untuk dibangun.'}
        </span>
        <a href="#about">
          {pageMode ? (en ? 'Next: About' : 'Berikutnya: Tentang') : (en ? 'Scroll to explore' : 'Gulir untuk menjelajah')}
          {pageMode ? <ArrowRight size={15} /> : <ArrowDown size={15} />}
        </a>
      </div>
    </section>
  );
}
