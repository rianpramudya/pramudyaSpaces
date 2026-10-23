# Arah desain dan pengalaman

Keputusan aktif, 23 Oktober 2026. Identitas PramudyaSpaces: studio personal fotografis yang mempertemukan desain, software engineering, dan eksplorasi AI. Referensi Lumora/Laocoön menjadi inspirasi komposisi/material, bukan identitas atau konten yang disalin.

## Bahasa visual

Hero menjadi titik masuk ekspresif: foto arch, judul editorial, pencahayaan tembaga/biru dingin yang tenang, ruang negatif terukur, CTA jelas. Section berikutnya menjaga material dan ritme yang sama tetapi tidak mengulang hero besar berkali-kali.

Utamakan informasi yang ingin dinilai pengunjung: siapa pemilik, apa yang dikerjakan, kontribusi dan buktinya, kemudian cara berkolaborasi. Foto/depth mendukung konteks tersebut; dekorasi tidak boleh melintas di belakang paragraf hingga mengganggu keterbacaan.

Konsep lama sage, inisial RP 3D besar, kartu bersarang di setiap section, dan menu layar penuh bukan default desain aktif. Perubahan arah membutuhkan instruksi pengguna baru, bukan interpretasi agent dari screenshot lama.

## Urutan dan karakter section

| Urutan | Komponen | Cara penyajian |
|---|---|---|
| 1 | Hero `#home` | Foto arch besar dalam bingkai, identity/role, CTA dan glimpse karya |
| 2 | Statistik | Strip “Bukti lewat karya”, dihitung dari koleksi terbit; tepat sebelum about |
| 3 | About `#about` | Foto formal, biografi, kontak profesional/CV sesuai visibility |
| 4 | Projects `#projects` | Galeri karya pilihan dan cerita; link archive/detail |
| 5 | Services `#services` | Kemungkinan kolaborasi dan karya yang mendukung |
| 6 | Experience `#journey` | Perjalanan, peran, tanggung jawab, bukti terkait |
| 7 | Skills `#skills` | Kelompok keahlian/workspace dan penerapan pada proyek |
| 8 | Background `#background` | Pendidikan, bahasa, pencapaian yang dapat dibaca bertahap |
| 9 | Certificates `#certificates` | Kredensial, issuer/tanggal dan detail/preview yang jelas |
| 10 | Playground `#playground` | Istirahat interaktif; tidak wajib dimainkan untuk melanjutkan |
| 11 | Contact `#contact` | Form inline seimbang dengan copy dan kontak langsung |
| 12 | Footer | Penutup fotografis selaras hero, navigasi dan tautan profesional |

Statistik tidak memiliki anchor menu sendiri saat ini. Section opsional hanya muncul ketika mempunyai konten publik. Menu mengikuti urutan anchor di atas, bukan menambahkan ulang section di akhir. Header utama menampilkan Beranda → Tentang → Proyek → Layanan → Kontak; hamburger dan navigasi bab memakai daftar lengkap yang tersedia dari `Portfolio`.

## Hero dan fotografi

- Foto utama hitam-putih; sapuan berwarna memakai pasangan foto dengan posisi/komposisi identik. Foto formal about tetap aset profil yang terpisah.
- Arch, mask bawah, dan pencahayaan menyatukan foto dengan lingkungan. Jangan menambah border kotak pada foto atau mengubah wajah dengan treatment generatif tanpa instruksi.
- Tepi foto berada dalam garis hero dengan gutter bersama. Pergeseran vertikal saat scroll boleh; pembesaran wadah yang melewati garis tidak boleh.
- Role/headline dan CTA tetap paling mudah dibaca. Foto tidak boleh mengalahkan pesan atau menutupi CTA saat breakpoint berubah.
- Hero dipertahankan ketika merapikan section bawah; hindari redesign ulang tanpa kebutuhan.

## Karya, konten dan bukti

Galeri harus menonjolkan karya yang dipilih, menyediakan navigasi yang jelas dan menuju detail. Halaman `/projects` adalah daftar lengkap dengan kontrol yang tersedia; `/projects/[id]` menjelaskan konteks, peran, proses, teknologi, hasil, tautan dan bukti.

Jangan mencetak paragraf CV panjang sebagai satu blok di setiap kartu. Gunakan hierarki judul/ringkasan, metadata, lalu rincian bertahap tanpa menghapus konten. Tautan dari skills/layanan/pengalaman harus menuju proyek yang relevan, bukan dekorasi.

Dummy harus tetap terlihat sebagai contoh dan bukan klaim prestasi. Jangan menggunakan ilustrasi konsep seolah screenshot produk asli atau menambahkan metrik yang belum dibuktikan. Jika bukti tidak ada, jelaskan kekurangannya.

## Header, dock, contact dan admin

Header berupa floating bar ringkas dengan identitas, main links, jam, bahasa/tema, dan menu. Popover hamburger tidak memenuhi layar; pada layar pendek ia boleh scroll di dalam batas viewport. State aktif, Escape, klik luar, keyboard dan focus harus konsisten.

Dock hanya berisi aksi langsung Buku tamu/Tanya Rian. Tombol dan popover Studio beserta animasi chibi dock dihapus pada 24 Oktober 2026; game runner tetap berada di section Ruang bermain dan kontrol suara ada di game. di mobile tidak boleh hilang atau pecah menjadi tombol bertumpuk. Dock tidak boleh menutup submit form, detail penting, atau area bermain. Drawer/panel harus menyediakan close yang terlihat.

Kontak adalah form langsung, bukan CTA yang memaksa pengunjung membuka form tersembunyi. Desktop dapat dua kolom; ukuran heading dan panjang copy harus seimbang dengan tinggi form. Mobile menyusun vertikal dengan urutan baca yang jelas. Tidak ada klaim keamanan teknis/dekoratif seperti “AES-256” tanpa dasar implementasi.

Admin berbagi material, tipografi dan tema public dengan dekorasi lebih sedikit. Prioritaskan label yang jelas, peta sumber section, preview, draft/publish, relasi proyek dan feedback simpan. Jangan memberi animasi yang menunda pengisian atau menyembunyikan state belum tersimpan.

## Sistem gerak

| Situasi | Perilaku |
|---|---|
| Initial loading | Menunggu aset viewport/data awal; skip, error fallback dan timeout tetap tersedia |
| Exit loading | Fade dan geser layar ke atas 600ms; halaman inert sampai selesai; fallback pelepasan 700ms |
| Reduced motion | Indikator loading statis, keluar langsung, tidak ada choreography yang wajib ditunggu |
| Scroll section | Native scroll dengan parallax/reveal terukur; tanpa pemaksaan scroll atau pin panjang |
| Foto | Reveal pointer pada perangkat eligible; foto statis pada touch/perangkat terbatas |
| Tema | Transisi tema existing, fallback browser yang tidak mendukung tetap fungsional |
| Menu/control | Gerak pendek menunjukkan state, bukan pertunjukan terpisah |

Parameter environment ada di `src/lib/cinematic-scene.ts`: batas 800.000 piksel per surface, DPR maksimum 1,5, serta quality gate. Batas ini mengendalikan biaya render, bukan bukti 60fps. Stop/pause render saat tersembunyi atau tidak diperlukan.

## Cara mengevaluasi revisi

Mulai dari screenshot/perilaku nyata, sebutkan masalah spesifik, ubah komponen yang bertanggung jawab, lalu bandingkan pada viewport/bahasa/tema yang sama. Jangan menyebut “premium” sebagai bukti. Periksa hierarki, wrap, alignment, kontras, fokus, area sentuh dan keterbacaan saat animasi bergerak.

Token/ukuran komponen dimiliki [DESIGN_SYSTEM](DESIGN_SYSTEM.md). Cara membuktikan hasil dan mencatat batasnya dimiliki [TESTING](TESTING.md). Desain dianggap membaik ketika tugas pengguna lebih jelas dan tidak ada regresi fungsi, bukan karena efek bertambah.
