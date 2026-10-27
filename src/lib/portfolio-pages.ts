export function pageHref(section: string): string {
  return section === 'home' ? '/portofolio' : `/portofolio?page=${encodeURIComponent(section)}`;
}
export function resolvePortfolioPage(value: string | undefined, nav: readonly string[][]): string | null {
  const page = value || 'home';
  return nav.some(([id]) => id === page) ? page : null;
}
export function pageForHash(hash: string, nav: readonly string[][]): string | null {
  let id: string;
  try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch { return null; }
  const page = id.startsWith('certificate-') ? 'certificates' : id;
  return nav.some(([key]) => key === page) ? page : null;
}

// Announce the new chapter without turning the whole section into a focus frame.
export function focusChapterHeading(section: HTMLElement): void {
  const heading = section.querySelector<HTMLElement>('h1,h2,h3');
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({preventScroll:true});
}
