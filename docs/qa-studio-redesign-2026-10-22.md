# PramudyaSpaces studio redesign

## Direction

Adapted the supplied Lumora brief into the existing Next.js application: Onest, warm white surfaces, copper accents, a focused project carousel, photographic grayscale-to-color cursor reveal, a compact intro loader, smooth scrolling, full-screen navigation, and native-dialog contact requests. The portfolio retains its own identity and actual CMS content instead of the reference studio’s invented clients, ratings, and statistics.

## Content and functionality

- Hero uses the two owner-supplied staircase portraits, optimized to 316 KB and 374 KB WebP files. They are registered in private Supabase Storage and selected through new profile fields: hero_photo, hero_reveal_photo and hero_photo_alt. Existing profile photo remains independent. Previous profile backed up in ignored local backups.
- Added and applied migration 20261022103644_studio_hero_portraits.sql. Published-media authorization and deletion guards include both new hero images; draft profiles keep them private. Hero alt text participates in translation.
- About, selected work, services, experience, toolkit, education, languages, achievements, certificates, real portfolio counts, playground and contact are connected to published CMS data. The focused project gallery includes every published project, adjacent previews, previous/next controls, horizontal swipe, keyboard navigation, project selectors, process disclosure, case studies and the searchable/sortable archive.
- Contact CTAs open the existing real contact form. Guestbook, assistant, OAuth, owner authentication, documents/CV and the playable blocks/chibi controls remain available. No third-party notification or contact submission was sent during QA.
- Source cleanup removed unused 3D hero/portrait/gallery modules, their retired tests and style files. three.js was uninstalled; Lenis 1.3.23 is the only new library. Existing neutral palette remains for PDF/admin/chibi assets; the public theme is independently scoped.

## Motion, responsiveness and accessibility

- Fine-pointer canvas brush with bounded interpolation and idle shutdown. Touch, reduced motion, low-memory devices and weak CPUs use the static portrait. Opening a dialog pauses the reveal and smooth scroll. Optional-library failure leaves native scrolling available.
- Session intro is skipped for reduced motion and paused animation preferences. Independent responsive layouts at 767/1023/1250px; navigation and form controls retain touch sizes, and long labels can wrap or truncate safely.
- Dialogs use native modal focus containment, Escape/backdrop close and focus restoration. New token-based contrast tests cover light/dark body text, supporting labels, copper and the fixed-light hero panels.

## Verification and limits

- 111 active tests passed, plus TypeScript, UI lint, production build, source import reachability and whitespace checks. Retired renderer tests were removed; functional CMS/auth/publication/security tests remain.
- Supabase query confirmed both hero paths, alt text, published profile and two registered media records. The prior profile was not otherwise overwritten.
- Live HTTP checks passed for the redesigned home, public API, both WebP hero images, project archive, a real case-study route and admin login. Unpublished media returned 404. Served CSS includes Onest and the new copper theme.
- The in-app browser returned no sessions. Actual screenshots at desktop/tablet/mobile, real pointer brush performance, keyboard/menu/modal interaction and per-frame photographic contrast remain unverified. HTTP/source/unit checks do not establish these visual outcomes.

## Scale and gallery refinement

- Reduced public shell from 1408 to 1240px, hero headline maximum from 88 to 66px, section headings from 66 to 48px, contact/footer headlines from 68 to 52px, and desktop section spacing to 64px. Decorative globe, idea band, statistics and mobile spacing are smaller; touch controls retain 44px targets.
- Replaced the four-card grid with the earlier focused spatial gallery pattern, rebuilt using CSS perspective and the new warm white/copper tokens. No WebGL library was reintroduced. The project image stays contained and links to its case study; horizontal gestures leave vertical scrolling available. Reduced-motion rules cover gallery transitions.
- Rendering regression verifies all six fixture projects remain selectable, carousel semantics and navigation instructions exist, and case/process links remain present. Actual browser gesture and layout testing remains pending because browser discovery still returns no connected sessions.

## Whole-site detail pass

- Confirmed the original formal portrait is still the profile photo in the CMS (HTTP 200). About now uses that exact asset, with its original 2:3 composition, a CSS monochrome treatment and a small pointer-responsive frame. No facial features were edited; hero images and CMS selections were not changed.
- Replaced the four oversized decorative idea tiles with a restrained inline detail below the biography. Normalized biography body size, section hierarchy and warm layered surfaces. Added shallow depth to the real portrait, project previews and certificates rather than obscuring reading text.
- Floating header has a compact unified material, active navigation state, light/dark contrast, and 44px controls. Archive and case pages share the typography, imagery and reading scale. Reset legacy stagger offsets and grid placements in the archive.
- Fixed the visitor dock at its root: layout and disclosure styles were missing after the older theme was retired. The component now owns its flex row, 44px targets, absolutely positioned scrollable panel, hidden/expanded state, and mobile three-action bar. Guestbook and assistant remain directly visible at every breakpoint. Chibi track and audio/pause controls stay contained in the Studio panel.
- Restyled guestbook/auth buttons, AI suggestions, messages, and composer without changing their APIs, authentication, data or forms.
- Added regression checks for the original formal photo, missing-photo fallback, directly available visitor actions, disclosure state and required dock positioning rules. Total: 94 tests.
- Responsive rules reviewed for 320/375px mobile, 768px tablet, 1024px and 1440px desktop compositions. This is a source-level review, not a rendered screenshot test. The Browser connection still reports no available backend, including an explicit attempt to connect to the in-app browser. Actual viewport screenshots, pointer/touch behavior, console output and animation performance remain unverified.

- Final local production check: homepage, archive, admin login and all five published project pages returned 200. All eight rendered local image assets returned 200, including the original formal photo. Served minified CSS contains the dock disclosure/positioning rules and responsive quick actions. Preview restarted with the verified build at port 3100.

## Workspace, background and credentials composition

- Replaced the repeated skill-pill grid with a category-controlled workspace. Keyboard arrow/Home/End controls follow the category tabs; tool selection displays the actual skill label, authored level/description and project evidence only where the project stack names that technology. No proficiency percentages, inferred soft-skill claims or new CMS fields were added.
- Education now uses a date rail, academic folio and visible GPA/summary, with full contribution bullets in native details. Languages are an open reading column; achievement descriptions and explicit dummy labels remain intact. Education-only and language-only layouts use the full available width.
- Credentials use one readable document preview and an index containing every published record. Mobile adds a native document selector, reducing scrolling between the choice and its preview. Full descriptions/credential identifiers stay available; original preview dialog remains in use.
- Counts now form a compact two-part summary with four anchors to the corresponding portfolio sections. Counts still derive exclusively from published CMS records.
- Added five regression tests covering explicit technology-to-project matching (including versions, false substring matches and drafts), category order, academic facts, document details and accessible workspace semantics. Total suite: 99 passing tests.
- TypeScript and UI lint passed. Source-level layouts reviewed for narrow mobile, tablet and desktop. Actual rendered screenshots, tab interaction, gestures and console output remain unverified: Browser discovery returned an empty list again.

## Photographic closing scene, 23 October 2026

- Footer now reuses the CMS hero portrait and its warm reveal image, with the same cursor-brush interaction and static mobile/reduced-motion fallback. A light photographic vignette protects the heading/CTA, while a near-opaque light directory preserves navigation, social links, contact visibility and the back-to-top link in both themes.
- Footer image is lazy and uses automatic fetch priority; the opening hero keeps high priority. Reveal images now start loading only when their portrait scene intersects the viewport. No assets or CMS data were replaced.
- Added a regression for lazy loading, original-photo fallback, empty-photo safety and retained footer actions. Total: 100 tests. Browser screenshots remain unverified because no connected browser backend has been available.

- Footer validation: 100 tests, TypeScript, lint and production build passed. Build first stopped with a framework security-upgrade advisory, then succeeded on retry with the same warning. Dependencies were not upgraded in this visual change; that warning remains unresolved.

## Inline contact, 23 October 2026

- Contact now presents the existing functional form directly beside the managed introduction, visible contact information and documents. Desktop uses two columns; mobile uses one column with a full-width submit action. Underline inputs follow the warm studio palette.
- Removed contact-modal state and duplicate form mounting. Header, full menu, hero, service actions and footer all use native contact anchors; project routes return to /#contact. Guestbook, assistant and credential dialogs remain unchanged.
- Form keeps its API, validation, field names, busy guard, success/error feedback and hidden honeypot. Added explicit POST method to prevent default pre-hydration GET submission of contact values. Subject remains required to match the existing API contract.
- Inline form regression verifies a single visible form, all expected fields, contact privacy and anchor entry points. Total: 101 passing tests, TypeScript and lint passed. Visual browser QA remains unavailable; no real inbox message or notification was sent during checks.

## Composition and interaction pass, 23 October 2026

- Audited linked public GitHub repository trees for all five projects. No usable product screenshots were present (one repository had only a large logo). No repository content was modified, and no new media or records were written to Supabase.
- Authored dummy-image labels now choose an editorial project cover using the actual title, role and technology stack, clearly marked as a concept cover. Genuine screenshots retain their original images. The same presentation applies in the home gallery, archive and toolkit proof preview. Original media remains in case-study pages.
- Dummy credential images now use an explicitly labeled learning-record presentation, with the original illustration still accessible through the preview action. Real document images retain their normal preview. No official certificate imagery or claims were invented.
- Projects have a wider stage and stronger typographic scale, a faint supporting floor plane and quieter title-index controls. About uses a native sticky portrait on desktop; journey/background are more compact. CSS view-timeline enhancement is optional and falls back to static content for unsupported browsers, reduced-motion and paused-motion preferences.
- Services now form an interactive selector and a reference-work stage. Relationships are explicitly topical, derived from authored titles, descriptions, stacks and contribution bullets. Draft projects are excluded; missing matches show a neutral contact path. Service descriptions, dummy labels, full bullets and contact anchors remain available.
- Contact adds localized field-level validation using native field constraints, first-error focus, aria-invalid/describedby, a progress icon and accessible success/error status. The API and server schema are unchanged. Inputs disable only while sending; failed requests preserve values. No real message or notification was sent during QA.
- Added five tests for concept/actual asset handling, topical project matching, service content, credential labels and contact feedback. Total: 106 passing tests; TypeScript and UI lint pass. Actual screenshots and interactive browser performance remain unverified because no connected Browser backend is available.

- Final preview proof: production build passed after retrying the known framework upgrade advisory. Home, archive, admin login and all five case studies returned 200; all three rendered image URLs returned 200. New editorial covers, topical service stage and credential disclosure labels are present. An invalid contact submission returned 400 without saving a message. Repository README inspection also found no usable screenshot embeds.

## Laocoön + studio combination, 23 October 2026

- Adapted the supplied Bronze and Time reference into the existing portfolio rather than replacing the application with a standalone exhibition. Retained CMS identity, photo pair, project content, section anchors, bilingual controls, theme switching, form, guestbook, assistant and admin routes. No reference sculpture or unrelated exhibition copy replaces the owner's content.
- Added native WebGL liquid-metal environments to the hero, project gallery and footer. The shader uses scroll phase, damped pointer movement, bronze-to-cool highlights and sparse procedural sparks. Canvas buffers are capped at 800k pixels; controller code imports only for visible eligible scenes. Offscreen/hidden/dialog/paused scenes stop rendering, and observers, listeners, buffers, programs and animation frames clean up on unmount. Context loss and shader/initialization failures retain the CSS fallback.
- Touch, small screens, reduced motion, <=2 reported CPU cores and <=2GB reported memory use static environments. These device heuristics are conservative fallbacks, not a benchmark of actual GPU performance.
- Self-hosted Italiana (10,164-byte WOFF2 + OFL) for editorial titles, retaining Onest for reading text and controls. Applied a warm-paper/bronze palette with a dark variant; new contrast tests pass for reading text and muted labels in both modes. Hero/footer use fixed dark materials and protected cream text.
- Restaged the hero portrait as a large arched photograph, with actual CMS word-by-word/per-letter title semantics and native photo reveal. Side chapter links follow the existing section state on wide screens and disappear on shorter/smaller viewports. Project and credential reading/navigation remain semantic HTML.
- Removed the session intro delay and Lenis; native scrolling and existing real section IDs remain. No hidden scrollbars, forced 900vh page, disabled text selection or hidden native cursor were introduced.
- Added five tests for quality gating, bounded resolution/progress, static SSR fallback, real chapter links, unavailable-WebGL handling, display font signature and theme contrast. Total: 111 passing tests. TypeScript and UI lint pass.
- Browser discovery still returned no sessions. Actual WebGL shader compilation/rendering, visual screenshots, timing, GPU behavior, pointer interaction and mobile rendering remain unverified. Pure lifecycle/configuration/SSR and build checks do not establish those outcomes.

- Final production build succeeded after retrying the existing framework upgrade advisory. Live preview returned 200 for home, archive, admin login and all five project pages. It serves three cinematic surfaces in their static initial state, the chapter anchors and inline contact form; the Italiana asset returned 200 with a valid WOFF2 signature. Portrait reveal buffers now shrink offscreen and on static device preferences, and color layers load only when eligible and visible. No real contact message was submitted.


## Contact balance and scroll choreography, 23 October 2026

- Added scroll-linked portrait travel, hero copy separation, gallery settling and footer photo parallax. A shared requestAnimationFrame controller uses time-based damping, reads geometry before writes, tracks only nearby sections and stops once settled. Native document scroll, real anchors, keyboard and touch navigation remain intact; this is visual smoothing, not inertial wheel interception.
- Motion resets for reduced-motion, paused motion, coarse/small devices, hidden tabs and open dialogs. Reveal transitions remain independent so all text and form controls stay accessible. No new dependency was added.
- Contact now has a smaller editorial heading, bounded column gap, a quiet bordered form surface, paired name/email fields above 480px and a single column below 900px. The submit button uses inverse reading tokens in both themes, with a visible keyboard focus outline. Existing field validation, API integration, downloads and contact links are preserved.
- 113 tests pass, including bounded chapter travel and frame-rate-independent damping/overshoot checks. TypeScript and UI lint pass. Browser discovery returned no sessions; rendered desktop/tablet/mobile layout and interaction timing remain unverified.

- Production build passed after the known one-time framework advisory retry, and preview on port 3100 was restarted. Live HTTP checks confirmed the new contact surface/reveal, scroll CSS, 480/900px responsive rules, all four fields, all guest/project/admin-login routes and rendered photo/font assets. Invalid contact data returned 400; no real message was submitted. These checks verify delivery and validation, not rendered geometry or console behavior.


## Theme transition, 23 October 2026

- Public and admin theme buttons use the shared preference hook to reveal the new theme radially from the button center (580ms). React state and HTML theme update together inside the document View Transition callback, retaining existing preference persistence and initial-load behavior.
- Unsupported browsers fade theme colors; reduced-motion and paused animation preferences switch directly. A transient lock ignores repeated clicks while a transition is active, and failed/skipped snapshots retain the requested theme and clear the lock. No dependency was added.
- Added a focused test covering reduced motion, paused motion, fallback, repeated requests, reveal origin, failed snapshots and thrown API calls. All 114 tests, TypeScript, UI lint and production build pass. Browser discovery returned no sessions, so actual animation rendering remains unverified.


## Admin content studio and compact guest navigation, 23 October 2026

- Replaced the guest navigation's full-screen modal drawer with a small anchored panel (maximum 350px wide, viewport-bounded scrolling). It retains real section links, active section, bilingual labels and native keyboard order. Outside click, selection, Escape and focus leaving the panel close it; Escape restores trigger focus. Other content drawers remain unchanged.
- Admin adopts the public studio's warm paper/dark bronze materials and Onest typography, with restrained Italiana headings. The overview now has a section-to-source content map, publication counts and editor destinations. Collection guides explain public placement and relationship behavior. Existing drafts, bulk visibility actions, ordering, profile, documents, visitor messages, media, translations and owner authorization remain.
- Added explicit project selection to service, skill, experience, education, certificate and achievement editors. Legacy service/skill automatic matching remains the default; an explicitly empty manual selection disables matching. The editor can show draft selections and clean up missing references, while the public resolver renders only published projects. Experience, education, milestone and certificate sections now expose selected project links.
- Validation accepts at most 30 UUID project references, deduplicates them and preserves other entry fields. Public content projection carries the selection while stripping draft/deleted project IDs; translation preserves IDs rather than translating or replacing them. Uses the existing entries JSON payload and owner-only save endpoint without database schema changes or rewriting current CMS records.
- Added seven tests for explicit/automatic matching, empty selections, save validation, public projection/translation, learning links, dashboard and editor server rendering. All 121 tests, TypeScript and UI lint pass. Production build passed after retrying the existing one-time framework advisory.
- Browser setup succeeded but no browser backend was available. Actual desktop/tablet/mobile geometry, clicking the popover and authenticated save/reload behavior remain unverified; no live content was changed during QA.

- Final production preview on port 3100 serves the compact-navigation CSS and new admin editor/theme bundles. Home, archive, all five project cases and rendered photo assets return 200. Unauthenticated `/admin` redirects to login (307); `/api/admin/content` rejects access (403). These are delivery/authorization checks, not proof of a signed-in save cycle.


## Audit menyeluruh — 23 Oktober 2026

Status: audit kode, pengujian otomatis, build, HTTP/API nyata dan dependency selesai. Ini bukan pernyataan bebas bug. Tidak ada perubahan kode aplikasi atau publikasi ulang konten pada audit ini. Satu request chatbot dan pemuatan terjemahan menggunakan alur aplikasi normal (cache/rate-limit dapat diperbarui); tidak ada pesan kontak/buku tamu yang diterbitkan dan tidak ada kredensial admin yang digunakan.

### Hasil verifikasi

| Area | Bukti | Status |
| --- | --- | --- |
| Unit dan komponen | `npm test`: 121/121 lulus | Lulus |
| TypeScript dan UI lint | `npm run typecheck`, `npm run lint` | Lulus |
| Build produksi | Berhasil setelah retry pemberitahuan keamanan framework | Lulus build; temuan keamanan tetap terbuka |
| Halaman publik | Beranda, arsip, lima studi kasus: 200 | Lulus HTTP |
| Halaman tidak ditemukan | URL asing dan proyek tidak valid: 404 | Lulus HTTP |
| Aset build | 15 URL JS/CSS/logo: 200 | Lulus HTTP |
| Media CMS | 17 gambar/dokumen publik: 200 | Lulus HTTP |
| Anchor/markup | Beranda dan satu kasus: satu H1, tanpa ID ganda/anchor rusak, field dan tombol berlabel, semua gambar memiliki alt | Lulus pemeriksaan HTML statis |
| Kontak dan chat, input tidak valid | 400 | Lulus validasi negatif; pengiriman kontak valid belum diuji |
| Origin asing | 403 | Lulus |
| Admin tanpa login | Halaman 307 ke login; GET API admin 403, documents GET 405 karena hanya POST | Proteksi yang diuji lulus; sesi pemilik belum diuji langsung |
| Buku tamu baca/tulis anonim | Baca 200; tulis anonim 401 | Lulus; OAuth belum aktif |
| Chatbot nyata | Request valid: 503, tanpa jawaban | Gagal operasional |
| Bahasa Inggris | 200, 43 record, `fallback:false` | Lulus pemuatan cache/terjemahan |
| Tautan luar | 7 dapat dijangkau, 0 kegagalan pasti, 2 tidak konklusif | LinkedIn HEAD 405 dan penerbit TOEFL HEAD 403 tidak dianggap broken link |
| Mobile/tablet/desktop, keyboard nyata, console, FPS, CLS/LCP/INP | Browser runtime tidak menemukan backend | Belum terverifikasi |

Cakupan kode dan render: header/menu; hero; about/foto; galeri/arsip/studi kasus; layanan; perjalanan; keahlian; pendidikan/bahasa/pencapaian; sertifikat; statistik; permainan/dock; kontak/footer; buku tamu/chat; login; dashboard/profil/editor/relasi/publikasi massal/dokumen/media/pesan/terjemahan/pengaturan. Render dan unit test bukan pengganti interaksi browser.

### Temuan menurut prioritas

1. **P0 — Dependency Next.js memiliki advisory kritis.** `package.json:21` memasang 16.4.0. `npm audit --json` melaporkan satu dependency rentan (Next.js), dengan dua advisory RCE kritis dan satu DoS tinggi. Fix yang disarankan npm: 16.4.2. Perlu upgrade patch, audit ulang dan regresi produksi. Keterpaparan eksploit pada deployment ini belum dibuktikan: tidak ditemukan pemakaian `next/image`, `use cache` atau Server Actions dalam kode aplikasi; advisory memiliki prasyarat khusus. Ini tetap alasan untuk memperbarui dependency, bukan bukti situs sudah dieksploitasi.
   - https://github.com/advisories/GHSA-2464-fhr4-w9xw
   - https://github.com/advisories/GHSA-p3m5-59mp-jv5r
   - https://github.com/advisories/GHSA-673q-mjm6-r5xr
2. **P1 — Chatbot tidak memberikan jawaban.** `/api/chat` dengan payload valid mengembalikan 503 setelah sekitar 2,5 detik. `src/lib/ai.ts:8` menyatukan semua respons non-2xx upstream menjadi pesan generik; penyebab spesifik model/key/kuota/billing belum dapat dipastikan dari respons ini. Perlu cek status provider dengan log yang disanitasi, lalu uji ulang satu pertanyaan.
3. **P1 — Tamu belum dapat login untuk menulis buku tamu.** Respons nyata `/api/guestbook` menyatakan `google:false` dan `github:false`. `src/components/public-panels.tsx:22` menonaktifkan tombol untuk provider yang tidak aktif. Membaca pesan bekerja; konfigurasi OAuth provider/callback diperlukan sebelum alur menulis tamu bisa diuji. Ini temuan konfigurasi, bukan bypass auth.
4. **P1 — Bukti hasil dan paper proyek hilang saat dipublikasikan.** `src/lib/content.ts:3` tidak mengizinkan `result_source` dan `paper`, padahal editor/validasi menerimanya dan `src/lib/project-story.ts:6` membutuhkannya. Reproduksi fixture lokal: sebelum projection `missingResult:false`, bukti/paper tersedia; setelah projection `missingResult:true`, keduanya hilang. Konten CMS tidak diubah. Perlu meneruskan field aman tersebut dan menambah tes pipeline simpan → projection → tampilan agar hasil terverifikasi tidak berubah menjadi TODO.
5. **P2 — Pemuatan media selalu mengulang jalur server/database/storage.** `src/app/api/media/[...path]/route.ts:7` mengambil seluruh konten untuk memeriksa izin; `src/lib/repository.ts:8` mengambil tiga koleksi lengkap. Media memakai `private, no-store` pada route dan proxy. Cache sengaja melindungi pencabutan publikasi dan media privat; jangan menggantinya dengan public cache tanpa desain invalidasi/otorisasi. Pertimbangkan metadata izin yang lebih kecil, deduplikasi per request, conditional request, dan turunan gambar responsif yang tetap mengikuti visibilitas CMS.
6. **P2 — CSS berlapis dan JavaScript awal belum ramping.** `src/app/layout.tsx:8` memuat seluruh stylesheet lintas revisi. `immersive.css` masih berisi selector generasi sebelumnya seperti `works-wheel` yang tidak mempunyai komponen aktif. `studio.css` sekitar 109 KB source dan banyak override berulang. `src/components/portfolio.tsx:10` mengimpor statis beranda, archive, panel pengunjung dan permainan untuk semua varian halaman. Pisahkan aset berdasarkan route/fitur dan audit selector sebelum menghapusnya; jangan menghapus seluruh stylesheet lama karena sebagian aturan masih aktif. Ukuran yang terukur mencakup runtime framework, bukan seluruhnya kode yang dapat dibuang.
7. **P2 — Perlindungan perubahan belum disimpan belum merata.** `src/components/admin/section-intro.tsx:8`, `messages.tsx:8` (draft balasan), dan panel koreksi terjemahan menyimpan perubahan lokal tanpa `useUnsavedChanges`. Profil/editor utama sudah memakai guard. Berpindah navigasi dapat menghilangkan isian pada panel lain tanpa konfirmasi; terapkan guard yang sama dan bedakan busy/dirty/saved.
8. **P2 — Chat gagal meninggalkan pesan yang belum dijawab dalam history.** `src/components/public-panels.tsx:30` menambahkan pertanyaan sebelum request, tetapi saat gagal hanya mengisi status. Pertanyaan berikutnya memasukkan history tersebut, sehingga dapat ada dua turn user berturut-turut. Perlu state failed/retry dan hanya menyertakan turn yang valid untuk provider; validasi server saat ini hanya membatasi role/ukuran, bukan struktur turn.
9. **P3 — Animasi masih memiliki biaya yang bisa dipangkas.** `src/components/liquid-portrait.tsx:13` mengalokasikan tiga canvas penuh dengan DPR hingga 2 tanpa pixel cap agregat. `cinematic-surface.tsx:18` memasang MutationObserver seluruh body untuk setiap permukaan; `cinematic-renderer.ts:47` memakai damping per-frame, sehingga rasa gerak bergantung refresh rate. Pointer dan loop umumnya memakai ref, cleanup dan visibility gate dengan baik. Tambahkan anggaran canvas dan pengukuran GPU, batasi observer, gunakan delta-time untuk damping. Dampak FPS/memori belum diukur di browser.
10. **P3 — Detail gambar dan state navigasi.** `src/components/portfolio.tsx:55` dan gambar tambahan/preview belum semuanya memiliki dimensi intrinsik. CSS stage sudah menyediakan aspect-ratio untuk cover, sehingga CLS tidak dapat disimpulkan hanya dari atribut yang hilang. Arsip menyimpan pencarian/filter/sort hanya pada state lokal (`project-archive.tsx:10`), sehingga tidak dapat dibagikan/pulih dari URL.

### Angka performa yang terukur

- Beranda: HTML 101,269 byte; TTFB satu sampel 1010 ms.
- JavaScript yang direferensikan HTML: 11 berkas, 688,319 byte decoded, estimasi gzip 213,836 byte.
- CSS: 3 berkas, 250,226 byte decoded, estimasi gzip 43,388 byte.
- Media publik: TTFB 1007–1951 ms; median 1246 ms pada batch permintaan lokal ini. Foto hero dasar 316.418 byte dan foto reveal 374.066 byte; format WebP sudah digunakan.
- Ukuran gzip merupakan perhitungan atas badan respons, bukan rekaman transfer browser. TTFB berasal dari preview produksi lokal dengan database/storage remote dan beberapa request paralel; bukan hasil pengguna nyata atau Core Web Vitals.

### Yang sudah efisien / terjaga

WebGL dimuat dinamis hanya untuk permukaan yang terlihat dan perangkat yang memenuhi syarat, dengan buffer 800 ribu piksel. Perangkat sentuh/reduced motion memakai fallback. Scroll visual dibatasi bagian dekat viewport, memakai RAF dan damping berbasis waktu; layout reads dibatch sebelum writes. Physics berhenti ketika tidak terlihat; interaksi pointer tidak memicu render React per frame. Media/form mempunyai validasi server; admin memeriksa sesi dan membership pemilik. Publikasi manual, penghapusan referensi, draft dan terjemahan sudah memiliki tes. Header keamanan dasar nosniff/frame/referrer/permissions terpasang.

### Batas hasil dan urutan tindak lanjut

Selesaikan P0 dan kegagalan P1 dahulu. Lanjutkan proteksi draft admin dan optimasi media/CSS/client boundary. Setelah itu uji browser nyata pada 360/390/768/1440px, light/dark, ID/EN, reduced motion, keyboard, touch dan jaringan lambat; rekam console, overflow dan Web Vitals. Sesi admin save/reload, pengiriman kontak valid, login OAuth dan penulisan buku tamu belum diuji end-to-end. Tidak ada klaim WCAG penuh, 60fps, bebas console error, atau seluruh mobile layout sudah aman.

Bukti lokal audit: `/private/tmp/full-audit-tests.log`, `full-audit-dependencies.json`, `full-audit-http.json`, `full-audit-live-features.json`, `full-audit-outbound.json`, `full-audit-build-retry.log`. Acuan UI: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md.


## Pemisahan section dan layout — 23 Oktober 2026

- Setiap section halaman utama kini mempunyai file sendiri di `src/components/sections`: hero, about, projects, services, experience, skills, background, certificates, stats, playground dan contact. Panel layanan, workspace keahlian, folio pendidikan dan galeri sertifikat juga ditempatkan bersama pemilik section-nya.
- Header/footer berada di `components/layout`; detail/arsip/galeri/cover/bukti proyek berada di `components/projects`. Heading dan tombol bersama berada di `components/ui`. `StudioHome` hanya menyiapkan data dan menyusun section; `Portfolio` tetap mengatur preferensi, navigasi dan panel.
- Pindah file dilakukan dengan memperbarui seluruh import aplikasi dan tes, tanpa compatibility stub atau dependency proyek baru. JSX diformat menggunakan formatter sementara. Kelas CSS, DOM section langsung di bawah main, urutan konten, sumber CMS, publikasi, relasi karya, callback, state dan cleanup animasi dipertahankan. Tidak ada perubahan database atau publikasi konten.
- Baseline 121 tes lulus sebelum pemisahan. Lima varian SSR (penuh, kosong, arsip, studi kasus, kontak privat) dibandingkan sebelum/sesudah, termasuk setelah formatting; markup sama setelah ID otomatis React dinormalisasi. TypeScript, UI lint dan 121 tes final lulus. Source-contract test hero dan seluruh import tes menunjuk file baru.
- Refactor ini berfokus pada kepemilikan komponen dan keterbacaan. Temuan dependency/AI/OAuth/data projection dari audit sebelumnya tetap terbuka. CSS dan batas pemuatan client belum dioptimalkan sebagai bagian pemisahan file ini.

- Build produksi final lolos setelah retry advisory framework yang sudah diketahui. Preview 3100 diperbarui. HTTP memverifikasi beranda 200, urutan sepuluh section ber-ID, form kontak, header/footer/dock, tujuh rute arsip/login/studi kasus dan dua puluh aset; admin tanpa sesi tetap 307 ke login. Pemeriksaan visual browser belum diulang.


## Upgrade keamanan Next.js — 23 Oktober 2026

- Perintah `next upgrade --agent=security` dijalankan melalui binary lokal proyek karena tidak ada binary global. Tool menetapkan target persis 16.4.2 dari 16.4.0. Instruksi shared/same-major dibaca dan pemeriksaan duplikasi lokal tidak menemukan pekerjaan setara. Repository tidak memiliki remote; pemeriksaan remote/PR tidak berlaku dan tidak ada PR yang dipublikasikan.
- Mengikuti default tool, upgrade diverifikasi pada worktree `/private/tmp/pramudyaspaces-next-security-20261023`, branch `security/next-16.4.2`. Snapshot terisolasi dari kondisi proyek terbaru dibuat sebagai baseline (termasuk perubahan sebelumnya yang belum di-commit), tanpa mengubah branch/index utama atau melacak environment. Konfigurasi lokal dirujuk melalui symlink `.env.local` yang diabaikan Git.
- Upgrade hanya mengubah `package.json`, `package-lock.json` dan `next.config.ts`: Next.js dipatok 16.4.2 beserta paket pendampingnya; `experimental.agentUpgrade: 'security'` ditambahkan sesuai instruksi dan dukungan tipe/schema versi target. Tidak menjalankan codemod atau migrasi major.
- Commit upgrade terverifikasi: `0c134e8`, setelah baseline terisolasi `3d37180`. Worktree bersih setelah commit. Ketiga file diverifikasi sama dengan baseline workspace utama sebelum ditimpa, lalu hasil terverifikasi diterapkan kembali dan `npm ci` dijalankan di workspace utama; pekerjaan pengguna lainnya tetap dipertahankan.
- Instalasi worktree dan workspace utama berhasil; `next --version` mengonfirmasi 16.4.2. `npm audit --json` di worktree dan audit instalasi utama melaporkan 0 kerentanan. Temuan P0 dependency pada audit sebelumnya ditutup oleh patch ini; temuan layanan/konfigurasi/optimasi lainnya tidak berubah.
- TypeScript, UI lint, 121 tes dan build produksi lulus di kedua workspace. Pemeriksaan HTTP kedua build: beranda 200; tujuh rute arsip/login/studi kasus 200; dua puluh aset 200; proyek tidak ditemukan 404; admin tanpa sesi 307; API admin 403; kontak invalid 400 dan origin asing 403. Tidak ada konten CMS yang diubah.
- Preview utama port 3100 sudah berjalan memakai Next.js 16.4.2; server sementara 3101 ditutup setelah pemeriksaan. Pemeriksaan visual browser tidak termasuk bukti ini.

- Perintah pelaporan hasil yang ditentukan tool Next.js dijalankan satu kali dengan ID upgrade dan status `success`; selesai dengan exit code 0, tanpa menyertakan detail proyek atau error pada argumennya.


## Bingkai footer selaras hero — 23 Oktober 2026

- Akar perbedaan: hero memiliki border-radius arch dan mask bawah, sedangkan aturan footer hanya mengatur ukuran/posisi dan masih memakai potongan persegi. Keduanya kini berbagi aturan arch `50% 50% 0 0`, mask transparan dan object-position. Foto footer diberi jarak atas 60px dan kanan 2%; posisi mobile tetap mengikuti breakpoint yang ada.
- Aset CMS, sapuan warna, parallax, lazy loading serta seluruh tautan footer dipertahankan. UI lint, TypeScript, 27 tes terkait dan build Next.js 16.4.2 lulus. Preview 3100 diperbarui; browser pengujian tidak tersedia sehingga hasil visual belum diperiksa langsung.

## Layar loading awal — 23 Oktober 2026

- Menambahkan fallback loading Next.js saat data server ditunggu, lalu layar loading klien dengan identitas dan token tema situs. Halaman tetap terpasang di belakang layar agar font dan gambar viewport pertama dapat dimuat dan didekode; gambar di bawah fold tetap lazy.
- Menunggu preferensi bahasa/tema dan hasil terjemahan awal sebelum pemeriksaan aset. Tidak memakai persentase atau durasi minimum palsu. Tombol Langsung masuk tersedia segera, batas otomatis 8 detik; gambar gagal tidak mengunci halaman. Abort membersihkan listener, scroll dikembalikan, dan reduced motion menggunakan indikator statis. Noscript mengembalikan akses konten SSR.
- Pemeriksaan: 123/123 tes lulus termasuk gambar terlihat/offscreen, decode cache, font readiness, error dan pembatalan; TypeScript, UI lint dan build lulus. Preview 3100 diperbarui. HTTP 200 memverifikasi layar loading, tombol, status awal dan CSS terkirim. Browser runtime melaporkan tidak tersedia (discovery kosong); visual mobile/desktop dan interaksi penuh belum diverifikasi di browser.

## Transisi keluar loading — 23 Oktober 2026

- Memisahkan kesiapan visual dari selesainya animasi keluar: konten tampil di belakang layar loading, lalu tirai memudar dan bergeser ke atas selama 600ms. Klik dan scroll halaman tetap terkunci hingga animasi berakhir. Listener animationend hanya menerima event dari layar utama; fallback 700ms mencegah layar terkunci jika animasi terinterupsi. Reduced motion langsung menyelesaikan transisi.
- Perilaku kesiapan tidak diubah: menunggu data awal/bahasa, font dan decode gambar viewport pertama, dengan pengecualian skip manual, timeout 8 detik, serta fallback aset gagal. Ini bukan jaminan semua gambar offscreen atau layanan eksternal sudah berhasil dimuat.
- TypeScript, UI lint, 24 tes terkait dan production build lulus. Preview 3100 diperbarui dan HTTP 200 mengonfirmasi state awal serta CSS exit terkirim. Browser pengujian masih tidak tersedia; visual animasi belum diperiksa langsung.

## Urutan statistik dan navigasi — 23 Oktober 2026

- Memindahkan statistik langsung setelah hero dan sebelum Tentang; komponen dan data hitungan tetap sama. Navigasi bersama kini mengikuti section aktual: home, about, projects, services, journey, skills, background, certificates, playground, contact. Section opsional tetap mengikuti ketersediaan konten publik.
- Header memfilter tautan utama dari urutan bersama; hamburger menggunakan urutan yang sama tanpa menambahkan playground di akhir setelah kontak. Navigasi bab dan tautan footer yang mengambil sumber bersama ikut selaras.
- Tes regresi urutan gagal sebelum perubahan dan lulus sesudahnya. TypeScript, UI lint, 27 tes terkait dan production build lulus. Preview 3100 diperbarui; HTTP 200 mengonfirmasi hero → statistik → about dan header about sebelum projects. Perubahan visual tidak diperiksa langsung melalui browser.

## Foto hero di dalam garis bingkai — 23 Oktober 2026

- Menyatukan inset horizontal bingkai dan tepi kanan foto melalui `--hero-frame-inset`: desktop/tablet 40px dan mobile 20px. Menghapus inset kanan negatif mobile dan inset kanan nol tablet.
- Menghapus pembesaran wadah foto saat scroll yang sebelumnya membuat tepi foto melampaui bingkai; pergeseran vertikal, arch, mask bawah dan interaksi reveal tetap dipertahankan. Tidak mengubah aset CMS atau framing footer.
- UI lint, TypeScript dan 24 tes rendering/scene/scroll lulus. Pemeriksaan visual browser belum dilakukan.
- Production build lulus; preview 3100 diperbarui. HTTP 200 memverifikasi CSS inset bersama 40px/20px terkirim dan inset negatif lama sudah hilang.
