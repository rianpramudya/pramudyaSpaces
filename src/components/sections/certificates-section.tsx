import type { Entry } from '@/lib/model';
import { SectionHeading } from '@/components/ui/section-heading';
import { CredentialGallery } from './credential-gallery';
export function CertificatesSection({
  certificates,
  projects,
  onPreview,
  title,
  description,
  en,
}: {
  certificates: Entry[];
  projects: Entry[];
  onPreview: (entry: Entry) => void;
  title: string;
  description?: string;
  en: boolean;
}) {
  if (!certificates.length) return null;
  return (
    <section id="certificates" className="studio-certificates studio-shell">
      <SectionHeading
        label={en ? 'Always learning' : 'Terus belajar'}
        title={title}
        description={description}
      />
      <CredentialGallery
        projects={projects}
        certificates={certificates}
        en={en}
        onPreview={onPreview}
      />
    </section>
  );
}
