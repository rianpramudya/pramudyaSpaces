# Personal opening — #home

The opening now presents the owner's identity rather than an interchangeable chrome knot. The composition pairs oversized first-name typography and the complete surname with the actual CMS headline, location and profile photo. The opposite side is a physical, extruded monogram derived from the first two name components; the current CMS produces RP. A tilted photographic print adds a personal reference to the metallic form. Native links lead to projects and about; existing playground access is retained. CMS records and publication settings were not changed.

The monogram uses local Helvetiker bold font data. Source and redistribution notice accompany the asset in src/assets/helvetiker-LICENSE.txt. No new package was added in this iteration. Bounded pointer/scroll movement keeps the initials readable; manual quarter-turn and pause remain available. The existing lazy-loading, offscreen/hidden pause, reduced-motion support, resource cleanup and native fallback continue to apply. The fallback also displays the actual initials.

## Verification

91 tests passed, TypeScript passed, production build passed. Identity tests cover CMS names, empty/single names, initials, real TextGeometry, CMS-driven photo/headline markup and fallback semantics. A new regression test first reproduced clipping at a 339×456 tablet stage, then passed after camera distance was made aspect-aware. Projection covers supported pointer, scroll, manual rotation and bobbing extremes. Independent static review found no remaining Important issue.

Preview was restarted on http://127.0.0.1:3100/#home with this production build. HTTP checks verify the new personal opening and RP fallback, three retained canvas stages and native section targets. Actual GPU rendering, visual composition, focus and touch behavior remain unverified because no browser is available in the session. CPU projection, render tests and HTTP checks do not establish visual correctness. No deployment was performed.
