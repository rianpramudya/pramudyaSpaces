'use client';
import { useEffect, type RefObject } from 'react';
import { lockBodyScroll } from '@/lib/scroll-lock';
import { waitForPageAssets } from '@/lib/page-readiness';

export function PageLoader({ root, contentReady, en, onReady, exiting, onExited, motion }: {
  root: RefObject<HTMLDivElement | null>;
  contentReady: boolean;
  en: boolean;
  onReady: () => void;
  exiting: boolean;
  onExited: () => void;
  motion: boolean;
}) {
  useEffect(() => lockBodyScroll(), []);

  useEffect(() => {
    if (exiting) return;
    const timeout = window.setTimeout(onReady, 8000);
    return () => clearTimeout(timeout);
  }, [exiting, onReady]);

  useEffect(() => {
    if (!exiting) return;
    // Release even if animationend is interrupted or motion is disabled.
    const reduced = !motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(onExited, reduced ? 0 : 700);
    return () => clearTimeout(timeout);
  }, [exiting, onExited, motion]);

  useEffect(() => {
    if (exiting || !contentReady || !root.current) return;
    const controller = new AbortController();
    void waitForPageAssets(root.current, controller.signal).then(() => {
      if (!controller.signal.aborted) onReady();
    });
    return () => controller.abort();
  }, [contentReady, exiting, onReady, root]);

  return <LoadingScreen en={en} onContinue={onReady} exiting={exiting} onExited={onExited} motion={motion} />;
}

export function LoadingScreen({ en = false, onContinue, exiting = false, onExited, motion = false }: {
  en?: boolean; onContinue?: () => void; exiting?: boolean; onExited?: () => void; motion?: boolean;
}) {
  return <div className="studio-site cinematic-site site-loading-screen" data-exiting={exiting} data-motion={motion ? 'on' : 'off'}
    onAnimationEnd={(event) => {
      if (exiting && event.target === event.currentTarget) onExited?.();
    }}>
    <div className="site-loading-identity">
      <img src="/brand/rpa-symbol.svg" width={40} height={40} alt="" />
      <span>pramudyaSpaces</span>
    </div>
    <div className="site-loading-copy" role="status" aria-live="polite">
      <p>{en ? 'A little space. A new perspective.' : 'Sebuah ruang. Perspektif baru.'}</p>
      <span>{en ? 'Preparing content and imagery…' : 'Menyiapkan konten dan visual…'}</span>
    </div>
    <div className="site-loading-track" aria-hidden="true"><i /></div>
    {onContinue && <button type="button" className="site-loading-skip" onClick={onContinue} disabled={exiting}>
      {en ? 'Continue to website' : 'Langsung masuk'} <span aria-hidden="true">↗</span>
    </button>}
    <noscript><style>{'.site-loading-screen{display:none!important}.portfolio[data-ready=false]{visibility:visible!important}'}</style></noscript>
  </div>;
}
