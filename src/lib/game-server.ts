import 'server-only';
import { currentUser, isOwner, serviceClient } from './supabase';
import { gameIdentity } from './game-score';
import { HttpError } from './http-error';
type GameAccount = { id: string; display_name: string; avatar_url: string };
export function gameAccount(required?: true): Promise<GameAccount>;
export function gameAccount(required: false): Promise<GameAccount | null>;
export async function gameAccount(required = true): Promise<GameAccount | null> {
  const user = await currentUser();
  if (!user) { if (required) throw new HttpError(401, 'Masuk lewat buku tamu untuk menyimpan skor.'); return null; }
  const owner = await isOwner(user.id);
  const db = serviceClient();
  const { data: profile } = owner ? await db.from('profile').select('name').maybeSingle() : { data: null };
  try { return { id: user.id, ...gameIdentity(user, owner, profile?.name || '') }; }
  catch (error) { if (required) throw error; return null; }
}
