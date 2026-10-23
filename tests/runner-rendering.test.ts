import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RunnerView } from '../src/components/runner-game';
import { createRunner, startRunner } from '../src/lib/runner-game';

function render(language: 'id' | 'en', phase: 'ready' | 'over', slow = false) {
  return renderToStaticMarkup(React.createElement(RunnerView, {
    language, state: { ...createRunner({ reducedMotion: slow }), phase, score: phase === 'over' ? 120 : 0 },
    best: 200, onStart() {}, onPause() {}, onJump() {}, onDuck() {},
  }));
}
test('runner initial screen has bilingual help, accessible canvas and local best without CMS or login', () => {
  const id = render('id', 'ready');
  for (const text of ['Mulai', 'Terbaik lokal', 'Spasi', 'canvas', 'aria-live="polite"']) assert.ok(id.includes(text), text);
  const en = render('en', 'ready');
  for (const text of ['Start', 'Local best', 'Space', 'Jump', 'Duck']) assert.ok(en.includes(text), text);
  assert.ok(!id.includes('skill-blocks'));
});
test('game over announces score and offers restart in both languages; slow mode stays playable', () => {
  for (const language of ['id', 'en'] as const) {
    const html = render(language, 'over', true);
    for (const text of [language === 'id' ? 'Main lagi' : 'Play again', '120', language === 'id' ? 'Mode lambat' : 'Slow mode']) assert.ok(html.includes(text), text);
    assert.ok(html.includes('<button'));
  }
});
test('running screen exposes pause instead of start', () => {
  const html = renderToStaticMarkup(React.createElement(RunnerView, { language: 'en', state: startRunner(createRunner()), best: 0, onStart() {}, onPause() {}, onJump() {}, onDuck() {} }));
  assert.ok(html.includes('Pause'));
});
