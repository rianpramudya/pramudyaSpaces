# Tahap proyek: WorksWheel

Mengadaptasi komponen WorksWheel yang dilampirkan pengguna. Lokasi reusable `src/components/ui/works-wheel.tsx`; wrapper ProjectGallery memetakan proyek terbit CMS, unggulan lebih dahulu, maksimal delapan. CSS native existing dipertahankan; tidak membutuhkan migrasi Tailwind/shadcn ataupun dependensi baru. Data, gambar, judul, kontribusi dan tautan berasal dari CMS, bukan demo eksternal.

Desktop: ring tangent berubah menjadi drum perspektif melengkung menggunakan geometri komponen asal. Tombol indeks, previous/next/reset dan keyboard memindahkan posisi; satu rAF menulis transform ketika perlu, berhenti setelah settle. Tidak menangkap scroll halaman. Mobile dan reduced-motion memakai gambar datar satu proyek, mempertahankan indeks dan ringkasan. Horizontal touch memilih; vertical/pinch tidak diambil alih. Empty artwork fallback dan empty publication guidance tersedia. Native links/button menggantikan listbox berisi tautan; ID useId menghindari benturan.

Tahap ini hanya proyek. Permainan balok, chase Spider-Man/Gwen, data admin, arsip dan section lain tetap. Bahasa dan token tema mengikuti aplikasi. Verifikasi 72 tes, TypeScript dan build produksi lulus; browser visual tidak tersedia sehingga QA animasi/perangkat nyata belum diverifikasi.
