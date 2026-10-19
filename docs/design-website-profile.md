# Design — Website Profil Personal

- **Status:** Draft desain — konsep dan susunan utama disetujui; detail siap ditinjau
- **Tanggal:** 11 Oktober 2026
- **Terkait:** [PRD Website Profil Personal](PRD-personal-profile-website.md)
- **Referensi visual:** [styfensagala.vercel.app](https://styfensagala.vercel.app)

## 1. Arah Desain

### Gagasan

**Poster interaktif**: halaman profil dibangun seperti poster personal yang berani—nama besar, label peran seperti stiker, dan status kerja yang terbaca seketika. Recruiter tetap cepat menemukan karya, CV, dan kontak; permainan kecil memberi halaman energi dan rasa ingin tahu.

Desain mengambil tipografi display besar, navigasi ringkas, label pekerjaan berbentuk kapsul, status rail, dan maskot kecil dari referensi sebagai inspirasi. Identitasnya tetap milik Rian: data proyek, cerita perjalanan, sertifikat, dan detail permainan diisi dari CMS. Hindari menyalin logo, tulisan, aset, atau animasi spesifik referensi.

### Prinsip

- **Recruiter tidak perlu menebak.** Nama, headline, status, tombol CV, dan kontak mudah ditemukan sejak awal.
- **Satu halaman, satu poster.** Hero boleh ekspresif; isi proyek dan pengalaman setelahnya kembali terstruktur agar recruiter mudah memindai.
- **Mainan punya batas.** Balok dan maskot bersifat opsional, dapat diabaikan, dan tidak menghalangi teks, foto, atau navigasi.
- **Energi tanpa dekorasi template.** Hindari gradient, efek kaca, kartu seragam, dan bayangan generik. Gerak dan bentuk kapsul hanya digunakan pada elemen yang memang interaktif.
- **Kontras hitam–putih.** Kanvas putih dan tinta hitam menjadi tampilan referensi; silver hadir pada garis dan bidang pendukung, aksen warna hanya sedikit.

## 2. Sistem Visual

### Palet warna

Gunakan token semantik agar komponen otomatis mengikuti tema. Mode terang meniru kontras putih-hitam dan garis tegas dari referensi. Tema pertama kali mengikuti preferensi perangkat; dark mode mempertahankan komposisi dan aksen, dengan grafit dan silver.

| Token | Light mode | Dark mode | Penggunaan |
|---|---|---|---|
| `background` | `#FFFFFF` | `#131416` | Latar halaman |
| `surface` | `#FFFFFF` | `#1D1F22` | Panel dan permukaan utama |
| `surface-muted` | `#F1F1F1` | `#272A2E` | Area sekunder dan kontrol |
| `text-primary` | `#050505` | `#F0F1F2` | Judul dan isi utama |
| `text-secondary` | `#5D5D5D` | `#B0B4BA` | Metadata dan isi pendukung |
| `border` | `#D2D2D2` | `#393C41` | Garis pemisah dan batas kontrol |
| `accent` | `#3156B8` | `#91A9F4` | Link, aksi utama, dan fokus keyboard |
| `status-positive` | `#18794E` | `#72C69A` | Status Open to Work; selalu disertai teks/ikon |

Silver bukan efek chrome: tidak ada gradient metalik, glow, atau bevel palsu. Uji kontras pasangan teks/latar saat implementasi; jangan gunakan warna sebagai satu-satunya pembawa informasi.

### Tipografi

- Gunakan **Barlow** dari satu keluarga font di halaman publik, panel, dan dashboard. Bobot 900 memberi karakter poster pada nama dan judul; bobot 400–700 menjaga isi, navigasi, dan form tetap mudah dibaca.
- Judul display kapital dan lebar; label navigasi/status ringkas, tebal, dan kapital. Isi memakai sentence case dengan ukuran dan leading yang nyaman.
- Nama membungkus alami di layar kecil. Jangan memaksa satu baris atau memberi tracking negatif sampai bentuk huruf saling bertabrakan.

### Bentuk dan material

- Radius kecil hingga sedang untuk tombol dan panel; balok permainan boleh lebih membulat agar terasa seperti benda mainan.
- Garis silver tipis membagi area seperti lembar kerja. Bayangan hanya digunakan untuk elemen yang mengambang atau membuka panel.
- Ikon sederhana dan konsisten; ikon suara, tema, bahasa, guestbook, dan chatbot diberi nama aksesibel.

## 3. Halaman Publik

### Navigasi tetap

Header putih tipis: wordmark di kiri, navigasi ringkas dan tebal di tengah, kontrol ID/EN dan tema di kanan. Tautan jangkar adalah **Tentang**, **Proyek**, **Perjalanan**, **Skills**, **Sertifikat**, **Kontak**, serta **Layanan** bila diterbitkan. Guestbook dan chatbot adalah tombol aksi di status rail, bukan tautan jangkar. Di mobile, navigasi masuk menu; pemilih bahasa dan tema tetap terlihat.

### Urutan konten

1. **Tentang / Hero** — nama display menjadi titik fokus dan memenuhi lebar halaman; headline, status, dan maksimal dua skill tampil sebagai kapsul yang sedikit berotasi. Professional summary, tombol CV yang dipublikasikan, tombol Hubungi, foto CMS, serta balok/mascot permainan mengisi lapisan berikutnya. Foto tetap terbaca dan tidak menutupi teks.
2. **Proyek** — arsip proyek, bukan kumpulan kartu seragam. Proyek unggulan mendapat bidang utama dengan gambar preview; proyek lain dapat berupa daftar/folder ringkas. Membuka item menavigasi ke halaman detail proyek dengan URL yang dapat dibagikan, berisi peran, konteks, hasil, teknologi, tautan, dan galeri gambar bila tersedia. Kembali ke arsip menggunakan navigasi browser biasa.
3. **Layanan (opsional)** — penawaran layanan ditampilkan hanya jika admin menerbitkan setidaknya satu layanan; jika kosong, bagian dan tautan nav disembunyikan.
4. **Perjalanan** — pengalaman kerja dan organisasi disajikan sebagai urutan waktu yang mudah dipindai. Gambar/logo dokumentasi bersifat opsional; tata letak tetap lengkap tanpa gambar.
5. **Skills / Tech Stack** — teknologi dan kompetensi dikelompokkan dari data CMS, bukan dibuat sebagai persentase kemampuan yang tidak terverifikasi.
6. **Sertifikat** — entri menampilkan judul, penerbit, tanggal, dan gambar bukti jika diunggah. Usulan interaksi: memilih gambar membuka pratinjau lebih besar; tautan verifikasi tampil bila tersedia.
7. **Kontak** — form dengan label jelas, tautan profesional, dokumen tambahan yang admin terbitkan (opsional), dan status pengiriman yang tegas. Email/nomor telepon hanya ditampilkan jika admin mengizinkannya untuk publik.
8. **Footer** — wordmark, copyright, dan kembali ke atas.

**Status rail** melintang di bawah viewport dengan sel bergaris untuk Open to Work/pekerjaan, lokasi bila tersedia, guestbook, dan chatbot. Di mobile rail diringkas dan tidak menutupi aksi inti. Guestbook dan chatbot membuka panel; hanya satu panel aktif pada satu waktu.

### Kerangka desktop

```text
┌ wordmark ───────────── Tentang  Proyek  Perjalanan  Skills  Sertifikat ─ ID/EN ◐ ┐
│ [HEADLINE] [SKILL CHIP] [STATUS]                                              │
│ NAMA BESAR YANG MEMENUHI LEBAR HALAMAN                       [FOTO / MASKOT]   │
│ ringkasan profesional                                                        │
│ [Unduh CV] [Hubungi]        balok interaktif / kontrol suara                  │
├ Proyek ──────────────────────────────────────────────────────────────────────┤
│ layanan?   perjalanan   skills   sertifikat   kontak                          │
└ status rail: OPEN TO WORK | LOKASI                  Buku Tamu | Tanya Rian ──┘
```

Komposisi rata kiri dan lebar. Satu momen display yang sangat besar menjadi ciri halaman; label peran dan tech stack berupa kapsul yang sedikit miring memberi rasa playful tanpa membuat isi menjadi dekorasi. Status rail tetap terbaca dan punya ruang aman pada mobile. Panel guestbook/chatbot tidak boleh menutup aksi penting tanpa cara dismiss yang jelas.

### Kerangka mobile

```text
┌ wordmark                    ID/EN ◐ ┐
│ [HEADLINE] [SKILL CHIP]             │
│ NAMA BESAR                           │
│ ringkasan                            │
│ [Unduh CV] [Hubungi]                │
│ foto + maskot / balok               │
│ Proyek unggulan                     │
│ ...                                  │
├ Open to Work ───── Buku Tamu ─ Tanya ┤
└──────────────────────────────────────┘
```

Pada mobile, nama boleh membungkus beberapa baris, foto diperkecil, dan kontrol rail diringkas dengan ruang aman bawah. Launcher/rail tidak menutupi form atau kontrol navigasi. Drawer guestbook/chatbot berubah menjadi panel layar penuh.

## 4. Permainan, Gerak, dan Suara

### Balok yang dapat dipindah

Balok label role/skill tampil **tepat di atas nama besar** seperti stiker yang dapat digeser. Balok tidak menjadi satu-satunya cara membaca skill—daftar Skills tetap tersedia normal di halaman. Saat dipindahkan, balok mengikuti pointer; sentuhan, tombol panah, dan Enter/Space menyediakan cara yang setara. Setiap perpindahan memberi bunyi orisinal pendek bila suara diaktifkan. Tidak boleh menutupi teks, foto, tombol CV, atau kontrol aksesibilitas.

Sediakan interaksi keyboard yang setara: fokuskan balok, gunakan tombol panah untuk menggeser, Enter/Space untuk memilih atau melepas, dan Escape untuk mengembalikan ke posisi awal. Pada layar sentuh, drag boleh tersedia dengan handle terpisah dari area scroll, tetapi harus selalu disertai kontrol tap untuk memilih posisi/slot tanpa drag. Bila permainan dimatikan atau `prefers-reduced-motion` aktif, balok tampil statis dan seluruh informasi skill tetap tersedia di bagian Skills.

### Maskot pengejar

**Dua maskot arcade orisinal** mondar-mandir berlawanan arah di jalur terpisah tepat di atas status rail agar tidak tertutup bar. Mereka terinspirasi oleh permainan “muncher” klasik, tetapi bentuk, warna, dan efek suaranya dibuat sendiri. Setiap 10 detik, hanya satu maskot bergantian menyapa “Hai!” selama sesaat. Saat pointer mendekat, maskot dapat mempercepat lari; jika diklik atau diketuk, ia memberi reaksi tertangkap dan satu bunyi berbeda. Klik/tap tidak memicu navigasi atau menutupi tombol. Pada layar sentuh, kontrol tidak bergantung pada hover.

### Audio dan preferensi gerak

- Efek suara pendek dan orisinal hanya muncul setelah tindakan eksplisit: bunyi ringan saat balok dipindah dan bunyi berbeda saat maskot berhasil diklik. Kontrol permainan mencakup suara dan gerak secara terpisah.
- Tidak ada audio autoplay. Kontrol suara selalu mudah ditemukan saat permainan aktif, memiliki label aksesibel, dan preferensi on/off diingat.
- Audio bukan satu-satunya umpan balik; gerak/visual juga menunjukkan hasil tindakan.
- Hormati `prefers-reduced-motion`: hentikan kejar-kejaran dan transisi non-esensial; sediakan versi statis yang tetap dapat dipakai.
- Batasi frekuensi suara saat pointer bergerak agar tidak berbunyi berulang atau mengejutkan. Volume default rendah.

### Transisi tema

Saat pengunjung mengganti tema, latar, teks, panel, dan border berubah bersamaan selama sekitar **200 ms**. Jangan menganimasikan posisi layout atau membuat konten berkedip. Jika pengunjung belum pernah memilih, ikuti preferensi sistem; simpan pilihan eksplisit agar bertahan saat kembali. Hormati `prefers-reduced-motion` dengan menghilangkan atau memendekkan transisi.

## 5. Guestbook dan Chatbot

### Guestbook drawer

Tombol Buku Tamu membuka drawer dari sisi kanan; halaman di belakangnya diredupkan. Header drawer dapat memakai nuansa log seperti `~/guestbook.log`, tetapi keterbacaan dan aksesibilitas lebih penting daripada dekorasi terminal. Pesan publik tampil langsung setelah pengguna berhasil login melalui GitHub atau Google dan mengirim pesan. Tidak ada persetujuan awal. Admin dapat menghapus kiriman pengguna non-admin dan membalas sebagai pemilik.

Drawer menampilkan identitas publik, isi pesan, waktu, serta balasan pemilik bila tersedia. Tombol close dan Escape menutupnya; fokus keyboard tetap berada di dalam drawer saat terbuka dan kembali ke pemicu setelah ditutup. Pada mobile drawer menjadi layar penuh. Tampilkan status kosong, pengiriman gagal, dan koneksi/login dengan bahasa yang jelas.

### Chatbot recruiter

Widget membuka panel tanya-jawab yang visualnya satu keluarga dengan drawer guestbook, tetapi dibedakan dengan judul dan ikon. Chatbot menjawab pertanyaan tentang konten profil yang sudah dipublikasikan, dalam bahasa yang sedang dipilih. Jika tidak tahu, arahkan ke bagian profil atau kontak. Tampilkan bahwa jawaban dihasilkan AI dan ingatkan pengunjung untuk tidak memasukkan data sensitif. Saat kuota Gemini atau layanan habis, tampilkan status tidak tersedia dan tautan kontak; jangan membuat respons palsu.

## 6. Dashboard Admin / CMS

Dashboard memakai struktur kerja yang tenang dan jelas, berbeda dari halaman publik yang lebih ekspresif. Gunakan sidebar tetap pada desktop dan menu ringkas pada mobile. Konten formulir tidak dipecah menjadi banyak kartu dekoratif.

```text
┌ Admin Panel ─────────────── breadcrumb ─────────────── Lihat Website ┐
│ Dashboard                                                        │
│ Inbox                                                            │
│ Konten                                                          │
│   Profil                                                        │
│   Projects                                                      │
│   Experience                                                    │
│   Services                                                      │
│   Skills                                                        │
│   Sertifikat                                                    │
│   Dokumen & CV                                                  │
│ Settings / Keluar                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Prinsip CMS

- Satu sumber konten yang diisi admin mendukung halaman publik, chatbot (konten publik saja), dan template dokumen karier.
- Form profil mengelola nama, headline, ringkasan, foto profil, status Open to Work/Sedang Bekerja/tersembunyi, kontak dan visibilitas tiap kontak.
- Proyek mendukung preview/sampul, galeri opsional, urutan, status draft/published, deskripsi, kontribusi, hasil, teknologi, dan tautan.
- Pengalaman/organisasi mendukung rentang waktu, peran, uraian, dan gambar opsional. Gambar bukan syarat untuk menyimpan atau menerbitkan konten.
- Skills dapat ditambah manual, dikelompokkan, diurutkan, dan diedit tanpa menyentuh kode.
- Sertifikat mendukung upload gambar, judul, penerbit, tanggal, deskripsi, dan tautan verifikasi opsional; pratinjau tersedia sebelum publikasi.
- Upload media tersedia di bagian konten yang membutuhkannya: foto profil, preview/galeri proyek, gambar sertifikat, dan gambar pengalaman opsional. Admin melihat preview, dapat mengganti/menghapus media, dan mengatur publikasi bersama kontennya.
- Input Bahasa Indonesia menjadi sumber; sistem menyediakan terjemahan Inggris dan admin dapat mengoreksi hasilnya. Perubahan dan status publikasi harus jelas.
- CV ATS dihasilkan menjadi PDF dari semua data CMS yang dipetakan ke CV contoh [CV ATS](CV_ATS_rian_pramudya_amanda-2.pdf). Template hanya memformat data; tidak mengarang atau menulis ulang isi dengan AI. Dokumen hasil generasi privat sampai admin menerbitkannya.
- Inbox menampilkan pesan form kontak; dashboard juga mengelola hapus/balas guestbook. Aksi destruktif meminta konfirmasi dan memberikan umpan balik yang jelas.
- Setelah menyimpan, admin mendapat status tersimpan/gagal yang konkret. Perubahan konten tidak membutuhkan deployment ulang.

## 7. Bahasa, Tema, dan Aksesibilitas

- Pemilih bahasa ID/EN selalu dapat ditemukan di navigasi. Admin memasukkan Bahasa Indonesia; sistem menyediakan terjemahan otomatis saat bahasa Inggris dipilih dan admin dapat menyimpan koreksi per konten. Rekomendasi alur: terjemahkan konten published pada permintaan pertama, simpan hasil, dan tampilkan tanpa menunggu admin menulis ulang; jika provider gagal, gunakan terjemahan tersimpan bila ada, jika tidak tampilkan teks Indonesia dengan pemberitahuan bahwa terjemahan Inggris sementara tidak tersedia. Chatbot menjawab dalam bahasa terpilih menggunakan hanya sumber profil published.
- Tema dan bahasa merupakan preferensi terpisah. Perubahan satu tidak mereset yang lain.
- Semua kontrol penting dapat digunakan dengan keyboard, memiliki fokus terlihat, label dan nama aksesibel, serta target sentuh yang memadai.
- Gambar CMS memiliki teks alternatif yang dapat diisi admin; logo dekoratif boleh diberi alt kosong. Preview sertifikat memiliki cara keluar yang jelas.
- Kontras teks, status dan kontrol dicek untuk kedua tema. Informasi status selalu berupa teks/ikon, bukan warna saja.
- Dialog/drawer mengelola fokus, dapat ditutup dengan Escape jika aman, dan mengembalikan fokus ke tombol pembuka.

## 8. Isi dan Microcopy

Gunakan Bahasa Indonesia yang lugas sebagai bahasa dasar UI; padanan Inggris mengikuti makna, bukan terjemahan kata demi kata yang kaku. Nama teknologi, organisasi, merek, dan diri sendiri dipertahankan. Hindari jargon terminal untuk aksi biasa.

Contoh label aksi:

- `Unduh CV ATS (PDF)` — mengunduh CV ATS hanya ketika admin menerbitkannya; jika CV tidak tersedia, tombol tidak tampil.
- `Hubungi` — menuju form kontak.
- `Buku Tamu` — membuka panel guestbook.
- `Simpan perubahan` — menyimpan formulir CMS.
- `Terbitkan` — membuat konten tampil publik.
- `Suara aktif` / `Suara mati` — mengubah preferensi audio.

Pesan kosong mengarahkan pada tindakan berikutnya; error menjelaskan apa yang gagal dan opsi yang tersedia. Jangan memakai copy promosi generik atau menyebut AI secara berlebihan.

## 9. Pertanyaan yang Masih Terbuka

PRD mencatat keputusan produk/teknis yang belum dikunci. Sebelum implementasi, pastikan terutama:

- Perilaku terjemahan Inggris yang belum ditinjau admin dan fallback ketika provider gagal.
- Batas publikasi per item/kontak serta identitas pengirim guestbook yang ditampilkan.
- Provider email untuk form kontak; batas chatbot dan kebijakan penyimpanan transkrip.
- Format dan akses publik untuk CV kreatif/surat lamaran; peta field contoh CV ATS ke form CMS.
- Maksimum ukuran/format media, optimasi thumbnail, aturan hapus/referensi media, dan apakah preview sertifikat memakai lightbox.
- Target kerja, ukuran keberhasilan, batas penggunaan/retensi chatbot, detail autentikasi admin, dan label live guestbook.

## 10. Ringkasan Arah

**Terang:** kanvas putih, tinta hitam, garis tegas, gambar pemilik dan proyek sebagai bukti utama, dengan warna aksen tipis. **Gelap:** komposisi yang sama dalam grafit dan silver. Satu keluarga Barlow menyatukan display, navigasi, isi, panel, dan form; bobot font berubah untuk menjaga hierarki dan keterbacaan. Balok, maskot, dan efek suara menjadi permainan singkat yang dikendalikan pengunjung, bukan hiasan yang mengganggu.


## Penegasan implementasi setelah koreksi pemilik

- Arena balok berada di atas nama hero, dengan gerak gravitasi/tumbukan sederhana serta drag, tap, dan keyboard. Label peran/skills berasal dari konten CMS; saat kosong, balok hanya memakai bentuk dekoratif.
- Pac-Man dengan hantu kecil melintas di jalur bawah viewport, terpisah dari tombol guestbook/chatbot. Gerak dapat dijeda dan suara opt-in.
- Layout publik memakai satu stylesheet khusus, tanpa aturan bertumpuk yang mengubah ukuran dan posisi hero berulang kali.
- Bagian pengalaman, skills, dan sertifikat kosong tidak menghasilkan panel besar yang memenuhi halaman.
- Verifikasi visual dan sentuhan di browser belum dapat dijalankan karena browser sesi tidak tersedia; jangan menyatakan kesamaan visual penuh dengan referensi sebelum pemeriksaan itu.

### Penyempurnaan visual 11 Oktober 2026

Ringkasan sejajar dengan nama; lebar konten dan jarak antarbagian konsisten. Bayangan tombol dihilangkan, garis pemisah lebih ringan, dan tipografi isi diberi leading lebih lapang. Foto dekoratif kosong disembunyikan. Animasi balok menggunakan langkah waktu tetap dan tidak direset ketika ResizeObserver hanya mendeteksi perubahan tinggi. Karakter pada jalur bawah dipertahankan sesuai arahan pemilik. Verifikasi visual browser masih belum tersedia; build dan tes tetap diperiksa.
