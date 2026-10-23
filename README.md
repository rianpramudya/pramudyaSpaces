# Pramudya Spaces

Website profil personal dan CMS Pramudya Spaces. Next.js App Router, TypeScript, Supabase Auth/Postgres/Storage. Seluruh fitur dibangun untuk satu peluncuran setelah verifikasi selesai.

## Menjalankan

```sh
npm ci
npm run dev -- --port 3100
```

Halaman tamu: `http://127.0.0.1:3100`. Login admin: `/admin/login`. Penyiapan akun tersembunyi: `/admin/register`. Tidak ada tautan admin/pendaftaran di navigasi tamu.

`.env.local` sudah memuat koneksi proyek `pramudyaSpace` yang diberikan pemilik. `.env.example` menjelaskan variabelnya; semua `.env` diabaikan Git. Untuk environment baru, salin `.env.example` ke `.env.local` dan isi konfigurasi. Server harus dimulai ulang setelah perubahan environment.

## Membuat akun pemilik

1. Buka `/admin/register` secara langsung.
2. Gunakan email yang disetel pada `OWNER_EMAIL` (saat ini email karier dari CV contoh).
3. Pilih password minimal 12 karakter.
4. Salin kode `ADMIN_SETUP_TOKEN` dari `.env.local` ke form. Nilainya hanya digunakan saat penyiapan akun tunggal.
5. Setelah berhasil, masuk ke CMS. Akun pemilik kedua ditolak oleh constraint singleton database.

Pemulihan password berada pada `/admin/login`. Pengaturan email/password dan keluar akun tersedia di `/admin/settings`. Pemulihan memakai email akun pemilik saat ini, termasuk setelah perubahan email. Supabase Auth perlu konfigurasi redirect dan SMTP yang sesuai agar email pemulihan/konfirmasi dapat diterima.

## Mengisi konten

Konten publik berasal dari CMS. Kelola profil, koleksi, dan status penerbitan melalui dashboard admin.

- Profil: identitas, ringkasan, foto/alt, status kerja, lokasi, kontak dan visibilitas, tautan profesional, judul/deskripsi setiap bagian publik.
- Koleksi: proyek, pengalaman kerja/organisasi, pendidikan, layanan, skills, sertifikat, pencapaian, bahasa. Form mendukung draft/published dan urutan.
- Media: JPEG/PNG/WebP maksimum 5 MB; PDF maksimum 10 MB. Bucket privat, tidak ada URL Storage publik. Endpoint `/api/media/…` memeriksa referensi published atau akun pemilik; hapus media yang masih dipakai ditolak.
- Dokumen: ATS PDF, CV kreatif PDF, surat lamaran PDF, atau PDF unggahan. Hasil generasi privat; terbitkan secara eksplisit dan pilih CV unggulan untuk tombol unduh publik. PDF merupakan snapshot; hasilkan ulang setelah data CMS diubah.
- Inbox: form publik menyimpan nama/email/subjek/pesan; admin menandai dibaca, mengarsipkan, menghapus, atau membuka email balasan.
- Guestbook: semua pengunjung membaca; hanya akun sosial GitHub/Google yang dapat menulis, langsung tampil, satu balasan admin per pesan.
- Terjemahan: hanya konten published dikirim ke provider. Cache dan koreksi terikat pada versi masing-masing bagian; perubahan satu entri tidak menghapus koreksi entri lain.

## Mengaktifkan AI

Buat API key di [Google AI Studio](https://aistudio.google.com/api-keys), lalu tambahkan `GEMINI_API_KEY` ke `.env.local`. Model configurable melalui `GEMINI_MODEL`. Kuota dan model perlu diverifikasi menggunakan akun yang digunakan; dokumentasi [API key](https://ai.google.dev/gemini-api/docs/api-key) dan [model](https://ai.google.dev/gemini-api/docs/models).

Chatbot memakai informasi publik dan bahasa pilihan, tidak menyimpan transkrip ke database. Batas: 1000 karakter pertanyaan, 20 request per sesi/hari, 40 per pengunjung/hari, 100 global/hari. Provider gagal menampilkan jalur kontak. Terjemahan gagal menampilkan sumber Indonesia dengan pemberitahuan. Prompt/jawaban mengikuti kebijakan data provider.

## Mengaktifkan login sosial

Di Supabase **Authentication → URL Configuration**, atur Site URL dan tambahkan callback aplikasi untuk development: `http://127.0.0.1:3100/auth/callback`. Setelah deployment, gunakan URL final dan callback HTTPS-nya.

Callback provider untuk proyek ini: `https://clmxldzygmczmyawyhel.supabase.co/auth/v1/callback`.

- **GitHub:** buat OAuth App di GitHub Developer Settings, gunakan callback provider di atas, lalu isi Client ID/Secret dan aktifkan GitHub di Supabase Auth Providers. [Panduan resmi](https://supabase.com/docs/guides/auth/social-login/auth-github).
- **Google:** buat OAuth client jenis Web application, konfigurasi consent screen, origin aplikasi dan callback provider di atas. Isi Client ID/Secret dan aktifkan Google di Supabase Auth Providers. [Panduan resmi](https://supabase.com/docs/guides/auth/social-login/auth-google).

Provider belum aktif saat pemeriksaan awal. Dashboard admin menunjukkan status konfigurasi. Jangan menandai guestbook OAuth terverifikasi sebelum login nyata berhasil.

## Notifikasi email opsional

Inbox tetap berfungsi tanpa email. Isi `RESEND_API_KEY`, `CONTACT_NOTIFICATION_TO`, dan `CONTACT_NOTIFICATION_FROM` (alamat/domain yang diverifikasi Resend) untuk notifikasi. Kegagalan notifikasi tidak menggagalkan pesan yang sudah tersimpan.

## Database

Migrasi `supabase/migrations/20261011101347_portfolio_cms.sql` sudah diterapkan pada proyek `pramudyaSpace`. Semua tabel memiliki RLS; fungsi admin memakai membership pemilik, bukan user_metadata. Tabel rate limit tidak memiliki policy pengguna karena hanya server yang boleh memakainya. Info linter tersebut disengaja.

Pada proyek baru, jalankan migrasi melalui Supabase CLI/MCP. Jangan mengulang SQL pada proyek yang sudah memiliki migrasi. `supabase/config.toml` tersedia untuk pengembangan lokal; Docker lokal belum berhasil dijalankan pada mesin ini karena kesalahan penyimpanan image.

## Pemeriksaan

```sh
npm test
npm run typecheck
npm run build
node --import tsx scripts/check-pdf.tsx
```

Tes unit mencakup proyeksi publik, validasi input/unggahan, pemetaan CV, judul terjemahan, pemeliharaan override, pemulihan akun, dan SSR halaman tamu.

Tes integrasi yang telah dijalankan terhadap Supabase: RLS, sesi login, form CMS/publikasi, media privat/publik, Inbox, PDF, rate limit atomik, dan penyiapan pemilik tunggal. `scripts/integration-check.ts` dan `scripts/bootstrap-check.ts` memerlukan database tanpa akun pemilik dan membuat akun/data QA sementara; jangan menjalankannya setelah pemilik mulai mengelola konten. File environment tidak dicetak.

Respons Gemini nyata, chatbot ID/EN, terjemahan/cache/koreksi telah diuji melalui `scripts/ai-integration-check.ts`. Skrip membuat konten QA sementara lalu membersihkannya. Verifikasi UI browser dan OAuth nyata masih memerlukan penyelesaian konfigurasi/pengujian. Belum ada deployment publik. Untuk Vercel, impor project Next.js, masukkan environment server, dan atur `SITE_URL` serta redirect Supabase sesuai URL deployment. Jangan mengirim secret key melalui variabel `NEXT_PUBLIC_`.

## Revisi dan pemeriksaan terbaru

Catatan UI terbaru: [Redesign studio, 22 Oktober 2026](docs/qa-studio-redesign-2026-10-22.md). Dokumen rencana dan laporan revisi lama telah dibersihkan.

Setelah penggabungan arah sinematik, 121 tes aktif, lint, TypeScript, dan build produksi lolos. Pemeriksaan HTTP halaman tamu, proyek, login admin, dan logo aktif berhasil. Audit menyeluruh terbaru menemukan chatbot 503, OAuth pengunjung belum aktif, dan field bukti proyek terbuang saat projection publik. Temuan dependency Next.js sudah ditangani dengan upgrade keamanan 16.4.0 → 16.4.2; instalasi dan audit dependency melaporkan 0 kerentanan. Lihat laporan QA untuk prioritas perbaikan. Verifikasi visual browser masih belum dilakukan karena sesi browser pengujian tidak tersedia.

## Aset font

Halaman tamu memakai Onest untuk teks isi dan Italiana untuk judul editorial, keduanya di-host lokal sesuai [lisensi Onest](src/assets/fonts/Onest-LICENSE.txt) dan [lisensi Italiana](src/assets/fonts/Italiana-LICENSE.txt). UI admin memakai Onest untuk pengisian dan Italiana pada judul editorial; IBM Plex Mono tetap tersedia untuk label teknis. IBM Plex Mono Latin bobot 400/600 berasal dari [Fontsource](https://github.com/fontsource/font-files/tree/main/fonts/google/ibm-plex-mono), proyek asli [IBM Plex](https://github.com/IBM/plex), dengan lisensi [SIL Open Font License 1.1](src/assets/fonts/IBM-Plex-Mono-LICENSE.txt). Font dimuat melalui `src/app/typography.css` dengan `font-display: swap`. Font Inter di `public/fonts` tetap digunakan untuk generasi PDF.

## Desain studio dan foto hero

Halaman tamu mengikuti arah desain studio fotografis dengan aksen tembaga. Kedua foto hero dikelola di **Admin → Profil → Foto latar hero**. Pilih foto utama hitam-putih, foto sapuan berwarna dengan komposisi yang sama, lalu isi deskripsi foto dan simpan profil. Foto profil untuk dokumen tetap terpisah. Field hero ditambahkan oleh migrasi `supabase/migrations/20261022103644_studio_hero_portraits.sql`.

Kartu karya memakai proyek CMS yang diterbitkan; rincian proses dan hasil tetap tersedia pada studi kasus. Statistik dihitung dari koleksi yang terbit. CTA kontak memakai form inbox yang sebenarnya. Foto statis menjadi fallback untuk sentuhan, reduced motion, serta perangkat berdaya rendah. Scroll memakai perilaku native. Lenis dan Three.js tidak menjadi dependensi aplikasi. Lapisan sinematik memakai shader WebGL ringan yang dimuat saat terlihat, dengan batas 800 ribu piksel per permukaan. Foto dan latar CSS tetap tampil jika WebGL tidak tersedia.

Arah Laocoön digabungkan dengan identitas PramudyaSpaces: pencahayaan tembaga menuju biru dingin, tipografi editorial, progress bab berbasis anchor asli, serta panggung foto/karya. Konten tetap mengikuti CMS dan seluruh section berada dalam alur dokumen biasa. Pengaturan kualitas renderer berada pada `src/lib/cinematic-scene.ts`. Tidak ada loader yang menahan pengunjung sebelum membaca konten.


## Alur pengisian studio konten

Buka **Admin → Ringkasan → Peta halaman utama** untuk menuju sumber data setiap section. Isi **Profil** dan **Proyek** terlebih dahulu, kemudian lengkapi layanan, keahlian, pengalaman, pendidikan, sertifikat, dan pencapaian. Di editor konten pendukung, gunakan **Hubungkan dengan karya → Pilih proyek sendiri** untuk menentukan referensi yang tampil. Layanan dan keahlian lama tetap memakai pencocokan otomatis sampai Anda memilih mode manual; pilihan manual yang kosong tidak menampilkan referensi. Proyek draft, dihapus, atau tidak tersedia tidak ditampilkan kepada tamu. Relasi disimpan di JSON konten melalui API admin yang sama; tidak memerlukan migrasi database.


## Struktur komponen halaman publik

`src/app` berisi route Next.js. `components/portfolio.tsx` mengelola preferensi, navigasi dan panel pengunjung; `components/studio-home.tsx` menyiapkan data CMS dan menyusun urutan section.

```text
src/components/
  layout/
    site-header.tsx
    site-footer.tsx
    types.ts
  sections/
    hero-section.tsx
    about-section.tsx
    projects-section.tsx
    services-section.tsx
    experience-section.tsx
    skills-section.tsx
    background-section.tsx
    certificates-section.tsx
    stats-section.tsx
    playground-section.tsx
    contact-section.tsx
    services-studio.tsx
    skills-workspace.tsx
    education-folio.tsx
    credential-gallery.tsx
  projects/
    project-detail.tsx
    project-archive.tsx
    project-gallery.tsx
    project-cover.tsx
    project-evidence.tsx
  ui/
    section-heading.tsx
    studio-button.tsx
  admin/
```

Komponen section menerima data dan callback melalui props eksplisit. Pemilahan konten terbit dan statistik tetap berada di `lib/studio-content.ts`, sementara komponen interaksi bersama (motion, portrait, dock, form dan permainan) tetap dapat dipakai lintas section. JSX pada file yang dipisahkan sudah diformat konsisten. CSS tetap memakai sistem selector dan token yang sama agar struktur DOM, responsivitas, dan tampilan tetap terjaga.
