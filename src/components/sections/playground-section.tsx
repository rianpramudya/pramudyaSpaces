import { Gamepad2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Playground } from '@/components/playground';
export function PlaygroundSection({
  technologies,
  language,
}: {
  technologies: string[];
  language: 'id' | 'en';
}) {
  const en = language === 'en';
  return (
    <section id="playground" className="studio-playground studio-shell">
      <SectionHeading
        label={en ? 'A little play goes a long way' : 'Main sebentar juga boleh'}
        title={en ? 'Serious work. Playful mind.' : 'Serius berkarya. Tetap bermain.'}
      />
      <div className="studio-play-panel">
        <div>
          <Gamepad2 size={28} />
          <p>
            {en
              ? 'Drag, toss, or use your keyboard. This little corner is yours.'
              : 'Geser, lempar, atau gunakan keyboard. Sudut kecil ini untuk Anda.'}
          </p>
        </div>
        <Playground skills={technologies} language={language} />
      </div>
    </section>
  );
}
