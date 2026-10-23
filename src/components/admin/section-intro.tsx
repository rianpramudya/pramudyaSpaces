'use client';
import { useState } from 'react';
import { Save } from 'lucide-react';
import { requestJSON } from '@/lib/client-api';
import { Field } from './fields';
import { useUnsavedChanges } from './use-unsaved-changes';
export const sectionDescriptionKeys:Record<string,string>={project:'projects_description',service:'services_description',experience:'journey_description',skill:'skills_description',certificate:'certificates_description'};
export function SectionIntro({sectionKey,initial,onSaved,notify}:{sectionKey:string;initial:string;onSaved:()=>Promise<void>;notify:(message:string)=>void}){
 const [value,setValue]=useState(initial);const [saved,setSaved]=useState(initial);const [busy,setBusy]=useState(false);
 useUnsavedChanges(value!==saved,busy);
 return <details className="section-intro admin-panel"><summary>Pengantar bagian di halaman tamu</summary><p>Opsional. Ini pengantar seluruh bagian; rincian setiap item diisi melalui daftar di bawah.</p><form className="admin-form" onSubmit={async e=>{e.preventDefault();setBusy(true);try{await requestJSON('/api/admin/content',{type:'section-copy',key:sectionKey,value});setSaved(value);try{await onSaved();notify('Pengantar bagian disimpan.');}catch{notify('Pengantar tersimpan. Muat ulang daftar untuk melihat perubahan.');}}catch(err){notify((err as Error).message);}finally{setBusy(false);}}}><Field label="Pengantar singkat" area disabled={busy} value={value} onChange={setValue} hint="Kosongkan jika bagian tidak memerlukan pengantar."/><button className="button" disabled={busy}><Save size={16}/>{busy?'Menyimpan…':'Simpan pengantar'}</button></form></details>;
}
