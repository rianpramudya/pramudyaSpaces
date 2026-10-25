'use client';
import Link from 'next/link';
import {ArrowUpRight,Check} from 'lucide-react';
import {kindLabels,type PublicContent,type Kind} from '@/lib/model';
import {ContentMap} from './content-map';
import {mediaURL} from '@/lib/client-api';
export function Overview({content}:{content:PublicContent}){
 const drafts=content.records.filter(entry=>!entry.published);
 const published=content.records.filter(entry=>entry.published).length;
 const steps=[
  {title:'Ceritakan tentang Anda',description:'Nama, jabatan, ringkasan, dan foto profil.',href:'/admin/profile',done:Boolean(content.profile.name&&content.profile.headline&&content.profile.summary&&content.profile.photo)},
  {title:'Tampilkan karya pilihan',description:'Isi proyek satu kali; gunakan sebagai bukti di section lain.',href:'/admin/project',done:content.records.some(entry=>entry.kind==='project'&&entry.published)},
  {title:'Siapkan CV unggulan',description:'Pilih dokumen terbit untuk diunduh pengunjung.',href:'/admin/documents',done:content.documents.some(doc=>doc.published&&doc.id===content.profile.featured_cv)},
  {title:'Terbitkan profil',description:'Periksa hasil, lalu tampilkan profil untuk pengunjung.',href:'/admin/profile',done:content.profile.published},
 ];
 const next=steps.find(step=>!step.done);
 return <div className="workspace-overview">
  <section className="workspace-welcome"><div><span className="workspace-availability"><span/>{content.profile.published?'Website Anda sudah terbit':'Profil masih berupa draft'}</span><h2>{next?'Isi, susun, terbitkan.':'Ada karya baru?'}</h2><p>{next?next.description:'Perbarui proyek dan cerita di baliknya. Konten yang terhubung akan memakai sumber yang sama.'}</p><Link className="button primary" href={next?.href||'/admin/project?new=1'}>{next?.title||'Kelola karya'}<ArrowUpRight size={16}/></Link><div className="workspace-summary"><span><strong>{published}</strong> konten terbit</span><span><strong>{drafts.length}</strong> draft</span><span><strong>{content.documents.length}</strong> dokumen</span></div></div>
   <div className="workspace-profile">{content.profile.photo?<img className="workspace-portrait" src={mediaURL(content.profile.photo)} alt="" width={140} height={184}/>:<span className="workspace-monogram" aria-hidden="true">{content.profile.name?.trim().split(/\s+/).slice(0,2).map(word=>word[0]).join('')||'P'}</span>}<strong>{content.profile.name||'Portofolio Anda'}</strong><span>{content.profile.headline||'Mulai dengan identitas profesional Anda'}</span><Link className="text-button" href="/" target="_blank" rel="noopener noreferrer">Buka halaman utama<ArrowUpRight size={15}/></Link></div>
  </section>
  <div className="workspace-columns"><section className="admin-panel workspace-checklist"><div className="between"><div><span className="workspace-kicker">Alur penerbitan</span><h2>Langkah berikutnya</h2></div><span className="workspace-count">{steps.filter(step=>step.done).length} / {steps.length}</span></div>{steps.map((step,index)=><Link className="workspace-step" href={step.href} key={step.title}><span className={`workspace-check ${step.done?'complete':''}`}>{step.done?<Check size={16}/>:String(index+1).padStart(2,'0')}</span><div><strong>{step.title}</strong><p>{step.description}</p></div><ArrowUpRight size={16}/></Link>)}</section>
   <section className="admin-panel workspace-drafts"><div className="between"><div><span className="workspace-kicker">Belum diterbitkan</span><h2>Lanjutkan draft</h2></div><span className="workspace-count">{drafts.length}</span></div><p className="form-help">Tersimpan di dashboard; belum tampil untuk pengunjung.</p>{drafts.length?drafts.slice(0,5).map(entry=><Link className="workspace-draft" key={entry.id} href={`/admin/${entry.kind}?edit=${entry.id}`}><div><span className="form-help">{kindLabels[entry.kind as Kind]}</span><strong>{entry.title}</strong></div><ArrowUpRight size={16}/></Link>):<div className="workspace-clear"><Check size={20}/><p>Tidak ada draft tertunda.</p><Link className="text-button" href="/admin/project">Tambah karya baru<ArrowUpRight size={15}/></Link></div>}</section>
  </div><ContentMap content={content}/>
 </div>;
}
