# Centered hero revision

Implemented from the supplied brief: one central content column, round CMS avatar, large foreground name, fixed role slot alongside location, paired actions, equal-width desktop facts and horizontally scrollable mobile facts. Labels distinguish Web, AI and Experience using the published contribution descriptions.

The hollow chrome routes occupy a separate centered background layer. The orbital header logo remains unchanged; the hero uses a hollow SVG with identical routes as its static fallback. The unused text-object font and its license were removed. The hero scene no longer accepts an initials/text-geometry parameter. Model centering and camera bounds remain covered by geometry tests.

The canvas has 48% opacity and reduced brightness. A feathered dark field sits behind the complete text area. Controls render into a reserved 44px slot outside the background layer; scene pointer events cannot intercept links. Manual rotation remains available for the static fallback. Lazy loading, low-power fallback and reduced motion are retained.

The dock is centered at the bottom; on mobile its single Studio trigger opens the existing guestbook, assistant and play controls. Its accessible name mentions all three destinations. Hero bottom clearance prevents the dock sharing the scroll-cue slot. `min-height:calc(100svh - header height)` allows the section to grow for long CMS text or short screens rather than clipping content.

## Verification

- UI lint, TypeScript and all 123 tests passed before the final preview build.
- After the final layer separation, the 23 affected hero/rendering/stage tests and production build passed again. The refreshed port 3100 preview serves the centered hero, Web/AI/Experience facts, hollow SVG, responsive stylesheet, dock rules and external control slot. The retired font name is absent from built client chunks.
- Rendering tests check avatar/name/action/control order, hollow fallback, CMS identity and published facts, bilingual labels and manual controls.
- Geometry tests check finite geometry, normalized center, absence of text geometry/central planet, and camera fit through pointer/scroll/manual rotations.
- Both the original unused font imports and the retired two-column mobile override were removed.
- The in-app browser returned no sessions. Visual checks at 375, 768 and 1280px, per-frame contrast measurement, pointer/touch interaction, portal placement after hydration and frame-rate measurements remain unverified. Source-level and HTTP checks do not establish those browser outcomes.
