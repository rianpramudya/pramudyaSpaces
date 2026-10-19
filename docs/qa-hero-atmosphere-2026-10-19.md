# Hero atmosphere and docks

Implemented the user's supplied hero redesign brief while retaining the dark/sage/off-white identity, CMS name and initials, photo, bilingual navigation, content, routes and playground. No dependency or CMS schema/content changes.

## Composition

HeroExperience is an isolated client presentation component; the parent Portfolio continues to supply public CMS content. It renders letter-separated first-name typography, a surname spaced across the wordmark width, a stable accessible full name, cycling professional focus, section index, city/availability annotations, a three-item published-content statistics strip and technology labels sourced from published project/skill records. The section count reflects actual visible sections rather than a fixed fabricated total. The requested ML/Computer Vision role labels appear when supported by the supplied CMS content. Photo tape, hover/focus lift and a circular text badge remain linked to About. Native projects/about/playground links remain available.

Atmosphere includes layered sage radial lighting, edge vignette, 4% monochrome grain, a fading perspective floor grid, damped cursor light sweep and blurred distant geometric accents. Three.js adds a bounded deterministic particle cloud, small wireframe torus/cube/sphere props, stronger sage rim lighting, a soft procedural floor contact shadow and a blurred photographic-style initials projection onto the floor. The floor reflection is a lightweight preblurred projection, not a physically accurate real-time mirror or full-scene depth-of-field render pass. Nearby content is sharp; distant CSS accents are blurred. No new palette hue was added.

The existing monogram floats/rotates slowly, responds to normalized pointer input capped at twelve degrees and turns with scroll. Hero letters, label depths and photo use independently weighted damped parallax. Staggered letters, eased object scale, staggered tags and a floor-grid reveal take roughly 1.5 seconds. Native text/controls remain readable outside the canvas. All small hero labels use a system monospace font.

## Motion and quality

Tunable values are at the top of src/lib/hero-scene.ts: glowIntensity, parallaxStrength, particleCount. Particle buffers are capped at40. Hero GPU rendering is lazy and restricted to width>=768, reported memory>=4GB when available, more than two hardware threads when reported, and no OS reduced-motion request. Other cases retain a static monogram illustration and scene composition. Reduced-motion, local pause, offscreen and hidden-document handling stop motion. Role swaps and decorative CSS motion require full capability and visible state. Continuous pointer values use refs/CSS properties rather than React renders; local storage is read on preference events, not every animation frame.

Lazy initialization uses generation checks to reject stale imports after quality changes. GPU teardown now handles Points as well as Mesh/Line resources, deduplicates shared geometry/materials and separately releases generated textures and the environment. A review found the particle disposal gap; a regression test verifies all resource disposal events occur exactly once.

Characters and audio/motion buttons occupy one bounded bottom-right dock, so runners no longer traverse footer labels. The native playground link has its own area. The status/location/guestbook/chat bar is a bordered glass dock, with solid-surface fallback for unsupported/reduced transparency. Both docks retain sage/off-white contrast and narrow-screen wrapping rules.

## Verification

101 tests passed; TypeScript and production build passed. Tests cover published-only data mapping and actual counts, unknown locations/empty data, capped pointer tilt, low-power/mobile/reduced-motion policy, deterministic particle buffers, shared/particle cleanup, bilingual native hero content, CMS role/tech labels, preserved navigation and contrast of dock palettes. Existing 3D geometry projection, admin/auth/content/security/rendering tests remain passing. Independent static review confirmed the resource cleanup fix and found no other confirmed Important regression.

Production preview restarted at http://127.0.0.1:3100/#home. HTTP verification: home/new hero/CSS200;17 local resources200;5 project detail routes and archive200;lazy atmosphere renderer chunk200;no duplicate HTML IDs or broken native section anchors. Existing About and project/contact canvas stages remain present. No deployment or external writes.

Browser discovery returned an empty list. Actual visual composition, GPU appearance, animation timing, dock collision at real viewports, touch/focus behavior and console remain unverified. No measured60fps or visual-perfect claim is made by CPU/SSR/HTTP checks.

City-level Bandung annotation uses6.9175°S/107.6191°E only when the CMS location contains Bandung. Source: [Universitas Pendidikan Indonesia, site context](https://repository.upi.edu/143101/4/S_TA_1909219_Chapter3.pdf). It is a city reference, not the owner's precise location.
