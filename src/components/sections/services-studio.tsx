'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { type Entry, textValue, listValue } from '@/lib/model';
import { serviceProjects } from '@/lib/presentation';
import { ProjectCover } from '@/components/projects/project-cover';

export function StudioServices({
  services,
  projects,
  en,
}: {
  services: Entry[];
  projects: Entry[];
  en: boolean;
}) {
  const [selected, setSelected] = useState(''),
    uid = useId(),
    index = Math.max(
      0,
      services.findIndex((s) => s.id === selected),
    ),
    service = services[index];
  if (!service) return null;
  const related = serviceProjects(service, projects);
  return (
    <div className="studio-service-studio">
      <div className="service-selector">
        {services.map((item, i) => (
          <article key={item.id} data-active={i === index}>
            <button
              type="button"
              aria-expanded={i === index}
              aria-controls={`${uid}-${i}`}
              onClick={() => setSelected(item.id)}
            >
              <span>{item.title}</span>
              <Plus size={20} />
            </button>
            <div id={`${uid}-${i}`} hidden={i !== index}>
              <p>{textValue(item.data, 'description')}</p>
              {listValue(item.data, 'bullets').length > 0 && (
                <ul>
                  {listValue(item.data, 'bullets').map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              )}
              <a href="#contact">
                {en ? 'Discuss this service' : 'Diskusikan layanan ini'}
                <ArrowUpRight size={17} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <aside
        className="service-work-stage"
        aria-label={en ? 'Related portfolio work' : 'Referensi karya terkait'}
      >
        <div className="service-stage-caption">
          <span>
            {Array.isArray(service.data.related_project_ids)
              ? en
                ? 'Selected related work'
                : 'Karya terkait pilihan'
              : en
                ? 'Related by topic'
                : 'Referensi berdasarkan topik'}
          </span>
          <ArrowRight size={18} />
        </div>
        {related[0] ? (
          <div className="service-work-focus" key={related[0].id}>
            <Link
              className="service-work-cover"
              href={`/projects/${related[0].id}`}
              aria-label={related[0].title}
            >
              <ProjectCover entry={related[0]} en={en} />
            </Link>
            <Link className="service-work-title" href={`/projects/${related[0].id}`}>
              {related[0].title}
              <ArrowUpRight size={18} />
            </Link>
            {related.slice(1, 3).map((project) => (
              <Link
                className="service-work-additional"
                href={`/projects/${project.id}`}
                key={project.id}
              >
                {project.title}
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="service-work-empty">
            <h3>{service.title}</h3>
            <p>
              {en
                ? 'Let’s discuss the scope and the right approach for your project.'
                : 'Mari diskusikan lingkup dan pendekatan yang sesuai untuk proyek Anda.'}
            </p>
            <a href="#contact">
              {en ? 'Start a conversation' : 'Mulai percakapan'}
              <ArrowUpRight size={18} />
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
