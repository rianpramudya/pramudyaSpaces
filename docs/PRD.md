# PRD — PramudyaSpaces

Status: spesifikasi aktif yang merekam implementasi dan arah perbaikan, 23 Oktober 2026. Pemilik produk: Rian Pramudya Amanda. Dokumen ini tidak menjanjikan fitur atau integrasi yang belum diverifikasi.

## Tujuan dan pengguna

Website harus membantu pengunjung memahami identitas pemilik, menilai kualitas karya dan kontribusinya, lalu menghubungi pemilik. CMS harus membuat pemilik mudah memperbarui cerita, bukti, dan relasi konten tanpa mengubah kode.

| Pengguna | Pekerjaan utama | Hasil yang diharapkan |
|---|---|---|
| Recruiter/calon kolaborator | Menilai profil, kontribusi, hasil, CV | Informasi jelas dan dapat diperiksa |
| Pengunjung umum | Menjelajah karya, bermain, meninggalkan pesan | Navigasi mudah tanpa hambatan dekoratif |
| Pemilik | Mengisi, menghubungkan, preview, menerbitkan konten | Satu sumber data dengan kontrol visibilitas |

Identitas produk: studio personal fotografis dan sinematik; profesional, hangat, serta playful. Detail arah visual dimiliki [DESIGN](DESIGN.md), bukan ditentukan ulang di PRD.

## Scope aktif

| Area | Perilaku yang harus dipertahankan |
|---|---|
| Profil publik | CMS identity, hero fotografis, statistik, about formal, kontak sesuai izin |
| Karya | Galeri pilihan, archive `/projects`, detail `/projects/[id]`, sortir/filter yang tersedia |
| Konten pendukung | Layanan, pengalaman, skills, pendidikan/bahasa/pencapaian, sertifikat |
| Keterhubungan | Referensi proyek publik dari section pendukung; draft tidak bocor |
| Navigasi | Anchor asli, header ringkas, hamburger ringkas, navigasi bab; urutan sesuai halaman |
| Preferensi | ID/EN, light/dark, reduced motion dan pengaturan gerak yang tersedia |
| Interaksi | Guestbook, chatbot, ruang bermain, dock pengunjung |
| Kontak | Form nama/email/subjek/pesan langsung pada section; tersimpan ke Inbox |
| Admin | Owner email/password, CRUD/draft/publish/order, media, PDF, inbox, guestbook, terjemahan |
| Initial load | Loading berjenjang dengan fallback, skip, timeout, exit animation |

Implementasi UI ada tidak berarti integrasi eksternal berhasil. Status operasional harus dibuktikan terpisah di [TESTING](TESTING.md).

## Alur utama dan acceptance

### Pengunjung menjelajah

1. Buka `/`; konten awal diperoleh di server dan disaring untuk publik.
2. Loading menunggu kebutuhan viewport awal, lalu membuka halaman tanpa menunggu semua gambar di bawah fold. Skip/timeout tetap boleh membuka lebih awal.
3. Identitas dan CTA terbaca; statistik tepat di bawah hero, sebelum about.
4. Header/menu mengikuti urutan section aktual. Semua anchor mencapai tujuan tanpa tertutup header.
5. Pilih karya, baca detail kontribusi/proses/teknologi/hasil; kembali ke archive atau home tanpa kehilangan akses navigasi.

Acceptance: tidak ada tautan draft, gambar kosong karena path tidak valid, teks di balik dekorasi, overflow horizontal, atau tombol dock menutupi form. Empty state tetap dapat dibaca.

### Pemilik mengisi CMS

1. Login owner tanpa OAuth sosial.
2. Isi Profil/Proyek dahulu; konten pendukung dapat dihubungkan ke karya.
3. Simpan draft, periksa hasil, lalu terbitkan.
4. Perubahan visibility dan unpublish harus tercermin pada payload publik serta akses media.

Acceptance: simpan gagal tidak diklaim berhasil; simpan berhasil tetapi refresh gagal dijelaskan tanpa memaksa duplikasi input. Urutan berlaku pada data sumber, bukan hanya daftar hasil filter. Form berisiko kehilangan input harus memiliki perlindungan navigasi; cakupan legacy yang belum lengkap dicatat sebagai gap.

### Pesan dan bukti profesional

- Form kontak tervalidasi menyimpan pesan sekali, memberikan feedback, dan mempertahankan input saat gagal. Email hanya notifikasi tambahan.
- Guestbook dapat dibaca tanpa login; pengunjung menulis dengan provider aktif, owner melalui sesi sendiri. Hanya pesan tidak tersembunyi tampil publik.
- Chat menjawab dari fakta publik dan menyediakan jalur kontak saat provider gagal; tidak mengarang kualifikasi.
- CV/sertifikat/proyek tidak menyamarkan dummy sebagai bukti nyata. PDF yang diterbitkan sudah diperiksa dan sesuai visibility.

## Kualitas nonfungsional

- Target aksesibilitas WCAG 2.2 AA; klaim kepatuhan memerlukan audit, bukan sekadar token kontras.
- Layout mendukung 320px hingga desktop lebar, zoom dan teks panjang ID/EN. Motion tidak menjadi syarat memahami konten.
- Keamanan: otorisasi server, minimisasi data publik, validasi input, RLS dan bucket privat; detail di [SECURITY](SECURITY.md).
- Sasaran performa untuk evaluasi: LCP ≤2,5 detik, INP ≤200 ms, CLS ≤0,1 pada pengukuran lapangan persentil 75. Target mengikuti [Web Vitals](https://web.dev/articles/vitals), belum bukti capaian. Jika tidak ada data lapangan, laporkan pengukuran lab sebagai lab.
- Aset di bawah fold tidak dipaksa eager; animasi berhenti ketika tidak relevan/tersembunyi, menyediakan fallback perangkat sentuh dan reduced motion.

## Prioritas berikutnya

| Prioritas | Pekerjaan | Kriteria selesai |
|---|---|---|
| P1 | Operasional AI | Respons valid nyata, fallback teruji, tidak ada data privat pada request |
| P1 | OAuth guestbook | Provider/callback benar dan login→posting→logout diuji di staging |
| P2 | Media/rendering | Ukur bottleneck, perbaiki dengan privasi/unpublish tetap benar |
| P2 | QA visual lengkap | Desktop/tablet/mobile, keyboard, reduced motion, kedua bahasa/tema memiliki bukti |

Temuan berasal dari audit sebelumnya dan inspeksi kode, bukan pengujian ulang layanan live pada saat dokumen ini dibuat. Catatan lengkap: [riwayat QA](qa-studio-redesign-2026-10-22.md).

## Perbaikan yang sudah diterapkan setelah audit

Pada 23 Oktober 2026: URL bukti/paper proyek bertahan hingga detail publik dengan tes pipeline; guard input meliputi profil, entri, pengantar, terjemahan, balasan, surat/dokumen dan pengaturan akun; error internal disanitasi; loader mengikuti motion off. Verifikasi interaksi browser tetap diperlukan. OAuth belum aktif karena aplikasi GitHub/Google belum dibuat oleh pemilik; ini prasyarat eksternal, bukan alasan menghapus autentikasi.

## Di luar scope tanpa instruksi baru

Tidak menambahkan multi-tenant admin, pembayaran, jejaring sosial, chatbot bebas topik, CMS pengganti, atau konversi seluruh React menjadi class. Tidak ada publikasi data dummy tambahan, migrasi remote, atau deployment otomatis hanya karena dokumen telah dibuat.

## Definisi selesai

Acceptance tugas terpenuhi, data/fungsi existing terjaga, pemeriksaan yang relevan lulus, batas verifikasi dijelaskan, dan dokumen pemilik kontrak diperbarui. Tidak ada definisi “tanpa bug selamanya”. Setiap perubahan scope harus dapat ditelusuri ke permintaan pengguna dan file yang bertanggung jawab.
