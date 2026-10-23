'use client';
import { useEffect,useRef,useState } from 'react';
import { useUnsavedChanges } from './use-unsaved-changes';
import { X,Save } from 'lucide-react';
import { kindLabels,type Kind,type Entry,textValue,listValue } from '@/lib/model';
import { requestJSON } from '@/lib/client-api';
import { Check,Field,MediaField,LinesField } from './fields';
import {ProjectPicker} from './project-picker';
export function EntryEditor({kind,entry,onClose,onSaved,notify,skills=[],projects=[],defaultPosition=0}:{kind:Kind;entry?:Entry;skills?:string[];projects?:Entry[];defaultPosition?:number;onClose:()=>void;onSaved:()=>Promise<void>;notify:(m:string)=>void}){
 const ref=useRef<HTMLDialogElement>(null);const [title,setTitle]=useState(entry?.title||'');const [data,setData]=useState<Record<string,unknown>>(entry?.data||{});const [published,setPublished]=useState(entry?.published||false);const position=entry?.position??defaultPosition;const [busy,setBusy]=useState(false);const [mediaBusy,setMediaBusy]=useState(false);
 const initialSnapshot=useRef(JSON.stringify({title:entry?.title||'',data:entry?.data||{},published:entry?.published||false}));
 const dirty=JSON.stringify({title,data,published})!==initialSnapshot.current;const mayClose=useUnsavedChanges(dirty,busy||mediaBusy);
 function close(){if(!busy&&!mediaBusy&&mayClose())onClose();}
 useEffect(()=>{const focus=document.activeElement as HTMLElement;const dialog=ref.current;dialog?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog?.close();document.body.style.overflow=overflow;focus?.focus();};},[]);
 const set=(key:string,value:unknown)=>setData(d=>({...d,[key]:value}));
 const field=(key:string,label:string,area=false,hint?:string)=><Field key={key} label={label} value={textValue(data,key)} onChange={v=>set(key,v)} area={area} hint={hint}/>;
 return <dialog ref={ref} className="admin-modal" aria-labelledby="entry-editor-title" onCancel={e=>{e.preventDefault();close();}}><div className="modal-title"><h2 id="entry-editor-title">{entry?'Edit':'Tambah'} {kindLabels[kind].toLowerCase()}</h2><button type="button" className="icon-button" aria-label="Tutup" disabled={busy||mediaBusy} onClick={close}><X/></button></div>
 <form className="admin-form" onSubmit={async e=>{e.preventDefault();if(busy||mediaBusy)return;setBusy(true);try{await requestJSON('/api/admin/content',{type:'entry',value:{...(entry?{id:entry.id}:{}),kind,title,published,position,data}});initialSnapshot.current=JSON.stringify({title,data,published});try{await onSaved();notify(published?'Konten tersimpan dan terbit.':'Draft tersimpan.');}catch{notify('Konten tersimpan. Muat ulang daftar untuk melihat perubahan.');}onClose();}catch(err){notify((err as Error).message);}finally{setBusy(false);}}}>
 <p className="form-help editor-guidance">Mulai dari informasi utama. Media dan detail tambahan bisa dilengkapi nanti.</p><fieldset className="editor-fields" disabled={busy||mediaBusy}>
 <Field label={kind==='skill'?'Nama kompetensi / teknologi':kind==='education'?'Institusi pendidikan':kind==='experience'?'Jabatan / Posisi':'Judul / Nama'} value={title} onChange={setTitle} required/>
 <div className="form-grid">
 {kind==='project'&&<>{field('role','Peran dalam proyek')}<Field label="Tanggal proyek" type="date" value={textValue(data,'date')} onChange={value=>set('date',value)} hint="Opsional. Dipakai pada urutan terbaru/terlama di arsip proyek, bukan tanggal terakhir diedit."/></>}
 {kind==='experience'&&textValue(data,'role')&&textValue(data,'role')!==title&&<details className="full"><summary>Detail jabatan dari data sebelumnya</summary>{field('role','Keterangan jabatan tambahan',false,'Jabatan utama menggunakan isian di atas. Detail lama tetap dipertahankan.')}</details>}
 {kind==='experience'&&<><label>Jenis pengalaman<select value={textValue(data,'type')||'work'} onChange={e=>set('type',e.target.value)}><option value="work">Pengalaman kerja</option><option value="organization">Organisasi</option></select></label>{field('organization','Organisasi / Perusahaan')}</>}
 {['experience','education'].includes(kind)&&<>{field('start','Mulai',false,'Contoh: Juni 2025 atau 2022')}<Field label="Selesai" value={textValue(data,'end')} onChange={v=>set('end',v)} disabled={Boolean(data.current)} hint={data.current?'Tidak perlu diisi selama masih berlangsung.':'Contoh: September 2025 atau 2026'}/><Check label="Masih berlangsung" checked={Boolean(data.current)} onChange={v=>set('current',v)}/></>}
 {kind==='education'&&<>{field('degree','Jenjang dan jurusan')}{field('gpa','GPA / IPK',false,'Contoh: 3.49 / 4.00')}</>}
 {kind==='skill'&&field('category','Kelompok',false,'Backend, Frontend, Tools, Design, Soft Skills…')}
 {kind==='language'&&field('level','Tingkat kemampuan')}
 {kind==='certificate'&&<>{field('issuer','Penerbit')}{field('date','Tanggal terbit')}{field('credential','Credential ID')}</>}
 {kind==='achievement'&&field('date','Tanggal')}
 
 </div>
 {kind!=='skill'&&field('description','Deskripsi',true)}
 {['service','skill','experience','education','certificate','achievement'].includes(kind)&&<ProjectPicker data={data} projects={projects} automatic={['service','skill'].includes(kind)} onChange={ids=>set('related_project_ids',ids)}/>}
 {['project','experience','education','achievement'].includes(kind)&&<LinesField label="Poin kontribusi / uraian" values={listValue(data,'bullets')} onChange={v=>set('bullets',v)} hint="Poin ini juga digunakan pada CV. Isi sesuai pengalaman sebenarnya."/>}
 {kind==='project'&&<><div className="technology-options"><span className="form-help">Pilih dari Skills yang sudah tersimpan.</span><div className="button-row">{[...new Set(skills)].map(skill=><button type="button" className={`technology-choice ${listValue(data,'technologies').includes(skill)?'selected':''}`} aria-pressed={listValue(data,'technologies').includes(skill)} key={skill} onClick={()=>set('technologies',listValue(data,'technologies').includes(skill)?listValue(data,'technologies').filter(t=>t!==skill):[...listValue(data,'technologies'),skill])}>{skill}</button>)}</div></div><Field label="Teknologi proyek" value={listValue(data,'technologies').join(', ')} onChange={v=>set('technologies',v.split(',').map(s=>s.trim()).filter(Boolean))} hint="Pilihan di atas otomatis masuk di sini. Tambahkan teknologi lain dengan koma bila diperlukan."/><details className="form-section"><summary>Studi kasus tambahan (opsional)</summary><p className="form-help">Deskripsi di atas menjadi ringkasan. Isi konteks dan hasil hanya untuk detail yang berbeda.</p>{field('context','Latar belakang / Masalah',true)}{field('result','Hasil / Dampak',true)}{field('result_source','URL bukti hasil',false,'Tautkan laporan, pengujian, atau dokumentasi yang mendukung hasil. Tanpa bukti, halaman publik menampilkan TODO hasil terverifikasi.')}{field('paper','URL paper / publikasi')}</details>{field('repository','URL repository')}<Check label="Proyek unggulan" checked={Boolean(data.featured)} onChange={v=>set('featured',v)}/></>}
 {['project','service','certificate','education','achievement'].includes(kind)&&field('url',kind==='certificate'?'URL verifikasi':'URL terkait')}
 {['project','experience','certificate','service'].includes(kind)&&<><label>Media pendukung</label><MediaField onBusyChange={setMediaBusy} paths={listValue(data,'media')} onChange={v=>set('media',v)}/>{field('alt','Deskripsi gambar (alt text)')}</>}
 <div className="publish-bar"><Check label="Terbitkan konten" checked={published} onChange={setPublished}/><div className="button-row"><button type="button" className="button" disabled={busy||mediaBusy} onClick={close}>Batal</button><button className="button primary" disabled={busy||mediaBusy}><Save size={16}/>{busy?'Menyimpan…':published?'Simpan & terbitkan':'Simpan draft'}</button></div></div>
 </fieldset></form></dialog>;
}
