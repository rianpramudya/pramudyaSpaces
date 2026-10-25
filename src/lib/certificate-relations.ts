import {type Entry,listValue} from './model';
export const certificateSourceKinds=['experience','language','education'] as const;
export function selectedCertificates(entry:Pick<Entry,'data'>,certificates:Entry[]):Entry[]{
  const available=new Map(certificates.filter(item=>item.kind==='certificate'&&item.published).map(item=>[item.id,item]));
  return [...new Set(listValue(entry.data,'related_certificate_ids'))].flatMap(id=>{const item=available.get(id);return item?[item]:[];});
}
export function certificateFromHash(hash:string,certificates:Entry[]){
  return certificates.find(item=>item.kind==='certificate'&&item.published&&hash===`#certificate-${item.id}`);
}
export function certificateConnections(certificate:Entry,records:Entry[]){
  return records.filter(entry=>certificateSourceKinds.some(kind=>kind===entry.kind)&&listValue(entry.data,'related_certificate_ids').includes(certificate.id));
}
