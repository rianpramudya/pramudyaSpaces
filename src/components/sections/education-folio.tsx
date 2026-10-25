import { GraduationCap, ArrowUpRight, Award, Plus } from 'lucide-react';
import { type Entry, textValue, listValue } from '@/lib/model';
import { RelatedWorkLinks } from '@/components/related-work-links';
import { RelatedCertificates } from '@/components/related-certificates';
export function EducationFolio({
  education,
  languages,
  achievements,
  en,
  projects = [],
  certificates = [],
}: {
  projects?: Entry[];
  certificates?: Entry[];
  education: Entry[];
  languages: Entry[];
  achievements: Entry[];
  en: boolean;
}) {
  return (
    <div className="studio-learning-folio">
      <div
        className="learning-foundation"
        data-has-education={education.length > 0}
        data-has-languages={languages.length > 0}
      >
        {education.length > 0 && (
          <div className="academic-pages">
            {education.map((entry) => (
              <article key={entry.id} className="academic-entry">
                <div className="academic-period">
                  <GraduationCap size={25} />
                  <span>{textValue(entry.data, 'start')}</span>
                  <i />
                  <span>{textValue(entry.data, 'end')}</span>
                </div>
                <div className="academic-reading">
                  <p className="studio-eyebrow">{textValue(entry.data, 'degree')}</p>
                  <h3>{entry.title}</h3>
                  {textValue(entry.data, 'gpa') && (
                    <div className="academic-gpa">
                      <span>{en ? 'GPA' : 'IPK'}</span>
                      <strong>{textValue(entry.data, 'gpa')}</strong>
                    </div>
                  )}
                  <p>{textValue(entry.data, 'description')}</p>
                  {listValue(entry.data, 'bullets').length > 0 && (
                    <details>
                      <summary>
                        {en ? 'Learning & contributions' : 'Pembelajaran & kontribusi'}
                        <Plus size={16} />
                      </summary>
                      <ul>
                        {listValue(entry.data, 'bullets').map((point, i) => (
                          <li key={i}>{point}</li>
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
        )}
        {languages.length > 0 && (
          <aside className="learning-languages">
            <h3>{en ? 'Languages' : 'Bahasa'}</h3>
            {languages.map((entry) => (
              <article key={entry.id}>
                <div>
                  <strong>{entry.title}</strong>
                  <span>{textValue(entry.data, 'level')}</span>
                </div>
                <p>{textValue(entry.data, 'description')}</p>
                <RelatedCertificates entry={entry} certificates={certificates} en={en} />
              </article>
            ))}
          </aside>
        )}
      </div>
      {achievements.length > 0 && (
        <div className="learning-achievements">
          <h3>
            <Award size={20} />
            {en ? 'Milestones' : 'Pencapaian'}
          </h3>
          <div>
            {achievements.map((entry) => (
              <article key={entry.id}>
                <span>{textValue(entry.data, 'date')}</span>
                <h4>{entry.title}</h4>
                <p>{textValue(entry.data, 'description')}</p>
                {listValue(entry.data, 'bullets').length > 0 && (
                  <details>
                    <summary>
                      {en ? 'Details' : 'Rincian'}
                      <Plus size={15} />
                    </summary>
                    <ul>
                      {listValue(entry.data, 'bullets').map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </details>
                )}
                <RelatedWorkLinks entry={entry} projects={projects} en={en} />
                {textValue(entry.data, 'url') && (
                  <a href={textValue(entry.data, 'url')} target="_blank" rel="noreferrer">
                    {en ? 'View achievement' : 'Lihat pencapaian'}
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
