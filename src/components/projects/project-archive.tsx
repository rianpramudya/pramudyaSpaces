'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { listValue, textValue, type Entry } from '@/lib/model';
import { catalogProjects, displayProjectDate, type ProjectSort } from '@/lib/project-catalog';
import { DepthSurface } from '@/components/depth-surface';
import { ProjectCover } from './project-cover';
export function ProjectArchive({ projects, en }: { projects: Entry[]; en: boolean }) {
  const [query, setQuery] = useState(''),
    [technology, setTechnology] = useState(''),
    [sort, setSort] = useState<ProjectSort>('newest');
  const published = projects.filter((p) => p.kind === 'project' && p.published);
  const rows = catalogProjects(published, { query, technology, sort });
  const technologies = [
    ...new Set(published.flatMap((p) => listValue(p.data, 'technologies'))),
  ].sort();
  return (
    <section className="project-archive page-width" data-page="gallery">
      <Link className="text-button" href="/#projects">
        {en ? 'Back to home' : 'Kembali ke beranda'}
      </Link>
      <div className="archive-intro">
        <h1>{en ? 'The project archive' : 'Arsip karya.'}</h1>
        <p>
          {en
            ? 'A closer look at the systems, experiments and ideas I have worked on.'
            : 'Lebih dekat dengan sistem, eksperimen, dan ide yang pernah saya kerjakan.'}
        </p>
        <span>
          {published.length} {en ? 'published projects' : 'proyek terbit'}
        </span>
      </div>
      <div className="archive-toolbar">
        <label className="archive-search">
          <span>{en ? 'Find a project' : 'Cari proyek'}</span>
          <div>
            <Search size={18} />
            <input
              type="search"
              placeholder={en ? 'Title or technology…' : 'Judul atau teknologi…'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </label>
        <label>
          {en ? 'Technology' : 'Teknologi'}
          <select value={technology} onChange={(e) => setTechnology(e.target.value)}>
            <option value="">{en ? 'All technologies' : 'Semua teknologi'}</option>
            {technologies.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          {en ? 'Sort by' : 'Urutkan'}
          <select value={sort} onChange={(e) => setSort(e.target.value as ProjectSort)}>
            <option value="newest">{en ? 'Newest' : 'Terbaru'}</option>
            <option value="oldest">{en ? 'Oldest' : 'Terlama'}</option>
            <option value="title">{en ? 'Title A–Z' : 'Judul A–Z'}</option>
          </select>
        </label>
      </div>
      <div className="archive-result">
        <span role="status">
          {rows.length} {en ? 'projects shown' : 'proyek ditampilkan'}
        </span>
        {(query || technology) && (
          <button
            className="text-button"
            onClick={() => {
              setQuery('');
              setTechnology('');
            }}
          >
            <X size={14} />
            {en ? 'Clear filters' : 'Hapus filter'}
          </button>
        )}
      </div>
      <div className="archive-list">
        {rows.map((project, index) => (
          <DepthSurface as="article" room="archive" className="archive-row" key={project.id}>
            <span className="archive-number">{String(index + 1).padStart(2, '0')}</span>
            <Link
              className="archive-image"
              href={`/projects/${project.id}`}
              aria-label={`${en ? 'View' : 'Lihat'} ${project.title}`}
            >
              <ProjectCover entry={project} en={en} />
            </Link>
            <div className="archive-story">
              <p className="muted small">
                {displayProjectDate(textValue(project.data, 'date'), en)}
                {textValue(project.data, 'role') && ` / ${textValue(project.data, 'role')}`}
              </p>
              <h2>
                <Link href={`/projects/${project.id}`}>{project.title}</Link>
              </h2>
              <p>{textValue(project.data, 'description')}</p>
              <span className="archive-tools">
                {listValue(project.data, 'technologies').join(' / ')}
              </span>
            </div>
            <Link
              className="archive-arrow icon-button"
              href={`/projects/${project.id}`}
              aria-label={`${en ? 'Read case study' : 'Baca studi kasus'} ${project.title}`}
            >
              <ArrowUpRight size={24} />
            </Link>
          </DepthSurface>
        ))}
      </div>
      {!rows.length && (
        <div className="archive-empty">
          <h2>{en ? 'No projects match.' : 'Belum ada proyek yang cocok.'}</h2>
          <p>
            {en
              ? 'Try another keyword or remove the technology filter.'
              : 'Coba kata kunci lain atau hapus filter teknologi.'}
          </p>
        </div>
      )}
      <p className="archive-note muted small">
        {en
          ? 'Undated projects appear after dated work in the order chosen by the owner.'
          : 'Proyek tanpa tanggal tampil setelah proyek bertanggal, mengikuti urutan yang diatur pemilik.'}
      </p>
    </section>
  );
}
