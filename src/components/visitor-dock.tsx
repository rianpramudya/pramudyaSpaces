'use client';
import { MessageSquare, Sparkles } from 'lucide-react';
import type { Profile } from '@/lib/model';

export function VisitorDock({ profile, language, onPanel }: {
  profile: Profile;
  language: 'id' | 'en';
  onPanel: (panel: 'guestbook' | 'chat') => void;
}) {
  const en = language === 'en';
  const owner = profile.name.split(' ')[0];
  return <aside className="visitor-dock" aria-label={en ? 'Visitor controls' : 'Kontrol pengunjung'}>
    <div className="dock-quick-actions">
      <button type="button" onClick={() => onPanel('guestbook')} aria-label={en ? 'Open guestbook' : 'Buka buku tamu'}><MessageSquare size={18} /><span>{en ? 'Guestbook' : 'Buku tamu'}</span></button>
      <button type="button" onClick={() => onPanel('chat')} aria-label={en ? 'Open AI assistant' : 'Buka asisten AI'}><Sparkles size={18} /><span>{en ? `Ask ${owner || 'me'}` : `Tanya ${owner || 'saya'}`}</span></button>
    </div>
  </aside>;
}
