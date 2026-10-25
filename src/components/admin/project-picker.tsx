'use client';
import {useRef,useState} from 'react';
import {type Entry,listValue} from '@/lib/model';
import {relatedWorkPreview} from '@/lib/admin-relations';
import {Check} from './fields';
type Mode='auto'|'manual'|'none';
export function ProjectPicker({data,projects,onChange,automatic,entry}:{data:Record<string,unknown>;projects:Entry[];onChange:(ids:string[]|undefined)=>void;automatic:boolean;entry?:Entry}){
 const ids=listValue(data,'related_project_ids');
 const [mode,setMode]=useState<Mode>(()=>Array.isArray(data.related_project_ids)?ids.length?'manual':'none':automatic?'auto':'none');
 const savedSelection=useRef(ids);
 const [query,setQuery]=useState('');
 const filtered=projects.filter(p=>p.title.toLowerCase().includes(query.toLowerCase()));
 const missing=ids.filter(id=>!projects.some(p=>p.id===id));
 const preview=entry?relatedWorkPreview({...entry,data},projects):projects.filter(p=>p.published&&ids.includes(p.id));
 function changeMode(next:Mode){if(mode==='manual')savedSelection.current=ids;setMode(next);onChange(next==='auto'?undefined:next==='none'?[]:savedSelection.current);}
 return <section className="project-picker"><div className="editor-section-heading"><span>Karya sebagai bukti</span><h3>Hubungkan dengan karya</h3><p className="form-help">Opsional. Pilih cara menampilkan proyek pendukung pada section ini.</p></div>
  <label>Pengaturan hubungan<select value={mode} onChange={event=>changeMode(event.target.value as Mode)}>{automatic&&<option value="auto">Otomatis dari isi & teknologi</option>}<option value="manual">Pilih sendiri</option><option value="none">Tanpa hubungan</option></select></label>
  {mode==='auto'&&<p className="form-help">Keahlian dicocokkan dengan nama teknologi proyek; layanan memakai kata kunci isi. Untuk mengatur hasil yang berbeda, gunakan Pilih sendiri.</p>}
  {mode==='manual'&&<><label>Cari proyek<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Ketik judul proyek…"/></label><div className="project-picker-options">{filtered.map(project=><Check key={project.id} label={`${project.title}${project.published?'':' · Draft'}`} checked={ids.includes(project.id)} onChange={checked=>{if(!checked||ids.length<30)onChange(checked?[...ids,project.id]:ids.filter(id=>id!==project.id));}}/>)}{!filtered.length&&<p className="form-help">{projects.length?'Tidak ada proyek yang cocok.':'Tambahkan proyek di menu Proyek terlebih dahulu.'}</p>}</div><p className="form-help">{ids.length}/30 dipilih. Proyek draft baru tampil setelah diterbitkan.</p>{missing.length>0&&<div className="project-picker-missing"><p>Beberapa proyek telah dihapus dan tidak akan tampil.</p><button type="button" className="text-button" onClick={()=>onChange(ids.filter(id=>!missing.includes(id)))}>Bersihkan tautan yang hilang</button></div>}</>}
  <div className="relation-preview" aria-live="polite"><strong>Akan tampil di website</strong>{preview.length?<ul>{preview.map(project=><li key={project.id}>{project.title}</li>)}</ul>:<p className="form-help">Tidak ada karya terkait yang ditampilkan.{mode==='auto'?' Belum ada proyek terbit yang cocok.':mode==='manual'?' Pilih proyek di atas untuk menambahkannya.':''}</p>}</div>
 </section>;
}
