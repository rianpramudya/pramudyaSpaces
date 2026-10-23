import type { Entry } from '@/lib/model';
import { SectionHeading } from '@/components/ui/section-heading';
import { EducationFolio } from './education-folio';
export function BackgroundSection({
  education,
  languages,
  achievements,
  projects,
  en,
}: {
  education: Entry[];
  languages: Entry[];
  achievements: Entry[];
  projects: Entry[];
  en: boolean;
}) {
  if (!education.length && !languages.length && !achievements.length) return null;
  return (
    <section id="background" className="studio-background studio-shell">
      <SectionHeading
        label={en ? 'Background' : 'Latar belakang'}
        title={en ? 'A foundation to keep growing.' : 'Bekal untuk terus tumbuh.'}
      />
      <EducationFolio
        projects={projects}
        education={education}
        languages={languages}
        achievements={achievements}
        en={en}
      />
    </section>
  );
}
