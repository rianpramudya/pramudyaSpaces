import { api, HttpError, rateLimit, readJson } from '@/lib/http';
import { serviceClient } from '@/lib/supabase';
import { gameAccount } from '@/lib/game-server';
import { gamePrivacySchema } from '@/lib/validation';
export async function PATCH(request: Request) { return api(request, async () => {
  const user = await gameAccount();
  const input = gamePrivacySchema.parse(await readJson(request));
  await rateLimit(request, 'game-privacy', 12, 60, user.id);
  // The SQL update never includes best_score; simultaneous score writes retain both changes.
  const { error } = await serviceClient().rpc('set_runner_privacy', { p_user_id: user.id, p_name: user.display_name, p_avatar: user.avatar_url, p_visible: input.show_on_board });
  if (error) throw new HttpError(503, 'Pengaturan privasi gagal disimpan.');
  return { show_on_board: input.show_on_board };
}); }
