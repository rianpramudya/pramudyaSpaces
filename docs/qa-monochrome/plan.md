# Monochrome immersive portfolio

User brief: retain RP sculpture, photo rotation (4:6), CMS, bilingual navigation, games, guestbook, chatbot and contact. Prioritize identity, product evidence, competence, contact. Hero black approved 2026-10-19. No new dependencies.

0. Shared palette (black, white, five neutral grays); CSS tokens and Three lighting/material constants.
1. Hero: name/RP first, quieter supporting details, work/contact CTAs.
2. Project story: CMS adapter, explicit problem/contribution/outcome, honest missing-result TODOs, real links.
3. Competence: consistent typography, floating content planes and materials; fact-based scope replaces count statistics.
4. Flow: identity > work > proof > contact; supplementary content disclosed without deleting data; hash navigation opens matching disclosure.
5. Unified dock: visitor controls, characters and audio; one expandable mobile launcher.
6. Minimum 12px labels, 44px controls, keyboard/focus, contrast and final QA.

One local commit per phase. Git initialized after explicit commit requirement. No environment secrets staged. Each phase runs production build, UI lint, typecheck and focused checks. Browser runtime reports no available browser; visual viewport checks at 375/768/1280 and actual pointer/touch, GPU, console and performance remain unverified until browser is available. Source/geometry tests do not substitute for rendered QA.
