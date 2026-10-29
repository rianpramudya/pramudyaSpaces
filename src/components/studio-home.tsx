'use client';
import { Fragment, useMemo, type ReactNode } from 'react';
import type { PublicContent, Entry } from '@/lib/model';
import { siteNavigation } from '@/lib/site-navigation';
import { studioContent } from '@/lib/studio-content';
import { StudioMotion } from './studio-motion';
import { HeroSection } from './sections/hero-section';
import { AboutSection } from './sections/about-section';
import { ProjectsSection } from './sections/projects-section';
import { ServicesSection } from './sections/services-section';
import { ExperienceSection } from './sections/experience-section';
import { SkillsSection } from './sections/skills-section';
import { BackgroundSection } from './sections/background-section';
import { CertificatesSection } from './sections/certificates-section';
import { StatsSection } from './sections/stats-section';
import { PlaygroundSection } from './sections/playground-section';
import { ContactSection } from './sections/contact-section';
export function StudioHome({
  content,
  language,
  onCertificate,
  onGuestbook,
  page,
}: {
  content: PublicContent;
  language: 'id' | 'en';
  onCertificate: (entry: Entry) => void;
  onGuestbook?: () => void;
  page?: string;
}) {
  const en = language === 'en',
    p = content.profile,
    d = useMemo(() => studioContent(p, content.records, en), [p, content.records, en]),
    copy = (key: string, fallback = '') => p.section_copy?.[key] || fallback;
  const sections: Record<string, ReactNode> = {
    home: (<>
      <HeroSection
        pageMode={!!page}
        profile={p}
        photo={d.photo}
        reveal={d.reveal}
        projects={d.projects}
        technologies={d.technologies}
        en={en}
      />
      <StatsSection stats={d.stats} en={en} />
    </>),
    about: (<>
      <AboutSection profile={p} documents={content.documents} en={en} />
    </>),
    background: (<>
      <BackgroundSection
        education={d.education}
        certificates={d.certificates}
        languages={d.languages}
        achievements={d.achievements}
        projects={d.projects}
        en={en}
      />
    </>),
    journey: (<>
      <ExperienceSection
        experiences={d.experiences}
        certificates={d.certificates}
        projects={d.projects}
        title={copy('journey_title', en ? 'Learning by doing.' : 'Belajar lewat perjalanan.')}
        description={copy('journey_description')}
        en={en}
      />
    </>),
    projects: (<>
      <ProjectsSection
        projects={d.projects}
        title={copy('projects_title', en ? 'Selected work' : 'Karya pilihan')}
        description={copy('projects_description')}
        en={en}
      />
    </>),
    skills: (<>
      <SkillsSection
        skills={d.skills}
        projects={d.projects}
        title={copy(
          'skills_title',
          en ? 'The right tools. Real possibilities.' : 'Perangkat tepat. Kemungkinan luas.',
        )}
        description={copy('skills_description')}
        en={en}
      />
    </>),
    certificates: (<>
      <CertificatesSection
        certificates={d.certificates}
        projects={d.projects}
        title={copy(
          'certificates_title',
          en ? 'Knowledge, put into practice.' : 'Ilmu yang terus diterapkan.',
        )}
        description={copy('certificates_description')}
        en={en}
        onPreview={onCertificate}
      />
    </>),
    services: (<>
      <ServicesSection
        services={d.services}
        projects={d.projects}
        title={copy('services_title', en ? 'What we can build' : 'Yang bisa kita bangun')}
        description={copy('services_description')}
        en={en}
      />
    </>),
    playground: (<>
      <PlaygroundSection language={language} onGuestbook={onGuestbook} />
    </>),
    contact: (<>
      <ContactSection
        profile={p}
        documents={content.documents}
        title={copy('contact_title', en ? 'What are you thinking?' : 'Sedang memikirkan apa?')}
        description={copy(
          'contact_description',
          en
            ? 'A project, a question, or simply a hello. I’m listening.'
            : 'Proyek, pertanyaan, atau sekadar menyapa. Saya siap mendengarkan.',
        )}
        language={language}
      />
    </>),
  };
  return (
    <>
      <StudioMotion version={`${language}:${content.records.length}:${page || 'scroll'}`} />
      {page ? (page==='playground'?null:sections[page]) : siteNavigation(content.records,en).map(([id]) => <Fragment key={id}>{sections[id]}</Fragment>)}
    </>
  );
}
