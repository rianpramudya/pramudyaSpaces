# Shared typography, 2026-10-19

- Main family: existing self-hosted Barlow. Headings, paragraphs, navigation, actions, profile facts and CMS forms use this family.
- Technical family: locally bundled IBM Plex Mono400/600, Latin WOFF2, 30,328 bytes combined. Used for technology chips, dates, coordinates, counters and technical annotations. License and source recorded in src/assets/fonts.
- One owner for typography roles: src/app/typography.css, imported after the existing public styles. Other styles reference shared family, size and weight tokens; old per-section mono stacks removed.
- Scale: labels12px, supporting UI14px, body/form16px, lead18–22px, three title levels and a fluid section heading. Hero wordmark retains its distinct scale; its calculation is resolved on the name element so --given-length remains CMS-dependent.
- Reading rhythm: body1.75, labels/actions1.5, section/title headings1.15. Main UI information no longer defaults to monospace.
- Compact mobile hero composition, visible mobile guestbook/chat controls, CMS data and 3D geometry remain in place. No package dependencies added.

Validation:

- UI lint, TypeScript check and production build passed.
- Full regression suite:115 passed,0 failed.
- Fresh preview HTTP200; both CSS files200; six Barlow and two IBM Plex Mono WOFF2 assets200, with valid wOF2 signatures.
- Font-family lint rejects ad hoc platform font stacks outside the typography owner.
- Browser rendering, actual font selection, line wrapping at device widths, font-swap layout shift and touch interactions have not been visually verified because no test browser is connected. HTTP font availability is not a rendered visual check.
