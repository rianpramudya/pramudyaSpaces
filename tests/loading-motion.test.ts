import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LoadingScreen } from '../src/components/page-loader';

test('initial loading is static until motion is known and an explicit pause stays static during exit', () => {
  const initial = renderToStaticMarkup(React.createElement(LoadingScreen));
  assert.ok(initial.includes('data-motion="off"'));
  const paused = renderToStaticMarkup(React.createElement(LoadingScreen, { motion: false, exiting: true }));
  assert.ok(paused.includes('data-motion="off"'));
  const enabled = renderToStaticMarkup(React.createElement(LoadingScreen, { motion: true }));
  assert.ok(enabled.includes('data-motion="on"'));
});
