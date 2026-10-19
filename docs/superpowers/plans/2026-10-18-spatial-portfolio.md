# Spatial Portfolio Implementation Plan

**Goal:** Replace the public portfolio composition with an immersive, readable spatial studio while retaining CMS/admin, projects, translation, documents, contact, guestbook and existing games.
**Architecture:** Server-provided CMS content continues into the existing client Portfolio. A focused SpatialScene leaf and scoped motion hook enhance ordinary HTML using native CSS perspective and transform; no rendering engine. Consolidated spatial.css replaces the accumulated hybrid/editorial/taste styling. Work wheel retains geometry but improves fallback, controls and case study content.
**Tech Stack:** Existing Next.js 16, React 19, TypeScript, native CSS, Barlow and Lucide; zero new dependencies.
**Design:** Black/silver stage, cool paper reading sections, restrained mint for spatial focus, Barlow with distinct display/body scale. Images 16px, buttons pill, prose open. User explicitly authorizes design decisions and completion without intermediate approval.

## Global constraints
- All personal content comes from existing published CMS records. No fabricated results or editing published data.
- Native vertical scrolling, keyboard navigation, minimum 44px controls, reduced-motion and user motion pause honored.
- Pause offscreen/background effects; pointer transforms use refs and scheduled frames, never render on pointer frames.
- No model/image download or WebGL startup cost; CSS 3D degrades to readable HTML on reduced motion/coarse pointer/unsupported transforms.
- Existing owner/admin routes and authentication unchanged.

## Review focus
Long CMS strings; missing images/data; navigation focus on small screens; image/story synchronization in wheel; reduced motion/offscreen pause and resource cleanup.

## Tasks
- [x] Add spatial preference/visibility and bounded pointer math tests, then implement scene with content-bearing planes and keyboard rotation/reset.
- [x] Restructure public hero, about, skills, experience, play area, contact and case study; keep public functions and add rendering tests for real CMS data, draft exclusion and section anchors.
- [x] Consolidate public design in spatial.css, retain base functional controls and chase CSS, remove obsolete override imports, implement section-specific scroll choreography with static fallback.
- [x] Improve work wheel progressive fallback, selected item details, media proportions and pause lifecycle. Verify published project mapping.
- [x] Run unit/render/contrast tests, TypeScript and production build; independent review and fix findings; restart local production preview and verify all local navigation/assets/HTTP routes. Browser QA if available; clearly record limits otherwise.

Verification details and browser limitations: `docs/qa-spatial-portfolio-2026-10-18.md`. All implementation steps complete; browser visual/console QA remains unavailable, explicitly recorded rather than claimed.
