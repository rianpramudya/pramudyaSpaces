# Design system — studio fotografis

Kontrak visual aktif, 23 Oktober 2026. Nilai runtime berasal dari CSS, bukan angka yang disalin ke dokumen ini. Arah penyajian tiap section berada di [DESIGN](DESIGN.md).

## Sumber kebenaran dan cakupan

- `src/app/design-tokens.css`: palette, surface, border dan token material public/admin.
- `src/app/typography.css`: font lokal dan tipe dasar.
- `src/app/studio.css`: komponen/layout studio dan responsivitas.
- `src/app/cinematic.css`: treatment sinematik, fotografi, tema dan motion.
- `src/app/page-loader.css`: loading awal/exit.
- `src/app/admin-workspace.css`: workflow dan layout admin.

`globals.css`, `portfolio.css`, `immersive.css`, `hero-chase.css`, `site-chrome.css`, dan `admin.css` masih dipakai pada jalur terkait. Sistem belum sepenuhnya terkonsolidasi. Sebelum mengubah rule, telusuri cascade/import; jangan menganggap nama komentar legacy sebagai arah desain baru.

## Warna semantik

| Token public cinematic | Light | Dark | Peran |
|---|---|---|---|
| `--studio-paper` | `#f6f2ec` | `#0c0b0a` | Latar utama |
| `--studio-text` | `#211c18` | `#f5efe7` | Teks utama |
| `--studio-muted` | `#6d6259` | `#b9aea3` | Teks sekunder yang tetap terbaca |
| `--studio-line` | `#d9cfc3` | `#3b3229` | Garis/divider dekoratif |
| `--studio-surface` | `#eee7de` | `#171410` | Permukaan pendukung |
| `--studio-surface-2` | `#ded1c2` | `#28221c` | Permukaan bertingkat |

Aksen lingkungan: `--cinematic-bronze`, `--cinematic-blue`, `--cinematic-cream`; tembaga memakai token studio yang sudah tersedia. Biru dingin hanya pencahayaan lingkungan, bukan warna teks/action acak. Hero dan footer mempertahankan basis gelap agar foto serta headline konsisten dalam kedua mode.

Gunakan token berdasarkan fungsi, bukan warna yang kebetulan mirip. Literal hex/RGB hanya didefinisikan pada file token. Overlay memakai `rgb(var(--studio-white-rgb) / ...)` atau token RGB lain, tidak mendefinisikan palette kedua di komponen.

Divider halus tidak cukup sebagai batas input/focus. Kontrol interaktif memerlukan kontras yang sesuai; validasi/error/sukses juga harus menyertakan teks atau ikon, bukan warna saja.

## Tipografi

- `--font-studio`: Onest untuk body, navigasi, tombol, form, dan admin.
- `--font-cinematic`: Italiana untuk headline editorial terpilih; bukan paragraf panjang atau label kontrol.
- `--font-mono`: IBM Plex Mono untuk metadata teknis terbatas.
- Pada scope `.studio-site`, `--font-mono` saat ini dioverride ke Onest. Periksa scope sebelum menganggap label teknis memakai Plex; token root tidak selalu menjadi hasil akhir.
- Barlow adalah font dasar/legacy yang masih dimuat. Inter pada PDF mengikuti kebutuhan dokumen dan tidak menjadi font UI publik baru.

Ukuran label minimal 12px sesuai lint; body dasar 16px dengan line-height nyaman sekitar 1,5–1,7. Label bukan sarana menyembunyikan disclaimer penting. Headline bersifat fluid dengan `clamp`; hero saat ini memakai 48–82px pada rule desktop dan penyesuaian mobile. Jangan menerapkan skala headline hero ke semua section.

Batasi paragraf panjang sekitar 45–75 karakter per baris sebagai pedoman komposisi, bukan pemotongan konten. Nama/proyek/email panjang harus wrap dengan aman. Nilai font final diperiksa pada CSS terkomputasi dan bahasa ID/EN.

## Layout, spacing dan bentuk

Skala jarak pilihan untuk perubahan baru: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Ini pedoman ritme; belum semuanya tersedia sebagai token. Gunakan ukuran fluid ketika viewport membutuhkan, bukan memaksa setiap nilai ke skala.

- Shell dasar studio: `min(100% - 80px, 1240px)`; breakpoint dan layar sangat lebar dapat menyesuaikan.
- Shell tablet yang tersedia memakai gutter 24px per sisi; mobile 20px per sisi.
- Garis bingkai hero dan tepi foto memakai `--hero-frame-inset`: 40px desktop/tablet, 20px mobile. Foto tidak boleh memakai inset negatif atau scale pada wadah yang menembus garis.
- Foto hero/footer: arch di atas, mask bawah lembut. Foto formal about: proporsi portrait mengikuti komponen existing; jangan mengganti identitas/fisik pemilik.
- Radius dipilih berdasarkan peran: tombol pill, container editorial lebih tenang, panel/menu ringkas. Jangan memberi radius besar dan shadow pada semua section.
- Utamakan divider, spacing dan hierarki dibanding nesting kartu. Bayangan hanya untuk layer yang benar-benar mengambang.

## Komponen dan state

| Komponen | Kontrak |
|---|---|
| `StudioButton` | CTA konsisten, label jelas, fokus terlihat; gunakan varian existing |
| `SectionHeading` | Eyebrow, judul, deskripsi dengan hierarki konsisten |
| Header/hamburger | Tautan mengikuti urutan halaman; menu popover ringkas, Escape dan klik luar menutup |
| Galeri proyek | Cover CMS, fokus karya, kontrol aksesibel, link studi kasus/archive |
| Form kontak/admin | Label eksplisit, required/error/pending/sukses, disabled hanya saat perlu |
| Visitor dock | Studio, buku tamu, chat tetap terjangkau tanpa menutupi CTA/form |
| Drawer/dialog | Judul, close, keyboard dan pengembalian fokus; sesuai pola komponen existing |
| Loading | Status nyata, tanpa persentase palsu; skip/timeout dan reduced motion |

Perubahan harus menangani default, hover, focus-visible, active, disabled, pending, empty dan error sesuai relevansi. Hover tidak menjadi satu-satunya cara membuka informasi pada sentuhan.

## Aksesibilitas dan responsivitas

Target WCAG 2.2 AA: teks biasa minimal 4,5:1; teks besar minimal 3:1; indikator kontrol/focus yang diperlukan minimal 3:1 terhadap warna berdekatan. Ukuran klik praktis ditargetkan ≥44×44 CSS px jika memungkinkan; ini target kenyamanan proyek, bukan klaim bahwa seluruh kontrol sudah memenuhi audit. Pedoman resminya: [WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

Uji 320, 375/390, 549, 768, 1024, 1440 dan 1920px; landscape, zoom 200%, keyboard, kedua bahasa/tema. Konten menyusun ulang berdasarkan kebutuhan, tidak sekadar memperkecil seluruh desktop. Jangan memakai `overflow-x:hidden` untuk menyembunyikan akar overflow konten.

## Motion dan pengukuran

Gerak bertujuan menunjukkan perubahan state, fokus karya, atau kedalaman foto. Utamakan transform/opacity; hindari layout thrashing, animasi besar yang terus berjalan, dan filter mahal pada seluruh halaman. Motion controls: [DESIGN](DESIGN.md).

`prefers-reduced-motion` dan preferensi motion off harus dihormati. GPU/60fps belum dapat dinyatakan tercapai tanpa profiling. Screenshot, audit keyboard dan pengukuran runtime tetap diperlukan di samping tes token/kontras.
