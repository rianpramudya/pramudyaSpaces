'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,ArrowUp,ChevronDown,Menu,X,Sun,Moon} from 'lucide-react';
import type {Profile} from '@/lib/model';
import {heroIdentity} from '@/lib/hero-identity';
type Shared={profile:Profile;nav:string[][];en:boolean;away:boolean};
const primarySections=new Set(['home','projects','about','contact']);
export function SiteHeader({profile,nav,en,away,activeSection,theme,onLanguage,onTheme}:Shared&{activeSection:string;theme:'light'|'dark';onLanguage:()=>void;onTheme:()=>void}){
 const [menu,setMenu]=useState(false);const toggle=useRef<HTMLButtonElement>(null),overflow=useRef<HTMLDetailsElement>(null);
 const extras=nav.filter(([id])=>!primarySections.has(id));const href=(id:string)=>`${away?'/':''}#${id}`;
 function close(){setMenu(false);if(overflow.current)overflow.current.open=false;}
 useEffect(()=>{
  const escape=(event:KeyboardEvent)=>{if(event.key!=='Escape')return;if(menu){setMenu(false);toggle.current?.focus();}else if(overflow.current?.open){overflow.current.open=false;overflow.current.querySelector('summary')?.focus();}};
  const outside=(event:PointerEvent)=>{if(overflow.current?.open&&!overflow.current.contains(event.target as Node))overflow.current.open=false;};
  const desktop=matchMedia('(min-width:1101px)');const resize=()=>{setMenu(false);if(overflow.current)overflow.current.open=false;};
  document.addEventListener('keydown',escape);document.addEventListener('pointerdown',outside);desktop.addEventListener('change',resize);
  return()=>{document.removeEventListener('keydown',escape);document.removeEventListener('pointerdown',outside);desktop.removeEventListener('change',resize);};
 },[menu]);
 const current=(id:string)=>!away&&activeSection===id?'location' as const:undefined;
 return <><header className="site-header" data-experience="sage-navigation">
  <Link href="/" className="wordmark chrome-wordmark" aria-label={profile.wordmark||profile.name||'Portfolio'}><span className="chrome-monogram" aria-hidden="true">{heroIdentity(profile.name).initials}</span><span className="chrome-brand-name">{profile.wordmark||profile.name||'Portfolio'}</span></Link>
  <nav id="public-navigation" aria-label={en?'Main navigation':'Navigasi utama'} className={menu?'main-nav open':'main-nav'}>
   {nav.map(([id,label])=><a key={id} className={primarySections.has(id)?'nav-primary-link':'nav-secondary-link'} href={href(id)} title={label} aria-current={current(id)} onClick={close}>{label}</a>)}
   {extras.length>0&&<details className="header-overflow" ref={overflow} data-active={!away&&extras.some(([id])=>id===activeSection)}><summary>{en?'More':'Lainnya'}<ChevronDown size={13}/></summary><div className="header-overflow-panel">{extras.map(([id,label])=><a key={id} href={href(id)} aria-current={current(id)} onClick={close}>{label}<ArrowUpRight size={13}/></a>)}</div></details>}
  </nav>
  <div className="header-tools"><button type="button" className="language-button" aria-label={en?'Switch to Indonesian':'Ganti ke bahasa Inggris'} onClick={onLanguage}><span className={!en?'selected':''}>ID</span><span className="lang-divider">/</span><span className={en?'selected':''}>EN</span></button><button type="button" className="icon-button chrome-theme" aria-pressed={theme==='dark'} aria-label={en?'Change theme':'Ganti tema'} onClick={onTheme}>{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button><button type="button" ref={toggle} className="icon-button mobile-menu" aria-controls="public-navigation" aria-expanded={menu} aria-label={menu?(en?'Close menu':'Tutup menu'):(en?'Open menu':'Buka menu')} onClick={()=>setMenu(value=>!value)}>{menu?<X size={19}/>:<Menu size={19}/>}</button></div>
 </header>{menu&&<button type="button" className="public-navigation-scrim" aria-label={en?'Close navigation':'Tutup navigasi'} onClick={close}/>}</>;
}
export function SiteFooter({profile,nav,en,away}:Shared){
 const identity=heroIdentity(profile.name),href=(id:string)=>`${away?'/':''}#${id}`;
 return <footer className="site-footer page-width" data-experience="signature-footer" aria-labelledby="footer-heading">
  <div className="footer-atmosphere" aria-hidden="true"><div className="footer-floor"/><span>{identity.initials}</span></div>
  <div className="footer-opening"><div><p className="footer-note">{en?'A conversation can be a beginning.':'Satu percakapan bisa jadi awal.'}</p><h2 id="footer-heading">{en?'See you at':'Sampai di'}<br/><span>{en?'the next idea.':'ide berikutnya.'}</span></h2></div><a className="footer-invitation" href={href('contact')}><span>{en?"Let's talk":'Mari bertukar ide'}</span><ArrowUpRight size={29}/></a></div>
  <div className="footer-directory"><Link href="/" className="footer-brand">{profile.wordmark||profile.name||'Portfolio'}{profile.headline&&<span>{profile.headline}</span>}</Link>
   <nav className="footer-navigation" aria-label={en?'Footer navigation':'Navigasi footer'}>{nav.filter(([id])=>['projects','about','contact'].includes(id)).map(([id,label])=><a key={id} href={href(id)}>{label}<ArrowUpRight size={13}/></a>)}<a href={href('playground')}>{en?'Playground':'Ruang bermain'}<ArrowUpRight size={13}/></a></nav>
   {(profile.socials.length>0||(profile.email&&profile.show_email))&&<div className="footer-socials">{profile.email&&profile.show_email&&<a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={13}/></a>}{profile.socials.map((social,index)=><a key={`${social.label}-${index}`} href={social.url} target="_blank" rel="noopener noreferrer">{social.label}<ArrowUpRight size={13}/></a>)}</div>}
  </div>
  <div className="footer-signature" aria-hidden="true">{identity.givenName||profile.wordmark||'Portfolio'}</div>
  <div className="footer-colophon"><span>© {new Date().getFullYear()} {profile.name||profile.wordmark||'Portfolio'}</span>{profile.location&&<span>{profile.location}</span>}<a href="#main">{en?'Back to top':'Kembali ke atas'}<ArrowUp size={14}/></a></div>
 </footer>;
}
