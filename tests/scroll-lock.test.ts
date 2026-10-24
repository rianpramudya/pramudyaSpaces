import test from 'node:test';
import assert from 'node:assert/strict';
import { lockBodyScroll } from '../src/lib/scroll-lock';

test('OAuth overlap: loader finishes before guestbook closes, then scroll is restored', () => {
  const body = { style: { overflow: '' } };
  const releaseLoader = lockBodyScroll(body);
  const releaseGuestbook = lockBodyScroll(body);
  releaseLoader();
  assert.equal(body.style.overflow, 'hidden', 'open drawer still owns a lock');
  releaseGuestbook();
  assert.equal(body.style.overflow, '', 'closing the last overlay must restore scrolling');
});
test('closing a drawer before loader completion keeps scroll locked until the loader exits', () => {
  const body = { style: { overflow: 'auto' } };
  const releaseLoader = lockBodyScroll(body);
  const releaseDrawer = lockBodyScroll(body);
  releaseDrawer();
  assert.equal(body.style.overflow, 'hidden');
  releaseLoader();
  assert.equal(body.style.overflow, 'auto');
});
test('nested overlays and repeated cleanup cannot release someone else’s lock', () => {
  const body = { style: { overflow: 'scroll' } };
  const first = lockBodyScroll(body), second = lockBodyScroll(body), third = lockBodyScroll(body);
  second(); second(); first();
  assert.equal(body.style.overflow, 'hidden');
  third();
  assert.equal(body.style.overflow, 'scroll');
  const again = lockBodyScroll(body);
  third();
  assert.equal(body.style.overflow, 'hidden');
  again();
  assert.equal(body.style.overflow, 'scroll');
});
test('Strict Mode cleanup/reacquisition and different documents preserve their initial state', () => {
  const a = { style: { overflow: '' } }, b = { style: { overflow: 'clip' } };
  const first = lockBodyScroll(a); first();
  const second = lockBodyScroll(a), other = lockBodyScroll(b);
  second();
  assert.equal(a.style.overflow, '');
  assert.equal(b.style.overflow, 'hidden');
  other();
  assert.equal(b.style.overflow, 'clip');
});
