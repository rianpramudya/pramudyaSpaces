'use client';
import { useState } from 'react';
import { ArrowUpRight,Send } from 'lucide-react';
import { requestJSON } from '@/lib/client-api';
export function ContactForm({language}:{language:'id'|'en'}){
 const en=language==='en';const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);const [sent,setSent]=useState(false);
 return <form className="contact-form" onSubmit={async e=>{e.preventDefault();setBusy(true);setStatus('');setSent(false);const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));try{await requestJSON('/api/contact',data);setSent(true);form.reset();setStatus(en?'Your message is saved. Thank you for reaching out.':'Pesan Anda tersimpan. Terima kasih sudah menghubungi.');}catch(err){setStatus((err as Error).message);}finally{setBusy(false);}}}>
  <div className="form-pair"><label>{en?'Name':'Nama'}<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder={en?'Your name':'Nama Anda'}/></label><label>Email<input name="email" type="email" required autoComplete="email" placeholder="nama@email.com"/></label></div>
  <label>{en?'Subject':'Subjek'}<input name="subject" required minLength={2} maxLength={200} placeholder={en?'What would you like to discuss?':'Apa yang ingin Anda diskusikan?'}/></label>
  <label>{en?'Message':'Pesan'}<textarea name="message" rows={5} required minLength={10} maxLength={5000} placeholder={en?'Tell me a little about it…':'Ceritakan sedikit tentangnya…'}/></label>
  <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
  <button className="button primary" disabled={busy}><Send size={16}/>{busy?(en?'Sending…':'Mengirim…'):(en?'Send message':'Kirim pesan')}</button>
  {status&&<p className={sent?'form-status success':'form-status'} role={sent?'status':'alert'}>{status}</p>}
 </form>;
}
