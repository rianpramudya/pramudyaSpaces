# QA: monochrome immersive portfolio

Date: 2026-10-19 (Asia/Jakarta)

## Implemented

- Black hero approved by owner. Chrome RP, 4:6 interactive portrait, CMS data, bilingual navigation and games preserved.
- Five neutral gray steps plus black/white, shared JSON palette, CSS semantic tokens and Three.js materials/lights. Project cover textures keep original color.
- Hero attention reduced through quieter parallax, 12 ambient particles, three supporting technology tags and work/contact CTAs.
- Project screenshots first, visible problem/contribution/outcome, source links, shared CMS story adapter. Featured and owner position determine priority.
- Added optional result_source and paper fields to CMS validation/editor; no remote CMS content/schema mutations.
- Experience and skill evidence precede native disclosures for background/certificates/services/play. Direct section hash opens the relevant disclosure; skip-to-main keeps disclosures closed.
- One visitor dock, one mobile launcher; characters only animate while expanded. Sound requires explicit enable and interaction.
- At least 12px declared CSS label sizes, 44px public control minima, 16px form inputs, high contrast focus, readable placeholders.

## Verification

- npm run lint: passed (custom UI token/font policy; not a full ESLint ruleset).
- npm run typecheck: passed.
- npm test: 115 passed, 0 failed.
- npm run build: passed for phases 0 through 6.
- HTTP: 7 public pages and 25 referenced assets returned 200; no duplicate IDs or missing same-page anchors.
- Shared palette/scene material neutrality and primary/muted palette contrast tested.
- Independent source review: fixed skip-link expansion and header touch-target CSS cascade issues.
- Source scan: no hardcoded runtime hex/numeric color literals outside the palette; no legacy sage identifiers in src.

## Content TODOs

The following projects show `TODO: isi hasil terverifikasi` until outcome text and a supporting URL are supplied. Existing CMS outcome notes remain available as unverified notes; no metrics invented.

- Government Portal — 30 Kecamatan & 30 OPD
- Astra Logistic & Asset Tracking System
- Amazon Electronics Recommendation System
- AcneScan: YOLOv11 Acne Lesion Detection & Counting System
- Real-Time Stock Monitoring Dashboard & Data Visualization

Also review existing illustrative/dummy covers and supplementary demo content before presenting them as final professional evidence. No new screenshots or impact metrics were fabricated.

## Not verified

- Browser runtime returned no browser. Rendered layout at 375, 768 and 1280px, actual keyboard/touch workflows, theme transitions, reduced-motion rendering, GPU frame rate, browser console and Core Web Vitals remain unverified.
- The HTTP and geometry/source checks above do not prove visual QA or a bug-free UI.
- External HEAD checks: seven links returned 200. TOEFL verification returned 403 and LinkedIn returned 999; these two are blocked/inconclusive, not confirmed broken. Their owner-provided URLs were preserved.
- OAuth login, Gemini provider responses and write operations were not exercised in this UI task; their implementation was preserved.
- The machine ran out of writable space during QA; only regenerable .next/cache and inactive .next/dev output were cleared. Build and tests passed afterward.

## Local revision history

Baseline checkpoint followed by one commit for each of seven phases. No remote publish or push. Environment secrets are ignored by Git.
