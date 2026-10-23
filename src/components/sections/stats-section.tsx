'use client';
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
export function StatsSection({
  stats,
  en,
}: {
  stats: { value: number; label: string }[];
  en: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const nodes = el.querySelectorAll<HTMLElement>('[data-count]'),
          start = performance.now();
        function tick(now: number) {
          const t = Math.min(1, (now - start) / 1100),
            progress = 1 - Math.pow(1 - t, 3);
          nodes.forEach(
            (node, i) => (node.textContent = String(Math.round(stats[i].value * progress))),
          );
          if (t < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stats]);
  return (
    <section
      className="studio-stats studio-shell"
      ref={root}
      aria-label={en ? 'Portfolio in numbers' : 'Portofolio dalam angka'}
    >
      <div className="studio-stats-panel" data-reveal>
        <div className="studio-metrics-intro">
          <p className="studio-eyebrow">{en ? 'By the numbers' : 'Dalam angka'}</p>
          <h2>{en ? 'Proof in the work.' : 'Bukti lewat karya.'}</h2>
          <p>
            {en
              ? 'A snapshot of the work, learning, and experience shared here.'
              : 'Gambaran karya, pembelajaran, dan pengalaman yang dibagikan di sini.'}
          </p>
        </div>
        <dl>
          {stats.map((s, i) => (
            <div key={s.label}>
              <dt>
                <a href={['#projects', '#skills', '#certificates', '#journey'][i]}>
                  {s.label}
                  <ArrowUpRight size={15} />
                </a>
              </dt>
              <dd>
                <span data-count>{s.value}</span>
                <span className="count-dot">.</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
