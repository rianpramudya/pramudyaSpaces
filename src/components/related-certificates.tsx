import {ArrowUpRight} from 'lucide-react';
import type {Entry} from '@/lib/model';
import {selectedCertificates} from '@/lib/certificate-relations';
export function RelatedCertificates({entry,certificates,en}:{entry:Entry;certificates:Entry[];en:boolean}){
  const related=selectedCertificates(entry,certificates);
  if(!related.length)return null;
  return <div className="related-work-links certificate-links"><span>{en?'Supporting certificates':'Sertifikat pendukung'}</span>{related.map(item=><a key={item.id} href={`#certificate-${item.id}`}>{item.title}<ArrowUpRight size={14}/></a>)}</div>;
}
