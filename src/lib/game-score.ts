import { canWriteGuestbook, guestbookName } from './guestbook-auth';
import { HttpError } from './http-error';
import { maxScoreForDuration, RUNNER_RULES } from './runner-game';
export const GAME_SESSION_SECONDS = 1800;
type Account = Parameters<typeof guestbookName>[0];
export function gameIdentity(user: Account | null, owner: boolean, ownerName = '') {
  if (!user || !canWriteGuestbook(user, owner)) throw new HttpError(401, 'Masuk lewat buku tamu dengan GitHub atau Google untuk menyimpan skor.');
  const raw = String(user.user_metadata?.avatar_url || user.user_metadata?.picture || '');
  let avatar = '';
  try { const url = new URL(raw); if (url.protocol === 'https:' && !url.username && !url.password && raw.length <= 2000) avatar = url.href; } catch {}
  return { display_name: guestbookName(user, owner, ownerName), avatar_url: avatar };
}
export type GameSession = { user_id: string; started_at: string; used_at: string | null };
export function validateGameSession(session: GameSession | null, userId: string, now: number, score: number) {
  const seconds = session ? (now - Date.parse(session.started_at)) / 1000 : NaN;
  if (!session || session.user_id !== userId || session.used_at || !Number.isFinite(seconds) || seconds < 0 || seconds > GAME_SESSION_SECONDS || !Number.isInteger(score) || score < 0 || score > RUNNER_RULES.maxScore || score > maxScoreForDuration(seconds)) {
    throw new HttpError(400, 'Sesi atau skor tidak valid. Mulai permainan baru.');
  }
}
export type BoardRow = { user_id: string; display_name: string; avatar_url: string; best_score: number; show_on_board: boolean; rank?: number | null };
export type Leaderboard = ReturnType<typeof projectLeaderboard>;
export function projectLeaderboard(rows: BoardRow[], userId?: string) {
  const visible = rows.filter(row => row.show_on_board).sort((a, b) => b.best_score - a.best_score || (a.rank ?? 0) - (b.rank ?? 0));
  const rankOf = (row: BoardRow) => row.rank ?? visible.indexOf(row) + 1;
  const own = userId ? rows.find(row => row.user_id === userId) : undefined;
  return {
    entries: visible.slice(0, 10).map(row => ({ display_name: row.display_name, avatar_url: row.avatar_url, best_score: row.best_score, rank: rankOf(row), is_me: row.user_id === userId })),
    viewer: own ? { best_score: own.best_score, show_on_board: own.show_on_board, rank: own.show_on_board ? rankOf(own) : null } : null,
  };
}
