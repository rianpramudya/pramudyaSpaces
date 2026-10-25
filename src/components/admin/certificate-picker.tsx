'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {type Entry,type Kind,kindLabels,listValue,textValue} from '@/lib/model';
import {selectedCertificates,certificateConnections} from '@/lib/certificate-relations';
import {Check} from './fields';
export function CertificatePicker({data,certificates,onChange}:{data:Record<string,unknown>;certificates:Entry[];onChange:(ids:string[])=>void}){
  const [query,setQuery]=useState('');
  const ids=listValue(data,'related_certificate_ids');
  const filtered=certificates.filter(item=>`${item.title} ${textValue(item.data,'issuer')}`.toLowerCase().includes(query.toLowerCase()));
  const visible=selectedCertificates({data},certificates);
  const missing=ids.filter(id=>!certificates.some(item=>item.id===id));
  return <section className="project-picker"><div className="editor-section-heading"><span>Bukti pengalaman & pembelajaran</span><h3>Sertifikat pendukung</h3><p className="form-help">Pilih sertifikat yang sudah tersimpan. Satu sertifikat bisa mendukung beberapa konten tanpa diunggah ulang.</p></div>
    <label>Cari sertifikat<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Judul atau penerbit sertifikat…"/></label>
    <div className="project-picker-options">{filtered.map(item=><Check key={item.id} label={`${item.title}${item.published?'':' · Draft'}`} checked={ids.includes(item.id)} onChange={checked=>{if(!checked||ids.length<30)onChange(checked?[...ids,item.id]:ids.filter(id=>id!==item.id));}}/>)}{!filtered.length&&<p className="form-help">{certificates.length?'Tidak ada sertifikat yang cocok.':'Belum ada sertifikat. Tambahkan di menu Sertifikat, lalu pilih di sini.'}</p>}</div>
    <p className="form-help">{ids.length}/30 dipilih. Pilihan kosong berarti tanpa sertifikat pendukung. Sertifikat draft baru tampil setelah diterbitkan.</p>
    {ids.length>0&&<button type="button" className="text-button" onClick={()=>onChange([])}>Lepaskan semua pilihan</button>}
    {missing.length>0&&<div className="project-picker-missing"><p>Terdapat sertifikat yang sudah dihapus dan tidak akan tampil.</p><button type="button" className="text-button" onClick={()=>onChange(ids.filter(id=>!missing.includes(id)))}>Bersihkan tautan yang hilang</button></div>}
    <div className="relation-preview" aria-live="polite"><strong>Akan tampil di website</strong>{visible.length?<ul>{visible.map(item=><li key={item.id}>{item.title}</li>)}</ul>:<p className="form-help">Belum ada sertifikat terbit yang dipilih.</p>}</div>
  </section>;
}
export function CertificateConnections({certificate,records}:{certificate:Entry;records:Entry[]}){
  const connections=certificateConnections(certificate,records);
  return <section className="project-connections"><div className="editor-section-heading"><span>Terhubung di website</span><h3>Sertifikat ini mendukung konten apa?</h3></div><p className="form-help">Atur hubungan dari editor pengalaman, bahasa, atau pendidikan. Konten dan sertifikat harus terbit agar tautannya tampil di website.</p>{connections.length?<ul>{connections.map(entry=><li key={entry.id}><Link href={`/admin/${entry.kind}?edit=${entry.id}`} target="_blank" rel="noopener noreferrer"><span><small>{kindLabels[entry.kind as Kind]}{!entry.published?' · Draft':''}</small><strong>{entry.title}</strong></span><ArrowUpRight size={16}/></Link></li>)}</ul>:<p className="form-help">Belum ditautkan ke konten lain.</p>}</section>;
}
