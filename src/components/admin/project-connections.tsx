import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {type Entry,kindLabels,type Kind} from '@/lib/model';
import {projectConnections} from '@/lib/admin-relations';
export function ProjectConnections({project,records}:{project:Entry;records:Entry[]}) {
  const connections=projectConnections(project,records);
  return <section className="project-connections" aria-label="Konten yang terhubung dengan proyek"><div className="editor-section-heading"><span>Terhubung di website</span><h3>Proyek ini dipakai di mana?</h3></div><p className="form-help">Hubungan manual mengikuti pilihan pada konten sumber. Hubungan otomatis mengikuti isi dan teknologi proyek; hanya konten terbit yang tampil untuk pengunjung.</p>
    {connections.length?<ul>{connections.map(({entry,mode})=><li key={entry.id}><Link href={`/admin/${entry.kind}?edit=${entry.id}`} target="_blank" rel="noopener noreferrer"><span><small>{kindLabels[entry.kind as Kind]} · {mode==='auto'?'Otomatis':'Pilihan manual'}{!entry.published?' · Draft':''}</small><strong>{entry.title}</strong></span><ArrowUpRight size={16}/></Link></li>)}</ul>:<p className="form-help">Belum ada konten yang memakai proyek ini. Hubungkan melalui editor keahlian, layanan, atau pengalaman setelah menyimpan proyek.</p>}
  </section>;
}
