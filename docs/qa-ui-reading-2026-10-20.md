# Public portfolio: design audit and revision

Scope: guest home, project browsing, shared header/footer, responsive layout and semantic structure. CMS data, admin workflows, authentication and publishing remain outside this visual revision.

## Evidence and direction

Compared the rendered HTML and linked CSS of the [previous portfolio](https://rianpramudya.github.io/pramudyaprofile/?lang=en) with the current React components and stylesheet cascade. The earlier site uses a shorter route through identity, biography, tools, projects and contact. The current site adds professional background and interactive rooms, but makes the reader work through a larger exhibition before finding the relevant facts.

Design direction: a monochrome portfolio with tactile 3D exhibits and calm reading areas. Keep Barlow, Plex Mono for technical labels, the RP sculpture, interactive 4:6 portrait, project gallery, bilingual content, guestbook, chat and playground. No new libraries, colors or invented career facts.

This is a source and structure audit. The in-app browser returned no available browser sessions. No screenshot comparison, real-device check, console inspection, performance measurement or claim of visual approval is implied.

## Findings addressed

- `src/app/immersive.css:7` — multiple layouts assumed a 1360px reading field. Shared `--content-width:1240px` now aligns the main page, header, footer and supporting sections.
- `src/components/portfolio.tsx:35` — editorial CMS headings also filled navigation, making labels lengthy and unpredictable. Navigation now uses concise bilingual destination names; editorial headings remain CMS-managed. Background has a navigation destination.
- `src/components/project-theatre.tsx:37` — a full-width 3D stage followed by a long explanation and a second index made each project dominate the page. Desktop now pairs stage and introduction; detailed process stays in a native disclosure and the case-study page. Tablet and mobile stack in document order. No project facts removed.
- `src/app/about-room.css:10` — portrait scale and caption height dictated large gaps around the biography. The portrait now occupies a smaller column, with an explicit 4:6 fallback fitting the stage and a compact caption.
- `src/app/refinement.css:51` — skills and experience repeated moving, bordered panels around reading content. These sections now use steady reading rails, smaller tool labels and consistent alignment. 3D remains on the actual exhibits.
- `src/components/supplementary-section.tsx:4` — education, certificates and services were hidden on arrival. Those professional sections now start open; the optional playground starts closed. Native keyboard disclosure and deep-link behavior are retained. Labels distinguish opening from collapsing.
- `src/components/credentials.tsx:8` — subordinate education/language/achievement headings reused h2 under their section h2. They now use h3 with entries at h4.
- `src/components/portfolio.tsx:87` — empty descriptions produced empty paragraph spacing. Description markup is now conditional.
- `src/app/reading-layout.css` — anchored/focused controls have scroll clearance; small screens use single-column layouts, existing 44px interaction targets and readable form fonts.

## Verification

Run UI lint, TypeScript, all repository tests and the production build. Rendering tests cover CMS heading preservation with short navigation, immediate visibility of professional sections, closed optional play, document order, published facts and archive/case-study access. Existing geometry, contrast, keyboard-navigation and resource-disposal tests remain applicable.

Results: UI lint, TypeScript and production build passed; all 117 tests passed. After the final section-index correction, the 16 affected rendering/disclosure tests and production build passed again. Refreshed the production preview on port 3100. HTTP checks confirmed the revised stylesheet, native section visibility, owner identity, 25 skills, 2 experiences, 1 education, 3 certificates, 3 services, contact fields and guestbook trigger. Home, archive and a published case study returned 200. These checks did not submit a contact message or exercise browser interaction.

Before visual sign-off, inspect 360px, 390px, 768px, 1024px and 1440px viewports in ID/EN, light/dark and reduced motion. Verify WebGL and static fallbacks, keyboard focus around the fixed visitor dock, project switching, portrait drag, disclosure collapse and contact submission. Automated source tests do not establish those browser outcomes.

Guideline reference: [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), fetched 2026-10-20. Findings were also assessed using Taste Skills, Frontend Design and UI/UX Pro Max. Existing product requirements take priority over generic style recommendations.
