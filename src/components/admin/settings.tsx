'use client';
import { useState } from 'react';
import { UserRound,ShieldCheck } from 'lucide-react';
import { PasswordInput } from '../password-input';
import { IntegrationStatus } from './integration-status';
import { requestJSON } from '@/lib/client-api';
import { useUnsavedChanges } from './use-unsaved-changes';
export function AccountSettings({email,notify}:{email:string;notify:(m:string)=>void}){
 const [busy,setBusy]=useState(false);const [dirty,setDirty]=useState(false);
 useUnsavedChanges(dirty,busy);
 return <><IntegrationStatus/><div className="admin-panel"><h2><UserRound size={17}/> Akun pemilik</h2><p>Masuk sebagai {email}. Pengaturan ini hanya tersedia untuk pemilik di dashboard admin.</p><form className="admin-form" onInput={e=>{const form=e.currentTarget;const email=form.elements.namedItem('email') as HTMLInputElement;const password=form.elements.namedItem('password') as HTMLInputElement;setDirty(Boolean(email.value||password.value));}} onSubmit={async e=>{e.preventDefault();setBusy(true);const form=e.currentTarget;const body=Object.fromEntries(new FormData(form));try{const result=await requestJSON<{message:string}>('/api/auth',{action:'settings',...body});notify(result.message);form.reset();setDirty(false);}catch(err){notify((err as Error).message);}finally{setBusy(false);}}}><fieldset className="editor-fields" disabled={busy}><label>Email baru<input name="email" type="email" autoComplete="email" placeholder={email}/><span className="form-help">Perubahan dapat memerlukan konfirmasi melalui email lama dan baru.</span></label><PasswordInput label="Password baru" name="password" minLength={12} maxLength={128} autoComplete="new-password" placeholder="Minimal 12 karakter"/><button className="button primary" disabled={busy}>{busy?'Menyimpan…':'Simpan pengaturan akun'}</button></fieldset></form></div><div className="account-note"><ShieldCheck size={20}/><p className="form-help">Website dikelola satu pemilik. Login sosial pengunjung tidak memberikan hak admin.</p></div></>;
}
