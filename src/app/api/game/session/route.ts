import { api, HttpError, rateLimit } from '@/lib/http';
import { serviceClient } from '@/lib/supabase';
import { gameAccount } from '@/lib/game-server';
export async function POST(request: Request) { return api(request, async () => {
  const user = await gameAccount();
  await rateLimit(request, 'game-session', 12, 60, user.id);
  const db = serviceClient();
  // Old sessions carry no history that the leaderboard needs; bound each active player's storage.
  const cleanup = await db.from('game_sessions').delete().eq('user_id', user.id).lt('started_at', new Date(Date.now() - 86400_000).toISOString());
  if (cleanup.error) throw new HttpError(503, 'Penyimpanan game belum tersedia. Anda tetap bisa bermain lokal.');
  const { data, error } = await db.from('game_sessions').insert({ user_id: user.id }).select('id').single();
  if (error || !data) throw new HttpError(503, 'Sesi online belum tersedia. Anda tetap bisa bermain lokal.');
  return { session: data.id };
}); }
