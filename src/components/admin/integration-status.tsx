'use client';
import { useEffect,useState } from 'react';
import { OAuthSetup,type OAuthSetupConfig } from './oauth-setup';
import { requestJSON } from '@/lib/client-api';
type Status=Record<string,boolean|number|null|OAuthSetupConfig>&{oauthSetup:OAuthSetupConfig};
export function IntegrationStatus(){
 const [status,setStatus]=useState<Status|null>(null);const [error,setError]=useState('');
 const [loading,setLoading]=useState(false);
 async function load(){setLoading(true);setError('');try{setStatus(await requestJSON<Status>('/api/admin/status'));}catch(err){setError((err as Error).message);}finally{setLoading(false);}}
 useEffect(()=>{void load();},[]);
 const rows=[['database','Database'],['groq','Chatbot Tanya Rian / Groq'],['gemini','Terjemahan konten / Gemini'],['google','Login buku tamu Google'],['github','Login buku tamu GitHub'],['emailNotifications','Notifikasi email (opsional)']];
 return <div className="admin-panel"><div className="between"><h2>Status layanan</h2><button className="button small" disabled={loading} onClick={()=>load()}>{loading?'Memeriksa…':'Periksa ulang status'}</button></div>{error&&<p role="status">{error}</p>}{status?rows.map(([key,label])=><div key={key} className="between" style={{padding:'12px 0',borderBottom:'1px solid var(--border)'}}><span>{label}</span><span className={`status-tag ${status[key]===true?'published':''}`}>{status[key]===true?'Terkonfigurasi':status[key]===null?'Belum diketahui':'Belum diatur'}</span></div>):!error&&<p>Memuat status…</p>}<p>Inbox menerima pesan tanpa notifikasi email. Chatbot memakai Groq; terjemahan memakai Gemini. Status ini memeriksa konfigurasi, bukan keberhasilan respons provider. pengunjung buku tamu memerlukan provider sosial aktif. Akun admin bisa langsung menulis tanpa login sosial.</p>{status?.oauthSetup&&<OAuthSetup config={status.oauthSetup}/>}</div>;
}
