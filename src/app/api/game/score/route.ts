import { api, HttpError, rateLimit, readJson } from '@/lib/http';
import { serviceClient } from '@/lib/supabase';
import { gameAccount } from '@/lib/game-server';
import { GAME_SESSION_SECONDS, validateGameSession } from '@/lib/game-score';
import { MAX_SCORE_RATE } from '@/lib/runner-game';
import { gameScoreSchema } from '@/lib/validation';
export async function POST(request: Request) { return api(request, async () => {
  const user = await gameAccount();
  const input = gameScoreSchema.parse(await readJson(request));
  await rateLimit(request, 'game-score', 12, 60, user.id);
  const db = serviceClient();
  const { data, error } = await db.from('game_sessions').select('user_id,started_at,used_at').eq('id', input.session).eq('user_id', user.id).maybeSingle();
  if (error) throw new HttpError(503, 'Penyimpanan skor belum tersedia.');
  validateGameSession(data, user.id, Date.now(), input.score);
  const result = await db.rpc('submit_runner_score', { p_user_id: user.id, p_session: input.session, p_score: input.score, p_name: user.display_name, p_avatar: user.avatar_url, p_max_rate: MAX_SCORE_RATE, p_session_seconds: GAME_SESSION_SECONDS });
  if (result.error) throw new HttpError(result.error.code === '22023' ? 400 : 503, 'Skor tidak dapat disimpan. Sesi mungkin sudah dipakai atau kedaluwarsa.');
  return { best_score: result.data };
}); }
