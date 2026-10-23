import type { Entry } from '@/lib/model';
import { SectionHeading } from '@/components/ui/section-heading';
import { StudioWorkspace } from './skills-workspace';
export function SkillsSection({
  skills,
  projects,
  title,
  description,
  en,
}: {
  skills: Entry[];
  projects: Entry[];
  title: string;
  description?: string;
  en: boolean;
}) {
  if (!skills.length) return null;
  return (
    <section id="skills" className="studio-skills studio-shell">
      <SectionHeading
        label={en ? 'Toolkit' : 'Perangkat kerja'}
        title={title}
        description={description}
      />
      <StudioWorkspace skills={skills} projects={projects} en={en} />
    </section>
  );
}
