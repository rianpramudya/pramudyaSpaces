# WebGL opening and contact — current implementation

User feedback: the prior CSS tilt redesign did not look immersive. User confirmed they were viewing `http://127.0.0.1:3100/#contact`. HTTP inspection confirmed current CSS-cube build was being served, so the perceptual problem was not assumed to be stale cache.

## Concrete replacement

The opening no longer renders SpatialScene's CSS identity cube. It is a full-width sculpture stage above oversized identity typography. The contact hash now opens a dark correspondence room with a procedural 3D envelope/raised letter, contrasting with the former light generic form. Existing CMS text, contact endpoint, documents and navigation remain intact.

Three.js is a new runtime dependency; @types/three is a development dependency. The renderer module is dynamically imported only after a stage is near view and a WebGL2 context is available. No external model/HDR asset is downloaded. Physical material reflections use the documented [RoomEnvironment](https://threejs.org/docs/pages/RoomEnvironment.html) and [PMREM](https://threejs.org/docs/pages/PMREMGenerator.html) path. Geometry is procedural: torus knot/orbit for the opening, extruded folded-envelope surfaces and a raised letter for contact.

CSS sculptures remain visible before loading or on unsupported/low-memory devices. Reduced-motion and local Pause stop automatic and pointer motion; explicit turn remains. Rendering stops offscreen/in hidden tabs. Pixel ratio is capped; canvas excludes its control bar. Geometry, materials, environment targets and renderer are disposed at teardown. Context loss returns to fallback.

## Evidence and limits

82 tests pass; TypeScript and production build pass. Geometry tests inspect finite vertices and actual projected positions across four quarter-turns and maximum pointer/scroll pitch, including the narrow mobile camera frame. Those tests caught contact-envelope clipping; model centering and a separate camera-distance policy fixed it. Static review caught paused pointer updates; controller now ignores pointer when inactive and resets offsets on pause.

Production preview updated on port 3100. HTTP checks verify both canvas stages, new data-experience markers, old cube absent from HTML, the lazy engine chunk and local CSS/assets/project routes.

Browser discovery still returns no available browsers. Actual GPU output, shader appearance, screenshots, touch, WebGL-context recovery and browser console cannot be claimed verified. Vertex projection and HTTP tests do not substitute for visual verification. No public deployment or CMS mutations.
