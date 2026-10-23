import { ArrowUpRight, Download } from 'lucide-react';
import type { Profile, CareerDocument } from '@/lib/model';
import { mediaURL } from '@/lib/client-api';
import { ContactForm } from '@/components/contact-form';
export function ContactSection({
  profile: p,
  documents,
  title,
  description,
  language,
}: {
  profile: Profile;
  documents: CareerDocument[];
  title: string;
  description: string;
  language: 'id' | 'en';
}) {
  const en = language === 'en';
  return (
    <section id="contact" className="studio-contact studio-shell">
      <div className="studio-contact-copy" data-reveal>
        <p className="studio-eyebrow">
          {en ? 'The next good thing starts here' : 'Hal baik berikutnya dimulai di sini'}
        </p>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="studio-contact-links">
          {p.email && p.show_email && (
            <a href={`mailto:${p.email}`}>
              {p.email}
              <ArrowUpRight size={19} />
            </a>
          )}
          {p.phone && p.show_phone && (
            <a href={`tel:${p.phone.replace(/[^+\d]/g, '')}`}>
              {p.phone}
              <ArrowUpRight size={19} />
            </a>
          )}
          {documents
            .filter((doc) => doc.id !== p.featured_cv)
            .map((doc) => (
              <a href={`${mediaURL(doc.path)}?download=1`} key={doc.id}>
                {doc.title}
                <Download size={16} />
              </a>
            ))}
        </div>
      </div>
      <div className="studio-contact-compose" data-reveal>
        <ContactForm language={language} />
      </div>
    </section>
  );
}
