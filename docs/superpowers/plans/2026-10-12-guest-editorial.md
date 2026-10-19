# Guest Editorial Redesign

User intent: replace repetitive cards with varied, creative information layouts; project gallery plus all-project archive ordered newest/oldest. Prior instruction authorizes direct execution.

Design direction: a portfolio exhibition. Keep monochrome section rhythm and Barlow; spend visual emphasis on project photography, let supporting content read as open editorial rows. Palette: black #090a0c, paper #fafafa, charcoal #23262c, ink #171717, muted #626262. One purposeful gallery, no autoplay. Portrait frame remains a deliberate visual object.

- [x] Project gallery: native swipe/scroll snap, previous/next, keyboard, count, case-study link; limited featured selection.
- [x] `/projects` archive: complete published collection, search, technology filter, newest/oldest/title ordering. Dates come only from CMS project date; undated last with explicit label and stable order.
- [x] Add optional project date input using existing `data.date` schema, preserving admin order.
- [x] Open layouts for about/background/skills/services/experience/certificates/contact; reserve boundaries for media and form controls.
- [x] Test archive privacy/order/date edge cases, render empty/full states, build and HTTP links, independent review; browser QA if available.

No CMS publication/data edits or deployment required. Existing hero, portrait, characters, book/chat and theme controls retained.

Review: full project images preserved with contain; archive metadata reads public CMS name; gallery layout includes tail spacing and bounds its active slide when data changes.
Verification: 68 tests pass, build passes, HTTP homepage/archive/five project detail pages and navigation assets checked. Browser runtime reports no browser; visual and interaction QA remain unverified. All existing project dates are empty; no dates were invented.
