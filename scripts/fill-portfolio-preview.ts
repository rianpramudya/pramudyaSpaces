import fs from 'node:fs';
import sharp from 'sharp';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Portfolio} from '../src/components/portfolio';
import {createClient} from '@supabase/supabase-js';
import {entrySchema,profileSchema} from '../src/lib/validation';
import {projectPublicContent} from '../src/lib/content';
import {translationSegments} from '../src/lib/translation-segments';
import {renderCareerPDF} from '../src/lib/career-pdf';
process.loadEnvFile('.env.local');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
const cv=JSON.parse(fs.readFileSync('docs/cv-content-prepared.json','utf8'));
const tables=['profile','entries','documents','media','translations','inbox','guestbook'];
const snapshot:Record<string,any[]>={};
for(const table of tables){const r=await db.from(table).select('*');if(r.error)throw new Error(`Read ${table} failed`);snapshot[table]=r.data;}
const apply=process.argv.includes('--apply');
fs.mkdirSync('.local-preview/uploads',{recursive:true,mode:0o700});
fs.mkdirSync('.local-backups',{recursive:true,mode:0o700});
const backup=`.local-backups/portfolio-before-full-preview-${Date.now()}.json`;
fs.writeFileSync(backup,JSON.stringify(snapshot,null,2),{mode:0o600});
const profile={...snapshot.profile[0]};const entries=[...snapshot.entries];
const seedTag='full-preview-2026-10-12';const mediaPaths:string[]=[];
function esc(value:string){return value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}
async function cover(label:string,caption:string,index:number){
 const path=`uploads/demo-${seedTag}-${index}.png`;mediaPaths.push(path);
 const dark=index%2===0,bg=dark?'#14171b':'#edf0f4',ink=dark?'#f5f6f8':'#1b2029',surface=dark?'#242a33':'#ffffff',muted=dark?'#b3bdcd':'#657083';
 const title=label.length>43?label.slice(0,40)+'…':label;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="${bg}"/><g font-family="Arial,sans-serif"><text x="72" y="86" font-size="20" fill="${muted}">RIAN PRAMUDYA AMANDA / CONCEPT PREVIEW</text><text x="72" y="155" font-size="37" font-weight="700" fill="${ink}">${esc(title)}</text><text x="72" y="199" font-size="20" fill="${muted}">${esc(caption)}</text><rect x="72" y="250" width="1056" height="438" rx="24" fill="${surface}" stroke="${muted}" stroke-width="2"/><rect x="96" y="274" width="170" height="388" rx="16" fill="${bg}"/><circle cx="128" cy="306" r="8" fill="${ink}"/><path d="M120 352h112M120 390h82M120 428h112M120 466h66" stroke="${muted}" stroke-width="8" stroke-linecap="round"/><rect x="298" y="284" width="802" height="45" rx="12" fill="${bg}"/>${[0,1,2].map(i=>`<rect x="${298+i*274}" y="357" width="254" height="93" rx="14" fill="${bg}"/><text x="${318+i*274}" y="416" font-size="28" fill="${ink}" font-weight="700">${['Explore','Build','Improve'][i]}</text>`).join('')}<path d="M324 590L424 545L524 568L624 488L724 528L824 478L1038 508" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><text x="72" y="747" font-size="21" fill="${muted}">DATA DUMMY — ilustrasi konsep, bukan screenshot atau sertifikat asli.</text></g></svg>`;
 const buffer=await sharp(Buffer.from(svg)).png().toBuffer();
 fs.writeFileSync(`.local-preview/${path}`,buffer,{mode:0o600});if(!apply)return path;
 const upload=await db.storage.from('portfolio').upload(path,buffer,{contentType:'image/png',upsert:true});if(upload.error)throw new Error('Cover upload failed');
 const saved=await db.from('media').upsert({path,name:`Dummy — ${label}.png`,mime:'image/png',size:buffer.length});if(saved.error)throw new Error('Media save failed');return path;
}
Object.assign(profile,{name:cv.profile.name,headline:cv.profile.headline,summary:cv.profile.summary,email:cv.profile.email,phone:cv.profile.phone,published:true,photo_alt:'Foto profil Rian Pramudya Amanda',show_email:true,show_phone:true});
profile.location=profile.location||'Bandung';
profile.socials=Array.from(new Map([...profile.socials,...cv.profile.socials,{label:'GitHub',url:'https://github.com/rianpramudya'}].map((s:any)=>[s.url.replace(/\/$/,''),s])).values());
profile.section_copy={...profile.section_copy,projects_title:'Karya pilihan',projects_description:'Dari portal pemerintahan hingga aplikasi AI: proyek yang tercantum dalam CV saya. Gambar sampul berlabel dummy adalah ilustrasi konsep, bukan screenshot produk asli.',services_title:'Yang bisa kita bangun',services_description:'Data dummy untuk melihat tampilan layanan. Penawaran, lingkup kerja, dan ketersediaan belum dikonfirmasi.',journey_title:'Perjalanan saya',journey_description:'Pengalaman kerja dan organisasi yang membentuk cara saya merancang, membangun, dan berkolaborasi.',skills_title:'Perangkat kerja saya',skills_description:'Teknologi, alat, dan kompetensi yang tercantum dalam CV. Saya menggabungkan pengembangan web, eksplorasi AI, dan desain antarmuka.',certificates_title:'Belajar, lalu menerapkan',certificates_description:'Hasil asesmen bahasa dan pelatihan dari CV. Ilustrasi pendukung berlabel dummy bukan salinan sertifikat resmi.',contact_title:'Mari bertukar ide',contact_description:'Punya ide website, ingin berdiskusi tentang proyek, atau sekadar menyapa? Ceritakan melalui form ini. Layanan dan pencapaian berlabel dummy hanya contoh tampilan.'};
profile.letter_recipient=profile.letter_recipient||'Tim Rekrutmen PT Contoh Digital (dummy)';profile.letter_role=profile.letter_role||'Lamaran Full Stack Web Developer — contoh dummy';profile.letter_body=profile.letter_body||'CONTOH SURAT LAMARAN / DATA DUMMY\n\nYth. Tim Rekrutmen,\n\nSaya Rian Pramudya Amanda, lulusan Informatika Telkom University. Saya memiliki pengalaman pengembangan web full-stack, proyek berbasis Machine Learning, serta pemanfaatan Generative AI dalam alur pengembangan perangkat lunak.\n\nMelalui contoh surat ini, saya menunjukkan format dokumen lamaran yang dapat dihasilkan dari data CMS. Perusahaan dan konteks lamaran merupakan dummy, bukan lamaran yang telah dikirim.\n\nTerima kasih atas perhatian Anda.';
const descriptions:Record<string,string>={
 'FullStack Web Developer Intern':'Berpartisipasi dalam pengembangan ekosistem portal digital Kabupaten Subang, termasuk website profil 30 Kecamatan dan 30 OPD. Pengalaman ini tercantum pada CV.',
 'Information & Communication Media Staff':'Mengelola identitas visual dan konten media HIMA IF Telkom University, serta berkolaborasi dengan pemangku kepentingan untuk mendukung program organisasi.',
 'Telkom University':'Studi S1 Informatika dengan fokus pada pengembangan perangkat lunak, Machine Learning, dan penerapan teknologi melalui proyek praktis.',
 'TOEFL Prediction Test — Score 640':'Hasil TOEFL Prediction Test dengan skor 640 yang tercantum dalam CV. Gunakan tautan verifikasi untuk memeriksa sertifikat.',
 'EPrT (English Proficiency Test) — Score 467':'Hasil English Proficiency Test (EPrT) dengan skor 467 dari Telkom University Language Center, sesuai CV.',
 'Preparation Course for Azure AI Fundamentals (AI-900)':'Pelatihan persiapan Azure AI Fundamentals (AI-900) yang tercantum dalam CV. Ini bukan klaim telah memperoleh sertifikasi ujian AI-900.'};
for(const source of cv.records){
 let entry=entries.find(e=>e.kind===source.kind&&e.title===source.title);
 if(!entry){entry={...source,id:crypto.randomUUID()};entries.push(entry);}
 entry.data={...source.data,...entry.data};entry.published=true;
 if(!entry.data.description&&descriptions[entry.title])entry.data.description=descriptions[entry.title];
 if(source.kind==='project'){
  entry.data.context=entry.data.context||`Konteks proyek sesuai CV: ${entry.data.description}`;
  entry.data.result=entry.data.result||'Implementasi dan kontribusi dijelaskan pada poin proyek di bawah. Tidak ada metrik tambahan di luar informasi CV.';
  if(!entry.data.media?.length)entry.data.media=[await cover(entry.title,entry.data.technologies?.join(' / ')||'Portfolio project',cv.records.filter((x:any)=>x.kind==='project').findIndex((x:any)=>x.title===entry.title))];
  entry.data.alt=entry.data.alt||`Ilustrasi konsep dummy untuk ${entry.title}, bukan screenshot asli.`;
 }
 if(source.kind==='certificate'&&!entry.data.media?.length){entry.data.media=[await cover(entry.title,'Ilustrasi portofolio — bukan sertifikat resmi',10+source.position)];entry.data.alt='Gambar pendukung dummy, bukan salinan sertifikat resmi.';}
}
// Preserve obvious early test entries as drafts instead of deleting them.
for(const e of entries)if(['ghnghn','mnjhmhjmm'].includes(e.title))e.published=false;
function add(kind:string,title:string,data:Record<string,unknown>,position:number){let e=entries.find(x=>x.kind===kind&&x.title===title);if(!e){e={id:crypto.randomUUID(),kind,title,position};entries.push(e);}Object.assign(e,{published:true,data});}
const services=[['Website & dashboard (dummy)','Contoh layanan: merancang website responsif dan dashboard pengelolaan konten. Isi ini dummy; lingkup, harga, dan ketersediaan perlu Anda konfirmasi.'],['Integrasi API & otomasi (dummy)','Contoh layanan: menghubungkan API dan merapikan alur kerja aplikasi. Ini data dummy untuk preview, bukan penawaran aktif.'],['Prototipe AI & data (dummy)','Contoh layanan: eksplorasi aplikasi Machine Learning, rekomendasi, dan visualisasi data. Ini data dummy; hasil dan kelayakan dibahas per proyek.']];
for(let i=0;i<services.length;i++)add('service',services[i][0],{description:services[i][1],url:'',media:[await cover(services[i][0],'Contoh layanan — data dummy',20+i)],alt:'Ilustrasi dummy layanan untuk preview website.'},i);
add('achievement','Finalis kompetisi inovasi digital (dummy)',{date:'2026 — contoh',description:'Data dummy untuk menampilkan kartu pencapaian. Ini bukan prestasi nyata dan tidak tercantum dalam CV.',bullets:['Contoh ruang untuk ringkasan kompetisi.','Ganti dengan pencapaian sebenarnya sebelum menggunakan portofolio profesional.']},0);
add('achievement','Karya pilihan komunitas developer (dummy)',{date:'2025 — contoh',description:'Data dummy: contoh format apresiasi komunitas. Tidak menyatakan penghargaan atau dukungan dari organisasi tertentu.'},1);
const indonesian=entries.find(e=>e.kind==='language'&&e.title==='Indonesia');if(indonesian){indonesian.published=true;indonesian.data.description='Bahasa yang digunakan dalam komunikasi dan konten portofolio ini.';}else add('language','Indonesia',{level:'Bahasa komunikasi',description:'Bahasa yang digunakan dalam komunikasi dan konten portofolio ini.'},0);
add('language','English',{level:'TOEFL Prediction 640 · EPrT 467',description:'Hasil asesmen diambil dari CV; tidak menetapkan tingkat CEFR yang belum terverifikasi.'},1);
const validProfile=profileSchema.parse(profile);const validEntries=entries.map(e=>{const value=entrySchema.parse(e);if(!value.id)throw new Error('Entry ID missing');return {...value,id:value.id};});
if(!apply){
 const previewDocs=[];for(const format of ['ats','creative','letter'] as const){const buffer=await renderCareerPDF(validProfile,validEntries.filter(e=>!e.title.includes('(dummy)')&&!['ghnghn','mnjhmhjmm'].includes(e.title)),format);const path=`uploads/preview-${format}.pdf`;fs.writeFileSync(`.local-preview/${path}`,buffer,{mode:0o600});previewDocs.push({id:crypto.randomUUID(),title:format==='letter'?'Contoh surat lamaran (dummy)':`CV ${format} — data CV`,format,path,published:format!=='letter',created_at:new Date().toISOString()});}
 const profileForPreview={...validProfile,featured_cv:previewDocs[0].id};
 fs.writeFileSync('.local-preview/proposed-content.json',JSON.stringify({profile:profileForPreview,records:validEntries,documents:previewDocs},null,2),{mode:0o600});
 const view=projectPublicContent(profileForPreview,validEntries,previewDocs);let markup=renderToStaticMarkup(React.createElement(Portfolio,{initial:view}));markup=markup.replaceAll('/api/media/uploads/demo-','./uploads/demo-').replaceAll('/api/media/uploads/preview-','./uploads/preview-').replaceAll('/api/media/uploads/','http://127.0.0.1:3100/api/media/uploads/').replaceAll('href="/projects/','href="http://127.0.0.1:3100/projects/');
 const styles=['globals','portfolio','hybrid','hero-chase'].map(name=>fs.readFileSync(`src/app/${name}.css`,'utf8')).join('\n');fs.writeFileSync('.local-preview/index.html',`<!doctype html><html lang="id" data-theme="light"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Preview lokal — Rian Pramudya Amanda</title><style>${styles}</style></head><body>${markup}</body></html>`,{mode:0o600});
 console.log(JSON.stringify({dryRun:true,localPreview:'.local-preview/index.html',backup,totalEntries:validEntries.length,kinds:Object.fromEntries(['project','experience','education','service','skill','certificate','achievement','language'].map(k=>[k,validEntries.filter(e=>e.kind===k&&e.published).length])),media:mediaPaths.length}));process.exit(0);}
for(const [table,rows] of [['profile',[validProfile]],['entries',validEntries]] as const){const r=await db.from(table).upsert(rows.map(row=>({...row,updated_at:new Date().toISOString()})));if(r.error)throw new Error(`Save ${table} failed: ${r.error.code}`);}
const generatedDocuments:any[]=[];
for(const format of ['ats','creative','letter'] as const){
 const title=format==='letter'?'Contoh surat lamaran (dummy) — Rian Pramudya Amanda':`CV ${format==='ats'?'ATS':'Kreatif'} — Rian Pramudya Amanda (data CV)`;
 const existing=snapshot.documents.find(d=>d.title===title&&d.format===format);
 const path=existing?.path||`uploads/${crypto.randomUUID()}.pdf`;
 const factRecords=validEntries.filter(e=>!e.title.includes('(dummy)')&&!['ghnghn','mnjhmhjmm'].includes(e.title));
 const buffer=await renderCareerPDF(validProfile,factRecords,format);
 const upload=await db.storage.from('portfolio').upload(path,buffer,{contentType:'application/pdf',upsert:true});if(upload.error)throw new Error('PDF upload failed');
 const doc={id:existing?.id||crypto.randomUUID(),title,format,path,published:format!=='letter'};
 const saved=await db.from('documents').upsert(doc);if(saved.error)throw new Error('PDF record save failed');generatedDocuments.push(doc);
}
const featured=generatedDocuments.find(d=>d.format==='ats');await db.from('profile').update({featured_cv:featured.id}).eq('id','main');
const {data:owner,error:ownerError}=await db.from('owners').select('user_id').single();if(ownerError)throw new Error('Owner unavailable');
const examples=[{name:'Pengunjung demo 01 (dummy)',body:'[DATA DUMMY] Senang melihat perpaduan proyek web dan AI di portofolio ini.',reply:'Terima kasih! Ini contoh balasan admin untuk preview buku tamu.'},{name:'Pengunjung demo 02 (dummy)',body:'[DATA DUMMY] Bagian perjalanan dan proyek membantu saya mengenal profil Anda.',reply:''}];
for(const item of examples){if(snapshot.guestbook.some(x=>x.name===item.name))continue;const r=await db.from('guestbook').insert({...item,user_id:owner.user_id,hidden:false,reply_updated_at:item.reply?new Date().toISOString():null});if(r.error)throw new Error('Guestbook demo failed');}
for(const [i,status] of ['new','read','archived'].entries()){const subject=`[DUMMY] Contoh pesan ${i+1}`;if(snapshot.inbox.some(x=>x.subject===subject))continue;const r=await db.from('inbox').insert({name:`Tamu demo ${i+1} (dummy)`,email:`demo${i+1}@example.com`,subject,message:'DATA DUMMY untuk preview dashboard. Contoh pertanyaan tentang proyek dan kolaborasi; bukan pesan dari pengunjung nyata.',status});if(r.error)throw new Error('Inbox demo failed');}
// Source-aligned English editorial overrides: keep CV English titles/bullets, translate the preview additions.
const p=await db.from('profile').select('*').single();const r=await db.from('entries').select('*').order('position').order('id');const d=await db.from('documents').select('*');if(p.error||r.error||d.error)throw new Error('Read after seed failed');
const content=projectPublicContent(p.data,r.data,d.data);
const enCopy:Record<string,string>={projects_title:'Selected work',projects_description:'Projects from my CV, from government portals to AI applications. Covers marked dummy are concept illustrations, not actual product screenshots.',services_title:'What we could build',services_description:'Dummy service examples for this preview. Scope, availability and offers have not been confirmed.',journey_title:'My journey',journey_description:'Work and organizational experience shaping how I design, build and collaborate.',skills_title:'My toolkit',skills_description:'Technologies, tools and skills listed in my CV, combining web development, AI exploration and interface design.',certificates_title:'Learn, then apply',certificates_description:'Language assessment results and training from my CV. Supporting dummy illustrations are not official certificate copies.',contact_title:'Let’s exchange ideas',contact_description:'Have a website idea, a project question or just want to say hello? Use this form. Services and achievements marked dummy are preview examples.'};
const translated=structuredClone(content);translated.profile.summary='Informatics graduate from Telkom University focused on Machine Learning, full-stack web development and practical applications of Generative AI. Interested in using AI tools to improve software development workflows and committed to continuous learning and building efficient, impactful technology solutions.';translated.profile.photo_alt='Profile photo of Rian Pramudya Amanda';translated.profile.section_copy=enCopy;
const englishCopy=JSON.parse(fs.readFileSync('docs/preview-english-copy.json','utf8'));
for(const e of translated.records){const copy=englishCopy[e.title];if(copy){if(copy.title)e.title=copy.title;for(const key of ['description','degree'])if(copy[key])e.data[key]=copy[key];}if(e.title.includes('(dummy)')){e.data.description='DUMMY DATA for layout preview only. This is not a verified service, achievement or professional claim.';if(e.data.bullets)e.data.bullets=['Replace this example with verified information before professional use.'];}if(e.data.context)e.data.context='Project context is described in the CV summary and contribution points below.';if(e.data.result)e.data.result='Implementation and contributions are documented below; no additional performance claims are introduced.';}
const source=translationSegments(content),english=translationSegments(translated);const translations=source.map(s=>({id:s.id,source_hash:s.hash,override:english.find(t=>t.id===s.id)?.value||s.value,updated_at:new Date().toISOString()}));const t=await db.from('translations').upsert(translations);if(t.error)throw new Error('Translation save failed');
fs.writeFileSync('.local-backups/full-preview-manifest.json',JSON.stringify({backup,seedTag,mediaPaths,generatedDocuments,dummyEntryIDs:r.data.filter(e=>e.title.includes('(dummy)')).map(e=>e.id)},null,2),{mode:0o600});
console.log(JSON.stringify({applied:true,backup,totalEntries:validEntries.length,publicKinds:Object.fromEntries(['project','experience','education','service','skill','certificate','achievement','language'].map(k=>[k,validEntries.filter(e=>e.kind===k&&e.published).length])),demoMedia:mediaPaths.length,newDocuments:generatedDocuments.length,translations:translations.length}));
