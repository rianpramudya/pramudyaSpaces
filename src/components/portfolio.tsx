'use client';
import { useEffect,useRef,useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight,Download,MessageSquare,Sparkles,ExternalLink } from 'lucide-react';
import type { PublicContent,Entry } from '@/lib/model';
import { textValue,listValue } from '@/lib/model';
import { oauthOutcome } from '@/lib/auth-policy';
import { mediaURL,requestJSON } from '@/lib/client-api';
import { usePreferences } from './preferences';
import { ContactForm } from './contact-form';
import {VisitorDock} from './visitor-dock';
import { PublicPanels } from './public-panels';
import { Playground } from './playground';
import { Background } from './credentials';
import {ProjectEvidence,ProjectLinks} from './project-evidence';
import { ProjectGallery } from './project-gallery';
import { ProjectArchive } from './project-archive';
import { Drawer } from './drawer';
import { DepthSurface } from './depth-surface';
import { HeroExperience } from './hero-experience';
import { SculptureStage } from './sculpture-stage';
import {SupplementarySection} from './supplementary-section';
import { AboutProfile } from './about-profile';
import { SiteHeader,SiteFooter } from './site-chrome';
export function Portfolio({initial,projectId,archive=false}:{initial:PublicContent;projectId?:string;archive?:boolean}){
 const portfolioRoot=useRef<HTMLDivElement>(null);
 const {language,setLanguage,theme,setTheme}=usePreferences();const en=language==='en';const [content,setContent]=useState(initial);const [fallback,setFallback]=useState(false);const [panel,setPanel]=useState<'guestbook'|'chat'|null>(null);const [authError,setAuthError]=useState(false);const [activeSection,setActiveSection]=useState('home');const [certificate,setCertificate]=useState<Entry|null>(null);
 useEffect(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)');const read=()=>{let enabled=true;try{enabled=localStorage.getItem('portfolio-motion')!=='off';}catch{}if(portfolioRoot.current)portfolioRoot.current.dataset.motion=!reduced.matches&&enabled?'on':'off';};read();reduced.addEventListener('change',read);window.addEventListener('portfolio-play-change',read);return()=>{reduced.removeEventListener('change',read);window.removeEventListener('portfolio-play-change',read);};},[]);

 useEffect(()=>{const result=oauthOutcome(location.search);if(result.openGuestbook)setPanel('guestbook');setAuthError(result.authError);},[]);
 useEffect(()=>{let active=true;if(language==='id'){setContent(initial);setFallback(false);return;}setFallback(false);requestJSON<{content:PublicContent;fallback:boolean}>('/api/translate').then(data=>{if(active){setContent(data.content);setFallback(data.fallback);}}).catch(()=>{if(active){setContent(initial);setFallback(true);}});return()=>{active=false;};},[language,initial]);
 const profile=content.profile;const copy=(key:string,fallback='')=>profile.section_copy?.[key]||fallback;const by=(kind:string)=>content.records.filter(e=>e.kind===kind&&e.published);const projects=by('project');const services=by('service');const experiences=by('experience');const skills=by('skill');const certificates=by('certificate');const education=by('education');const languages=by('language');const achievements=by('achievement');
 const cv=content.documents.find(d=>d.id===profile.featured_cv&&d.format!=='letter');
 const owner=profile.name.split(' ')[0]||'';
 const nav=[['home',en?'Home':'Beranda'],['projects',copy('projects_title',en?'Projects':'Proyek')],['about',en?'About':'Tentang'],...(skills.length?[['skills',copy('skills_title','Skills')]]:[]),...(services.length?[['services',copy('services_title',en?'Services':'Layanan')]]:[]),...(experiences.length?[['journey',copy('journey_title',en?'Experience':'Pengalaman')]]:[]),...(certificates.length?[['certificates',copy('certificates_title',en?'Certificates':'Sertifikat')]]:[]),['contact',copy('contact_title',en?'Contact':'Kontak')]];

 useEffect(()=>{
  if(archive||projectId)return;
  const observer=new IntersectionObserver(entries=>{const entered=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(entered[0])setActiveSection(entered[0].target.id);},{rootMargin:'-15% 0px -60% 0px',threshold:0});
  document.querySelectorAll('#main > section[id]').forEach(section=>observer.observe(section));return()=>observer.disconnect();
 },[archive,projectId,content.records.length]);
 useEffect(()=>{
  if(archive||projectId)return;const root=portfolioRoot.current;if(!root)return;let frame=0;
  function reveal(hash:string,scroll:boolean){let id='';try{id=decodeURIComponent(hash.slice(1));}catch{return;}const target=document.getElementById(id);if(!target||!root!.contains(target))return;let expanded=false;if(target.matches('section[id]'))target.querySelectorAll<HTMLDetailsElement>(':scope > details[data-section-disclosure]').forEach(detail=>{if(!detail.open){detail.open=true;expanded=true;}});let parent=target.parentElement;while(parent&&parent!==root){if(parent instanceof HTMLDetailsElement&&!parent.open){parent.open=true;expanded=true;}parent=parent.parentElement;}if(scroll&&expanded){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));}}
  const change=()=>reveal(location.hash,true);const click=(event:MouseEvent)=>{if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const link=(event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');if(link)reveal(link.hash,false);};
  root.addEventListener('click',click);window.addEventListener('hashchange',change);if(location.hash)change();return()=>{cancelAnimationFrame(frame);root.removeEventListener('click',click);window.removeEventListener('hashchange',change);};
 },[archive,projectId]);
 const project=projectId?projects.find(e=>e.id===projectId):undefined;
 return <div className="portfolio" ref={portfolioRoot}><a className="skip-link" href="#main">{en?'Skip to content':'Lewati ke konten'}</a>
  <SiteHeader profile={profile} nav={nav} en={en} away={!!projectId||archive} activeSection={activeSection} theme={theme} onLanguage={()=>setLanguage(en?'id':'en')} onTheme={()=>setTheme(theme==='dark'?'light':'dark')}/>
  {fallback&&<div className="translation-notice" role="status">English translation is temporarily unavailable. Showing the Indonesian source.</div>}
  <main id="main">{archive?<ProjectArchive projects={projects} en={en}/>:project?<ProjectDetail project={project} en={en}/>:<>
   <HeroExperience profile={profile} records={content.records} en={en} sectionCount={nav.length+1+(education.length||languages.length||achievements.length?1:0)}/>
   <section id="projects" className="page-section page-width" data-experience="project-theatre"><SectionHeading title={copy('projects_title',en?'Projects':'Proyek')} description={copy('projects_description')} count={projects.length}/>
    <ProjectGallery projects={projects} en={en}/>

   </section>
   <AboutProfile profile={profile} cv={cv} en={en}/>
   {experiences.length>0&&<section id="journey" className="page-section page-width competence-section"><SectionHeading title={copy('journey_title',en?'Experience':'Pengalaman')} description={copy('journey_description')}/>
    {experiences.length?<div className="timeline">{experiences.map(e=><DepthSurface as="article" room="journey" className="timeline-row" key={e.id}><div className="timeline-date">{textValue(e.data,'start')}<span>— {e.data.current?(en?'Present':'Sekarang'):textValue(e.data,'end')}</span></div><div className="timeline-content"><p className="muted small">{textValue(e.data,'organization')} · {e.data.type==='organization'?(en?'Organization':'Organisasi'):(en?'Work':'Kerja')}</p><h3>{e.title}</h3><p>{textValue(e.data,'description')}</p>{listValue(e.data,'bullets').length>0&&<details className="journey-contributions"><summary>{en?'Explore contributions':'Lihat kontribusi'}<span>{listValue(e.data,'bullets').length}</span></summary><ul>{listValue(e.data,'bullets').map((b,i)=><li key={i}>{b}</li>)}</ul></details>}</div>{listValue(e.data,'media')[0]&&<img className="experience-image" loading="lazy" src={mediaURL(listValue(e.data,'media')[0])} alt={textValue(e.data,'alt')||textValue(e.data,'organization')}/>}</DepthSurface>)}</div>:<Empty en={en} text={en?'Published experience will appear here.':'Pengalaman yang diterbitkan akan tampil di sini.'}/>}
   </section>}
   {skills.length>0&&<section id="skills" className="page-section page-width competence-section"><SectionHeading title={copy('skills_title','Skills')} description={copy('skills_description')}/>
    {skills.length?<div className="skill-groups">{[...new Set(skills.map(s=>textValue(s.data,'category')||'Skills'))].map(group=><DepthSurface room="skills" className="skill-group" key={group}><h3>{group}</h3><div className="skill-items">{skills.filter(s=>(textValue(s.data,'category')||'Skills')===group).map(s=><span key={s.id}>{s.title}</span>)}</div></DepthSurface>)}</div>:<Empty en={en} text={en?'Published skills will appear here.':'Kompetensi yang diterbitkan akan tampil di sini.'}/>}
   </section>}
   <Background education={education} languages={languages} achievements={achievements} en={en}/>
   {certificates.length>0&&<SupplementarySection id="certificates" en={en} title={copy('certificates_title',en?'Certificates':'Sertifikat')} description={copy('certificates_description')}>
    {certificates.length?<div className="certificate-list">{certificates.map(c=><DepthSurface as="article" room="credential" key={c.id} className="certificate-row">{listValue(c.data,'media')[0]?<button className="certificate-preview" onClick={()=>setCertificate(c)} aria-label={`${en?'Preview':'Pratinjau'} ${c.title}`}><img loading="lazy" src={mediaURL(listValue(c.data,'media')[0])} alt={textValue(c.data,'alt')||c.title}/></button>:<div className="certificate-mark">↗</div>}<div><span className="muted small">{textValue(c.data,'issuer')}</span><h3>{c.title}</h3>{(textValue(c.data,'description')||textValue(c.data,'credential'))&&<details className="credential-disclosure"><summary>{en?'Certificate details':'Rincian sertifikat'}</summary><p>{textValue(c.data,'description')}</p>{textValue(c.data,'credential')&&<p className="muted small">ID: {textValue(c.data,'credential')}</p>}</details>}</div><div className="certificate-meta"><span className="muted small">{textValue(c.data,'date')}</span>{textValue(c.data,'url')&&<a href={textValue(c.data,'url')} target="_blank" rel="noreferrer">{en?'Verify':'Verifikasi'}<ExternalLink size={14}/></a>}</div></DepthSurface>)}</div>:<Empty en={en} text={en?'Published certificates will appear here.':'Sertifikat yang diterbitkan akan tampil di sini.'}/>}
   </SupplementarySection>}
   {services.length>0&&<SupplementarySection id="services" en={en} title={copy('services_title',en?'Services':'Layanan')} description={copy('services_description')}><div className="service-list">{services.map(s=><DepthSurface as="article" room="service" key={s.id}><details className="service-disclosure"><summary><h3>{s.title}</h3><span aria-hidden="true">+</span></summary><p>{textValue(s.data,'description')}</p></details>{textValue(s.data,'url')&&<a className="text-button" href={textValue(s.data,'url')} target="_blank" rel="noreferrer">{en?'Learn more':'Selengkapnya'}<ArrowUpRight size={16}/></a>}</DepthSurface>)}</div></SupplementarySection>}
   <SupplementarySection id="playground" title={en?'Room for play':'Ruang bermain'} description={en?'A small interactive intermission.':'Istirahat sejenak dengan balok interaktif.'} en={en}><div className="play-section"><div className="play-copy"><span className="chapter-label">{en?'A small intermission':'Istirahat sebentar'}</span><h2>{en?'Serious about the work. Room for play.':'Serius berkarya. Tetap bisa bermain.'}</h2><p>{en?'Drag, throw, or tap the blocks. Arrow keys work too. No scores. Just a little curiosity.':'Seret, lempar, atau ketuk baloknya. Tombol panah juga bisa. Tanpa skor, cukup rasa ingin tahu.'}</p></div><DepthSurface room="play" className="play-surface"><Playground skills={[profile.headline,...skills.slice(0,5).map(skill=>skill.title)].filter(Boolean)} language={language}/></DepthSurface></div></SupplementarySection>
   <section id="contact" className="contact-section page-width" data-experience="correspondence-room"><div className="contact-copy"><span className="chapter-label">{en?'Have something in mind?':'Punya ide untuk dikerjakan?'}</span><h2>{copy('contact_title',en?'Contact':'Kontak')}</h2><p className="muted">{copy('contact_description')}</p><SculptureStage variant="contact" en={en}/><div className="contact-links">{profile.email&&<a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={17}/></a>}{profile.phone&&<a href={`tel:${profile.phone.replace(/[^+\d]/g,'')}`}>{profile.phone}<ArrowUpRight size={17}/></a>}{profile.socials.map(s=><a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label}<ArrowUpRight size={17}/></a>)}{content.documents.filter(d=>d.id!==profile.featured_cv).map(d=><a key={d.id} href={`${mediaURL(d.path)}?download=1`}>{d.title}<Download size={16}/></a>)}</div></div><DepthSurface room="contact" className="contact-station"><div className="contact-station-head"><span>{en?'A new conversation':'Awal percakapan baru'}</span><ArrowUpRight size={20}/></div><ContactForm language={language}/></DepthSurface></section>
  </>}</main>
    <SiteFooter profile={profile} nav={nav} en={en} away={!!projectId||archive}/>
    <VisitorDock profile={profile} language={language} play={!archive&&!projectId} onPanel={setPanel}/>
  {panel&&<PublicPanels panel={panel} onClose={()=>setPanel(null)} language={language} owner={owner} authError={authError}/>} {certificate&&<Drawer title={certificate.title} onClose={()=>setCertificate(null)}><img className="certificate-full" src={mediaURL(listValue(certificate.data,'media')[0])} alt={textValue(certificate.data,'alt')||certificate.title}/></Drawer>}
 </div>;
}
function SectionHeading({title,description,count}:{title:string;description:string;count?:number}){return <div className="section-heading"><div><h2>{title}{count!==undefined&&<sup>{String(count).padStart(2,'0')}</sup>}</h2><p className="muted">{description}</p></div></div>;}
function Empty({text,en}:{text:string;en:boolean}){return <div className="empty-state"><span className="empty-line"/><p>{text}</p></div>;}
function ProjectImage({entry}:{entry:Entry}){const image=listValue(entry.data,'media')[0];return <div className="project-image">{image?<img loading="lazy" src={mediaURL(image)} alt={textValue(entry.data,'alt')||entry.title}/>:<div className="project-placeholder"><span>{entry.title}</span><div className="project-cover-tags">{listValue(entry.data,'technologies').slice(0,3).map(t=><span key={t}>{t}</span>)}</div></div>}</div>;}
function ProjectDetail({project,en}:{project:Entry;en:boolean}){return <article className="project-detail page-width" data-page="case-study"><Link className="text-button" href="/projects">← {en?'All projects':'Semua proyek'}</Link><p className="muted">{textValue(project.data,'role')}</p><h1>{project.title}</h1><DepthSurface room="case" className="case-image-stage"><ProjectImage entry={project}/></DepthSurface><p className="project-lead">{textValue(project.data,'description')}</p><div className="project-story"><DepthSurface as="article" room="case" className="case-chapter"><h2>{en?'Project story':'Cerita proyek'}</h2><ProjectEvidence data={project.data} en={en} headingLevel={3}/></DepthSurface>{textValue(project.data,'context')&&<DepthSurface as="article" room="case" className="case-chapter"><h2>{en?'Full context':'Latar belakang lengkap'}</h2><p>{textValue(project.data,'context')}</p></DepthSurface>}</div><div className="tags">{listValue(project.data,'technologies').map(t=><span key={t}>{t}</span>)}</div><ProjectLinks data={project.data} en={en}/><div className="project-gallery">{listValue(project.data,'media').slice(1).map(image=><img key={image} loading="lazy" src={mediaURL(image)} alt={textValue(project.data,'alt')||project.title}/>)}</div></article>;}
