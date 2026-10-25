import Link from 'next/link';
import {ArrowUpRight,Link2} from 'lucide-react';
import {type Entry,type Kind,type PublicContent} from '@/lib/model';
import {certificateSourceKinds} from '@/lib/certificate-relations';
const sections:Partial<Record<Kind,{name:string;anchor:string;hint:string}>>={
 project:{name:'Karya pilihan',anchor:'projects',hint:'Isi proyek terlebih dahulu. Teknologi, layanan, dan pengalaman dapat merujuk ke karya ini.'},
 skill:{name:'Perangkat kerja',anchor:'skills',hint:'Kelompokkan teknologi, lalu pilih proyek sebagai contoh penerapannya.'},
 service:{name:'Yang bisa kita bangun',anchor:'services',hint:'Tulis layanan dan pilih karya relevan yang menjadi contoh untuk pengunjung.'},
 experience:{name:'Perjalanan',anchor:'journey',hint:'Lengkapi peran dan kontribusi. Tautkan proyek yang dikerjakan atau sertifikat pendukung.'},
 education:{name:'Latar belakang',anchor:'background',hint:'Tambahkan pendidikan, lalu pilih karya atau sertifikat sebagai bukti pembelajaran.'},
 language:{name:'Bahasa',anchor:'background',hint:'Tulis kemampuan bahasa dan pilih sertifikat asesmen, misalnya TOEFL atau EPrT.'},
 achievement:{name:'Pencapaian',anchor:'background',hint:'Lengkapi pencapaian dengan karya terkait jika tersedia.'},
 certificate:{name:'Arsip pembelajaran',anchor:'certificates',hint:'Tambahkan pelatihan atau sertifikat, lalu pilih karya yang menerapkan ilmunya.'},
};
export function CollectionGuide({kind,records}:{kind:Kind;records:Entry[]}){
 const section=sections[kind];if(!section)return null;
 const certificateLinks=records.filter(entry=>Array.isArray(entry.data.related_certificate_ids)&&entry.data.related_certificate_ids.length>0).length;
 const linked=records.filter(entry=>Array.isArray(entry.data.related_project_ids)&&entry.data.related_project_ids.length>0).length;
 return <aside className="collection-guide"><div><span>Tampil di halaman utama / {section.name}</span><p>{section.hint}</p>{kind!=='project'&&kind!=='language'&&<small><Link2 size={13}/>{linked} konten memiliki pilihan karya. Atur hubungan saat mengedit konten.</small>}{certificateSourceKinds.some(source=>source===kind)&&<small><Link2 size={13}/>{certificateLinks} konten memiliki pilihan sertifikat pendukung.</small>}</div><Link href={`/#${section.anchor}`} target="_blank" rel="noopener noreferrer">Lihat section<ArrowUpRight size={15}/></Link></aside>;
}
export function ContentMap({content}:{content:PublicContent}){
 return <section className="content-map"><header><div><span className="form-help">Peta halaman utama</span><h2>Tempat setiap konten tampil.</h2><p>Mulai dari profil dan karya, lalu lengkapi section pendukungnya.</p></div><Link className="button" href="/" target="_blank" rel="noopener noreferrer">Pratinjau website<ArrowUpRight size={15}/></Link></header><div className="content-map-rows"><Link href="/admin/profile"><span>01</span><div><strong>Identitas, hero & kontak</strong><small>Nama, foto, cerita, pengantar kontak, dan visibilitas profil.</small></div><span>{content.profile.published?'Terbit':'Draft'}</span><ArrowUpRight size={17}/></Link>{(['project','skill','service','experience','education','certificate','achievement','language'] as Kind[]).map((kind,index)=>{const items=content.records.filter(entry=>entry.kind===kind),section=sections[kind]!;return <Link href={`/admin/${kind}`} key={kind}><span>{String(index+2).padStart(2,'0')}</span><div><strong>{section.name}</strong><small>{section.hint}</small></div><span>{items.filter(entry=>entry.published).length} terbit{items.some(entry=>!entry.published)&&` · ${items.filter(entry=>!entry.published).length} draft`}</span><ArrowUpRight size={17}/></Link>;})}</div></section>;
}
