import { Gamepad2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { RunnerGame } from '@/components/runner-game';
export function PlaygroundSection({
  language,
  onGuestbook,
}: {
  language: 'id' | 'en';
  onGuestbook?: () => void;
}) {
  const en = language === 'en';
  return (
    <section id="playground" className="studio-playground studio-shell">
      <SectionHeading
        label={en ? 'A little play goes a long way' : 'Main sebentar juga boleh'}
        title={en ? 'Serious work. Playful mind.' : 'Serius berkarya. Tetap bermain.'}
      />
      <details className="studio-play-panel">
        <summary><span>{en ? 'Take a play break' : 'Istirahat sambil bermain'}</span><span className="playground-disclosure-mark" aria-hidden="true">+</span></summary>
        <div className="studio-play-intro">
          <Gamepad2 size={28} />
          <p>
            {en
              ? 'Jump over errors. Duck under bugs. How far can you go?'
              : 'Lompati error, tundukkan diri di bawah bug. Seberapa jauh Anda bisa berlari?'}
          </p>
        </div>
        <RunnerGame language={language} onGuestbook={onGuestbook} />
      </details>
    </section>
  );
}
