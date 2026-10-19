# Project theatre — current #projects design

User requested the same substantive immersive treatment as the new WebGL opening/contact. The public ProjectGallery now renders ProjectTheatre instead of WorksWheel; the supplied wheel remains available as an unused reusable component. No CMS content or publication state changed.

## Presentation

The selected project's CMS cover is displayed in a large physical screen with rounded metallic bezel. Adjacent projects recede and rotate in perspective. Selecting work moves displays through the scene and updates the native title, role, technologies, description, context, contribution bullets and result. The reading area is outside the 3D distortion. Previous/next, named project selectors, native detail links and all-project archive access remain available. The index supports arrow-key movement from the focused button; single-touch horizontal swipe advances selection without hijacking vertical scrolling or pinch.

## Rendering and resilience

Three.js is already installed; no new dependencies. This renderer is lazy-loaded near the viewport and uses procedural display geometry/environment, with real image textures from published CMS records. Covers use aspect-preserving contain geometry. Only active/adjacent displays request images; cached displays are bounded by the eight-project featured selection. Animation renders on demand until selection/pointer interpolation settles. Reduced-motion, local pause, hidden document and offscreen state disable motion. GPU resources, observers, listeners and late texture callbacks are handled on teardown. Unsupported/low-memory/context-loss states retain a native cover/title fallback and links.

## Verification

87 unit/render/policy/contrast tests pass; TypeScript and production build pass. Five new tests verify published-only mapping and stable featured/CMS ordering, retained source fields, wide/portrait cover fitting, camera framing at mobile/tablet/desktop sizes, renderer-independent native navigation and empty-state fallback. Independent static review found no Important regression.

Preview: http://127.0.0.1:3100/#projects. Browser discovery remains empty; actual GPU output, texture appearance, gestures, focus and screenshots are unverified. CPU projection and HTTP checks do not prove visual correctness. No deployment.

Final HTTP verification: new theatre present, old wheel absent from rendered HTML, three canvas stages across opening/projects/contact; 5 detail routes, 22 local resources and both renderer/client chunks returned200. No failed local resources. Production preview restarted to this build.
