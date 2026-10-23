# Testing dan QA

Panduan aktif, 23 Oktober 2026. Kode tes adalah sumber cakupan aktual; laporan QA menyimpan hasil pada waktu tertentu. Tes otomatis tidak membuktikan semua alur browser, provider, atau konfigurasi deployment sudah benar.

## Perintah aman untuk pemeriksaan lokal

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` menjalankan Node test runner melalui `tsx` pada `tests/*.test.ts`. Banyak tes memakai fixture lokal, fungsi murni dan server rendering React. `typecheck` menjalankan `tsc --noEmit`. `lint` adalah skrip CSS/token/typography khusus; belum ada ESLint umum. Build memeriksa bundling/routing, bukan seluruh integrasi runtime.

Untuk fokus, misalnya:

```sh
node --import tsx --test tests/rendering.test.ts tests/site-chrome.test.ts
node --import tsx --test tests/page-readiness.test.ts
node --import tsx --test tests/content.test.ts tests/validation.test.ts
```

Sesuaikan tes dengan perilaku yang diubah. Setelah gate relevan lulus, jangan mengulang seluruh suite tanpa perubahan atau alasan baru. Perubahan dokumen saja tidak memerlukan build; periksa tautan dan akurasi kode/kontrak yang dijelaskan.

## Matriks lapisan

| Lapisan | Bukti yang dicari | Batas |
|---|---|---|
| Unit/policy | Normal, kosong, invalid, batas panjang, visibility, relasi | Tidak membuktikan remoteDB |
| SSR/rendering | Konten, urutan, anchor, draft tidak tampil, empty state | Tidak membuktikan hydration/ukuran visual |
| Type/lint/build | Kontrak statis, subset aturan UI, bundle dapat dibangun | Tidak membuktikan provider tersedia |
| HTTP smoke | Status, payload terproyeksi, header/aset dari build benar | Tidak membuktikan interaksi/aksesibilitas |
| Integrasi staging | Auth, persistensi, RLS/media, provider dan error nyata | Memerlukan target dan fixture terkontrol |
| Browser manual/otomatis | Keyboard, klik, resize, screenshot, console/network | Memerlukan browser yang dapat diakses |
| Performa | Rendering/bundle/latensi dan metrik nyata | Pisahkan lab, field, dan dugaan |

## Aturan pengujian data

Default QA menggunakan fixture lokal. Jangan mengirim pesan kontak/guestbook sungguhan, membuat owner, menerbitkan dummy, menghapus media, mengirim reset email atau memanggil AI berbayar hanya untuk memastikan tombol berfungsi.

| Skrip | Risiko dan tempat yang sesuai |
|---|---|
| `scripts/check-pdf.tsx` | Merender PDF lokal dan menulis artefak; baca destination/input sebelum menjalankan |
| `scripts/bootstrap-check.ts` | Membuat/membersihkan akun atau data setup; database uji kosong saja |
| `scripts/integration-check.ts` | Menulis konten/media/pesan/dokumen dan membersihkan fixture; database uji terisolasi tanpa owner aktif |
| `scripts/ai-integration-check.ts` | Konten QA sementara dan panggilan provider; staging dengan budget/izin jelas |
| `scripts/import-cv-drafts.mjs` | Import dan backup data; bukan smoke test |
| `scripts/fill-portfolio-preview.ts` | Isi konten/artefak preview; periksa efek tulis dan target sebelum eksekusi |

Nama skrip bukan jaminan keamanan. Baca kode, identifikasi project/URL secara aman tanpa mencetak secret, gunakan database khusus uji, simpan ID fixture, dan cleanup hanya ID tersebut. Jika tindakan spesifik pada data aktif sudah diotorisasi pengguna dalam sesi, ikuti scope itu dan laporkan hasilnya; jangan menganggap otorisasi historis umum berlaku untuk tindakan baru yang berbeda.

## QA browser minimum

Viewport: 320, 375/390, 549, 768, 1024, 1440, 1920px, ditambah landscape dan zoom 200% untuk area terpengaruh. Periksa ID/EN, light/dark, reduced motion, keyboard dan sentuhan.

1. Loading: cached/slow/broken image, font lambat, terjemahan gagal, skip, timeout, exit, scroll pulih; tidak ada halaman inert setelah keluar atau deadlock pada gambar lazy.
2. Hero: teks/CTA terbaca, foto di dalam bingkai, arch/reveal tidak bocor, fallback statis bekerja.
3. Urutan: hero → statistik → about; header/hamburger/bab mengikuti section. Anchor tidak tertutup header.
4. Karya: next/previous/keyboard yang tersedia, archive/filter/sort, link case, draft tersembunyi, proyek tanpa media/bukti, judul dan teknologi panjang.
5. Section lain: empty/1/banyak entri, disclosure, relasi target draft/dihapus, sertifikat tanpa preview.
6. Dock/panel: Studio/Buku tamu/Chat tetap terjangkau di mobile, tidak overlap submit; close/Escape/focus/scroll panel benar.
7. Kontak: required, email salah, batas pesan, pending/sukses/gagal, input tidak hilang saat gagal, tidak double submit. Mock respons atau staging; jangan mengirim ke inbox aktif.
8. Admin: nonowner ditolak server, owner email/password, save/error/stale refresh, draft/publish, reorder/filter, media/doc visibility dan navigasi dengan input belum tersimpan.
9. Browser console/network: tidak ada error hydration, request loop, aset rusak atau kegagalan tersembunyi pada alur yang diuji.
10. Gerak/performa: tidak memaksa pengguna menunggu, idle tidak memboroskan render; uji tanpa WebGL, pointer coarse dan preferensi motion off.

Jika Browser/Codex atau tool yang tersedia tidak dapat tersambung, laporkan eksplisit: “visual/interaksi browser belum diverifikasi”. Jangan menggantinya dengan klaim hasil screenshot dari SSR.

## Regresi dan acceptance

Bug nontrivial: reproduksi dengan fixture atau tindakan yang jelas, tambah tes perilaku yang relevan, buktikan gagal sebelum fix jika ekonomis, lalu lulus sesudahnya. Jangan menambah snapshot seluruh DOM atau tes class CSS untuk perubahan kosmetik kecil yang tidak memberi perlindungan perilaku.

Untuk perubahan akses data, uji pipeline lengkap: input tervalidasi → simpan/fixture → proyeksi publik → tampilan/media. Contoh yang kini dilindungi `tests/project-publication.test.ts`: field `result_source`/`paper` tidak hilang di tengah pipeline. Mengetes editor saja tidak cukup.

## Performa, keamanan dan rilis

- Ukur payload JS/CSS, request media/DB, render canvas dan kegagalan provider sebelum optimasi. Target LCP/INP/CLS di [PRD](PRD.md) mengikuti definisi [Web Vitals](https://web.dev/articles/vitals).
- Jangan menambah cache publik demi skor jika media privat atau unpublish bisa bocor.
- Sebelum rilis dependency, jalankan audit dependency terbaru dan review advisory yang relevan; jumlah nol bukan sertifikasi keamanan. Lihat [SECURITY](SECURITY.md).
- Untuk release/staging, jalankan suite penuh, typecheck, lint, build, smoke HTTP, lalu alur kritis browser dan integrasi yang relevan. Jika gate tidak bisa dijalankan, catat sebagai keterbatasan atau blocker sesuai dampak.
- Catat viewport, URL/commit atau build, tanggal, perintah/exit code, hasil, dan bagian belum diuji. Jangan mencantumkan token, cookie atau data pribadi dalam artefak QA.

## Status bukti

Setelah perbaikan bertahap pada 23 Oktober 2026, `npm test` dijalankan ulang dan 129/129 tes lulus. Tes baru mencakup pipeline bukti proyek, dirty tracking balasan, sanitasi error/validasi upload, dan state gerak loader. Tautan lokal pada sembilan dokumen aktif diperiksa tanpa tautan rusak; review pembaca independen mencocokkan kontrak utama dengan kode. Build telah dijalankan pada tugas perbaikan runtime; hasil akhirnya dicatat pada laporan QA. Angka tes bukan syarat tetap: jalankan `npm test` untuk jumlah terbaru. Pengujian browser/integrasi live tidak dilakukan pada tugas dokumentasi ini.

Temuan operasional terdahulu (chat 503, OAuth nonaktif) belum diuji ulang oleh penulisan dokumen ini. Projection bukti dan cakupan guard yang ditemukan sudah diperbaiki; media `no-store` serta boundary client lebar tetap menjadi area evaluasi performa. Interaksi guard/loader di browser belum diverifikasi langsung. [Laporan QA](qa-studio-redesign-2026-10-22.md) berisi detail serta pembaruan kronologis, termasuk patch keamanan Next yang sudah dilakukan.
