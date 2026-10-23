import test from 'node:test';
import assert from 'node:assert/strict';
import { gameScoreSchema, gamePrivacySchema } from '../src/lib/validation';
import { gameIdentity, validateGameSession, projectLeaderboard } from '../src/lib/game-score';
const now = Date.parse('2026-10-24T00:10:00Z');
const session = { user_id: 'owner', started_at: new Date(now - 10_000).toISOString(), used_at: null };
test('score schema rejects negative, fractional, oversized scores and client-supplied identity', () => {
  const id = '5ff5d404-78a1-4e66-bbc9-6a244e543bbc';
  for (const score of [-1, .5, 1_000_001, Infinity, '100']) assert.equal(gameScoreSchema.safeParse({ session: id, score }).success, false);
  assert.equal(gameScoreSchema.safeParse({ session: id, score: 100, user_id: 'fake' }).success, false);
  assert.ok(gameScoreSchema.safeParse({ session: id, score: 0 }).success);
  assert.equal(gamePrivacySchema.safeParse({ show_on_board: 'false' }).success, false);
});
test('score session rejects replay, other owner, expiry, future start and impossible score', () => {
  validateGameSession(session, 'owner', now, 100);
  for (const candidate of [null, { ...session, used_at: new Date(now).toISOString() }, { ...session, user_id: 'another' }, { ...session, started_at: new Date(now - 1_800_001).toISOString() }, { ...session, started_at: new Date(now + 1).toISOString() }]) assert.throws(() => validateGameSession(candidate, 'owner', now, 100));
  assert.throws(() => validateGameSession(session, 'owner', now, 621));
});
test('anonymous and unsupported sign-ins cannot write; provider identity follows guestbook policy', () => {
  assert.throws(() => gameIdentity(null, false));
  assert.throws(() => gameIdentity({ app_metadata: { provider: 'email' } }, false));
  assert.throws(() => gameIdentity({ user_metadata: { provider: 'github' } }, false));
  assert.deepEqual(gameIdentity({ app_metadata: { provider: 'github' }, user_metadata: { user_name: 'Visitor', avatar_url: 'javascript:alert(1)' } }, false), { display_name: 'Visitor', avatar_url: '' });
  assert.equal(gameIdentity({ app_metadata: { provider: 'email' } }, true, 'Owner CMS').display_name, 'Owner CMS');
});
test('public leaderboard projects safe fields only and omits hidden users including self rank', () => {
  const rows = [{ user_id: 'a', email: 'secret@example.com', display_name: 'A', avatar_url: '', best_score: 10, show_on_board: true }, { user_id: 'b', email: 'hidden@example.com', display_name: 'B', avatar_url: '', best_score: 20, show_on_board: false }];
  const result = projectLeaderboard(rows, 'b');
  assert.equal(result.entries.length, 1);
  assert.deepEqual(result.viewer, { best_score: 20, show_on_board: false, rank: null });
  assert.ok(!JSON.stringify(result).includes('user_id'));
  assert.ok(!JSON.stringify(result).includes('email'));
  assert.equal(projectLeaderboard(rows, 'a').entries[0].is_me, true);
});
test('projection caps public rows at ten while retaining the actual private rank outside that list', () => {
  const rows = Array.from({ length: 11 }, (_, i) => ({ user_id: String(i), display_name: `Player ${i}`, avatar_url: '', best_score: 200-i, show_on_board: true, rank: i === 10 ? 99 : i+1 }));
  const result = projectLeaderboard(rows, '10');
  assert.equal(result.entries.length, 10);
  assert.equal(result.viewer?.rank, 99);
  assert.ok(result.entries.every(row => !row.is_me));
});
