'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight,LockKeyhole } from 'lucide-react';
import { PasswordInput } from './password-input';
import { requestJSON } from '@/lib/client-api';
export function AuthForm({register=false,connected}:{register?:boolean;connected:boolean}){
 const [busy,setBusy]=useState(false);const [status,setStatus]=useState('');const [reset,setReset]=useState(false);
 return <main className="auth-page"><aside className="auth-art"><Link className="wordmark" href="/">Pramudya Spaces<span className="wordmark-dot"/></Link><div><h1>YOUR SPACE.<br/>YOUR STORY.</h1><div className="auth-art-line"/></div><p>Ruang untuk mengelola karya dan perjalanan Anda.</p></aside><div className="auth-form-side"><form className="auth-form" onSubmit={async e=>{
  e.preventDefault();setBusy(true);setStatus('');const values=Object.fromEntries(new FormData(e.currentTarget));try{const result=await requestJSON<{redirect?:string;message?:string}>('/api/auth',{...values,action:register?'register':reset?'reset':'login'});if(result.redirect)location.assign(result.redirect);else setStatus(result.message||'Berhasil.');}catch(err){setStatus((err as Error).message);}finally{setBusy(false);}
 }}><div><LockKeyhole size={25}/><h2>{register?'Buat akun pemilik':reset?'Pulihkan akses':'Selamat datang kembali.'}</h2><p>{register?'Penyiapan satu akun untuk mengelola website.':reset?'Tautan pemulihan dikirim ke email pemilik.':'Masuk untuk mengelola profil, karya, dan pesan.'}</p></div>
 <label>Email<input name="email" required type="email" autoComplete="email" placeholder="Email pemilik"/></label>
 {!reset&&<PasswordInput label="Password" name="password" required minLength={register?12:1} maxLength={128} autoComplete={register?'new-password':'current-password'} placeholder={register?'Minimal 12 karakter':'Password Anda'}/>}
 {register&&<label>Kode penyiapan<input name="token" required type="password" minLength={32} autoComplete="off" placeholder="Kode rahasia pemilik"/></label>}
 {!connected&&<p className="form-status">Autentikasi belum terhubung. Lengkapi konfigurasi Supabase untuk menggunakan akun.</p>}
 {status&&<p className="form-status" role="status">{status}</p>}<button className="button primary" disabled={busy||!connected}>{busy?'Memproses…':register?'Buat akun':reset?'Kirim tautan pemulihan':'Masuk'}<ArrowUpRight size={17}/></button>
 <div className="auth-foot"><Link className="text-button" href="/">Kembali ke profil</Link>{!register&&<button type="button" className="text-button" onClick={()=>{setReset(!reset);setStatus('');}}>{reset?'Kembali masuk':'Lupa password?'}</button>}</div>
 {register&&<p className="form-help">Form ini tidak ditautkan di halaman tamu. Setelah akun pemilik dibuat, penyiapan akun tambahan ditolak.</p>}
 </form></div></main>;
}
