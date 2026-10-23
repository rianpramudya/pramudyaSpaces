import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForPageAssets } from '../src/lib/page-readiness';

class ImageStub extends EventTarget {
  complete = false;
  loading = 'lazy';
  top = 0;
  decoded = false;
  getBoundingClientRect() { return { top: this.top, bottom: this.top + 200, width: 100, height: 200 }; }
  async decode() { this.decoded = true; }
}

test('readiness waits for visible image decoding and fonts, leaves offscreen media lazy', async () => {
  const visible = new ImageStub(), offscreen = new ImageStub();
  offscreen.top = 1500;
  let fontsReady!: () => void;
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { innerHeight: 800 } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { fonts: { ready: new Promise<void>(resolve => { fontsReady = resolve; }) } } });
  try {
    const root = { querySelectorAll: () => [visible, offscreen] } as unknown as HTMLElement;
    let ready = false;
    const pending = waitForPageAssets(root, new AbortController().signal).then(() => { ready = true; });
    assert.equal(visible.loading, 'eager');
    assert.equal(offscreen.loading, 'lazy');
    visible.dispatchEvent(new Event('load'));
    await Promise.resolve();
    assert.equal(visible.decoded, true);
    assert.equal(ready, false);
    fontsReady();
    await pending;
    assert.equal(ready, true);
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else Reflect.deleteProperty(globalThis, 'window');
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else Reflect.deleteProperty(globalThis, 'document');
  }
});

test('broken images and cancellation cannot trap the visitor', async () => {
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { innerHeight: 800 } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: {} });
  try {
    const image = new ImageStub();
    const root = { querySelectorAll: () => [image] } as unknown as HTMLElement;
    const broken = waitForPageAssets(root, new AbortController().signal);
    image.dispatchEvent(new Event('error'));
    await broken;
    const abort = new AbortController();
    const stuck = waitForPageAssets(root, abort.signal);
    abort.abort();
    await stuck;
    await waitForPageAssets(root, abort.signal);
    const cached = new ImageStub(); cached.complete = true;
    await waitForPageAssets({ querySelectorAll: () => [cached] } as unknown as HTMLElement, new AbortController().signal);
    assert.equal(cached.decoded, true);
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else Reflect.deleteProperty(globalThis, 'window');
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else Reflect.deleteProperty(globalThis, 'document');
  }
});
