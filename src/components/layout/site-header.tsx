'use client';
import { useEffect, useState, useRef, useId, type MouseEvent } from 'react';
import Link from 'next/link';
import {pageHref} from '@/lib/portfolio-pages';
import { ArrowUpRight, Menu, Sun, Moon, X } from 'lucide-react';
import type { SiteChromeProps } from './types';
export function SiteHeader({
  profile,
  pageMode = false,
  nav,
  en,
  away,
  activeSection,
  theme,
  onLanguage,
  onTheme,
  motion,
  onMotion,
}: SiteChromeProps & {
  activeSection: string;
  theme: 'light' | 'dark';
  motion: boolean;
  onMotion: () => void;
  onLanguage: () => void;
  onTheme: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const menuPanel = useRef<HTMLDivElement>(null),
    menuButton = useRef<HTMLButtonElement>(null),
    menuId = useId();
  const [menu, setMenu] = useState(false),
    [clock, setClock] = useState(''),
    [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const read = () => setScrolled(window.scrollY > 32);
    read();
    window.addEventListener('scroll', read, { passive: true });
    return () => window.removeEventListener('scroll', read);
  }, []);
  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat(en ? 'en-US' : 'id-ID', {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta',
        }).format(new Date()),
      );
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [en]);
  useEffect(() => {
    if (!menu) return;
    const outside = (event: PointerEvent) => {
      if (
        !menuPanel.current?.contains(event.target as Node) &&
        !menuButton.current?.contains(event.target as Node)
      )
        setMenu(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [menu]);
  useEffect(() => { if(pageMode)setMenu(false); }, [activeSection,pageMode]);
  const href = (id: string) => pageMode ? pageHref(id) : `${away ? '/' : ''}#${id}`,
    primary = new Set(['home', 'projects', 'services', 'about', 'contact']);

  return (
    <>
      <header
        className="site-header studio-header"
        data-scrolled={scrolled}
        data-away={away}
        data-experience="studio-navigation"
      >
        <div className="studio-header-inner">
          <Link
            href={pageMode ? '/portofolio' : '/'}
            className="wordmark studio-brand"
            aria-label={profile.wordmark || profile.name || 'PramudyaSpaces'}
          >
            <img src="/brand/rpa-symbol.svg" width={30} height={30} alt="" />
            <span>
              {profile.wordmark || 'PramudyaSpaces'}
              <small>{en ? 'Design meets engineering.' : 'Desain bertemu teknologi.'}</small>
            </span>
          </Link>
          <nav
            className="studio-primary-nav"
            aria-label={en ? 'Main navigation' : 'Navigasi utama'}
          >
            {nav
              .filter(([id]) => primary.has(id))
              .map(([id, label]) => (
                <a
                  href={href(id)}
                  key={id}
                  aria-current={!away && activeSection === id ? 'location' : undefined}
                  onClick={() => setMenu(false)}
                >
                  {label}
                </a>
              ))}
          </nav>
          <div className="header-tools">
            <span className="studio-clock">
              <span>{en ? 'Bandung time' : 'Waktu Bandung'}</span>
              <time suppressHydrationWarning>{clock || 'WIB'}</time>
            </span>
            <button
              type="button"
              className="language-button"
              onClick={onLanguage}
              aria-label={en ? 'Switch to Indonesian' : 'Ganti ke bahasa Inggris'}
            >
              {en ? 'EN' : 'ID'}
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={onTheme}
              aria-pressed={theme === 'dark'}
              aria-label={en ? 'Change theme' : 'Ganti tema'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              ref={menuButton}
              aria-controls={menuId}
              className="studio-menu-button"
              type="button"
              aria-label={
                menu ? (en ? 'Close menu' : 'Tutup menu') : en ? 'Open menu' : 'Buka menu'
              }
              aria-expanded={menu}
              onClick={() => setMenu((value) => !value)}
            >
              {menu ? <X size={17} /> : <Menu size={17} />}
              <span>Menu</span>
            </button>
          </div>
          {menu && (
            <div
              id={menuId}
              ref={menuPanel}
              className="studio-nav-popover"
              onBlur={(event) => {
                if (
                  event.relatedTarget &&
                  !event.currentTarget.contains(event.relatedTarget as Node) &&
                  event.relatedTarget !== menuButton.current
                )
                  setMenu(false);
              }}
            >
              <p>{en ? 'Explore the space' : 'Jelajahi ruang ini'}</p>
              <nav aria-label={en ? 'All sections' : 'Semua bagian'}>
                {nav.map(
                  ([id, label], index) => (
                    <a
                      href={href(id)}
                      key={id}
                      onClick={() => setMenu(false)}
                      aria-current={!away && activeSection === id ? 'location' : undefined}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {label}
                      <ArrowUpRight size={15} />
                    </a>
                  ),
                )}
              </nav>
              <a className="studio-reading-mode" href={pageMode ? `/#${activeSection}` : pageHref(activeSection==='playground'?'home':activeSection)}>
                <span>{en ? 'Reading mode' : 'Cara menjelajah'}</span>
                <strong>{pageMode ? (en ? 'Switch to scroll' : 'Ganti ke scroll') : (en ? 'Open page mode' : 'Buka mode per halaman')}</strong>
              </a>
              <button type="button" className="studio-motion-toggle" aria-pressed={!motion} onClick={onMotion}>
                <span>{en ? 'Reduce animation' : 'Kurangi animasi'}</span>
                <span aria-hidden="true">{!motion ? (en ? 'On' : 'Aktif') : (en ? 'Off' : 'Nonaktif')}</span>
              </button>
              <small>
                {profile.location}
                {clock && ` · ${clock} WIB`}
              </small>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
