# PramudyaSpaces

Portofolio Rian Pramudya Amanda dengan CMS pemilik tunggal. Halaman publik menggabungkan fotografi, tipografi editorial, karya, profil, layanan, pengalaman, dan ruang bermain. Data berasal dari Supabase; admin mengelola konten tanpa mengedit kode.

Dokumentasi ini diselaraskan dengan kode pada **23 Oktober 2026**. Kondisi provider dan deployment harus diperiksa pada environment yang dipakai; keberadaan konfigurasi tidak membuktikan layanan operasional.

## Dokumentasi

| Dokumen | Tanggung jawab |
|---|---|
| [AGENTS.md](AGENTS.md) | Aturan kerja AI agent dan batas tindakan |
| [PRD](docs/PRD.md) | Tujuan, fitur, prioritas, acceptance |
| [Arsitektur](docs/ARCHITECTURE.md) | Modul, route, data, integrasi |
| [Design system](docs/DESIGN_SYSTEM.md) | Token dan komponen |
| [Desain](docs/DESIGN.md) | Arah visual, komposisi, interaksi |
| [Code style](docs/CODE_STYLE.md) | Konvensi implementasi dan OOP/SOLID |
| [Testing](docs/TESTING.md) | Perintah, skenario, batas pengujian |
| [Security](docs/SECURITY.md) | Auth, privasi, model ancaman |
| [Riwayat QA](docs/qa-studio-redesign-2026-10-22.md) | Hasil pemeriksaan historis; baca pembaruan terakhir |

## Teknologi dan prasyarat

Next.js App Router 16.4.2, React 19.3.0, TypeScript 7.0.2, Supabase Auth/Postgres/Storage, Zod, dan `@react-pdf/renderer` pada snapshot ini. `package.json` dan `package-lock.json` adalah sumber versi aktual.

Gunakan Node.js LTS yang kompatibel dengan versi Next.js terpasang dan npm untuk environment baru; validasi sebelum menetapkan pin runtime. Repositori belum memiliki `.nvmrc` atau `engines` sebagai pin runtime. Docker dan Supabase CLI diperlukan hanya untuk database lokal. Tidak ada ORM tambahan, Three.js, atau Lenis pada dependensi saat ini.

```sh
npm ci
test -e .env.local || cp .env.example .env.local
npm run dev -- --port 3100
```

Salin environment hanya pada setup baru; jangan menimpa `.env.local` yang sudah berisi konfigurasi. Isi nilainya secara lokal, lalu restart server setelah perubahan. Halaman publik: `http://127.0.0.1:3100/`; admin: `/admin/login`.

## Konfigurasi

| Variabel | Penggunaan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Kunci publik untuk klien sesi; tetap bergantung pada izin/RLS |
| `SUPABASE_SECRET_KEY` | Server saja; jangan memakai prefix `NEXT_PUBLIC_` |
| `SITE_URL` | Origin aplikasi; untuk preview ini gunakan `http://127.0.0.1:3100` |
| `OWNER_EMAIL`, `ADMIN_SETUP_TOKEN` | Setup owner pertama; token acak minimal 32 karakter |
| `RATE_LIMIT_SECRET` | Secret HMAC pembatasan request; gunakan nilai terpisah yang kuat |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Chat dan terjemahan; model/kuota harus tersedia pada akun |
| `RESEND_API_KEY`, `CONTACT_NOTIFICATION_TO`, `CONTACT_NOTIFICATION_FROM` | Notifikasi email opsional; pengirim harus terverifikasi |

`.env.example` masih memakai port 3000 sebagai contoh. Samakan `SITE_URL`, alamat preview, dan allowlist redirect ketika memakai port 3100. Jangan memasukkan nilai credential ke issue atau dokumen.

## Database dan akun admin

Migrasi berurutan berada di [supabase/migrations](supabase/migrations). Untuk database uji lokal, jalankan `npm run db:local`, ambil konfigurasi lokal secara privat, lalu terapkan migrasi pending dengan Supabase CLI sesuai target. Untuk remote, periksa project reference dan migration history sebelum menerapkan migrasi; jangan mengulang SQL yang sudah diterapkan atau menjalankan reset pada database aktif.

1. Pada instalasi baru tanpa owner, isi `OWNER_EMAIL` dan `ADMIN_SETUP_TOKEN`.
2. Buka `/admin/register` langsung. Gunakan email tersebut, password minimal 12 karakter, dan token setup.
3. Setelah owner terbentuk, login memakai email/password di `/admin/login`. Owner tambahan ditolak oleh database.
4. Pengaturan email/password dan pemulihan berada di `/admin/settings` dan `/admin/login`. Alur email membutuhkan konfigurasi Auth/SMTP/redirect yang benar.

Admin **tidak perlu login Google/GitHub**. OAuth dipakai pengunjung untuk menulis buku tamu; sesi owner juga dapat menulis. Route admin tidak ditautkan pada navigasi tamu, tetapi perlindungannya tetap pemeriksaan server.

## Alur pengisian

Mulai dari **Ringkasan → Peta halaman utama**, isi Profil dan Proyek, lalu hubungkan layanan, keahlian, pengalaman, pendidikan, dan sertifikat dengan proyek yang relevan. Gunakan draft selama penyusunan, preview, lalu terbitkan secara eksplisit.

- Foto hero utama dan foto sapuan warna harus memiliki komposisi sama; foto formal profil dikelola terpisah.
- Relasi manual memakai `related_project_ids`. Pilihan manual kosong tidak menampilkan proyek; proyek draft/tidak tersedia disaring dari publik. Layanan/skills lama dapat memakai pencocokan otomatis.
- Kontak mempunyai form inline yang menyimpan ke Inbox. Notifikasi email gagal tidak membatalkan pesan yang sudah tersimpan.
- Dokumen PDF merupakan snapshot: hasilkan ulang setelah data sumber berubah, periksa isinya, lalu terbitkan/pilih CV unggulan jika diperlukan.
- Media melalui `/api/media/…` dari bucket privat. Gambar JPEG/PNG/WebP maksimal 5 MB; PDF maksimal 10 MB.
- Loading awal menunggu preferensi, konten awal/bahasa, font, dan gambar viewport pertama. Skip dan timeout 8 detik tersedia, lalu transisi keluar 600 ms. Aset offscreen tetap lazy-load.

## OAuth dan AI

Di Supabase Auth atur Site URL dan redirect aplikasi `/auth/callback` untuk setiap environment. Callback pada OAuth App provider adalah `https://<project-ref>.supabase.co/auth/v1/callback`, berbeda dari callback aplikasi. Ikuti panduan resmi [GitHub](https://supabase.com/docs/guides/auth/social-login/auth-github) dan [Google](https://supabase.com/docs/guides/auth/social-login/auth-google); jangan menaruh client secret pada browser.

AI hanya menerima proyeksi konten publik. Masukkan key/model Gemini yang valid, lalu uji respons nyata dengan memperhatikan kuota dan biaya. Jangan menganggap chat atau terjemahan aktif hanya karena key terisi. Rincian kontrol dan temuan berada di [SECURITY](docs/SECURITY.md) dan [TESTING](docs/TESTING.md).

## Pemeriksaan dan produksi

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run start -- --port 3100
```

Jalankan dev dan start produksi secara bergantian pada port yang sama. Saat build selesai, restart proses preview yang benar agar tidak menyajikan aset lama. `npm run lint` saat ini adalah pemeriksaan CSS/token UI khusus, **bukan ESLint umum**.

Skrip bootstrap, integrasi, import, dan fill dapat menulis atau menghapus data sementara. Jangan menjalankannya di database pemilik aktif untuk smoke test. Lihat klasifikasi skrip dan matriks QA di [TESTING](docs/TESTING.md).

Perbaikan bertahap setelah audit sudah mempertahankan URL bukti/paper proyek pada proyeksi publik, melengkapi guard input admin, menyaring pesan error internal, dan menyelaraskan motion off pada loader. Temuan operasional yang belum dibuktikan selesai mencakup chat 503 dan provider OAuth pengunjung yang belum aktif; pemilik mengonfirmasi aplikasi OAuth belum dibuat. Riwayat pemeriksaan visual juga terbatas karena browser pengujian tidak tersedia. Lihat laporan QA; jangan menganggap dokumentasi baru ini menyelesaikan temuan tersebut.

Untuk deployment, gunakan runtime yang cocok, konfigurasi environment secara privat, terapkan migrasi pending dengan benar, sesuaikan `SITE_URL`/redirect, lalu uji staging. Dokumentasi ini tidak menerbitkan deployment atau mengubah CMS.

## Lisensi aset

Font UI publik: [Onest](src/assets/fonts/Onest-LICENSE.txt) dan [Italiana](src/assets/fonts/Italiana-LICENSE.txt), dimuat lokal. Label teknis dapat memakai [IBM Plex Mono](src/assets/fonts/IBM-Plex-Mono-LICENSE.txt). Barlow masih dimuat untuk gaya dasar/legacy; font Inter dipakai pada jalur PDF. Pertahankan lisensi dan izin foto/aset ketika mengganti atau membersihkan file.

## SEO dan Google Search Console

Metadata berbahasa Indonesia berfokus pada Rian Pramudya dan memakai origin canonical `https://pramudyaspaces.vercel.app` dari `src/lib/seo.ts`, terpisah dari `SITE_URL` untuk callback auth lokal. Bila domain produksi diganti, perbarui origin SEO tersebut secara sengaja.

`/sitemap.xml` dibuat dinamis dari halaman home, archive dan proyek terbit melalui `getPublicContent()`; draft, data admin, dokumen/media API dan anchor section tidak dimasukkan sebagai halaman. Tidak ada tanggal modifikasi palsu pada sitemap. `/robots.txt` mengizinkan halaman publik, memblokir `/admin`, `/api`, `/auth`, dan menunjuk sitemap produksi. Robots adalah petunjuk crawler, bukan pengganti otorisasi; admin tetap memiliki metadata noindex dan gate server.

File `public/google2e0088a0eb377ab5.html` adalah verifikasi GSC: jangan diubah, dipindahkan, atau dihapus. Proxy tidak mencakup file tersebut, robots maupun sitemap. Setelah perubahan diterbitkan ke Vercel, submit `sitemap.xml` di GSC dan gunakan URL Inspection untuk halaman utama/proyek; waktu indeks dan peringkat tidak dijamin oleh implementasi metadata.
