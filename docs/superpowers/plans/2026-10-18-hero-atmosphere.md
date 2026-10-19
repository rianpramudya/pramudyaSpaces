# Immersive Hero Implementation Plan

> Execution: inline, using the existing Three.js and native CSS. User supplied the detailed design brief and authorized implementation.

**Goal:** Fill the existing RIAN/RP opening with atmosphere, environmental depth and CMS-based editorial details while keeping sage/off-white identity and readable native content.

**Architecture:** A dedicated HeroExperience owns CMS-derived presentation and bounded, damped DOM parallax. Existing SculptureStage remains the lazy GPU boundary; a hero-only environment adds reflection, contact shadow, particles and wireframe props. Contact, About and project renderers retain their interfaces. A new public-only stylesheet scopes hero/dock changes.

**Constraints:** Preserve bilingual UI, published data, route anchors, CV/about/projects/playground functions. No new packages or palette. Reduced/local-paused/hidden/offscreen states stop motion; mobile and low-power hero use static fallback. Never claim measured frame rate or browser QA without evidence.

## Tasks

- [x] Add tests for published-only tech/stat mapping, bounded parallax, quality selection and geometry; implement scene config/data helpers and HeroExperience. Validate blank/long/translated CMS fields and location changes.
- [x] Add hero atmosphere using existing Three: soft alpha floor contact shadow, blurred floor reflection, rim light, float/rotation, finite particles/wireframes. Keep camera frame safe; dispose shared geometry/materials/textures and late work. Preserve native static fallback.
- [x] Style gradient/vignette/grain/grid, tags/connectors, typography, polaroid/badge, stagger entry and scroll exit. Confine chibis/audio to one dock; restyle status dock and reserve narrow-screen space.
- [x] Run targeted/full tests, TypeScript, build, independent review, HTTP/asset checks. Discover browser and state visual verification limits. Restart port 3100 with final build; record QA.

## Review focus

- CMS drafts/unknown city must not leak or produce fabricated statistics/coordinates.
- Reduced motion, local pause, coarse pointers, low memory and document visibility must disable autonomous motion.
- Photo/translation updates must not leave stale renderer state or hidden fallbacks.
- Mobile typography/tags/docks must wrap without obscuring actions; interactive overlays must remain keyboard accessible.
- Lazy scene cleanup must release GPU resources and listeners, including shared mesh assets.
