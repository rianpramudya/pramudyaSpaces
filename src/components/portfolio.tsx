'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PublicContent, Entry } from '@/lib/model';
import { textValue, listValue } from '@/lib/model';
import { oauthOutcome } from '@/lib/auth-policy';
import { mediaURL, requestJSON } from '@/lib/client-api';
import { usePreferences } from './preferences';
import { PageLoader } from './page-loader';
import { StudioHome } from './studio-home';
import { CinematicChapters } from './cinematic-surface';
import { VisitorDock } from './visitor-dock';
import { PublicPanels } from './public-panels';
import { ProjectDetail } from './projects/project-detail';
import { ProjectArchive } from './projects/project-archive';
import { Drawer } from './drawer';
import { SiteHeader } from './layout/site-header';
import { SiteFooter } from './layout/site-footer';
export function Portfolio({
  initial,
  projectId,
  archive = false,
}: {
  initial: PublicContent;
  projectId?: string;
  archive?: boolean;
}) {
  const portfolioRoot = useRef<HTMLDivElement>(null);
  const { language, setLanguage, theme, toggleTheme, ready: preferencesReady } = usePreferences();
  const en = language === 'en';
  const [content, setContent] = useState(initial);
  const [fallback, setFallback] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [motion, setMotion] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const finishLoading = useCallback(() => setRevealed(true), []);
  const finishExit = useCallback(() => setLoaded(true), []);
  const [panel, setPanel] = useState<'guestbook' | 'chat' | null>(null);
  const [authError, setAuthError] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [certificate, setCertificate] = useState<Entry | null>(null);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => {
      let enabled = true;
      try {
        enabled = localStorage.getItem('portfolio-motion') !== 'off';
      } catch {}
      const animate = !reduced.matches && enabled;
      setMotion(animate);
      if (portfolioRoot.current)
        portfolioRoot.current.dataset.motion = animate ? 'on' : 'off';
    };
    read();
    reduced.addEventListener('change', read);
    window.addEventListener('portfolio-play-change', read);
    return () => {
      reduced.removeEventListener('change', read);
      window.removeEventListener('portfolio-play-change', read);
    };
  }, []);

  useEffect(() => {
    const result = oauthOutcome(location.search);
    if (result.openGuestbook) setPanel('guestbook');
    setAuthError(result.authError);
  }, []);
  useEffect(() => {
    let active = true;
    if (language === 'id') {
      setContent(initial);
      setFallback(false);
      return;
    }
    setFallback(false);
    setTranslated(false);
    requestJSON<{ content: PublicContent; fallback: boolean }>('/api/translate')
      .then((data) => {
        if (active) {
          setContent(data.content);
          setFallback(data.fallback);
          setTranslated(true);
        }
      })
      .catch(() => {
        if (active) {
          setContent(initial);
          setFallback(true);
          setTranslated(true);
        }
      });
    return () => {
      active = false;
    };
  }, [language, initial]);
  const profile = content.profile;
  const copy = (key: string, fallback = '') => profile.section_copy?.[key] || fallback;
  const by = (kind: string) => content.records.filter((e) => e.kind === kind && e.published);
  const projects = by('project');
  const services = by('service');
  const experiences = by('experience');
  const skills = by('skill');
  const certificates = by('certificate');
  const education = by('education');
  const languages = by('language');
  const achievements = by('achievement');
  const cv = content.documents.find((d) => d.id === profile.featured_cv && d.format !== 'letter');
  const owner = profile.name.split(' ')[0] || '';
  const nav = [
    ['home', en ? 'Home' : 'Beranda'],
    ['about', en ? 'About' : 'Tentang'],
    ['projects', en ? 'Projects' : 'Proyek'],
    ...(services.length ? [['services', en ? 'Services' : 'Layanan']] : []),
    ...(experiences.length ? [['journey', en ? 'Experience' : 'Pengalaman']] : []),
    ...(skills.length ? [['skills', en ? 'Skills' : 'Keahlian']] : []),
    ...(education.length || languages.length || achievements.length
      ? [['background', en ? 'Background' : 'Latar belakang']]
      : []),
    ...(certificates.length ? [['certificates', en ? 'Certificates' : 'Sertifikat']] : []),
    ['playground', en ? 'Playground' : 'Ruang bermain'],
    ['contact', en ? 'Contact' : 'Kontak'],
  ];

  useEffect(() => {
    if (archive || projectId) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entered = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (entered[0]) setActiveSection(entered[0].target.id);
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 },
    );
    document
      .querySelectorAll('#main > section[id]')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [archive, projectId, content.records.length]);
  useEffect(() => {
    if (archive || projectId) return;
    const root = portfolioRoot.current;
    if (!root) return;
    let frame = 0;
    function reveal(hash: string, scroll: boolean) {
      let id = '';
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target || !root!.contains(target)) return;
      let expanded = false;
      if (target.matches('section[id]'))
        target
          .querySelectorAll<HTMLDetailsElement>(':scope > details[data-section-disclosure]')
          .forEach((detail) => {
            if (!detail.open) {
              detail.open = true;
              expanded = true;
            }
          });
      let parent = target.parentElement;
      while (parent && parent !== root) {
        if (parent instanceof HTMLDetailsElement && !parent.open) {
          parent.open = true;
          expanded = true;
        }
        parent = parent.parentElement;
      }
      if (scroll && expanded) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() =>
          target.scrollIntoView({ block: 'start', behavior: 'instant' }),
        );
      }
    }
    const change = () => reveal(location.hash, true);
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (link) reveal(link.hash, false);
    };
    root.addEventListener('click', click);
    window.addEventListener('hashchange', change);
    if (location.hash) change();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('click', click);
      window.removeEventListener('hashchange', change);
    };
  }, [archive, projectId]);
  const project = projectId ? projects.find((e) => e.id === projectId) : undefined;
  return (
    <>
    {!loaded && <PageLoader root={portfolioRoot} contentReady={preferencesReady && (!en || translated)} en={en} onReady={finishLoading} exiting={revealed} onExited={finishExit} motion={motion} />}
    <div
      className="portfolio studio-site cinematic-site"
      data-ready={revealed}
      inert={!loaded && preferencesReady}
      aria-hidden={(!loaded && preferencesReady) || undefined}
      data-active-section={activeSection}
      ref={portfolioRoot}
    >
      <a className="skip-link" href="#main">
        {en ? 'Skip to content' : 'Lewati ke konten'}
      </a>
      <SiteHeader
        profile={profile}
        nav={nav}
        en={en}
        away={!!projectId || archive}
        activeSection={activeSection}
        theme={theme}
        onLanguage={() => setLanguage(en ? 'id' : 'en')}
        onTheme={toggleTheme}
      />
      {fallback && (
        <div className="translation-notice" role="status">
          English translation is temporarily unavailable. Showing the Indonesian source.
        </div>
      )}
      {!archive && !projectId && <CinematicChapters nav={nav} active={activeSection} en={en} />}
      <main id="main">
        {archive ? (
          <ProjectArchive projects={projects} en={en} />
        ) : project ? (
          <ProjectDetail project={project} en={en} />
        ) : (
          <>
            <StudioHome content={content} language={language} onCertificate={setCertificate} onGuestbook={() => setPanel('guestbook')} />
          </>
        )}
      </main>
      <SiteFooter profile={profile} nav={nav} en={en} away={!!projectId || archive} />
      <VisitorDock
        profile={profile}
        language={language}
        onPanel={setPanel}
      />
      {panel && (
        <PublicPanels
          panel={panel}
          onClose={() => setPanel(null)}
          language={language}
          owner={owner}
          authError={authError}
        />
      )}{' '}
      {certificate && (
        <Drawer title={certificate.title} onClose={() => setCertificate(null)}>
          <img
            className="certificate-full"
            src={mediaURL(listValue(certificate.data, 'media')[0])}
            alt={textValue(certificate.data, 'alt') || certificate.title}
          />
        </Drawer>
      )}
    </div>
    </>
  );
}
