# Code style dan prinsip OOP

Aturan perubahan baru, 23 Oktober 2026. Kode lama belum seragam: sebagian file ringkas/minified, sebagian sudah diformat. Jangan mengubah formatting seluruh file atau repositori ketika tugas hanya memerlukan patch kecil.

## TypeScript dan penamaan

- Pertahankan `strict: true`; gunakan `unknown` untuk input yang belum dipercaya, lalu parse/narrow. Hindari `any`, cast berantai, dan non-null assertion untuk menutupi kontrak yang tidak jelas.
- Gunakan `import type` untuk tipe, alias `@/` untuk impor aplikasi, dan impor relatif pendek untuk modul berdekatan.
- Komponen/tipe PascalCase; fungsi/variabel camelCase; hook diawali `use`; file kebab-case. Konstanta konfigurasi stabil dapat memakai UPPER_SNAKE_CASE seperti `CINEMATIC_SCENE`.
- Nama menjelaskan domain: `publishedProjects`, `requireOwner`, `related_project_ids`. Jangan menamai semua helper `Manager`, `Utils`, atau `Service` tanpa tanggung jawab jelas.
- Props eksplisit, sempit, dan bertipe. Hindari boolean beruntun yang menghasilkan banyak mode tak terkait; gunakan union untuk state eksklusif bila menambah perilaku baru.
- Nilai derived dihitung dari sumber, bukan disalin menjadi state terpisah. Gunakan `useMemo` untuk kebutuhan nyata, bukan setiap ekspresi.
- Prefer `const`, early return, pure function, `async/await`, dan `Promise.all` untuk I/O independen. Mutasi yang saling bergantung tetap berurutan.

## OOP tanpa memaksakan class

OOP di proyek ini berarti pemisahan tanggung jawab, enkapsulasi state, dan kontrak yang jelas. React memakai function component dan komposisi sebagai bentuk utama UI. Jangan mengonversi ke class component atau menambah inheritance tree demi label OOP.

| Prinsip | Penerapan yang diharapkan |
|---|---|
| Single responsibility | Section menyajikan satu area; projection mengatur visibilitas; repository mengakses data |
| Encapsulation | State menu di header; state renderer di controller; secret hanya di modul server |
| Open/closed | Gunakan props/config untuk variasi yang nyata; hindari cabang lintas fitur dalam komponen universal |
| Liskov substitution | Implementasi alternatif suatu kontrak harus menjaga hasil, error dan cleanup yang dijanjikan |
| Interface segregation | Props/port hanya memuat yang diperlukan; jangan memberikan seluruh admin content ke komponen publik kecil |
| Dependency inversion | Logika domain menerima data/kontrak, bukan bergantung langsung pada DOM, provider, atau SDK |
| Composition over inheritance | Gabungkan section dan komponen kecil; hindari `BaseSection` atau `BaseService` tanpa kebutuhan terbukti |

Class tepat bila objek mengelola lifecycle/resource atau state bersama yang memang perlu metode terenkapsulasi. `HttpError extends Error` adalah contoh yang sudah ada. Renderer saat ini juga dapat memakai factory/controller tanpa class; keduanya sah. Class tidak wajib untuk setiap entitas database.

Contoh batas tanggung jawab menggunakan fungsi murni (contoh pedoman, bukan API baru yang harus ditambahkan):

```ts
import type { Entry } from '@/lib/model';

export function publishedProjects(entries: readonly Entry[]): Entry[] {
  return entries.filter((entry) => entry.kind === 'project' && entry.published);
}
```

Fungsi tidak mengambil data sendiri atau mengubah array input. Sebelum menambah helper semacam ini, periksa `studioContent` dan helper existing agar tidak menduplikasi perilaku.

## React, Next.js dan efek

- Section di `components/sections`, chrome di `components/layout`, karya di `components/projects`. Orkestrator menyusun komponen; jangan mengembalikan satu file raksasa berisi semua JSX.
- Gunakan `'use client'` hanya saat membutuhkan state/effect/browser; client tidak mengimpor modul `server-only`.
- Gunakan server untuk akses database/provider, validasi dan auth. UI boleh memvalidasi lebih awal, tetapi tidak menggantikan validasi server.
- Effect hanya untuk sinkronisasi dengan sistem eksternal. Bersihkan timer, frame, observer, event listener dan request; cegah respons lama menimpa state baru.
- Hooks tidak dipanggil bersyarat. Key berasal dari identitas data stabil; indeks hanya untuk data statis yang benar-benar tidak berubah.
- Browser API di effect atau handler; SSR tidak boleh mengakses `window`, `document`, atau localStorage saat render.
- Gunakan `Link` untuk route internal dan anchor untuk perpindahan section. Tombol untuk aksi, bukan `<div onClick>`.
- Jangan menaruh HTML mentah dari CMS dengan `dangerouslySetInnerHTML` tanpa kebutuhan dan sanitasi yang dirancang. Teks biasa dirender sebagai teks.
- Pemisahan server/client mengikuti [panduan Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components); pemecahan UI dan state mengikuti [Thinking in React](https://react.dev/learn/thinking-in-react).

## Data, error dan I/O

- Validasi di boundary dengan schema Zod existing. Perubahan schema harus sejalan dengan tipe, editor dan projection.
- Pisahkan error yang diharapkan dari error internal; gunakan `HttpError`/helper existing. Jangan membuat respons sukses setelah persistensi gagal.
- Catch tidak boleh menyembunyikan kehilangan data. Catch kosong hanya untuk best-effort/fallback yang memang disengaja dan memiliki perilaku pengguna yang jelas.
- Jangan log payload pribadi, credential, prompt lengkap atau isi Inbox. Informasi diagnostik disanitasi.
- API response mempertahankan kontrak saat refactor. Hindari mengubah nama field atau status tanpa memperbarui pemanggil dan tes.
- Jangan menambah cache/global singleton state yang memuat sesi pengguna atau data privat lintas request.

## CSS, aset dan formatting

- Token warna hanya di `design-tokens.css`; keluarga font melalui token di `typography.css`. Lihat [DESIGN_SYSTEM](DESIGN_SYSTEM.md).
- Edit rule pemilik perilaku, bukan append override baru setiap kali. Periksa media query dan specificity yang masih aktif.
- Hindari inline style kecuali nilai dinamis seperti CSS custom properties untuk motion. Jangan menambah warna literal di TSX untuk menghindari lint.
- Gambar memiliki alt, dimensi/aspect ratio, dan loading strategy. Pertahankan asset asli dan lisensi.
- Untuk kode baru/multiline: indent 2 spasi, semicolon, single quotes TS, double quotes JSX, satu statement per baris. Ikuti gaya lokal jika patch kecil lebih mudah dibaca dengan format existing.
- Belum ada konfigurasi formatter/ESLint menyeluruh. Jangan mengklaim seluruh aturan ini enforced otomatis; `npm run lint` hanya memeriksa subset CSS.

## Review perubahan

Utamakan correctness, privasi, keterbacaan, lalu optimasi yang terukur. Jangan memecah file hanya karena jumlah baris; pecah ketika tanggung jawab berbeda. Hindari overengineering: interface untuk implementasi tunggal yang tidak memberi seam pengujian/isolasi sering tidak diperlukan.

Acceptance dan verifikasi mengikuti [AGENTS](../AGENTS.md) dan [TESTING](TESTING.md). Versi dependency dan lockfile tidak diubah oleh dokumen ini.
