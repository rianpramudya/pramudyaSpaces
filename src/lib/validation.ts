import { RUNNER_RULES } from './runner-game';
import { z } from 'zod';
import { kinds,sectionCopyKeys } from './model';
const short = z.string().trim().max(240);
const url = z.string().trim().max(2000).refine(v => !v || /^https?:\/\//i.test(v), 'Gunakan tautan http atau https.');
const path = z.string().max(300).refine(v => !v || /^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/.test(v) && !v.includes('..'), 'Path media tidak valid.');
const text = z.string().trim().max(10000);
export const profileSchema = z.object({
 section_copy:z.partialRecord(z.enum(sectionCopyKeys),z.string().trim().max(2000)).default({}),
 id:z.literal('main').default('main'), name:short, wordmark:short, headline:short, summary:text, location:short,
 email:z.union([z.literal(''),z.email()]), phone:short, show_email:z.boolean(),show_phone:z.boolean(), photo:path,photo_alt:short,hero_photo:path.default(''),hero_reveal_photo:path.default(''),hero_photo_alt:short.default(''),
 status:z.enum(['open','working','hidden']),published:z.boolean(),socials:z.array(z.object({label:short,url})).max(10),featured_cv:z.string().max(100),
 letter_recipient:short,letter_role:short,letter_body:text,
});
export const dataSchema = z.object({
 related_project_ids:z.array(z.uuid()).max(30).transform(ids=>[...new Set(ids)]).optional(),
 related_certificate_ids:z.array(z.uuid()).max(30).transform(ids=>[...new Set(ids)]).optional(),
 description:text.optional(),role:short.optional(),organization:short.optional(),type:z.enum(['work','organization']).optional(),start:short.optional(),end:short.optional(),current:z.boolean().optional(),
 technologies:z.array(short).max(50).transform(values=>[...new Set(values.filter(Boolean))]).optional(),url:url.optional(),repository:url.optional(),media:z.array(path).max(10).optional(),alt:short.optional(),featured:z.boolean().optional(),
 context:text.optional(),result:text.optional(),result_source:url.optional(),paper:url.optional(),bullets:z.array(z.string().trim().max(2000)).max(30).optional(),category:short.optional(),issuer:short.optional(),date:short.optional(),credential:short.optional(),degree:short.optional(),gpa:short.optional(),level:short.optional(),
});
export const entrySchema = z.object({id:z.uuid().optional(),kind:z.enum(kinds),title:z.string().trim().min(1).max(240),published:z.boolean(),position:z.number().int().min(0).max(100000),data:dataSchema}).transform(entry=>{if(entry.kind==='experience'&&entry.data.role?.toLowerCase()===entry.title.toLowerCase()){const data={...entry.data};delete data.role;return {...entry,data};}return entry;});
export const contactSchema = z.object({name:z.string().trim().min(2).max(100),email:z.email().max(254),subject:z.string().trim().min(2).max(200),message:z.string().trim().min(10).max(5000),website:z.string().max(200).default('')});
export const guestbookSchema = z.object({body:z.string().trim().min(1).max(500)});
export const chatSchema = z.object({message:z.string().trim().min(1).max(1000),language:z.enum(['id','en']).default('id'),session:z.uuid(),history:z.array(z.object({role:z.enum(['user','model']),text:z.string().max(3000)})).max(10).default([])});
export function validateUpload(bytes: Uint8Array, mime:string, size:number):string {
 const b=Buffer.from(bytes); let extension='';
 if(mime==='application/pdf' && b.subarray(0,5).toString()==='%PDF-') extension='pdf';
 if(mime==='image/png' && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension='png';
 if(mime==='image/jpeg' && b[0]===255 && b[1]===216 && b[2]===255) extension='jpg';
 if(mime==='image/webp' && b.subarray(0,4).toString()==='RIFF' && b.subarray(8,12).toString()==='WEBP') extension='webp';
 if(!extension) throw new z.ZodError([{code:'custom',path:[],message:'Berkas harus JPEG, PNG, WebP, atau PDF asli.'}]);
 if(size>(extension==='pdf'?10:5)*1024*1024 || size<1) throw new z.ZodError([{code:'custom',path:[],message:'Ukuran maksimum gambar 5 MB dan PDF 10 MB.'}]);
 return extension;
}

export const sectionDescriptionSchema=z.object({key:z.enum(['projects_description','services_description','journey_description','skills_description','certificates_description','contact_description']),value:z.string().trim().max(2000)});

export const gameScoreSchema = z.object({session:z.uuid(),score:z.number().int().min(0).max(RUNNER_RULES.maxScore)}).strict();
export const gamePrivacySchema = z.object({show_on_board:z.boolean()}).strict();
