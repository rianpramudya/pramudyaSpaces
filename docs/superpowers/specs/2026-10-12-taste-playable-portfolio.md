# Taste redesign: playable developer portfolio

Design read: portfolio developer untuk perekrut dan calon kolaborator; monokrom, playful, tipografi Barlow yang kuat. DESIGN_VARIANCE 7, MOTION_INTENSITY 5, VISUAL_DENSITY 3. Existing native CSS stack retained. User's explicit alternating black/white chapters override skill's default theme lock. Existing dark-mode tokens remain.

Hero splits readable identity and interactive physics playground; mobile stacks both. Projects come immediately after hero, before personal background. Gallery places project summary beside a larger artwork, with filmstrip choices and archive access. About portrait uses monochrome image, offset frame, caption and contact action. Skills use large typographic groups. Experience uses date, position and supporting image with expandable contributions. Credentials and contact keep complete CMS information.

Games retained: draggable/tappable/keyboard physics blocks, reset, Spider-Man/Gwen chase, greetings, sound/motion controls. No additional game: focus stays on portfolio navigation. CMS data and publication state unchanged.

Animation hierarchy: hero enters once, selected project artwork transitions after an explicit choice, link arrows acknowledge hover. Native scrolling and existing game motion preferences retained; new animations disabled under reduced-motion. Shapes: 12px media, pill controls, open reading surfaces. No new dependencies.

Verification: 70 tests passing including CSS parsing and theme contrast, TypeScript and production build. Independent review fixed 768–900px nested story-grid collision and restored anywhere wrapping for long CMS names. Browser runtime returns no available browsers, so visual breakpoint checks, gestures, console and Lighthouse remain unverified. Production preview uses port 3100; user development server remains untouched.
