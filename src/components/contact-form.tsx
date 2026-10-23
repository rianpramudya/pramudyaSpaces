'use client';
import {useId,useState,type FormEvent} from 'react';
import {Send,LoaderCircle,CheckCircle2} from 'lucide-react';
import {requestJSON} from '@/lib/client-api';
import {contactFieldError} from '@/lib/contact-feedback';
const fields=['name','email','subject','message'] as const;
type ContactField=typeof fields[number];
export function ContactForm({language}:{language:'id'|'en'}){
 const en=language==='en',uid=useId();const [status,setStatus]=useState(''),[busy,setBusy]=useState(false),[sent,setSent]=useState(false),[errors,setErrors]=useState<Partial<Record<ContactField,string>>>({});
 function errorFor(input:HTMLInputElement|HTMLTextAreaElement){return contactFieldError(input.value,{minLength:input.minLength,maxLength:input.maxLength,emailInvalid:input instanceof HTMLInputElement&&input.type==='email'&&input.validity.typeMismatch},en);}
 function check(input:HTMLInputElement|HTMLTextAreaElement){const name=input.name as ContactField;if(!fields.includes(name))return;setErrors(previous=>({...previous,[name]:errorFor(input)}));}
 function attributes(name:ContactField){return {disabled:busy,id:`${uid}-${name}`,'aria-invalid':!!errors[name],'aria-describedby':errors[name]?`${uid}-${name}-error`:undefined,onBlur:(event:React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>)=>check(event.currentTarget),onInput:(event:FormEvent<HTMLInputElement|HTMLTextAreaElement>)=>{if(errors[name])check(event.currentTarget);}};}
 const feedback=(name:ContactField)=>errors[name]&&<span className="contact-field-error" id={`${uid}-${name}-error`}>{errors[name]}</span>;
 return <form method="post" noValidate aria-busy={busy} onInput={()=>{if(status){setStatus('');setSent(false);}}} className="contact-form" onSubmit={async event=>{event.preventDefault();if(busy)return;const form=event.currentTarget,next:Partial<Record<ContactField,string>>={};for(const name of fields){const input=form.elements.namedItem(name) as HTMLInputElement|HTMLTextAreaElement;const error=errorFor(input);if(error)next[name]=error;}setErrors(next);if(Object.keys(next).length){setSent(false);setStatus(en?'Please check the highlighted fields.':'Periksa kembali kolom yang ditandai.');(form.elements.namedItem(Object.keys(next)[0]) as HTMLElement)?.focus();return;}setBusy(true);setStatus('');setSent(false);const data=Object.fromEntries(new FormData(form));try{await requestJSON('/api/contact',data);form.reset();setSent(true);setErrors({});setStatus(en?'Your message is saved. Thank you for reaching out.':'Pesan Anda tersimpan. Terima kasih sudah menghubungi.');}catch(err){setStatus((err as Error).message);}finally{setBusy(false);}}}>
  <div className="form-pair"><label htmlFor={`${uid}-name`}>{en?'Name':'Nama'}<input {...attributes('name')} name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder={en?'Your name':'Nama Anda'}/>{feedback('name')}</label><label htmlFor={`${uid}-email`}>Email<input {...attributes('email')} name="email" type="email" required maxLength={254} autoComplete="email" spellCheck={false} placeholder={en?'you@example.com':'nama@email.com'}/>{feedback('email')}</label></div>
  <label htmlFor={`${uid}-subject`}>{en?'Subject':'Subjek'}<input {...attributes('subject')} name="subject" required minLength={2} maxLength={200} placeholder={en?'What would you like to discuss?':'Apa yang ingin Anda diskusikan?'}/>{feedback('subject')}</label>
  <label htmlFor={`${uid}-message`}>{en?'Message':'Pesan'}<textarea {...attributes('message')} name="message" rows={5} required minLength={10} maxLength={5000} placeholder={en?'Tell me a little about it…':'Ceritakan sedikit tentangnya…'}/>{feedback('message')}</label>
  <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
  <button className="button primary" disabled={busy}>{busy?<LoaderCircle size={16} className="contact-spinner" aria-hidden="true"/>:<Send size={16} aria-hidden="true"/>}{busy?(en?'Sending…':'Mengirim…'):(en?'Send message':'Kirim pesan')}</button>
  {status&&<p className={sent?'form-status success':'form-status'} role={sent?'status':'alert'}>{sent&&<CheckCircle2 size={20} aria-hidden="true"/>}<span>{status}</span></p>}
 </form>;
}
