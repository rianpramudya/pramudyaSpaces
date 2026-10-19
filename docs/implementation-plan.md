# Rencana implementasi seluruh website

Tujuan: membangun seluruh fitur PRD sebelum satu peluncuran. Acuan: PRD-personal-profile-website.md dan design-website-profile.md. Implementasi langsung di sesi ini mengikuti instruksi pemilik.

## Arsitektur dan batas data

Next.js App Router + TypeScript, Supabase Auth/Postgres/Storage, deployment kompatibel Vercel. Tidak membuat deployment publik selama pekerjaan belum selesai. Halaman publik hanya menerima proyeksi data published. Isi portfolio tidak disimpan sebagai konstanta UI; admin mengisi seluruh isi dan mengatur urutannya. Konten awal kosong, dengan CTA dan keadaan kosong yang jelas.

Rute /admin/login untuk pemilik, /admin/register untuk penyiapan satu akun menggunakan rahasia server dan email pemilik yang diizinkan. Tidak ada tautan admin/register di website tamu. Semua operasi admin memverifikasi user melalui Supabase dan membership tabel owner, bukan user_metadata. Pengaturan akun hanya berada di admin.

## Keputusan implementasi

- Profil, proyek, pengalaman, pendidikan, layanan, skills, sertifikat, pencapaian, bahasa, dan informasi CV dikelola lewat form CMS terstruktur.
- Semua media berada pada bucket privat. Route server membaca media hanya jika referensinya ada di konten published, atau peminta merupakan admin.
- Kontak: nama, email, subjek, pesan; masuk ke Inbox tanpa ketergantungan email. Notifikasi email opsional melalui Resend server.
- Guestbook: OAuth Google/GitHub, teks 1–500 karakter, satu balasan pemilik per pesan, pagination dan rate limit. Nama sosial dan avatar boleh tampil; email tidak ditampilkan.
- Chatbot: server Gemini, konteks hanya proyeksi published, maksimal pesan 1000 karakter, 20 pesan per sesi/hari dan pembatas global. Transkrip tidak disimpan di database; UI menyimpan hanya selama panel aktif. Failure mengarahkan ke kontak.
- Bahasa: ID sumber utama, terjemahan published pada permintaan pertama dengan cache fingerprint; override admin terikat pada versi sumber dan dapat diedit. Fallback ID diberi pemberitahuan. UI statis memakai kamus ID/EN.
- Dokumen ATS, kreatif, surat lamaran: PDF dari data CMS, tanpa penulisan AI, privat sampai diterbitkan. Surat lamaran memiliki form tujuan dan isi manual. CV unggulan dipilih admin.
- Gambar JPEG/PNG/WebP maksimal 5 MB; PDF maksimal 10 MB; validasi signature dan path. Hapus media ditolak jika masih direferensikan.
- Permainan balok dan maskot memakai pointer/keyboard/tap; audio opt-in dan gerak dapat dimatikan, menghormati reduced motion.

## Pekerjaan dan bukti selesai

- [x] Fondasi aplikasi, model data, proyeksi published, validasi: tes kebocoran draft/kontak privat/terjemahan usang.
- [x] Skema Postgres dengan RLS, Storage privat, pemilik tunggal, pembatas request atomik.
- [x] Auth tersembunyi, login, logout, reset password, pengaturan email/password admin.
- [x] Form CMS profil dan semua koleksi, media, publikasi, urutan, preview.
- [x] Halaman publik dan detail proyek sesuai palet, tipografi, ID/EN, tema, mobile.
- [x] Kontak/Inbox, guestbook OAuth dan moderasi, chatbot dengan kegagalan jelas.
- [x] Terjemahan cache/override dan semua generator PDF, preview/download/publikasi.
- [x] Balok/maskot/audio, keyboard, drawer focus, metadata.
- [ ] Suite tes, typecheck, build produksi, pengujian HTTP dan integrasi database jika proyek tersedia.

## Kondisi yang harus diuji

Pengguna OAuth biasa tidak mendapat akses CMS; draft dan media privat tidak bocor; perubahan sumber menghindari terjemahan lama; kegagalan provider tidak menghasilkan jawaban palsu; PDF panjang tidak terpotong. Browser otomatis dalam sesi belum tersedia, sehingga batas verifikasi visual harus dilaporkan jika kondisi ini bertahan.

## Hasil verifikasi

Implementasi semua kelompok fitur tersedia. Pengujian provider Gemini telah lulus; OAuth nyata dan UI browser tetap belum selesai; lihat verification.md. Tidak ada rilis publik.
