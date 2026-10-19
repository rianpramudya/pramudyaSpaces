# Isian website penuh — 12 Oktober 2026

Pengguna menyetujui pengisian CMS dan penerbitan seluruh konten CV/dummy, termasuk email, telepon, dan CV. Isian diterapkan ke proyek Supabase aplikasi, bukan hanya HTML lokal.

## Isi yang tampil

| Bagian | Jumlah | Sumber |
|---|---:|---|
| Proyek | 5 | CV |
| Pengalaman | 2 | CV |
| Pendidikan | 1 | CV |
| Skills | 25 | CV |
| Sertifikat/pelatihan | 3 | CV |
| Bahasa | 2 | Isian existing, komunikasi pengguna, hasil tes pada CV |
| Layanan | 3 | Contoh berlabel dummy |
| Pencapaian | 2 | Contoh berlabel dummy |

Profil, ringkasan, kontak, pengantar section, foto, dan tautan profesional terisi. Bandung serta status profesional existing dipertahankan. Email/telepon terlihat sesuai persetujuan. Tidak ada tingkat CEFR atau klaim telah lulus sertifikasi AI-900 yang dibuat tanpa dasar.

Sebelas ilustrasi konsep ditambahkan sebagai media CMS: lima proyek, tiga sertifikat, tiga layanan. Setiap ilustrasi menampilkan label dummy dan bukan screenshot produk atau salinan sertifikat resmi.

CV ATS dan CV Kreatif baru diterbitkan; ATS menjadi CV unggulan. Kedua PDF hanya menggunakan record faktual dan mengecualikan layanan/pencapaian dummy serta isian percobaan lama. Contoh surat lamaran dummy tersedia di Dokumen admin sebagai dokumen privat. Dokumen lama dipertahankan.

Dua pesan buku tamu dummy (satu dengan contoh balasan) dan tiga pesan Inbox dummy (baru/dibaca/arsip) ditambahkan. Tidak ada email yang dikirim. Lima puluh delapan override bahasa Inggris tersimpan sesuai fingerprint sumber. Isian percobaan `ghnghn` dan `mnjhmhjmm` dipertahankan sebagai draft, bukan dihapus.

## Verifikasi

- Delapan jenis record CMS mempunyai konten publik; total 43 record publik dan dua draft percobaan lama.
- Sembilan section tamu terdapat dalam HTML; label dummy terlihat.
- Lima belas media/PDF publik merespons HTTP 200; PDF memiliki signature `%PDF-`.
- Lima halaman detail proyek merespons HTTP 200 dan memuat judul CMS yang sesuai.
- Buku tamu publik menampilkan dua pesan dummy; Inbox memiliki tiga pesan contoh.
- CV unggulan menunjuk ke dokumen publik; CV ATS/Kreatif baru diterbitkan.
- API terjemahan menyajikan override terkini dengan `fallback=false`.
- TypeScript lulus. Suite yang terakhir dijalankan: 63 tes lulus.

Backup data sebelum pengisian berada di `.local-backups/portfolio-before-full-preview-1791782243868.json`. Manifest record/media/dokumen contoh berada di `.local-backups/full-preview-manifest.json`; berkas ini diabaikan version control dan dibatasi akses lokal. Seeder: `scripts/fill-portfolio-preview.ts`; default dry run, mutasi memerlukan `--apply`.

Browser otomatis tidak tersedia, sehingga hasil ini memverifikasi data, HTML, tautan, dan media melalui HTTP, bukan pemeriksaan visual langsung pada perangkat.
