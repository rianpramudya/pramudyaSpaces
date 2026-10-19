# Galeri dan layout editorial — QA

Halaman tamu menggunakan bentuk informasi berbeda: panggung proyek dengan pemilih thumbnail, kelompok skills berupa baris, timeline pengalaman terbuka, daftar layanan, arsip sertifikat, dan kontak tanpa panel pembungkus. Bingkai foto tetap menjadi highlight. Hitam/putih bergantian dipertahankan; dark mode memakai token lokal yang sesuai.

Galeri menampilkan satu proyek dalam panggung gambar besar dan ringkasan, dengan maksimal lima thumbnail pilihan dari proyek terbit, unggulan lebih dahulu. Tombol, keyboard dari thumbnail yang difokuskan, dan swipe horizontal mengganti pilihan; scroll vertikal dan pinch tidak mengganti proyek. Tidak ada autoplay. Semua gambar memakai contain. Layanan, kontribusi pengalaman, dan rincian sertifikat memakai native details agar informasi lengkap tersedia tanpa memenuhi tampilan awal.

Tombol Lihat semua proyek menuju `/projects`. Arsip menampilkan seluruh proyek terbit, pencarian judul/deskripsi/teknologi, filter teknologi, urutan terbaru/terlama/judul, hasil kosong, dan tautan detail. Metadata membaca nama publik CMS. Navigasi arsip menuju anchor beranda; detail proyek kembali ke arsip.

Tanggal proyek opsional tersedia pada form Proyek admin. Sort kronologis memakai `data.date`, menerima tanggal ISO/tahun/bulan yang valid, menolak tanggal mustahil, dan tidak menggunakan updated_at sebagai umur proyek. Proyek tanpa tanggal berada di akhir, diurutkan menurut posisi CMS kemudian ID. Lima proyek existing belum memiliki tanggal; tidak ada tanggal yang dikarang atau data CMS yang diubah.

Verifikasi: 70 tes lulus; TypeScript/build produksi berhasil. HTTP beranda dan arsip 200, lima detail proyek 200 dan memiliki tautan kembali ke arsip; 18 anchor beranda mempunyai target; asset CSS 200. Tes meliputi filter gabungan, draft/non-project exclusion, tanggal tidak valid/leap year, urutan kronologis, kondisi kosong, gallery/archive rendering, kontras palet archive, dan navigasi detail.

Independent review menemukan potensi crop gambar dan metadata nama hardcoded; keduanya diperbaiki. Browser runtime tidak tersedia, sehingga gesture, focus, screenshot lintas breakpoint, computed layout, dan console browser belum diverifikasi langsung. Native controls dan logika sorting diuji pada tingkat render/unit/HTTP; ini tidak menjamin ketiadaan seluruh bug visual.

Preview: http://127.0.0.1:3100/ dan http://127.0.0.1:3100/projects.

## Revisi kedua

Review independen menemukan tracking multitouch dan navigasi keyboard memakai selected index ketika fokus berbeda. Keduanya diperbaiki. Build produksi dan TypeScript berhasil. HTTP preview terbaru memverifikasi panggung, lima thumbnail, satu pilihan aktif, progressive disclosure, arsip, CSS, dan tautan detail proyek. Cover CMS masih ilustrasi dummy dari pengisian preview sebelumnya; revisi UI tidak mengubah konten atau menerbitkan deployment. Preview produksi di port 3100 diperbarui. Browser tetap tidak tersedia; QA visual dan gesture langsung belum dapat diklaim.
