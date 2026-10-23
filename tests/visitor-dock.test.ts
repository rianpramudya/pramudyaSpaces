import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VisitorDock } from '../src/components/visitor-dock';
import { emptyProfile } from '../src/lib/model';
test('visitor dock keeps direct guestbook and chat actions without Studio or chibi panel', () => {
  for (const language of ['id', 'en'] as const) {
    const html = renderToStaticMarkup(React.createElement(VisitorDock, { profile: { ...emptyProfile, name: 'Rian' }, language, onPanel() {} }));
    assert.equal((html.match(/<button/g) || []).length, 2);
    for (const removed of ['<details', '<summary', 'Studio', 'dock-content', 'arcade-lane']) assert.ok(!html.includes(removed), removed);
    assert.ok(html.includes(language === 'id' ? 'Buka buku tamu' : 'Open guestbook'));
    assert.ok(html.includes(language === 'id' ? 'Tanya Rian' : 'Ask Rian'));
  }
});
