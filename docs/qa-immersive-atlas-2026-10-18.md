# Immersive Atlas — verifikasi

Instruksi terbaru pengguna menggantikan design.md sebagai acuan visual. Implementasi tidak mengubah design.md maupun isi CMS. Public stylesheet aktif sekarang `immersive.css`, menggantikan `spatial.css`; tidak memuat keduanya bersamaan.

## Karakter tiap ruang

- Pembuka: monumen identitas, portal berlapis, lantai perspektif, pintasan kompetensi dan objek yang dapat diputar.
- Proyek pilihan: roda karya 3D dengan area membaca studi kasus di luar distorsi.
- Profil: portrait dengan alas/pedestal dan bidang identitas berlapis.
- Pendidikan: catatan terjilid; penghargaan dan bahasa tetap sebagai catatan terbuka.
- Kompetensi: rak bertingkat, sisi depan terekspos dan tipografi terangkat.
- Layanan: bidang berlipat yang membuka untuk deskripsi.
- Pengalaman: lintasan bidang berselang dengan perbedaan kedalaman tanggal dan kontribusi.
- Sertifikat: lembar arsip dengan tab dan preview terangkat.
- Bermain: meja berlapis; arena fisika sendiri tetap tidak ditransformasi.
- Kontak: meja korespondensi dengan form sebagai lembar utama.
- Arsip `/projects`: dinding karya dua kolom berselang, satu kolom pada mobile, filter/urutan tetap bekerja.
- Studi kasus: panggung gambar, bidang konteks/hasil yang kontras, kontribusi dan tautan asli.

## Interaksi dan fungsi

DepthSurface mempertahankan HTML div/article dan seluruh konten native. Pointer memakai bounded offsets, cached bounds dan satu scheduled DOM write per frame. Efek dibatasi fine pointer, preferensi gerak, visibilitas elemen/dokumen; observers/listeners/frame dibersihkan. Keyboard focus menetralkan bidang; mobile/reduced-motion menggunakan bidang membaca datar. Bagian skills, services dan journey punya scroll choreography berbeda dengan static fallback. Tidak ada scroll hijack atau dependency baru.

Semua konten, role, context/result, teknologi, kontribusi, kontak/CV, publikasi, auth admin, guestbook/chat, balok, reset dan chase Spider-Man/Gwen tetap memakai alur sebelumnya. Tidak ada database mutation atau deployment.

## Bukti

77 tes lulus; TypeScript dan production build lulus. Tes mencakup seluruh room markers, CMS content retention, archive/detail distinction, native semantics, pointer bounds, motion gates, policy/draft exclusion, form validation dan palette contrast. Independent static review tidak menemukan Important regression.

HTTP final: 8 room variants tampil di beranda; arsip galeri dan 5 studi kasus 200; 21 aset lokal 200; 10 anchor memiliki target; missing project 404; admin anonim dialihkan ke login. Tidak ada resource lokal gagal.

Preview produksi lokal: http://127.0.0.1:3100/.

Browser runtime kembali melaporkan no browser available. Oleh karena itu actual compositing, screenshot desktop/tablet/mobile, focus rendering, gesture, computed overflow, console browser dan Lighthouse tidak diklaim telah diverifikasi. Automated/render/HTTP checks bukan jaminan seluruh bug visual tidak ada.
