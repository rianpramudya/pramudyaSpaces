import type {Entry} from './model';
// Keep anchor navigation in the same reading order as StudioHome.
export function siteNavigation(records:Entry[],en:boolean):string[][]{
 const kinds=new Set(records.filter(entry=>entry.published).map(entry=>entry.kind));
 return [
  ['home',en?'Home':'Beranda'],
  ['about',en?'About':'Tentang'],
  ...(['education','language','achievement'].some(kind=>kinds.has(kind))?[['background',en?'Background':'Latar belakang']]:[]),
  ...(kinds.has('experience')?[['journey',en?'Experience':'Pengalaman']]:[]),
  ['projects',en?'Projects':'Proyek'],
  ...(kinds.has('skill')?[['skills',en?'Skills & competencies':'Keahlian & kompetensi']]:[]),
  ...(kinds.has('certificate')?[['certificates',en?'Certificates':'Sertifikat']]:[]),
  ...(kinds.has('service')?[['services',en?'Services':'Layanan']]:[]),
  ['playground',en?'Playground':'Ruang bermain'],
  ['contact',en?'Contact':'Kontak'],
 ];
}
