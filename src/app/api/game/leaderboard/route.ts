import { api, HttpError, rateLimit } from '@/lib/http';
import { serviceClient } from '@/lib/supabase';
import { gameAccount } from '@/lib/game-server';
import { projectLeaderboard, type BoardRow } from '@/lib/game-score';
export async function GET(request: Request) { return api(request, async () => {
  await rateLimit(request, 'game-board', 90, 60);
  const user = await gameAccount(false);
  const { data, error } = await serviceClient().rpc('runner_board', { p_user_id: user?.id || null });
  if (error) throw new HttpError(503, 'Papan peringkat belum tersedia. Game lokal tetap bisa dimainkan.');
  return { ...projectLeaderboard((data || []) as BoardRow[], user?.id), authenticated: Boolean(user) };
}); }
