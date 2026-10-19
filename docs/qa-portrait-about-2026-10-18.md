# About portrait atelier

User requested a redesign of /#about following the immersive home and project theatre. The former text-plus-tilted-photo block is replaced with an editorial masthead, a photograph mounted in a physical Three.js gallery frame and an open biography reading area. The native biography, owner name, professional headline, photo/alt text and featured CV remain sourced from the existing public CMS payload. Routes, anchors, playground, CMS schema and published content were not changed.

## Interaction and resilience

Three named view buttons appear after the photograph has loaded and the renderer has drawn successfully. They support native keyboard/touch activation; pressed state identifies the chosen angle. Fine pointer movement adjusts the frame modestly. Rendering is on demand while settling, with no idle loop. Biography and CV/contact links stay outside the transformed scene. The photo is fitted without crop or aspect distortion. The frame includes volumetric metallic rails, backing, mount and plinth, with a procedural environment and lighting; no new dependency, model or HDR download.

The renderer is lazy-imported near the viewport. Hidden/offscreen state, reduced motion and the existing local motion preference disable animated interpolation. Resize recalculates camera framing and bounded pixel ratio. Cleanup disposes frame geometry, materials, texture, environment, renderer, frame request, listeners and observers. Late texture completion after disposal releases its texture. Failed/unsupported/low-memory/context-loss cases retain the native framed photo; missing or failed images retain owner initials. Removing a previously loaded photo immediately forces fallback mode, including during CMS-language refresh.

## Verification

95 tests passed; TypeScript and production build passed. New tests verify photo aspect fitting, actual finite-volume framing at mobile/tablet/desktop with supported view/pointer extremes, CMS biography/photo/CV preservation, paragraph boundaries and empty-state behavior. Projection tests caught clipping during implementation; the final model is centered including its plinth and camera distance reserves depth clearance. Independent static review caught the photo-removal lifecycle bug, which was corrected and rechecked.

Production preview restarted at http://127.0.0.1:3100/#about. HTTP checks confirm live CMS biography/name/headline, valid native section anchors, downloadable CV, local assets and the lazy portrait renderer chunk. Actual GPU output, visual quality, touch, keyboard focus, reduced-motion runtime and console remain unverified: browser discovery returned no available browser. CPU/SSR/HTTP checks do not establish visual correctness. No deployment or CMS mutation.
