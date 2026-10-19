# Penyempurnaan UI/UX — 11 Oktober 2026

Referensi: https://styfensagala.vercel.app. Arah visual halaman tamu mengikuti poster personal hitam-putih: Barlow tebal, nama besar, label interaktif, profil dengan foto, ruang visual untuk tiap karya, pendidikan, perjalanan, skills, sertifikat, serta status rail. Karakter bawah dipertahankan. Tidak menyalin aset ataupun isi referensi.

Palet: putih #FFFFFF, tinta #111111, bidang #F3F3F3, garis #E3E3E3, teks sekunder #626262. Admin mengikuti identitas tipografi dan kontras yang sama, dengan latar #F5F5F5 dan tombol utama hitam. Dark mode mempertahankan hierarki.

- Hero menampilkan headline lengkap, ringkasan, foto CMS, dan aksi CV/kontak. Arena cukup berisi headline serta dua kompetensi; konten skill lain tetap di bagian Skills.
- Semua proyek terbit memiliki preview atau sampul tipografi dari judul/teknologi asli, ringkasan dan jalur ke studi kasus. Gambar proyek tidak dipotong paksa.
- Pendidikan, bahasa, serta pencapaian terbit memiliki penyajian publik. Data draft tidak ikut dirender.
- Label navigasi dan judul bagian menggunakan sumber yang sama.
- Pengantar bagian tidak lagi ditumpuk di Profil. Pengantar masing-masing kategori dikelola pada halaman kategorinya; kontak tetap di Profil. Penyimpanan pengantar hanya memperbarui section_copy, bukan menimpa identitas.
- Sidebar admin dikelompokkan menjadi profil/perjalanan, karya/website, pesan, dan akun. Menu mobile dapat ditutup dengan tombol, backdrop, atau Escape.
- Dokumen dan terjemahan memakai detail yang bisa dibuka untuk mengurangi panjang halaman. Inbox/buku tamu memiliki pencarian; Inbox juga filter status.
- Password dapat ditampilkan/disembunyikan. Ikon aksi memiliki label aksesibel; checkbox tabel diberi area sentuh 44px. Modal mengunci scroll latar dan mengembalikan fokus.
- CSS dasar admin dipindahkan dari globals.css ke admin.css. Selector berulang pada tingkat yang sama dikonsolidasikan; stylesheet diformat supaya mudah ditinjau.
- Reduced motion, safe area, scroll offset, teks panjang, serta penataan header layar kecil diperhatikan.

Batas verifikasi: runtime browser melaporkan tidak ada browser tersedia. Karena itu screenshot, sentuhan, fokus, dan kesamaan visual dengan referensi belum diverifikasi langsung. Tes rendering, validasi, tipe, build, respons HTTP, dan perlindungan endpoint tetap diperiksa. Penilaian visual penuh membutuhkan browser yang terhubung.

## Pembaruan arah 12 Oktober 2026

Referensi tambahan: https://rianpramudya.github.io/pramudyaprofile/ dan dua screenshot pemilik. Website lama memiliki nuansa terminal, nama dominan, statistik, serta kartu identitas. Versi gabungan memakai hero poster, signature monospace dari data profil asli, jumlah konten terbit dari CMS, panel profil/foto, dan kartu bagian yang lebih terstruktur. Tiap section yang benar-benar dirender bergantian hitam dan putih melalui nth-of-type, sehingga urutan warna tetap bergantian meskipun kategori opsional kosong. Hero dipisahkan dari Tentang. Desain gabungan dikelola dalam hybrid.css; karakter bawah tetap dipertahankan.
