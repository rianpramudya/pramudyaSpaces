# Header/footer alignment with the immersive hero

User requested header/footer consistency with /#home. SiteHeader and SiteFooter now share the hero's dark sage/off-white palette, monospace details, fine borders and restrained physical depth. The old crowded inline navigation and plain footer were replaced. Public profile data, translations, route paths, main anchor IDs, theme control and admin workflows were preserved. No dependency or CMS mutation.

## Header

Sticky dark glass with a small dimensional CMS-initial monogram, full CMS brand and quieter active navigation. Desktop shows home/projects/about/contact and puts the remaining existing sections in a native details/summary disclosure. At width<=1100px the menu button exposes all section links; extras are not nested behind another disclosure. Native summary activation handles keyboard opening; implemented Escape/outside-pointer/breakpoint handlers close menus and Escape returns focus to the relevant control. Archive/detail links correctly point back to /#section. ID/EN and global theme controls remain available. Names are visually clamped to two lines while the brand link retains its full accessible label.

## Footer

A dark signature room contains a large editorial closing, native contact CTA, CMS brand/headline/socials, public email only when show_email is true, a short navigation directory, playground access, oversized first-name signature and back-to-top link. The backdrop has a faint perspective floor and outlined monogram. No additional canvas, idle animation or GPU renderer. Hover depth is disabled for reduced motion. Footer padding reserves room for existing docks; root bottom padding is removed to avoid a light gap after the dark closing. All data comes from the existing public profile/nav.

## Verification

105 tests passed; TypeScript and production build passed. Four focused tests verify native overflow/controls and custom CMS labels, away-page navigation, contact privacy/CMS identity/socials, empty-data usability and top/play/contact links. Contrast coverage includes the new chrome palette. Independent static review found a long-brand wrapping risk, which was fixed by a two-line clamp and rechecked.

Preview restarted on http://127.0.0.1:3100. HTTP checks cover the home, archive and all five published project detail pages; each includes the new header/footer. Native fragment targets, unique IDs, returning section links and local assets are checked. Browser discovery was empty: actual screenshots, responsive visual layout, keyboard focus/interaction, glass rendering and console remain unverified. Tests, static review and HTTP do not establish visual correctness. No deployment.
