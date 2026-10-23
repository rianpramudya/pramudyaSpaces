'use client';
import { useState } from 'react';
import type { RunnerBoard } from './use-runner-online';
function PlayerAvatar({ name, url }: { name: string; url: string }) {
  const [failed, setFailed] = useState(false);
  const safe = url.startsWith('https://');
  return <span className="runner-avatar">{safe && !failed ? <img src={url} width={32} height={32} loading="lazy" referrerPolicy="no-referrer" alt="" onError={() => setFailed(true)} /> : name.slice(0, 1).toUpperCase()}</span>;
}
export function RunnerLeaderboard({ language, board, loading, error, privacyBusy, privacyError, onPrivacy, onRefresh, onGuestbook }: {
  language: 'id' | 'en'; board: RunnerBoard | null; loading: boolean; error: boolean;
  privacyBusy: boolean; privacyError: boolean; onPrivacy: (hidden: boolean) => void; onRefresh: () => void; onGuestbook?: () => void;
}) {
  const en = language === 'en';
  const login = en ? 'Sign in through the guestbook to save your score' : 'Masuk lewat buku tamu untuk menyimpan skor';
  return <section className="runner-leaderboard" aria-label={en ? 'Space Run leaderboard' : 'Papan peringkat Space Run'}>
    <header><div><span className="runner-board-label">TOP 10 / SPACE RUN</span><h3>{en ? 'A little friendly competition.' : 'Sedikit kompetisi, banyak keseruan.'}</h3></div><button type="button" className="text-button" onClick={onRefresh} disabled={loading}>{en ? 'Refresh' : 'Muat ulang'}</button></header>
    {loading ? <p role="status">{en ? 'Loading scores…' : 'Memuat skor…'}</p> : error ? <p role="status">{en ? 'Leaderboard unavailable. You can still play locally.' : 'Papan peringkat belum tersedia. Anda tetap bisa bermain lokal.'}</p> : !board?.entries.length ? <p>{en ? 'No scores yet. Set the first record.' : 'Belum ada skor. Jadilah pencatat rekor pertama.'}</p> : <ol className="runner-rankings">{board.entries.map(row => <li key={row.rank}><span className="runner-rank">{String(row.rank).padStart(2, '0')}</span><PlayerAvatar key={`${row.rank}:${row.avatar_url}`} name={row.display_name} url={row.avatar_url} /><span className="runner-player-name">{row.display_name}{row.is_me && <small>{en ? 'You' : 'Anda'}</small>}</span><strong>{row.best_score}</strong></li>)}</ol>}
    {board?.authenticated ? <div className="runner-board-account">
      {board.viewer && <p>{en ? 'Your best' : 'Skor terbaik Anda'} <strong>{board.viewer.best_score}</strong> · {board.viewer.rank ? `${en ? 'Rank' : 'Peringkat'} ${board.viewer.rank}` : (en ? 'Not on the public board' : 'Tidak tampil di papan publik')}</p>}
      <p>{en ? 'Your name and account photo appear publicly with your score. You can hide them at any time.' : 'Nama dan foto akun tampil publik bersama skor. Anda dapat menyembunyikannya kapan saja.'}</p>
      <label className="runner-privacy"><input type="checkbox" checked={board.viewer?.show_on_board === false} disabled={privacyBusy || loading} onChange={event => onPrivacy(event.target.checked)} />{en ? 'Hide me from the leaderboard' : 'Sembunyikan saya dari papan peringkat'}</label>
      {privacyBusy && <p role="status">{en ? 'Saving privacy…' : 'Menyimpan privasi…'}</p>}
      {privacyError && <p role="alert">{en ? 'Privacy was not saved. Please retry.' : 'Privasi belum tersimpan. Silakan coba lagi.'}</p>}
    </div> : !loading && <div className="runner-board-login">{onGuestbook ? <button type="button" className="text-button" onClick={onGuestbook}>{login} ↗</button> : <a href="/?guestbook=1#playground">{login} ↗</a>}<p>{en ? 'Local play needs no account. Online scores show your name and photo; an opt-out is available after sign-in.' : 'Bermain lokal tanpa akun. Skor online menampilkan nama dan foto; opsi sembunyikan tersedia setelah masuk.'}</p></div>}
  </section>;
}
