import { ArrowUpRight } from 'lucide-react';
import { projectStory } from '@/lib/project-story';
export function ProjectEvidence({
  data,
  en,
  headingLevel = 4,
}: {
  data: Record<string, unknown>;
  en: boolean;
  headingLevel?: 3 | 4;
}) {
  const story = projectStory(data);
  const Heading = headingLevel === 3 ? 'h3' : 'h4';
  return (
    <div className="project-evidence">
      <section>
        <Heading>{en ? 'The problem' : 'Masalah'}</Heading>
        <p>{story.problem}</p>
      </section>
      <section>
        <Heading>{en ? 'My contribution' : 'Kontribusi saya'}</Heading>
        {story.contributions.length ? (
          <ul>
            {story.contributions.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        ) : (
          <p>
            {typeof data.role === 'string' && data.role ? data.role : 'TODO: isi kontribusi saya'}
          </p>
        )}
      </section>
      <section>
        <Heading>{en ? 'Outcome & evidence' : 'Hasil & bukti'}</Heading>
        <p className={story.missingResult ? 'evidence-todo' : ''}>{story.result}</p>
        {story.resultSource && (
          <a className="text-button" href={story.resultSource} target="_blank" rel="noreferrer">
            {en ? 'View evidence' : 'Lihat bukti'}
            <ArrowUpRight size={16} />
          </a>
        )}
        {story.missingResult && story.authoredResult && (
          <details>
            <summary>
              {en ? 'CMS outcome note · evidence pending' : 'Catatan hasil CMS · menunggu bukti'}
            </summary>
            <p>{story.authoredResult}</p>
          </details>
        )}
      </section>
    </div>
  );
}
export function ProjectLinks({ data, en }: { data: Record<string, unknown>; en: boolean }) {
  const { links } = projectStory(data);
  return links.length ? (
    <div className="project-source-links" aria-label={en ? 'Project sources' : 'Sumber proyek'}>
      {links.map((link) => (
        <a
          className="text-button"
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noreferrer"
        >
          {link.label}
          <ArrowUpRight size={16} />
        </a>
      ))}
    </div>
  ) : null;
}
