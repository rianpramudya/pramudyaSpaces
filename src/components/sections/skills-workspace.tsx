'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Code2, Layers } from 'lucide-react';
import { type Entry, textValue, listValue } from '@/lib/model';
import { ProjectCover } from '@/components/projects/project-cover';
import { projectsUsingSkill, skillGroups } from '@/lib/workspace-content';

export function StudioWorkspace({
  skills,
  projects,
  en,
}: {
  skills: Entry[];
  projects: Entry[];
  en: boolean;
}) {
  const uid = useId(),
    groups = skillGroups(skills),
    [category, setCategory] = useState(''),
    [selection, setSelection] = useState('');
  const current = Math.max(
      0,
      groups.findIndex((g) => g.name === category),
    ),
    group = groups[current];
  if (!group) return null;
  const selected = group.items.find((s) => s.id === selection) || group.items[0],
    related = projectsUsingSkill(selected, projects),
    cover = related[0] && listValue(related[0].data, 'media')[0];
  function chooseCategory(index: number) {
    if (groups[index]) {
      setCategory(groups[index].name);
      setSelection('');
    }
  }
  return (
    <div className="studio-workspace" data-experience="interactive-workspace">
      <div
        className="workspace-categories"
        role="tablist"
        aria-label={en ? 'Skill categories' : 'Kategori kompetensi'}
      >
        {groups.map((g, index) => (
          <button
            type="button"
            role="tab"
            id={`${uid}-tab-${index}`}
            aria-selected={index === current}
            aria-controls={`${uid}-panel`}
            tabIndex={index === current ? 0 : -1}
            key={g.name}
            onClick={() => chooseCategory(index)}
            onKeyDown={(e) => {
              let next = index;
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
                next = (index + 1) % groups.length;
              else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
                next = (index + groups.length - 1) % groups.length;
              else if (e.key === 'Home') next = 0;
              else if (e.key === 'End') next = groups.length - 1;
              else return;
              e.preventDefault();
              chooseCategory(next);
              const buttons =
                e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]');
              buttons?.[next]?.focus();
            }}
          >
            <span>{g.name}</span>
            <small>{g.items.length}</small>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
      <div
        className="workspace-panel"
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${current}`}
        tabIndex={0}
      >
        <div className="workspace-stage" key={selected.id}>
          <div className="workspace-stage-glow" aria-hidden="true" />
          <div className="workspace-tool-sign" aria-hidden="true">
            <Code2 strokeWidth={0.65} />
          </div>
          <div className="workspace-selected">
            <p>{group.name}</p>
            <h3>{selected.title}</h3>
            {textValue(selected.data, 'level') && <span>{textValue(selected.data, 'level')}</span>}
            {textValue(selected.data, 'description') && (
              <p className="workspace-skill-description">
                {textValue(selected.data, 'description')}
              </p>
            )}
          </div>
          {related[0] && (
            <Link className="workspace-project-proof" href={`/projects/${related[0].id}`}>
              {cover && (
                <div className="workspace-proof-cover">
                  <ProjectCover entry={related[0]} en={en} />
                </div>
              )}
              <span>
                <small>{en ? 'Used in this project' : 'Digunakan dalam proyek'}</small>
                <strong>{related[0].title}</strong>
              </span>
              <ArrowUpRight size={18} />
            </Link>
          )}
        </div>
        <div
          className="workspace-tool-picker"
          aria-label={en ? 'Choose a skill' : 'Pilih kompetensi'}
        >
          {group.items.map((skill) => (
            <button
              key={skill.id}
              type="button"
              aria-pressed={skill.id === selected.id}
              onClick={() => setSelection(skill.id)}
            >
              {skill.title}
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
        {related.length > 1 && (
          <div className="workspace-related">
            <Layers size={16} />
            <span>{en ? 'Also used in' : 'Juga digunakan dalam'}</span>
            {related.slice(1).map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`}>
                {p.title}
                <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
