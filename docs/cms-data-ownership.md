# Sumber pengisian data CMS

- Identitas, ringkasan, kontak, foto, dan tautan profesional diisi di Profil. Website, chatbot, dan CV memakai sumber yang sama.
- Email kontak publik berbeda tujuan dari email login. Email login hanya di Pengaturan akun; visibilitas email kontak di Profil.
- Pengalaman memakai satu jabatan utama di Judul. Detail jabatan lama yang berbeda tetap tersedia; nilai role yang sama dengan judul dihapus saat penyimpanan.
- Teknologi proyek bisa dipilih dari Skills tersimpan tanpa mengetik ulang. Teknologi proyek menunjukkan penggunaan pada proyek tersebut; Skills adalah daftar kompetensi umum. Pilihan teknologi merupakan snapshot nama, sehingga perubahan nama Skills tidak mengganti proyek lama otomatis.
- Media diunggah sekali, lalu dipilih kembali dari form foto, konten, dan dokumen. Pilihan tidak membuat salinan berkas baru; path yang sama tidak ditambahkan dua kali.
- CV dibuat dari CMS tanpa form identitas/pengalaman kedua. Surat lamaran hanya mengisi penerima, posisi tujuan, dan isi surat di Dokumen.
- Deskripsi proyek adalah ringkasan. Konteks dan hasil merupakan detail studi kasus opsional, bukan pengulangan ringkasan.
- Teks bagian website adalah judul/deskripsi editorial opsional, terpisah dari data profil pribadi.
- Terjemahan otomatis dan koreksinya memakai sumber CMS, bukan form duplikat untuk menulis ulang versi Indonesia.

Tidak ada migrasi atau penghapusan data tersimpan pada pembaruan UI ini. Nilai legacy berbeda tetap dipertahankan. Verifikasi screenshot dan interaksi browser belum dapat dilakukan karena browser pengujian tidak tersedia.

## Publikasi beberapa item

Di setiap daftar kategori konten dan Dokumen & CV, centang item atau gunakan checkbox kepala tabel untuk memilih semua hasil yang ditampilkan. Klik Terbitkan pilihan atau Jadikan draft. Perubahan pencarian, filter, dan kategori membersihkan pilihan untuk menghindari perubahan item tersembunyi. Media, inbox, terjemahan, dan pengaturan akun tidak memiliki status terbit/draft. Profil tunggal tetap memakai kontrol Terbitkan profil. API membatasi maksimal 500 ID per permintaan dan memeriksa pemilik; pembaruan hanya menyentuh status publikasi (serta waktu perubahan pada konten).
