# Keamanan dan privasi

Aturan perubahan dan catatan implementasi, 23 Oktober 2026. Dokumen ini bukan pentest atau sertifikat keamanan. Detail yang memerlukan pembuktian ulang dicatat di bagian gap. Gunakan [OWASP Top 10](https://owasp.org/www-project-top-ten/) sebagai rujukan risiko dan review berkelanjutan.

## Aset dan batas kepercayaan

Aset sensitif: sesi/credential owner, secret provider, data profil privat, draft, dokumen karier yang belum terbit, Inbox, dan izin media. Konten publik memang dapat diakses semua orang setelah diterbitkan sesuai projection.

Input browser, JSON/form, nama file, metadata OAuth, riwayat chat, isi CMS, hasil AI, query URL dan dokumen yang ditempel tidak otomatis dipercaya. Model AI bukan boundary otorisasi. Request server juga harus divalidasi; kode client atau tombol tersembunyi bukan pengaman.

| Risiko | Kontrol yang ada / kewajiban |
|---|---|
| Pengunjung menjadi admin | `getUser`/sesi + membership `owners`; owner check di server |
| Draft/kontak privat bocor | `projectPublicContent` allowlist, published, show_email/show_phone |
| Media privat dibaca via path | Path terbatas, referensi publik atau owner, bucket privat |
| Spam/biaya provider | Validasi, honeypot kontak, RPC rate limit |
| Request lintas origin | `originCheck` berdasarkan `SITE_URL` dan kebijakan loopback lokal |
| XSS/injeksi | Teks dirender React, URL/input tervalidasi; tidak menerima HTML mentah sembarang |
| Kebocoran secret | Modul server-only, env privat, tidak dicetak/di-commit |
| Prompt injection | Hanya fakta publik, instruksi/data dipisah; tidak ada akses admin melalui chat |

## Auth dan otorisasi

- Owner login email/password; `/admin/register` hanya setup awal dengan email yang cocok, token minimal 32 karakter dan constraint owner tunggal.
- Route dashboard melakukan redirect jika bukan owner. Setiap API admin tetap memeriksa `requireOwner()`; jangan bergantung pada layout/proxy saja.
- Pengunjung OAuth Google/GitHub boleh menulis guestbook sesuai policy, bukan mengelola CMS. Owner boleh memakai sesi sendiri untuk guestbook.
- `user_metadata` hanya untuk display yang dibatasi, bukan sumber role admin. Owner berasal dari tabel membership.
- Return path/callback harus internal atau origin yang diizinkan. Jangan membuka redirect ke input arbitrary.
- Reset email memakai respons generik; update email/password memerlukan sesi owner. Uji pemulihan dan logout pada environment terkontrol.

RLS tidak menggantikan pemeriksaan server ketika service/secret client digunakan. Kunci secret Supabase memiliki hak yang melewati RLS; simpan hanya di server dan lakukan otorisasi eksplisit sebelum operasi sensitif. Lihat [API keys](https://supabase.com/docs/guides/getting-started/api-keys) dan [securing the Data API](https://supabase.com/docs/guides/api/securing-your-api).

## Database dan Storage

Semua tabel public pada migrasi saat ini mengaktifkan RLS. Policy owner menggunakan membership; tabel counter mempunyai akses server terbatas. Pengunjung tidak membaca seluruh tabel secara langsung: API/repository memproyeksikan konten publik.

- Perubahan policy perlu tes owner, nonowner, anonymous, dan akses resource milik/tidak diizinkan. `authenticated` saja tidak cukup sebagai otorisasi.
- Jangan menambah `SECURITY DEFINER` untuk mengatasi error izin. Jika memang diperlukan, batasi execute, schema/search_path dan caller secara eksplisit lalu audit.
- Jangan membuat bucket publik untuk menghindari endpoint media. URL yang sulit ditebak bukan kontrol akses.
- Upload menerima format/ukuran yang diizinkan dan memeriksa signature/MIME; gambar maksimum 5 MB, PDF 10 MB. File tetap input tidak tepercaya.
- Unpublish harus mencabut akses tamu termasuk media/dokumen terkait. Saat ini media memakai `private, no-store`; desain cache baru wajib membuktikan invalidasi dan pemisahan akses owner/tamu.
- Migrasi tidak boleh merusak data tanpa rencana dan otorisasi. Periksa project target, migration history, backup serta recovery sebelum perubahan remote.

## Input, origin dan rate limit

`readJson` membatasi payload pada 100.000 unit sesuai pemeriksaan implementasi, lalu Zod menerapkan schema domain. Jangan menyebut pemeriksaan ini sebagai streaming body limit: request text masih dibaca penuh sebelum pemeriksaan panjang kedua.

Origin yang hilang saat ini diizinkan; origin check bukan bukti identitas. Origin lokal hanya memiliki pengecualian loopback sesuai implementasi; jangan memperluasnya ke domain deployment. Semua mutasi sensitif tetap membutuhkan sesi/otorisasi yang sesuai.

| Alur | Batas saat ini |
|---|---|
| Kontak | 5 request/jam, honeypot, pesan 10–5000 karakter |
| Guestbook | 3/menit dan 20/hari per user, pesan 1–500 karakter |
| Chat | 20/hari per sesi, 40/hari pengunjung, 100/hari global, pertanyaan ≤1000 karakter |
| Login | 10/15 menit |
| Setup owner | 5/jam |
| Reset | 3/jam |
| Mulai OAuth | 10/menit |

Counter memakai RPC atomik dan HMAC, bukan menyimpan IP mentah dalam key. Pada Vercel kode memakai header platform; di luar Vercel identitas IP fallback adalah `local`, sehingga beberapa pengguna dapat berbagi limit. Jika hosting berubah, rancang sumber identitas tepercaya; jangan percaya `X-Forwarded-For` arbitrary.

## AI, komunikasi dan data pribadi

AI chat dan terjemahan hanya menerima proyeksi publik. Jangan memasukkan `getContent()`, Inbox, credential, data surat lamaran privat atau draft ke prompt. Transkrip chat tidak disimpan ke database oleh alur sekarang; itu bukan klaim bahwa provider tidak memproses/menyimpan data. Periksa kebijakan provider dan kebutuhan notice pengguna sebelum deployment.

Prompt menolak instruksi dalam data dan membatasi jawaban pada fakta publik, tetapi prompt bukan jaminan anti-injeksi. Jangan memberi tool database/admin kepada chatbot publik atau mengeksekusi output AI. URL hasil AI harus diperlakukan sebagai input.

Contact sukses berarti Inbox tersimpan; notifikasi opsional tidak boleh memicu duplikasi. Jangan mengirim email/fixture ke akun nyata tanpa izin spesifik. Batasi log pada metadata diagnostik yang disanitasi; jangan log body pesan atau prompt lengkap.

## Secret, dependency dan delivery

`.env.local` tidak boleh dicetak atau di-commit; `.env.example` berisi contoh aman. `NEXT_PUBLIC_` hanya untuk nilai yang memang boleh terlihat browser. Gunakan secret manager environment hosting, least privilege, rotasi setelah dugaan kebocoran, dan pisahkan test/staging/production.

Next config sekarang memasang `nosniff`, `strict-origin-when-cross-origin`, `DENY` untuk frame dan pembatasan camera/mic/geolocation. Jangan mengklaim CSP atau HSTS sudah dikonfigurasi aplikasi: belum ada pada header config ini. HTTPS dan kebijakan tambahan perlu dievaluasi sesuai hosting/integrasi.

Perubahan dependency: verifikasi sumber dan advisory, pin versi yang ditambahkan sesuai kebutuhan proyek, commit lockfile, gunakan `npm ci`, jalankan tes/build/audit yang relevan. Next saat snapshot 16.4.2 setelah patch; status kerentanan harus diperiksa ulang ketika merilis. Versi saat ini tidak otomatis versi terbaru.

## Kontrol yang ditutup setelah audit

`http-error.ts` memisahkan `HttpError` yang berpesan aman dan error validasi dari error tak terduga. `failure()` mengembalikan pesan umum untuk error internal; penolakan owner memakai `HttpError(403)` tanpa menebak isi pesan. Upload invalid tetap menghasilkan validasi 400 yang jelas. Tes memeriksa redaksi pesan sensitif dan status. Allowlist publik kini mempertahankan `result_source`/`paper` tervalidasi tanpa meneruskan seluruh JSON atau mengizinkan terjemahan mengganti URL.

## Gap yang harus ditangani terpisah

- Rate limit non-Vercel memakai identitas bersama `local`; evaluasi sebelum hosting lain digunakan.
- Belum ada bukti pengujian visual/aksesibilitas penuh, pentest, pemulihan backup, kebijakan retensi Inbox atau monitoring produksi yang lengkap.
- OAuth guestbook dan provider AI mempunyai kegagalan konfigurasi/operasional pada audit terakhir. Jangan menandai aktif tanpa login/respons nyata.

## Respons insiden dan pelaporan

Jika secret terpapar: hentikan distribusi, rotasi/revoke melalui provider berwenang, periksa akses/log yang relevan, nilai sesi/data terdampak dan dokumentasikan tanpa menyalin secret. Menghapus string dari commit terakhir saja tidak mencabut credential. Jangan mengubah akun/remote atas nama audit tanpa otorisasi yang sesuai.

Laporkan dugaan kerentanan secara privat kepada pemilik melalui kanal yang disepakati; jangan menerbitkan token atau detail eksploit pada issue publik. Belum ada mailbox security khusus yang ditetapkan di repositori.

Verifikasi mengikuti [TESTING](TESTING.md); batas tindakan agent mengikuti [AGENTS](../AGENTS.md). Tidak ada konfigurasi cloud atau data live yang diubah oleh pembuatan dokumentasi ini.

## Skor Space Run

Endpoint game menolak sesi anonim/provider yang tidak didukung policy buku tamu. Identitas berasal dari user terverifikasi, bukan body klien. Score payload strict berisi UUID sesi dan integer skor saja; identity/user_id tambahan ditolak. Rate limit 12 sesi/submit/perubahan privasi per pengguna per menit dan 90 pembacaan leaderboard per IP per menit memakai helper existing.

Sesi 30 menit, sekali pakai, terikat user_id. Pengecekan TypeScript diulang di SQL dengan row lock untuk mencegah replay bersamaan; upsert skor monotonik dan update privasi tidak saling menimpa. Proyeksi API membuang user_id/email, menampilkan hanya profil yang tidak disembunyikan, dan menggunakan private/no-store karena berisi skor pribadi. SELECT langsung dibatasi kolom display_name/avatar_url/best_score; game_sessions dan RPC tidak dapat diakses anon/authenticated.

Validasi laju maksimal bukan anti-cheat penuh. Durasi server mencakup pause; klien jahat tetap dapat menunggu lalu mengirim nilai yang masuk batas. Tidak ada klaim integritas kompetisi setara game yang disimulasikan server. Avatar publik berasal dari URL HTTPS profil; UI memakai no-referrer dan fallback inisial saat gambar gagal. Migrasi hanya ditulis dan diuji di PostgreSQL sementara, belum diterapkan pada Supabase aktif.
