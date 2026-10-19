# QA — Spatial portfolio, 18 Oktober 2026

## Implementasi

Public layout dibangun ulang menjadi spatial studio: hero beridentitas CMS dan kubus CSS 3D enam sisi, orbit kompetensi dengan pintasan, roda proyek perspektif, profil dengan portrait berlapis, skills tipografis, layanan expandable, experience spine, indeks sertifikat, play desk khusus, serta kontak dengan form yang sama. Navigasi aktif menggunakan IntersectionObserver, menu Escape mengembalikan fokus. CSS baru `spatial.css` menggantikan import hybrid/editorial/taste sehingga override desain lama tidak bertumpuk. Base functional controls dan chibi chase tetap digunakan.

Konten proyek menampilkan context, technologies, role, contribution bullets, result, cover dan detail/repository/demo asli dari CMS. Tidak ada konten, status publikasi, database atau auth admin yang diubah. Dokumen dan informasi kontak tetap mengikuti public projection server. Tidak ada dependency atau model 3D yang ditambahkan. Objek menggunakan CSS perspective, preserve-3d dan DOM, bukan WebGL.

## Verifikasi otomatis

- 75 unit/render/policy/contrast tests lulus. Tes baru mencakup pointer bounds/zero dimensions, pause/reduced/offscreen states, dan retensi detail CMS pada komposisi baru. Test lama yang mengharuskan balok di atas nama diperbarui: balok sekarang punya section bermain sendiri.
- TypeScript dan build produksi lulus.
- HTTP beranda dan arsip 200; 5 detail proyek 200; semua memiliki tautan kembali.
- 21 resource gambar/CSS/JS/font lokal berstatus 200, tanpa tautan lokal rusak.
- 10 anchor beranda mempunyai target.
- Proyek tidak ditemukan menghasilkan 404.
- Guestbook GET dan owner login 200; kunjungan admin anonim dialihkan ke owner login.
- GitHub profil, website lama, dan kelima repository proyek 200. Verifikasi sertifikat eksternal merespons 403; LinkedIn 999. Keduanya menolak akses otomatis sehingga validitas halaman tujuan tidak dapat dipastikan dengan pemeriksaan ini; tautan CMS tidak diubah.

## Performa dan fallback

Pointer dikoaleskan per frame, memakai DOM refs tanpa rerender kontinu. Wheel merender hanya selama perubahan; frame berhenti setelah settle. Offscreen/hidden-tab mematikan gerak, reduced-motion dan preferensi jeda dihormati. Mobile, reduced-motion, single project, dan deviceMemory <=2GB menggunakan viewer proyek datar. Balok hanya mensimulasikan fisika ketika areanya terlihat; chase berhenti di hidden tab. Scroll tetap native. Sebelum enhancement, cover pertama tetap terlihat. CSS 3D unsupported fallback tersedia.

## Review dan batasan

Independent static review menemukan benturan specificity full-bleed dan safe-area arcade; keduanya diperbaiki dan diverifikasi reviewer. Satu proyek memakai flat viewer; next/previous disabled. Pemilihan, media dan ringkasan kembali ke proyek pertama ketika jumlah proyek berubah.

Browser runtime tidak menyediakan browser (discovery kosong). Karena itu screenshot lintas viewport, rendering/computed overflow, gesture nyata, console browser, Lighthouse/Core Web Vitals dan validasi visual tema belum diverifikasi langsung. HTTP dan unit tests tidak membuktikan ketiadaan seluruh bug visual. Preview lokal produksi di http://127.0.0.1:3100/. Tidak ada deployment publik.
