# Catatan verifikasi — 11 Oktober 2026

## Sudah diperiksa

- `npm test`: 19 tes lulus, mencakup data publik, input, media, pemetaan CV, SSR, pemulihan akun, serta koreksi terjemahan per konten.
- `npm run typecheck`: lulus.
- `npm run build`: build Next.js produksi berhasil.
- Supabase `pramudyaSpace`: migrasi berhasil; seluruh sembilan tabel memiliki RLS dan bucket portfolio privat.
- Tes integrasi API nyata: akses admin, sesi/login/logout, RLS pengguna biasa/anon, kontak privat, CMS/publikasi proyek, detail URL, unggahan privat/publik, penolakan hapus media yang direferensikan, Inbox, penolakan write lintas origin, generator ATS, publikasi/unduh PDF, cache override, rate limit atomik, dan endpoint reset akun.
- Tes penyiapan: kode salah ditolak, email selain pemilik ditolak, akun pemilik terbentuk dengan sesi, penyiapan pemilik kedua ditolak. Semua akun/data QA dibersihkan.
- PDF: ATS dan kreatif contoh panjang lima halaman; surat lamaran dua halaman. Ekstraksi menemukan proyek terakhir dan poin kontribusi; halaman pertama dirender/dilihat. Jarak nama/jabatan diperbaiki setelah inspeksi.
- Bundle browser diperiksa tanpa secret key server, kode penyiapan, atau rahasia rate limit.
- Review independen selesai; enam temuan penting diperbaiki. Pending guard/deduplikasi pagination guestbook juga ditambahkan.

- Gemini 3.8 Flash: daftar model dan generateContent berhasil dengan key server. Enam tes integrasi AI lulus: chatbot ID dari fakta published, terjemahan EN tanpa draft, cache persisten, koreksi admin, chatbot EN, dan penolakan membuka sertifikat draft. Akun/data QA tidak dipertahankan. Gangguan kapasitas 503 pada permintaan awal pulih pada percobaan berikutnya.
- Gemini key diperiksa tidak muncul dalam bundle browser.

## Belum terverifikasi / konfigurasi belum lengkap

- Gemini key sudah dikonfigurasi dan provider nyata teruji. Penilaian kualitas jawaban terhadap konten portfolio lengkap tetap perlu dilakukan setelah admin mengisi konten.
- Provider Google dan GitHub terdeteksi belum aktif: OAuth callback dan UI tersedia, tetapi login sosial nyata belum diuji. Instruksi konfigurasi ada di README.
- Tidak ada browser yang tersedia pada runtime sesi: responsif visual, focus trap, keyboard/touch, tema dan permainan membutuhkan pengujian browser sebelum rilis.
- Email pemulihan/konfirmasi membutuhkan konfigurasi redirect/SMTP Supabase; tes endpoint berhasil, pengiriman ke mailbox pemilik belum diverifikasi.
- Notifikasi Resend opsional belum dikonfigurasi; penyimpanan Inbox berhasil tanpa notifikasi.
- Konten pemilik belum diisi/dipublikasikan. Tidak ada data portfolio palsu atau data kontak CV yang diterbitkan otomatis.
- Belum ada deployment Vercel atau rilis publik, mengikuti keputusan seluruh fitur dan verifikasi selesai dahulu.

## Keputusan implementasi yang diambil

- Pemilik tunggal memakai email yang dikonfigurasi dan kode penyiapan server; hak admin diputuskan tabel owner.
- Dokumen kreatif/surat lamaran diekspor PDF dan privat sampai diterbitkan.
- Chat tidak menyimpan transkrip; batas dan fallback tercantum pada README.
- Terjemahan/cache/override per bagian sumber, tidak menghapus koreksi bagian lain.
- Gambar maksimal 5 MB, PDF 10 MB, media Storage privat.
- Permainan memakai kontrol suara opt-in dan gerak terpisah.

Linter Supabase memberi INFO “RLS Enabled No Policy” untuk request_limits. Ini disengaja: tabel hanya digunakan service role melalui RPC; anon/authenticated tidak diberi policy akses. [Penjelasan linter](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
