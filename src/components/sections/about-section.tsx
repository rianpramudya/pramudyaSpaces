import { ArrowUpRight, ArrowRight, Download, Globe, Plus } from 'lucide-react';
import type { Profile, CareerDocument } from '@/lib/model';
import { mediaURL } from '@/lib/client-api';
import { DepthSurface } from '@/components/depth-surface';
export function AboutSection({
  profile: p,
  documents,
  en,
}: {
  profile: Profile;
  documents: CareerDocument[];
  en: boolean;
}) {
  const cv = documents.find((doc) => doc.id === p.featured_cv && doc.format !== 'letter'),
    paragraphs = p.summary.split(/\n\s*\n/).filter(Boolean);
  return (
    <section id="about" className="studio-about studio-shell">
      <div className="studio-about-portrait" data-reveal>
        {p.photo ? (
          <DepthSurface room="portrait" className="studio-formal-frame">
            <figure>
              <img
                src={mediaURL(p.photo)}
                width={835}
                height={1253}
                loading="lazy"
                alt={p.photo_alt || p.name}
              />
              <figcaption>
                <strong>{p.name}</strong>
                <span>{p.location}</span>
              </figcaption>
            </figure>
          </DepthSurface>
        ) : (
          <div className="studio-portrait-empty">
            <Globe size={120} strokeWidth={0.7} />
            <span>{p.name}</span>
          </div>
        )}
        <div className="studio-portrait-line" aria-hidden="true" />
      </div>
      <div className="studio-about-statement" data-reveal>
        <p className="studio-eyebrow">{en ? 'The person behind the work' : 'Di balik karya'}</p>
        <h2>{en ? 'Curiosity is where it starts.' : 'Rasa ingin tahu adalah awalnya.'}</h2>
        {paragraphs[0] ? (
          <p className="studio-about-summary">{paragraphs[0]}</p>
        ) : (
          <p>{en ? 'The profile is being prepared.' : 'Profil sedang disiapkan.'}</p>
        )}
        {paragraphs.length > 1 && (
          <details className="studio-biography">
            <summary>
              {en ? 'More about me' : 'Selengkapnya tentang saya'}
              <Plus size={17} />
            </summary>
            {paragraphs.slice(1).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </details>
        )}
        <div className="studio-about-bottom">
          <div>
            <span>{en ? 'Find me online' : 'Temukan saya'}</span>
            <div className="studio-social-chips">
              {p.socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </div>
          {cv && (
            <a className="button studio-button outline" href={`${mediaURL(cv.path)}?download=1`}>
              {en ? 'Download CV' : 'Unduh CV'}
              <span>
                <Download size={17} />
              </span>
            </a>
          )}
        </div>
        <div className="studio-create-band" aria-hidden="true">
          <span>{en ? 'Ideas' : 'Ide'}</span>
          <i />
          <span>{en ? 'Into' : 'Jadi'}</span>
          <ArrowRight size={18} />
          <span>{en ? 'Impact' : 'Nyata'}</span>
        </div>
      </div>
    </section>
  );
}
