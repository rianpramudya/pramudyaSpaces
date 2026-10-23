// Only visible images are critical; offscreen CMS images keep their lazy loading.
export async function waitForPageAssets(root: HTMLElement, signal: AbortSignal): Promise<void> {
  if (signal.aborted) return;
  const images = Array.from(root.querySelectorAll('img')).filter((image) => {
    const rect = image.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
  });
  const pending = images.map((image) => new Promise<void>((resolve) => {
    const finish = () => {
      image.removeEventListener('load', loaded);
      image.removeEventListener('error', finish);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const loaded = () => {
      if (typeof image.decode === 'function') void image.decode().catch(() => {}).then(finish);
      else finish();
    };
    signal.addEventListener('abort', finish, { once: true });
    if (image.complete) loaded();
    else {
      image.addEventListener('load', loaded, { once: true });
      image.addEventListener('error', finish, { once: true });
      image.loading = 'eager';
    }
  }));
  // Abort also releases font readiness if a font request never settles.
  await new Promise<void>((resolve) => {
    const finish = () => { signal.removeEventListener('abort', finish); resolve(); };
    signal.addEventListener('abort', finish, { once: true });
    void Promise.allSettled([...pending, document.fonts?.ready]).then(finish);
    if (signal.aborted) finish();
  });
}
