import type { Entry } from '@/lib/model';
import { SectionHeading } from '@/components/ui/section-heading';
import { StudioServices } from './services-studio';
export function ServicesSection({
  services,
  projects,
  title,
  description,
  en,
}: {
  services: Entry[];
  projects: Entry[];
  title: string;
  description?: string;
  en: boolean;
}) {
  if (!services.length) return null;
  return (
    <section id="services" className="studio-services studio-shell">
      <SectionHeading label={en ? 'Services' : 'Layanan'} title={title} description={description} />
      <StudioServices services={services} projects={projects} en={en} />
    </section>
  );
}
