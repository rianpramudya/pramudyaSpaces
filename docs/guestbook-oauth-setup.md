# Buku tamu dan login pengunjung

Admin login melalui `/admin/login` dengan email dan password pemilik. Identitas admin diperiksa melalui tabel `owners`, bukan metadata pengguna. Sesi admin yang sama bisa menulis buku tamu; nama memakai Profil CMS. Login sosial tidak memberi izin dashboard.

Pengunjung membaca tanpa login; menulis setelah login GitHub atau Google. Tombol provider hanya aktif jika Supabase melaporkan provider tersedia. Saat audit 12 Oktober 2026, kedua provider masih nonaktif.

Panduan interaktif tersedia di Dashboard → Pengaturan akun → Status layanan → Konfigurasi login pengunjung GitHub & Google. Tombol Salin dan tautan dashboard tersedia. Setelah konfigurasi, tekan Periksa ulang status.

1. Supabase → Authentication → URL Configuration: isi Site URL dan Redirect URLs. Website lokal berjalan di `http://127.0.0.1:3000` atau preview `http://127.0.0.1:3100`. Tambahkan `http://127.0.0.1:3000/auth/callback**` dan `http://127.0.0.1:3100/auth/callback**`; jika memakai localhost, tambahkan padanannya. Produksi memakai domain website, dan `SITE_URL` aplikasi harus sesuai.
2. GitHub → Settings → Developer settings → OAuth Apps: buat OAuth App; Homepage URL memakai alamat website, Authorization callback URL memakai `https://clmxldzygmczmyawyhel.supabase.co/auth/v1/callback`. Masukkan Client ID dan Client Secret ke provider GitHub Supabase, aktifkan dan simpan.
3. Google Cloud → Google Auth Platform: atur Branding, Audience, Data Access (`openid`, email, profile), lalu buat OAuth Client tipe Web application. Authorized JavaScript origins memakai origin website. Authorized redirect URIs memakai callback Supabase yang sama. Masukkan Client ID dan Client Secret ke provider Google Supabase, aktifkan dan simpan. Pada mode Testing hanya akun penguji yang diizinkan; siapkan Audience untuk pengunjung umum sebelum rilis.
4. Uji masing-masing provider melalui jendela privat: buka buku tamu, login, kembali ke buku tamu, kirim pesan, pastikan tampil, lalu logout. Di jendela admin cukup login akun pemilik lalu buka buku tamu. Logout dari buku tamu dengan sesi admin juga keluar dari akun admin; tombol menyebutkan hal ini.

Client Secret disimpan di Supabase. Tidak perlu memasukkannya ke CMS, kode browser, atau chat. Aktivasi provider belum dapat diselesaikan sebelum OAuth App dan kredensial provider dibuat.

Dokumentasi resmi: [GitHub](https://supabase.com/docs/guides/auth/social-login/auth-github), [Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## Verifikasi implementasi

- 56 tes otomatis lulus; build produksi berhasil.
- API buku tamu dengan sesi QA pemilik: `isOwner=true`, `canWrite=true`, nama sesuai Profil CMS.
- Permintaan admin berisi pesan kosong mencapai validasi HTTP 400, bukan ditolak karena provider email. Tidak ada pesan uji yang diterbitkan.
- Pengunjung tanpa sesi ditolak HTTP 401.
- Login OAuth provider yang belum aktif ditolak HTTP 503 sebelum redirect, dengan petunjuk konfigurasi.
- Sesi QA dicabut setelah pemeriksaan; password dan sesi admin lain tidak diubah.
- Login GitHub/Google end-to-end belum diuji karena kedua provider belum dikonfigurasi. Browser otomatis belum tersedia.

- Pemeriksaan API konfigurasi final memastikan Site URL tetap `127.0.0.1:3100`, bukan `localhost` hasil normalisasi internal Next.js; callback tetap callback Supabase. Panduan komponen diuji melalui render statis. Panel konfigurasi memuat data setelah mount, sehingga pemeriksaan HTML awal tidak membuktikan interaksi browser.
