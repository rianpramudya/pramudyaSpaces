'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="error-page"><h1>Halaman belum dapat dimuat.</h1><p>Coba muat kembali beberapa saat lagi.</p><button className="button primary" onClick={reset}>Coba lagi</button></main>;}
