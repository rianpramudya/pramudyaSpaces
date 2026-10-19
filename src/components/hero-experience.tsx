'use client';
import {useEffect,useRef,type CSSProperties} from 'react';
import {ArrowDown,ArrowUpRight,MapPin} from 'lucide-react';
import type {Profile,Entry} from '@/lib/model';
import {heroIdentity} from '@/lib/hero-identity';
import {heroSceneConfig,heroSceneData,heroQuality} from '@/lib/hero-scene';
import {mediaURL} from '@/lib/client-api';
import {SculptureStage} from './sculpture-stage';
export function HeroExperience({profile,records,en,sectionCount}:{profile:Profile;records:Entry[];en:boolean;sectionCount:number}){
 const root=useRef<HTMLElement>(null);const identity=heroIdentity(profile.name),data=heroSceneData(profile,records,en);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:768px)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
  let visible=false,canAnimate=false,frame=0,previous=0;const target={x:0,y:0},current={x:0,y:0};
  function allowed(){let on=true;try{on=localStorage.getItem('portfolio-motion')!=='off';}catch{}const hardware=navigator as Navigator & {deviceMemory?:number};return on&&heroQuality(window.innerWidth,hardware.deviceMemory,reduced.matches,hardware.hardwareConcurrency).animate;}
  function paint(now:number){frame=0;if(!visible||!canAnimate||document.visibilityState!=='visible')return;
   const dt=previous?Math.min((now-previous)/1000,.05):1/60;previous=now;const damping=1-Math.exp(-7*dt);current.x+=(target.x-current.x)*damping;current.y+=(target.y-current.y)*damping;
   el!.style.setProperty('--hero-x',current.x.toFixed(4));el!.style.setProperty('--hero-y',current.y.toFixed(4));
   const box=el!.getBoundingClientRect();el!.style.setProperty('--hero-scroll',Math.max(0,Math.min(1,-box.top/Math.max(1,box.height))).toFixed(4));
   frame=requestAnimationFrame(paint);
  }
  function sync(){cancelAnimationFrame(frame);frame=0;previous=0;canAnimate=allowed();const active=canAnimate&&visible&&document.visibilityState==='visible';el!.dataset.quality=canAnimate?'full':'static';el!.dataset.visible=String(active);el!.dataset.ready='true';
   if(active)frame=requestAnimationFrame(paint);else{target.x=target.y=current.x=current.y=0;el!.style.setProperty('--hero-x','0');el!.style.setProperty('--hero-y','0');el!.style.setProperty('--hero-scroll','0');}
  }
  const move=(event:PointerEvent)=>{if(!fine.matches||event.pointerType!=='mouse')return;const box=el.getBoundingClientRect();const strength=Math.max(0,Math.min(1,heroSceneConfig.parallaxStrength));target.x=Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1))*strength;target.y=Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1))*strength;};
  const leave=()=>{target.x=target.y=0;};
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync();});observer.observe(el);
  el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);reduced.addEventListener('change',sync);desktop.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('portfolio-play-change',sync);sync();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);reduced.removeEventListener('change',sync);desktop.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);window.removeEventListener('portfolio-play-change',sync);};
 },[]);
 const badge=(data.roles.length?data.roles:[profile.headline]).filter(Boolean).join(' • ').toUpperCase()+' • ';
 return <section id="home" ref={root} className="hero hero-experience page-width" data-experience="personal-monogram" data-quality="static" style={{'--hero-glow':heroSceneConfig.glowIntensity} as CSSProperties}>
  <div className="hero-atmosphere" aria-hidden="true"><div className="hero-neutral-glow"/><div className="hero-light-sweep"/><div className="hero-floor-grid"/><div className="hero-film-grain"/><i className="hero-far-orbit"/><i className="hero-far-cube"/></div>
  <div className="hero-annotations"><span>{`01 / ${String(sectionCount).padStart(2,'0')}`}</span>{data.coordinates&&<span>{profile.location} <span className="hero-coordinates">{data.coordinates}</span></span>}{profile.status!=='hidden'&&<span className="hero-availability"><i/>{profile.status==='open'?'Open to work':(en?'Currently working':'Sedang bekerja')}</span>}</div>
  <div className="hero-identity"><p className="hero-greeting">{en?"Hi, I'm":"Halo, saya"}</p>
   <h1 className={`hero-name ${profile.name?'':'hero-name-empty'}`} style={{'--given-length':Math.max(4,Array.from(identity.givenName).length)} as CSSProperties} aria-label={profile.name||undefined}>{profile.name?<><span className="hero-given-name" aria-hidden="true">{Array.from(identity.givenName).map((letter,index)=><span className="hero-letter-rise" key={index} style={{'--letter-index':index,'--letter-depth':index%2?1:-1} as CSSProperties}><span className="hero-letter">{letter}</span></span>)}</span>{identity.familyName&&<span className="hero-family-name" aria-hidden="true">{Array.from(identity.familyName).map((letter,index)=><span key={index}>{letter===' '?'\u00a0':letter}</span>)}</span>}</>:(en?'Your name':'Nama Anda')}</h1>
   {profile.headline&&<p className="hero-role" aria-label={profile.headline}><span className="hero-role-cycle" data-count={data.roles.length} aria-hidden="true" style={{'--role-count':data.roles.length} as CSSProperties}>{data.roles.map((role,index)=><span key={role} style={{'--role-index':index} as CSSProperties}>{role}</span>)}</span><span className="sr-only">{profile.headline}</span></p>}
   {profile.location&&<p className="hero-location"><MapPin size={14}/>{profile.location}</p>}
   <div className="hero-entry-actions"><a className="button primary" href="#projects">{en?'View work':'Lihat karya'}<ArrowUpRight size={18}/></a><a className="text-button" href="#contact">{en?'Contact':'Kontak'}<ArrowDown size={17}/></a></div>
   {data.facts.length>0&&<dl className="hero-stats" aria-label={en?'Contribution and experience':'Kontribusi dan pengalaman'}>{data.facts.map(stat=><div key={stat.label+stat.value}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>}
  </div>
  <div className="hero-signature-object"><div className="hero-object-arrival"><SculptureStage variant="hero" en={en} monogram={identity.initials}/></div>
   {data.technologies.length>0&&<ul className="hero-tech-tags" aria-label={en?'Technologies in my work':'Teknologi dalam karya saya'}>{data.technologies.slice(0,3).map((technology,index)=><li key={technology} className={`hero-tech-tag hero-tech-tag-${index}`} style={{'--tag-index':index,'--tag-depth':index%2?-1:1} as CSSProperties}><span>{technology}</span></li>)}</ul>}
   {profile.photo&&<a className="hero-photo-note" href="#about" aria-label={en?`About ${profile.name}`:`Tentang ${profile.name}`}><span className="polaroid-tape" aria-hidden="true"/><img src={mediaURL(profile.photo)} alt={profile.photo_alt||profile.name}/><span>{identity.givenName}</span>{badge.trim()!=='•'&&<svg className="hero-photo-badge" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="hero-badge-path" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0"/></defs><text><textPath href="#hero-badge-path" textLength="292" lengthAdjust="spacing">{badge}</textPath></text></svg>}</a>}
  </div>
  <div className="hero-baseline"><a href="#projects" className="hero-scroll"><ArrowDown size={16}/>{en?'Scroll to explore':'Scroll untuk menjelajah'}</a><a className="hero-play-link" href="#playground">{en?'Take a play break':'Istirahat, main sebentar'}<ArrowUpRight size={15}/></a></div>
 </section>;
}
