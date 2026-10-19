# PRD — Website Profil Personal dengan CMS

- **Status:** Done — PRD final; keputusan implementasi terbuka dicatat untuk tahap berikutnya
- **Tanggal:** 11 Oktober 2026
- **Pemilik produk:** [Nama pemilik profil]
- **Keputusan awal:** Next.js, Supabase, Vercel; kandidat awal chatbot: Gemini API Free

## 1. Ringkasan Produk dan Tujuan

### Ringkasan
 - Alur terjemahan Bahasa Inggris: apakah dibuat saat konten disimpan atau diminta pengunjung, dan apakah hasil yang belum ditinjau admin boleh langsung tampil. Chatbot hanya boleh memakai terjemahan yang tersedia untuk publik.
 - Aturan publikasi perlu diperjelas untuk tiap jenis informasi/konten (profil, kontak, pengalaman, proyek, CV, sertifikat, terjemahan) agar informasi privat tidak tampil di website atau masuk ke konteks chatbot.

Website profil personal dan portofolio untuk membangun personal branding serta mendukung pencarian kerja di industri teknologi. Website memiliki halaman publik untuk recruiter dan pengunjung, serta CMS admin agar pemilik dapat memperbarui konten tanpa mengubah kode.
 - Pemetaan setiap bagian/field CV contoh ke input CMS, batas kecocokan format PDF, dan perilaku jika data yang dibutuhkan belum diisi admin.
 - Alur form kontak: field yang diminta, konfirmasi pengiriman kepada pengunjung, serta tindakan admin yang tersedia untuk pesan Inbox.
 - Tampilan balasan pemilik di guestbook dan apakah satu pesan dapat memiliki lebih dari satu balasan admin.
 - Cara provisioning/login akun admin tunggal dan batas penggunaan chatbot per sesi/hari; keputusan penyimpanan transkrip (usulan awal: tidak disimpan) harus dipastikan sebelum chatbot diluncurkan.

### Tujuan produk

 Keputusan terbuka yang memengaruhi privasi, autentikasi, batas chatbot, terjemahan, dan pemetaan CV harus diselesaikan sebelum fitur terkait diimplementasikan. Target posisi, analytics, dan detail visual dapat diselesaikan pada tahap desain/validasi berikutnya.

- Menampilkan nama, foto, dan deskripsi profesional secara menonjol agar pengunjung cepat memahami identitas pemilik profil.
- Menyajikan pengalaman organisasi, sertifikat, tech stack/knowledge, serta karya dan informasi relevan lainnya sebagai bukti kompetensi.
- Membuat pengalaman menjelajah terasa playful dan interaktif, terinspirasi oleh referensi yang diberikan tanpa menyalin desainnya.
- Memudahkan recruiter menghubungi pemilik profil melalui form kontak dan chatbot AI yang menjawab pertanyaan sederhana berdasarkan konten profil yang dipublikasikan.
- Memungkinkan pemilik mengelola konten website melalui CMS admin.

### Prinsip desain

- Informasi penting untuk recruiter tetap mudah ditemukan dan dibaca; interaksi playful tidak boleh menghalangi akses ke profil, bukti kompetensi, CV/kontak, atau navigasi utama.
- Konten chatbot dibatasi pada informasi profil yang sudah dipublikasikan. Jika jawaban tidak tersedia, chatbot harus menyatakan keterbatasannya dan mengarahkan pengunjung ke kontak.
- CMS harus cukup sederhana untuk memperbarui konten profil tanpa bantuan developer.

## 2. Pengguna, Kebutuhan, dan Ukuran Keberhasilan

### Pengguna

1. **Recruiter dan hiring manager di industri teknologi (pengguna utama):** ingin memahami identitas profesional, kompetensi, pengalaman, dan karya pemilik profil dengan cepat; lalu membuka CV atau menghubungi pemilik. Posisi spesifik yang ditargetkan belum ditentukan, sehingga konten awal dirancang untuk pencarian kerja di industri teknologi secara umum.
2. **Pengunjung lain, termasuk rekan profesional:** ingin menjelajahi profil dengan pengalaman yang menarik, melihat karya, dan dapat meninggalkan pesan melalui guestbook.
3. **Pemilik profil (admin):** ingin memperbarui isi website melalui dashboard CMS, termasuk tech stack/knowledge, tanpa mengubah kode.

### Kebutuhan utama

- Recruiter dapat menemukan ringkasan profil, bukti kompetensi, CV, dan cara menghubungi pemilik tanpa harus menyelesaikan permainan atau interaksi tertentu.
- Pengunjung dapat menjelajahi konten dan berinteraksi melalui guestbook atau chatbot.
- Admin dapat memperbarui informasi secara mandiri dan melihat/memoderasi pesan guestbook.

### Ukuran keberhasilan — usulan awal

- Recruiter dapat memahami identitas dan kompetensi utama serta menemukan CV/kontak melalui navigasi yang jelas.
- Website menghasilkan interaksi yang relevan: klik CV/tautan karya, kiriman form kontak, dan penggunaan chatbot untuk pertanyaan seputar profil.
- Pemilik dapat mengubah dan menerbitkan konten profil, pengalaman organisasi, sertifikat, serta tech stack dari CMS tanpa perubahan kode.

Target angka untuk metrik penggunaan belum ditetapkan. Posisi kerja spesifik dan kebutuhan analytics akan dikonfirmasi sebelum metrik kuantitatif ditentukan.

## 3. Ruang Lingkup dan Persyaratan Fungsional

### 3.1 Halaman Tamu

- Website publik mendukung Bahasa Indonesia dan Bahasa Inggris; pengunjung dapat mengganti bahasa melalui kontrol bahasa yang mudah ditemukan.
- Admin cukup memasukkan konten secara manual dalam Bahasa Indonesia; saat pengunjung memilih Bahasa Inggris, sistem otomatis menerjemahkan konten tersebut ke Bahasa Inggris. Terjemahan tidak boleh mengharuskan admin menulis ulang seluruh konten dalam bahasa kedua.
- Admin dapat meninjau dan mengoreksi hasil terjemahan otomatis, terutama istilah profesional, nama proyek, dan pengalaman. Koreksi disimpan dan digunakan kembali agar terjemahan konsisten.
- Pengunjung dapat mengganti tampilan antara mode terang dan gelap. Pilihan tema disimpan agar tetap berlaku saat berpindah halaman atau kembali berkunjung.
- Nama, foto, ringkasan profesional, pengalaman organisasi/kerja, sertifikat, Skills/Tech Stack, proyek, status profesional, CV/tautan unduh yang ditandai publik, tautan sosial, dan form kontak ditampilkan sebagai bagian profil publik sesuai konten yang dipublikasikan admin.
- Hero menampilkan label peran/tech stack yang dapat dipindahkan di atas nama besar. Setiap balok yang digerakkan memberi efek suara jika pengunjung mengaktifkan suara.
- Dua maskot arcade orisinal mondar-mandir di lintasan bawah hero; satu maskot bergantian menyapa singkat setiap 10 detik. Maskot dapat ditangkap dengan klik/tap, disertai efek suara berbeda bila suara aktif.
- Suara tidak autoplay; kontrol suara dan gerak terpisah, dan gerak menghormati `prefers-reduced-motion`. Detail visual dan pola responsif mengikuti [dokumen desain](design-website-profile.md).

### 3.2 Guestbook Interaktif

- Tombol Buku Tamu pada halaman publik membuka panel dari sisi kanan di atas halaman yang diredupkan atau diburamkan, mengikuti referensi visual yang diberikan; guestbook bukan halaman terpisah.
- Panel menampilkan pesan yang dikirim oleh pengguna terautentikasi tanpa menunggu persetujuan admin, beserta identitas publik pengirim dari akun sosial, waktu kirim, dan balasan pemilik bila tersedia.
- Pengunjung harus masuk dengan GitHub atau Google untuk mengirim pesan. Semua pengunjung dapat membaca pesan yang masih tampil tanpa harus masuk.
- Pengirim dapat membuat pesan teks singkat. Balasan hanya dapat dibuat oleh pemilik/admin; balasan bertingkat antar-pengunjung tidak termasuk cakupan awal.
- Pesan tampil di guestbook setelah berhasil dikirim tanpa moderasi/persetujuan awal. Admin/pemilik website dapat menghapus pesan yang dikirim pengguna non-admin melalui dashboard, serta menambahkan atau mengubah balasan pemilik.
- Panel dapat ditutup melalui tombol tutup, tombol Escape, atau tindakan tutup yang mudah ditemukan. Pada layar ponsel, panel menggunakan tampilan penuh atau pola responsif yang setara.
- Sistem harus membatasi spam dan penyalahgunaan, memvalidasi panjang/jenis pesan, serta memberi umpan balik yang jelas untuk status kirim, moderasi, dan kegagalan.
- Jumlah pesan yang ditampilkan dan label status online/live merupakan elemen antarmuka opsional; makna status live dan perilaku real-time perlu ditetapkan saat desain teknis bila fitur tersebut dipertahankan.

### 3.3 Chatbot AI untuk Recruiter

- Chatbot ditujukan terutama untuk recruiter yang ingin bertanya secara sederhana tentang profil, pengalaman, organisasi, proyek, sertifikat, Skills/Tech Stack, status profesional, CV, dan cara menghubungi pemilik.
- Chatbot tersedia melalui tombol/widget yang mudah ditemukan pada halaman publik dan membuka antarmuka percakapan tanpa menghalangi konten utama.
- Jawaban harus berdasarkan informasi profil yang telah dipublikasikan dan dikelola melalui CMS. Chatbot tidak boleh mengarang kualifikasi atau menggunakan konten draft/privat. Jika sumber tidak memuat jawaban, chatbot menyatakan belum memiliki informasi tersebut dan menawarkan tautan kontak atau bagian terkait.
- Chatbot menjawab dalam bahasa yang sedang dipilih pengunjung (Bahasa Indonesia atau Bahasa Inggris) dan tetap menjaga nama diri, organisasi, teknologi, serta merek.
- Kandidat provider/model awal adalah **Gemini API Free — Gemini 3.8 Flash**, sesuai perkiraan awal trafik rendah (sekitar maksimal dua pengunjung per hari). Kuota, batas layanan, dan syarat penggunaan dapat berubah; saat kuota tercapai atau layanan gagal, antarmuka menampilkan pesan yang jelas dan tautan kontak.
- Permintaan AI dilakukan dari sisi server Next.js; API key tidak boleh dikirim ke browser. Hanya konten profil publik yang diperlukan yang boleh disertakan ke provider AI.
- Antarmuka menjelaskan bahwa jawaban dibuat AI dan mengimbau pengguna untuk tidak memasukkan informasi sensitif. Karena penggunaan free tier Gemini dapat melibatkan penggunaan prompt dan jawaban untuk peningkatan layanan serta peninjauan manusia, chatbot hanya boleh menerima pertanyaan terkait informasi profil publik.
- Batas panjang pesan/jawaban dan rate limit perlu diterapkan untuk mengurangi spam, biaya tak terduga, dan penyalahgunaan.

**Keputusan terbuka untuk chatbot:** durasi penyimpanan percakapan (default yang diusulkan: tidak menyimpan transkrip), jumlah pesan per sesi, dan batas penggunaan perlu ditetapkan sebelum implementasi.

### 3.4 CMS Admin

Dashboard admin menjadi CMS untuk mengelola konten website dan aktivitas masuk, tanpa perlu mengubah kode. Mengacu pada kebutuhan dan referensi dashboard, admin dapat:

- Melihat ringkasan dashboard seperti jumlah proyek, pengalaman, pesan masuk, dan status website.
- Mengelola profil: nama lengkap, headline/jabatan, professional summary, foto profil, nomor telepon, email, dan tautan sosial/portofolio. Foto profil diunggah melalui dashboard dan ditampilkan pada halaman publik sesuai status publikasi profil. Admin dapat memilih detail kontak yang dipublikasikan.
- Mengelola proyek/portofolio: membuat, mengubah, menghapus, mengurutkan, dan mengatur status publikasi proyek; mengunggah gambar sampul/preview serta, bila diperlukan, beberapa gambar pendukung yang ditampilkan pada detail proyek publik.
- Mengelola pengalaman kerja/organisasi dan layanan (services) yang ingin ditampilkan; gambar pendukung seperti dokumentasi kegiatan atau logo organisasi bersifat opsional dan konten tetap dapat diterbitkan tanpa gambar.
- Mengelola Skills/Tech Stack: menambah, mengubah, menghapus, mengelompokkan, dan mengurutkan teknologi atau kompetensi secara manual.
- Mengelola sertifikat: admin dapat mengunggah gambar sertifikat (misalnya JPEG/JPG, PNG, atau WebP) serta mengisi judul, penerbit, tanggal, deskripsi, dan tautan verifikasi bila tersedia. Gambar dapat dipratinjau di dashboard dan ditampilkan pada bagian Sertifikat di website sesuai status publikasinya.
- Mengunggah dan mengelola media visual untuk konten website dari form konten terkait, termasuk foto profil, preview/galeri proyek, gambar sertifikat, dan gambar pendukung pengalaman/organisasi bila digunakan. Gambar yang terhubung ke konten published ditampilkan pada halaman publik; gambar pada konten draft tetap privat.
- Mengunggah/mengganti CV dan, bila diperlukan, surat lamaran; mengatur tautan unduh pada halaman publik.
- Mengatur status profesional yang ditampilkan pada website, misalnya **Open to Work** atau **Sedang Bekerja**. Status yang tampil harus jelas dan tidak saling bertentangan; admin juga dapat menyembunyikannya.
- Membuat dokumen karier menggunakan template format yang diisi dari informasi yang telah dimasukkan admin di CMS: CV berformat ATS-friendly, CV kreatif, dan surat lamaran. Fitur ini menyusun dan memformat data yang tersedia; fitur tidak menggunakan AI untuk menulis ulang atau menambahkan informasi.
- CMS menyediakan input terstruktur bagi admin untuk mengisi dan mengelola seluruh informasi serta setiap bagian yang ditampilkan pada CV contoh `docs/CV_ATS_rian_pramudya_amanda-2.pdf`; tidak ada bagian CV yang hanya dapat diubah dengan mengedit kode atau PDF secara manual.
- CV ATS dihasilkan sebagai PDF dengan isi dan struktur mengikuti CV contoh tersebut, menggunakan seluruh data terkait yang sudah dimasukkan admin ke dashboard.
- Meninjau dan mengunduh dokumen hasil generasi. Jika informasi sumber perlu diubah, admin memperbaruinya di CMS lalu menghasilkan dokumen kembali. Dokumen hasil generasi tidak tersedia untuk publik kecuali admin secara eksplisit menerbitkannya.
- Melihat dan mengelola pesan yang dikirim melalui form kontak (Inbox).
- Mengelola guestbook dari dashboard: menghapus pesan yang dikirim pengguna non-admin dan menambahkan/mengubah balasan pemilik. Pesan tidak memerlukan persetujuan admin sebelum ditampilkan.
- Memperbarui konten profil yang menjadi sumber jawaban chatbot; perubahan hanya memakai konten yang dipublikasikan.
- Mengelola konten Bahasa Indonesia sebagai sumber utama. Sistem otomatis menyediakan terjemahan Bahasa Inggris untuk konten tersebut; admin dapat meninjau, mengoreksi, dan menyimpan override terjemahan per konten.
- Membuka/meninjau website publik dari dashboard.

Konten publik yang dikelola admin perlu mendukung status draft/published bila sesuai dengan jenis konten. Hak admin hanya untuk pemilik yang terautentikasi; pengunjung tidak memiliki akses ke CMS.

**Keputusan terbuka untuk fitur dokumen:** format ekspor untuk CV kreatif dan surat lamaran, serta jenis dokumen yang boleh diterbitkan untuk unduhan publik perlu ditentukan sebelum desain teknis. Usulan aman: dokumen hasil generasi bersifat privat sampai admin secara eksplisit menerbitkannya. CV ATS wajib dihasilkan sebagai PDF. Isi dokumen bersumber dari data CMS dan format ditentukan oleh template; penulisan atau penyesuaian isi dengan AI tidak termasuk cakupan.

**Keputusan terbuka untuk bahasa:** provider/mekanisme terjemahan dan perilaku saat layanan penerjemahan gagal atau terjemahan belum tersedia perlu ditentukan. Otomatisasi terjemahan saat pengunjung mengganti bahasa merupakan kebutuhan produk. Nama diri, nama organisasi, nama teknologi, dan merek harus dipertahankan kecuali admin secara manual mengoreksinya.

## 4. Persyaratan Teknis dan Kualitas

### Stack dan layanan utama

- **Next.js** digunakan untuk halaman publik, dashboard admin, dan endpoint server-side yang diperlukan.
- Website dideploy ke **Vercel**.
- **Supabase** digunakan untuk PostgreSQL, autentikasi, dan penyimpanan berkas seperti foto profil, media proyek, sertifikat, serta dokumen karier.
- **Gemini API Free** merupakan kandidat awal provider chatbot. Kunci API disimpan sebagai konfigurasi rahasia server dan tidak pernah dikirim ke client.

### Keamanan dan privasi

- Dashboard admin hanya dapat diakses pemilik yang terautentikasi; perubahan hak akses atau konten privat tidak dapat dilakukan oleh pengguna publik.
- Kebijakan akses Supabase (Row Level Security) harus membatasi data dan operasi berdasarkan peran. Berkas privat, jika ada, tidak boleh dapat diakses publik melalui URL terbuka.
- Validasi input dilakukan di sisi server untuk form kontak, guestbook, autentikasi, dan CMS. Endpoint publik harus memiliki perlindungan spam/rate limit yang sesuai.
- Hanya konten yang ditandai publik yang dapat dirender pada halaman tamu atau dikirim sebagai konteks chatbot.
- Penggunaan layanan AI dan terjemahan harus mengikuti kebijakan data provider yang dipilih. Data privat atau informasi yang tidak diperlukan tidak dikirim ke provider.

### Kualitas pengalaman

- Halaman publik dan admin harus responsif pada ponsel, tablet, dan desktop.
- Navigasi, form, panel guestbook, chatbot, pemilih bahasa, dan tema harus dapat digunakan dengan keyboard serta memiliki label yang jelas.
- Konten profil utama, karya, CV, dan kontak harus tetap dapat ditemukan tanpa menjalankan interaksi playful.
- Halaman publik harus mendukung metadata dan struktur konten yang ramah mesin pencari; tema gelap/terang dan pilihan bahasa harus konsisten antarhalaman.
- Kegagalan layanan eksternal (AI, OAuth, pengiriman form, atau penerjemahan) harus menampilkan pesan yang dapat dimengerti dan menyediakan jalur alternatif bila memungkinkan.

### Operasional dan batasan

- Pengelolaan konten harian harus dapat dilakukan dari CMS tanpa perubahan kode atau deployment ulang.
- Perubahan konten tersimpan di Supabase; perubahan kode dan konfigurasi aplikasi tetap memerlukan deployment melalui Vercel.
- Batas penggunaan, kuota, dan ketersediaan paket gratis Vercel, Supabase, dan Gemini perlu diverifikasi saat implementasi dan dipantau setelah peluncuran karena dapat berubah.
- Provider pengiriman email untuk notifikasi form kontak, provider penerjemahan otomatis, dan format/aksesibilitas unduhan selain PDF CV ATS masih perlu diputuskan.

## 5. Kriteria Penerimaan, Risiko, Asumsi, dan Keputusan Terbuka

### Kriteria penerimaan

- Pengunjung dapat melihat profil, proyek, pengalaman, sertifikat, Skills/Tech Stack, status profesional, dan informasi kontak yang telah diterbitkan admin.
- Informasi recruiter utama—ringkasan profil, bukti kompetensi, CV yang ditandai publik, dan kontak—dapat ditemukan tanpa harus memakai guestbook, chatbot, atau menyelesaikan interaksi playful.
- Pengunjung dapat mengganti bahasa Indonesia/Inggris; konten yang dimasukkan admin dalam Bahasa Indonesia tersedia otomatis dalam Bahasa Inggris, dan koreksi terjemahan admin dipakai kembali.
- Pengunjung dapat mengganti mode terang/gelap dan pilihan tampilannya tetap tersimpan saat berpindah halaman.
- Pengunjung dapat membaca pesan guestbook; untuk mengirim pesan harus masuk melalui GitHub atau Google. Pesan tampil setelah berhasil dikirim tanpa menunggu persetujuan admin, dan admin dapat menghapus pesan pengguna non-admin dari dashboard.
- Chatbot hanya menjawab berdasarkan konten profil yang dipublikasikan, menggunakan bahasa terpilih, tidak mengarang informasi jika sumber tidak memuat jawabannya, serta tidak membocorkan API key ke browser.
- Admin dapat mengelola seluruh konten yang ditetapkan dalam bagian 3.4 dari dashboard; pengunjung tidak dapat mengakses fungsi admin.
- Admin dapat mengisi seluruh bagian yang ditampilkan pada CV ATS contoh melalui CMS dan menghasilkan PDF yang mengikuti isi serta struktur contoh tanpa AI menulis atau menambah isi.
- Halaman dan fungsi inti tetap dapat digunakan di layar ponsel dan desktop; kegagalan layanan pihak ketiga menampilkan pesan yang jelas dan jalur alternatif yang tersedia.

### Risiko dan mitigasi

- **Terjemahan otomatis tidak akurat:** admin dapat mengoreksi dan menyimpan terjemahan; nama diri, organisasi, teknologi, dan merek dipertahankan.
- **Batas atau perubahan free tier Gemini:** terapkan batas penggunaan, pantau kuota, dan sediakan pesan saat chatbot tidak tersedia; provider berbayar dapat dipertimbangkan bila kebutuhan berubah.
- **Jawaban chatbot keliru atau di luar sumber:** batasi konteks ke konten publik, instruksikan chatbot untuk mengakui jika tidak tahu, dan sediakan tautan ke sumber profil/kontak.
- **Spam atau pesan tidak pantas pada guestbook/form kontak:** wajibkan autentikasi sosial untuk guestbook, terapkan validasi dan rate limit, lalu sediakan kemampuan admin menghapus pesan non-admin setelah pesan tampil.
- **Kebocoran data pribadi atau akses admin:** minimalkan data yang dikirim ke layanan luar, lindungi rahasia server, terapkan autentikasi dan Row Level Security, serta tinjau pilihan publikasi informasi kontak.
- **Ruang lingkup melebar:** dahulukan profil, CMS, CV ATS PDF, form kontak, dan pengalaman mobile; layanan/dokumen tambahan atau permainan kompleks dapat diprioritaskan setelah versi awal ditentukan.

### Asumsi

- Website dikelola oleh satu pemilik/admin utama.
- Bahasa Indonesia adalah bahasa sumber yang dimasukkan melalui CMS; terjemahan Inggris dibuat otomatis dan dapat dikoreksi admin.
- Perkiraan awal trafik adalah sekitar maksimal dua pengunjung per hari; angka ini merupakan estimasi pemilik, bukan batas teknis yang dijamin.
- Konten chatbot hanya mencakup informasi profesional yang layak dipublikasikan.
- CMS, autentikasi, database, dan penyimpanan berkas menggunakan layanan Supabase; website publik dan admin di-host di Vercel.

### Keputusan terbuka

- Provider terjemahan otomatis dan pengalaman ketika penerjemahan gagal atau hasil belum tersedia.
- Provider pengiriman email/notifikasi untuk form kontak dan pesan Inbox.
- Format ekspor CV kreatif dan surat lamaran serta dokumen hasil generasi mana yang dapat diterbitkan untuk unduhan publik (default usulan: privat sampai admin menerbitkan).
- Batas penggunaan chatbot dan apakah transkrip percakapan disimpan (usulan awal: tidak disimpan).
- Posisi kerja spesifik yang ditargetkan, target angka keberhasilan, serta apakah analytics penggunaan perlu diaktifkan.
- Apakah elemen status live guestbook dipertahankan. Arah visual, susunan halaman, dan interaksi utama dijelaskan pada [dokumen desain](design-website-profile.md); batas teknis permainan/media diselesaikan saat perencanaan implementasi.
