import type { Entry } from '@/lib/model';
import { SectionHeading } from '@/components/ui/section-heading';
import { Plus } from 'lucide-react';
import { textValue, listValue } from '@/lib/model';
import { RelatedWorkLinks } from '@/components/related-work-links';
import { RelatedCertificates } from '@/components/related-certificates';
export function ExperienceSection({
  experiences,
  projects,
  certificates = [],
  title,
  description,
  en,
}: {
  experiences: Entry[];
  projects: Entry[];
  certificates?: Entry[];
  title: string;
  description?: string;
  en: boolean;
}) {
  if (!experiences.length) return null;
  return (
    <section id="journey" className="studio-journey studio-shell">
      <SectionHeading
        label={en ? 'Experience' : 'Pengalaman'}
        title={title}
        description={description}
      />
      <div className="studio-timeline">
        {experiences.map((entry) => (
          <article key={entry.id} data-reveal>
            <div className="studio-timeline-date">
              {textValue(entry.data, 'start')}
              <span>
                {entry.data.current ? (en ? 'Present' : 'Sekarang') : textValue(entry.data, 'end')}
              </span>
            </div>
            <div>
              <span className="studio-eyebrow">{textValue(entry.data, 'organization')}</span>
              <h3>{entry.title}</h3>
              <p>{textValue(entry.data, 'description')}</p>
              {listValue(entry.data, 'bullets').length > 0 && (
                <details>
                  <summary>
                    {en ? 'Explore contributions' : 'Lihat kontribusi'}
                    <Plus size={17} />
                  </summary>
                  <ul>
                    {listValue(entry.data, 'bullets').map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </details>
              )}
              <RelatedWorkLinks entry={entry} projects={projects} en={en} />
              <RelatedCertificates entry={entry} certificates={certificates} en={en} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
