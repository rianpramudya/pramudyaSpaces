# Pramudya Spaces

Website profil personal dan CMS sesuai `docs/PRD-personal-profile-website.md` dan `docs/design-website-profile.md`. Next.js App Router, TypeScript, Supabase Auth/Postgres/Storage. Seluruh fitur dibangun untuk satu peluncuran setelah verifikasi selesai.

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

Konten awal kosong. Isi melalui CMS; tidak ada profil/proyek fiktif yang diterbitkan otomatis.

- Profil: identitas, ringkasan, foto/alt, status kerja, lokasi, kontak dan visibilitas, tautan profesional, judul/deskripsi setiap bagian publik.
- Koleksi: proyek, pengalaman kerja/organisasi, pendidikan, layanan, skills, sertifikat, pencapaian, bahasa. Form mendukung draft/published dan urutan.
- Media: JPEG/PNG/WebP maksimum 5 MB; PDF maksimum 10 MB. Bucket privat, tidak ada URL Storage publik. Endpoint `/api/media/…` memeriksa referensi published atau akun pemilik; hapus media yang masih dipakai ditolak.
- Dokumen: ATS PDF, CV kreatif PDF, surat lamaran PDF, atau PDF unggahan. Hasil generasi privat; terbitkan secara eksplisit dan pilih CV unggulan untuk tombol unduh hero. PDF merupakan snapshot; hasilkan ulang setelah data CMS diubah.
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
