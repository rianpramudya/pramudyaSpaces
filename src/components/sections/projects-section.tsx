import type { Entry } from '@/lib/model';
import { SectionHeading } from '@/components/ui/section-heading';
import { StudioProjectGallery } from '@/components/projects/project-gallery';
import { StudioButton } from '@/components/ui/studio-button';
export function ProjectsSection({
  projects,
  title,
  description,
  en,
}: {
  projects: Entry[];
  title: string;
  description?: string;
  en: boolean;
}) {
  return (
    <section id="projects" className="studio-work studio-shell">
      <SectionHeading
        label={en ? 'Portfolio' : 'Portofolio'}
        title={title}
        description={description}
      />
      <StudioProjectGallery projects={projects} en={en} />
      <div className="studio-section-end">
        <p>
          {en
            ? 'The thinking, the process, and what came out of it.'
            : 'Pemikiran, proses, dan hasil di balik setiap proyek.'}
        </p>
        <StudioButton href="/projects">
          {en ? 'Explore all projects' : 'Lihat semua proyek'}
        </StudioButton>
      </div>
    </section>
  );
}
