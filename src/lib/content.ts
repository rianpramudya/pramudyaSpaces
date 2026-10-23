import { createHash } from 'node:crypto';
import { emptyProfile, type Profile, type Entry, type PublicContent, type CareerDocument, kinds, sectionCopyKeys } from './model';
export const publicDataKeys = ['description', 'role', 'organization', 'type', 'start', 'end', 'current', 'technologies', 'url', 'repository', 'media', 'alt', 'featured', 'context', 'result', 'bullets', 'category', 'issuer', 'date', 'credential', 'degree', 'gpa', 'level', 'related_project_ids'] as const;
const translatedDataKeys = ['description', 'role', 'context', 'result', 'bullets', 'category', 'degree', 'level'];
export function projectPublicContent(profile: Profile, entries: Entry[], documents: CareerDocument[] = []): PublicContent {
 const clean: Profile = profile.published ? {
  ...emptyProfile, name: profile.name, wordmark: profile.wordmark, headline: profile.headline, summary: profile.summary,
  hero_photo:profile.hero_photo||'',hero_reveal_photo:profile.hero_reveal_photo||'',hero_photo_alt:profile.hero_photo_alt||'',
  location: profile.location, photo: profile.photo, photo_alt: profile.photo_alt, status: profile.status,
  email: profile.show_email ? profile.email : '', phone: profile.show_phone ? profile.phone : '',
  show_email: profile.show_email, show_phone: profile.show_phone, published: true,
  socials: profile.socials, featured_cv: profile.featured_cv, section_copy: profile.section_copy||{},
 } : { ...emptyProfile };
 const visibleProjects=new Set(entries.filter(e=>e.published&&e.kind==='project').map(e=>e.id));
 const records = entries.filter(e => e.published && kinds.includes(e.kind as typeof kinds[number])).sort((a,b) => a.position - b.position).map(e => {
  const data=Object.fromEntries(publicDataKeys.filter(key=>e.data[key]!==undefined).map(key=>[key,e.data[key]]));
  if(data.related_project_ids!==undefined){const ids=data.related_project_ids;data.related_project_ids=Array.isArray(ids)?[...new Set(ids.filter(id=>typeof id==='string'&&visibleProjects.has(id)))]:[];}
  return {id:e.id,kind:e.kind,title:e.title,position:e.position,published:true,data};
 });
 return { profile: clean, records, documents: documents.filter(d => d.published).map(d => ({ id:d.id, title:d.title, format:d.format, path:d.path, published:true, created_at:d.created_at })) };
}
export function sourceFingerprint(value: unknown): string { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
export function safeReturnPath(path: string | null): string {
 return path && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') && !/[\r\n]/.test(path) ? path : '/';
}
export function translationInput(content: PublicContent) {
 return { profile: { headline: content.profile.headline, summary: content.profile.summary, photo_alt: content.profile.photo_alt,hero_photo_alt:content.profile.hero_photo_alt, section_copy: content.profile.section_copy }, records: content.records.map(e => ({ id:e.id, title: e.title, data: Object.fromEntries(translatedDataKeys.filter(k => e.data[k] !== undefined).map(k=>[k,e.data[k]])) })) };
}
export function translatePublicContent(content: PublicContent, translated: unknown): PublicContent {
 if (!translated || typeof translated !== 'object') return content;
 const value = translated as { profile?: Record<string,unknown>; records?: {id:string;title?:string;data?:Record<string,unknown>}[] };
 const profile = { ...content.profile,section_copy:{...content.profile.section_copy} };
 if(value.profile?.section_copy && typeof value.profile.section_copy==='object'){const copy=value.profile.section_copy as Record<string,unknown>;for(const key of sectionCopyKeys)if(typeof copy[key]==='string')profile.section_copy[key]=copy[key] as string;}
 for (const k of ['headline','summary','photo_alt','hero_photo_alt'] as const) if (typeof value.profile?.[k] === 'string') profile[k] = value.profile[k] as string;
 return { ...content, profile, records: content.records.map(entry => {
  const t = Array.isArray(value.records) ? value.records.find(t => t.id === entry.id) : undefined;
  const data = {...entry.data};
  for (const k of translatedDataKeys) if (typeof t?.data?.[k] === 'string' || (k === 'bullets' && Array.isArray(t?.data?.[k]) && (t?.data?.[k] as unknown[]).every(v=>typeof v==='string'))) data[k] = t!.data![k];
  return {...entry, title: typeof t?.title === 'string' && t.title ? t.title : entry.title, data};
 }) };
}
export function publicMediaPaths(content: PublicContent): Set<string> {
 return new Set([content.profile.photo,content.profile.hero_photo||'',content.profile.hero_reveal_photo||'', ...content.records.flatMap(e => Array.isArray(e.data.media) ? e.data.media as string[] : []), ...content.documents.map(d => d.path)].filter(Boolean));
}
