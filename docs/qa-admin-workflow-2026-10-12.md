# Audit dashboard dan QA — 12 Oktober 2026

## Hasil implementasi

Dashboard menjadi ruang kerja portofolio: langkah berikutnya, shortcut draft menuju item sebenarnya, checklist profil/karya/CV, dan akses cepat. Navigasi utama berisi Ringkasan, Profil, Proyek, Pengalaman, Dokumen & CV. Koleksi pendukung, pesan, dan pengaturan dikelompokkan dalam menu yang dapat dilipat. Grup halaman aktif terbuka otomatis.

Form memiliki ruang dan tipografi lebih lega, kelompok informasi yang jelas, status perubahan profil, serta aksi simpan draft/terbit yang eksplisit. Daftar koleksi memakai kartu pada mobile, dengan pilihan item, status, urutan, Edit, dan Hapus. Light/dark menggunakan token lokal dashboard. Tema halaman tamu dan karakter tidak diubah.

## Bug dan perbaikan logika

- Pengurutan sebelumnya memakai dua request terpisah. Kini RPC `reorder_entry` menggunakan satu transaksi, advisory lock per jenis, row lock, dan hanya mengubah posisi/timestamp. Authorization tetap owner-only dengan security invoker dan RLS.
- Daftar menggunakan urutan posisi kemudian ID, sama dengan RPC; posisi yang sama tidak menghasilkan tetangga berbeda antara UI/database.
- Toggle publikasi hanya memperbarui visibilitas, tanpa mengirim ulang seluruh isi record.
- Form menjaga perubahan belum disimpan pada navigasi, Back/Forward, refresh, tutup dialog, dan logout. Logout meminta izin meninggalkan form sebelum sesi dicabut.
- Save/close menunggu unggahan media selesai. Isian dikunci selama save/upload.
- Save berhasil tetapi refresh gagal dibedakan dari save gagal. Data lama dikunci dan tersedia tombol Perbarui daftar, sehingga tindakan berikutnya tidak menimpa hasil save dengan snapshot lama.
- Penyimpanan surat lamaran hanya memperbarui field surat, bukan seluruh profil.
- Kontras teks menu aktif diperbaiki setelah independent code review.

## Verifikasi selesai

| Pemeriksaan | Hasil |
|---|---|
| `npm test` | 63 lulus, 0 gagal |
| TypeScript dan build produksi | Lulus |
| Render overview kosong, draft, profil lengkap | Lulus |
| Guard logout, upload pending, pembatalan history | Lulus dalam harness EventTarget |
| Refresh gagal dan pemulihan | Lulus; snapshot lama dikunci |
| Token tombol, teks sekunder, menu aktif | Rasio pasangan yang diuji minimal 4.5:1 |
| SQL transaksi dengan posisi sama | Lulus: naik/turun, isi dan publikasi tetap, ID hilang ditolak, non-owner ditolak |
| Kebersihan data SQL QA | Rollback; tidak ada record `QA order` tersimpan |
| Halaman admin/tamu dengan sesi QA owner | 17 halaman HTTP 200, tanpa redirect tak terduga |
| Tautan internal dari halaman yang diperiksa | 28 tautan HTTP 200 |
| Data CMS | Urutan posisi/ID konsisten |
| API reorder | UUID tidak valid HTTP 400; ID hilang HTTP 409 |
| Surat terlalu besar | HTTP 413 tanpa mutasi |
| API admin tanpa sesi | HTTP 403 |
| Buku tamu dengan sesi owner | `canWrite=true` |

Sesi QA sementara dicabut setelah audit. Tidak ada perubahan password, publikasi data CMS, deployment, atau pesan uji publik. Migrasi fungsi pengurutan diterapkan ke proyek Supabase yang digunakan aplikasi.

## Batas QA

Browser runtime tidak tersedia: discovery mengembalikan daftar kosong. Pemeriksaan visual nyata pada mobile/tablet, drag/focus, interaksi setelah hydration, upload melalui browser, dialog Back/Forward pada browser sebenarnya, dan console browser belum terverifikasi. Tes CSS/token, render, event harness, HTTP, dan database tidak menggantikan pemeriksaan tersebut. Karena itu laporan ini tidak menyatakan aplikasi bebas seluruh bug.

Supabase security advisor tidak menemukan masalah izin baru pada RPC. Finding yang sudah ada: RLS `request_limits` tanpa policy (tabel ini hanya dipakai server) dan leaked-password protection belum aktif; konfigurasi tersebut tidak diubah pada redesign dashboard ini.

Preview produksi lokal: http://127.0.0.1:3100/admin

Rencana dan ledger: `docs/superpowers/plans/2026-10-12-admin-workflow.md`. Tes integrasi transaksi: `tests/integration/admin-order.sql`.
