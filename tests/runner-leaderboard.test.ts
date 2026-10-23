import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RunnerLeaderboard } from '../src/components/runner-leaderboard';
const empty = { authenticated: false, entries: [], viewer: null };
function render(language: 'id' | 'en', options: Partial<React.ComponentProps<typeof RunnerLeaderboard>> = {}) {
  return renderToStaticMarkup(React.createElement(RunnerLeaderboard, { language, board: empty, loading: false, error: false, privacyBusy: false, privacyError: false, onPrivacy() {}, onRefresh() {}, ...options }));
}
test('leaderboard has genuine empty/loading/error and bilingual guestbook login action', () => {
  for (const language of ['id', 'en'] as const) {
    assert.ok(render(language).includes(language === 'id' ? 'Belum ada skor' : 'No scores yet'));
    assert.ok(render(language).includes('guestbook=1'));
    assert.ok(render(language, { loading: true }).includes(language === 'id' ? 'Memuat' : 'Loading'));
    assert.ok(render(language, { error: true }).includes(language === 'id' ? 'belum tersedia' : 'unavailable'));
  }
});
test('ranked player has self marker, safe image fallback, private score and opt-out checkbox', () => {
  const html = render('en', { board: { authenticated: true, entries: [{ rank: 1, display_name: 'Visitor', avatar_url: '', best_score: 120, is_me: true }], viewer: { best_score: 120, show_on_board: false, rank: null } } });
  for (const text of ['Visitor', '120', 'You', 'type="checkbox"', 'checked=""', 'name and account photo']) assert.ok(html.includes(text), text);
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('user_id'));
});
