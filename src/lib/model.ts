export const kinds = ['project', 'experience', 'education', 'service', 'skill', 'certificate', 'achievement', 'language'] as const;
export type Kind = typeof kinds[number];
export type Entry = { id: string; kind: string; title: string; published: boolean; position: number; data: Record<string, unknown>; updated_at?: string };
export const sectionCopyKeys = ['projects_title','projects_description','services_title','services_description','journey_title','journey_description','skills_title','skills_description','certificates_title','certificates_description','contact_title','contact_description'] as const;
export type Profile = {
 section_copy: Record<string,string>;
 id: string; name: string; wordmark: string; headline: string; summary: string; location: string;
 email: string; phone: string; show_email: boolean; show_phone: boolean; photo: string;
 photo_alt: string; status: string; published: boolean; socials: { label: string; url: string }[];
 featured_cv: string; letter_recipient: string; letter_role: string; letter_body: string;
};
export type PublicContent = { profile: Profile; records: Entry[]; documents: CareerDocument[] };
export type CareerDocument = { id: string; title: string; format: string; path: string; published: boolean; created_at: string; source_hash?: string };
export const emptyProfile: Profile = {
 section_copy: {}, id: 'main', name: '', wordmark: '', headline: '', summary: '', location: '', email: '', phone: '', show_email: false, show_phone: false,
 photo: '', photo_alt: '', status: 'hidden', published: false, socials: [], featured_cv: '', letter_recipient: '', letter_role: '', letter_body: '',
};
export const kindLabels: Record<Kind, string> = { project: 'Proyek', experience: 'Pengalaman', education: 'Pendidikan', service: 'Layanan', skill: 'Skills', certificate: 'Sertifikat', achievement: 'Pencapaian', language: 'Bahasa' };
export function textValue(data: Record<string, unknown>, key: string): string { return typeof data[key] === 'string' ? data[key] as string : ''; }
export function listValue(data: Record<string, unknown>, key: string): string[] { return Array.isArray(data[key]) ? (data[key] as unknown[]).filter((v): v is string => typeof v === 'string') : []; }
