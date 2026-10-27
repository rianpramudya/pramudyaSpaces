'use client';
import Link from 'next/link';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { CinematicSurface } from '@/components/cinematic-surface';
import { LiquidPortrait } from '@/components/liquid-portrait';
import { mediaURL } from '@/lib/client-api';
import type { SiteChromeProps } from './types';
export function SiteFooter({ profile, nav, en, away }: SiteChromeProps) {
  const href = (id: string) => `${away ? '/' : ''}#${id}`,
    photo = profile.hero_photo || profile.photo;
  return (
    <footer
      id="footer"
      className="site-footer studio-footer"
      data-experience="studio-footer"
      aria-labelledby="footer-heading"
      data-photographic={!!photo}
    >
      <CinematicSurface themeAware />
      {photo && (
        <LiquidPortrait
          base={mediaURL(photo)}
          reveal={profile.hero_reveal_photo ? mediaURL(profile.hero_reveal_photo) : undefined}
          alt=""
          priority={false}
        />
      )}
      <div className="studio-footer-vignette" aria-hidden="true" />
      <div className="studio-shell">
        <div className="studio-footer-opening">
          <div>
            <p className="studio-eyebrow">
              {en ? 'Make the next thing meaningful.' : 'Mari buat sesuatu yang berarti.'}
            </p>
            <h2 id="footer-heading">
              {en ? 'Have an idea?' : 'Punya ide?'}
              <br />
              {en ? 'Let’s bring it to life.' : 'Mari wujudkan.'}
            </h2>
          </div>
          <a className="button studio-button light" href={href('contact')}>
            {en ? 'Start a conversation' : 'Mulai percakapan'}
            <span>
              <ArrowUpRight size={20} />
            </span>
          </a>
        </div>
        <div className="studio-footer-directory">
          <div className="studio-footer-columns">
            <div>
              <Link href="/" className="studio-brand">
                <img src="/brand/rpa-symbol.svg" width={32} height={32} alt="" />
                {profile.wordmark || 'PramudyaSpaces'}
              </Link>
              <p>
                {profile.name}
                {profile.headline && (
                  <>
                    <br />
                    {profile.headline}
                  </>
                )}
              </p>
            </div>
            <nav aria-label={en ? 'Footer navigation' : 'Navigasi footer'}>
              <h3>{en ? 'Explore' : 'Jelajahi'}</h3>
              {nav
                .filter(([id]) => ['projects', 'about', 'services', 'journey'].includes(id))
                .map(([id, label]) => (
                  <a key={id} href={href(id)}>
                    {label}
                    <ArrowUpRight size={13} />
                  </a>
                ))}
              <a href={href('playground')}>
                {en ? 'Playground' : 'Ruang bermain'}
                <ArrowUpRight size={13} />
              </a>
            </nav>
            <div>
              <h3>{en ? 'Elsewhere' : 'Temukan saya'}</h3>
              {profile.socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
            <div>
              <h3>{en ? 'Say hello' : 'Sapa saya'}</h3>
              {profile.email && profile.show_email && (
                <a className="footer-email" href={`mailto:${profile.email}`}>
                  {profile.email}
                  <ArrowUpRight size={13} />
                </a>
              )}
              {profile.show_phone && profile.phone && (
                <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a>
              )}
              <p>{profile.location}</p>
            </div>
          </div>
          <div className="studio-legal">
            <span>
              © {new Date().getFullYear()} {profile.name || 'PramudyaSpaces'}
            </span>
            <a href="#main">
              {en ? 'Back to top' : 'Kembali ke atas'}
              <ArrowUp size={14} />
            </a>
          </div>
        </div>
        <div className="studio-footer-watermark" aria-hidden="true">
          SPACES
        </div>
      </div>
    </footer>
  );
}
