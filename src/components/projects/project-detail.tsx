import Link from 'next/link';
import { type Entry, textValue, listValue } from '@/lib/model';
import { mediaURL } from '@/lib/client-api';
import { DepthSurface } from '@/components/depth-surface';
import { ProjectEvidence, ProjectLinks } from './project-evidence';
function ProjectImage({ entry }: { entry: Entry }) {
  const image = listValue(entry.data, 'media')[0];
  return (
    <div className="project-image">
      {image ? (
        <img
          loading="lazy"
          src={mediaURL(image)}
          alt={textValue(entry.data, 'alt') || entry.title}
        />
      ) : (
        <div className="project-placeholder">
          <span>{entry.title}</span>
          <div className="project-cover-tags">
            {listValue(entry.data, 'technologies')
              .slice(0, 3)
              .map((t) => (
                <span key={t}>{t}</span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
export function ProjectDetail({ project, en }: { project: Entry; en: boolean }) {
  return (
    <article className="project-detail page-width" data-page="case-study">
      <Link className="text-button" href="/projects">
        ← {en ? 'All projects' : 'Semua proyek'}
      </Link>
      <p className="muted">{textValue(project.data, 'role')}</p>
      <h1>{project.title}</h1>
      <DepthSurface room="case" className="case-image-stage">
        <ProjectImage entry={project} />
      </DepthSurface>
      <p className="project-lead">{textValue(project.data, 'description')}</p>
      <div className="project-story">
        <DepthSurface as="article" room="case" className="case-chapter">
          <h2>{en ? 'Project story' : 'Cerita proyek'}</h2>
          <ProjectEvidence data={project.data} en={en} headingLevel={3} />
        </DepthSurface>
        {textValue(project.data, 'context') && (
          <DepthSurface as="article" room="case" className="case-chapter">
            <h2>{en ? 'Full context' : 'Latar belakang lengkap'}</h2>
            <p>{textValue(project.data, 'context')}</p>
          </DepthSurface>
        )}
      </div>
      <div className="tags">
        {listValue(project.data, 'technologies').map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <ProjectLinks data={project.data} en={en} />
      <div className="project-gallery">
        {listValue(project.data, 'media')
          .slice(1)
          .map((image) => (
            <img
              key={image}
              loading="lazy"
              src={mediaURL(image)}
              alt={textValue(project.data, 'alt') || project.title}
            />
          ))}
      </div>
    </article>
  );
}
