'use client';
import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { type Entry, textValue, listValue } from '@/lib/model';
import { CinematicSurface } from '@/components/cinematic-surface';
import { ProjectCover } from './project-cover';
import { ProjectEvidence, ProjectLinks } from './project-evidence';

export function StudioProjectGallery({ projects, en }: { projects: Entry[]; en: boolean }) {
  const [selected, setSelected] = useState(''),
    storyId = useId(),
    touch = useRef<{ x: number; y: number } | null>(null);
  const index = Math.max(
      0,
      projects.findIndex((p) => p.id === selected),
    ),
    entry = projects[index];
  function choose(next: number) {
    if (projects[next]) setSelected(projects[next].id);
  }
  if (!entry)
    return (
      <p className="studio-empty">
        {en
          ? 'Published projects will appear here.'
          : 'Proyek yang diterbitkan akan tampil di sini.'}
      </p>
    );
  return (
    <div
      className="studio-gallery"
      role="region"
      aria-roledescription={en ? 'carousel' : 'karusel'}
      aria-label={en ? 'Selected project gallery' : 'Galeri proyek pilihan'}
    >
      <div className="studio-gallery-toolbar">
        <span>{en ? 'Work in focus' : 'Karya dalam sorotan'}</span>
        <span aria-live="polite">
          <span className="studio-gallery-count" key={entry.id}>{String(index + 1).padStart(2, '0')}</span> / {String(projects.length).padStart(2, '0')}
        </span>
        <div>
          <button
            type="button"
            disabled={index === 0}
            aria-label={en ? 'Previous project' : 'Proyek sebelumnya'}
            onClick={() => choose(index - 1)}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            disabled={index === projects.length - 1}
            aria-label={en ? 'Next project' : 'Proyek berikutnya'}
            onClick={() => choose(index + 1)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div
        className="studio-gallery-stage"
        tabIndex={0}
        aria-label={
          en
            ? 'Project previews. Use left and right arrow keys.'
            : 'Pratinjau proyek. Gunakan tombol panah kiri dan kanan.'
        }
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            choose(index + (e.key === 'ArrowRight' ? 1 : -1));
          } else if (e.key === 'Home' || e.key === 'End') {
            e.preventDefault();
            choose(e.key === 'Home' ? 0 : projects.length - 1);
          }
        }}
        onTouchStart={(e) => {
          const p = e.touches[0];
          touch.current = e.touches.length === 1 ? { x: p.clientX, y: p.clientY } : null;
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          const p = e.changedTouches[0];
          if (!start || !p || e.touches.length) return;
          const dx = p.clientX - start.x,
            dy = p.clientY - start.y;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4)
            choose(index + (dx < 0 ? 1 : -1));
        }}
        onTouchCancel={() => {
          touch.current = null;
        }}
      >
        <CinematicSurface />
        {projects.slice(Math.max(0, index - 1), index + 2).map((project) => {
          const position = projects.indexOf(project) - index;
          return (
            <div className="studio-gallery-frame" data-position={position} key={project.id}>
              {position === 0 ? (
                <Link
                  href={`/projects/${project.id}`}
                  aria-label={`${en ? 'Read case study' : 'Baca studi kasus'}: ${project.title}`}
                >
                  <ProjectCover entry={project} en={en} lazy={position !== 0} />
                </Link>
              ) : (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`${en ? 'Select' : 'Pilih'} ${project.title}`}
                  onClick={() => choose(index + position)}
                >
                  <ProjectCover entry={project} en={en} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="studio-gallery-story" id={storyId}>
        <div className="studio-gallery-reading" key={entry.id}>
          <p className="studio-eyebrow">
            {textValue(entry.data, 'role') || textValue(entry.data, 'category')}
          </p>
          <h3>{entry.title}</h3>
          <p>{textValue(entry.data, 'description')}</p>
          <div className="studio-gallery-tags">
            {listValue(entry.data, 'technologies').map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div>
          <details key={entry.id}>
            <summary>
              {en ? 'Process, contribution & outcome' : 'Proses, kontribusi & hasil'}
            </summary>
            <ProjectEvidence data={entry.data} en={en} />
          </details>
          <ProjectLinks data={entry.data} en={en} />
          <Link className="studio-gallery-case" href={`/projects/${entry.id}`}>
            {en ? 'Read the case study' : 'Baca studi kasus'}
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="studio-gallery-index" aria-label={en ? 'Choose a project' : 'Pilih proyek'}>
        {projects.map((project, i) => (
          <button
            key={project.id}
            type="button"
            aria-pressed={i === index}
            aria-controls={storyId}
            onClick={() => choose(i)}
          >
            {project.title}
          </button>
        ))}
      </div>
    </div>
  );
}
