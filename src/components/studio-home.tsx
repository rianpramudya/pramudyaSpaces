'use client';
import { useMemo } from 'react';
import type { PublicContent, Entry } from '@/lib/model';
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
}: {
  content: PublicContent;
  language: 'id' | 'en';
  onCertificate: (entry: Entry) => void;
}) {
  const en = language === 'en',
    p = content.profile,
    d = useMemo(() => studioContent(p, content.records, en), [p, content.records, en]),
    copy = (key: string, fallback = '') => p.section_copy?.[key] || fallback;
  return (
    <>
      <StudioMotion version={`${language}:${content.records.length}`} />
      <HeroSection
        profile={p}
        photo={d.photo}
        reveal={d.reveal}
        projects={d.projects}
        technologies={d.technologies}
        en={en}
      />
      <StatsSection stats={d.stats} en={en} />
      <AboutSection profile={p} documents={content.documents} en={en} />
      <ProjectsSection
        projects={d.projects}
        title={copy('projects_title', en ? 'Selected work' : 'Karya pilihan')}
        description={copy('projects_description')}
        en={en}
      />
      <ServicesSection
        services={d.services}
        projects={d.projects}
        title={copy('services_title', en ? 'What we can build' : 'Yang bisa kita bangun')}
        description={copy('services_description')}
        en={en}
      />
      <ExperienceSection
        experiences={d.experiences}
        projects={d.projects}
        title={copy('journey_title', en ? 'Learning by doing.' : 'Belajar lewat perjalanan.')}
        description={copy('journey_description')}
        en={en}
      />
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
      <BackgroundSection
        education={d.education}
        languages={d.languages}
        achievements={d.achievements}
        projects={d.projects}
        en={en}
      />
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
      <PlaygroundSection technologies={d.technologies} language={language} />
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
    </>
  );
}
