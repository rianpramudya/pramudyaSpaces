'use client';
import {useEffect,useRef,useState,useId} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,ArrowUpRight,RotateCcw} from 'lucide-react';
import {shouldAnimateSpatial} from '@/lib/spatial-motion';
import {clampGalleryIndex,swipeDirection} from '@/lib/gallery-navigation';
export interface WorksWheelItem {id:string;title:string;image?:string;href:string;description:string;role?:string;technologies:string[];alt?:string;context?:string;result?:string;contributions?:string[];}
/** Adapted from the supplied WorksWheel: ring -> bowed perspective drum.
 * Native CSS retains the portfolio's tokens. No document scroll interception.
 * Draw only while changing; mobile/reduced motion use a flat project viewer. */
export function WorksWheel({items,label,en}:{items:WorksWheelItem[];label:string;en:boolean}){
 const uid=useId();const [active,setActive]=useState(0);const [opened,setOpened]=useState(false);
 const stage=useRef<HTMLDivElement>(null);const cards=useRef<(HTMLAnchorElement|null)[]>([]);const wheel=useRef<HTMLDivElement>(null);const ringLabel=useRef<HTMLDivElement>(null);
 const target=useRef(0);const turn=useRef(0);const repaint=useRef<()=>void>(()=>{});const touch=useRef<{x:number;y:number;id:number}|null>(null);
 const current=clampGalleryIndex(active,items.length);const item=items[current];
 useEffect(()=>{setActive(0);target.current=0;turn.current=0;setOpened(false);},[items.length]);
 useEffect(()=>{
  const el=stage.current;if(!el)return;let frame=0;let disposed=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');const narrow=matchMedia('(max-width: 767px)');let visible=false;let on=true;
  const constrained=(navigator as Navigator & {deviceMemory?:number}).deviceMemory;const lowPower=!!constrained&&constrained<=2;
  const draw=()=>{
   frame=0;if(disposed)return;
   const animate=shouldAnimateSpatial(reduced.matches,on,visible,document.visibilityState==='visible');const flat=items.length<2||reduced.matches||narrow.matches||lowPower||!on;
   const gap=target.current-turn.current;turn.current=flat||!animate?target.current:Math.abs(gap)<.001?target.current:turn.current+gap*.12;
   const t=turn.current,m=Math.min(1,Math.max(0,t)),pos=Math.max(0,t-1);
   const width=el.clientWidth,height=el.clientHeight;el.dataset.enhanced='true';const cardW=flat?Math.max(0,width-32):Math.min(height*.38*1.45,width*.4);const cardH=flat?Math.min(height-24,cardW/1.45):cardW/1.45;
   const ringR=cardH*1.14,drumR=cardH*2.22,bow=cardH*1.82;
   const scale=items.length?Math.min(1,Math.max(.16,2*Math.PI*ringR/items.length*.82/(cardW||1))):1;
   el.style.perspective=flat?'none':`${cardH*2.7}px`;
   if(wheel.current)wheel.current.style.transform=flat?'none':`translateZ(${-m*drumR}px)`;
   cards.current.forEach((card,i)=>{if(!card)return;const d=i-pos,deg=d*40;const visible=flat?i===Math.round(pos):m<.5||Math.abs(d)<=1.6;
    card.style.width=`${cardW}px`;card.style.height=`${cardH}px`;card.style.marginLeft=`${-cardW/2}px`;card.style.marginTop=`${-cardH/2}px`;
    card.style.transform=flat?'none':`translateX(${-m*bow*(1-Math.cos(deg*Math.PI/180))}px) rotateZ(${(1-m)*d*360/items.length}deg) translateY(${-(1-m)*ringR}px) rotateX(${m*deg}deg) translateZ(${m*drumR}px)`;
    card.style.opacity=visible?'1':'0';card.style.visibility=visible?'visible':'hidden';card.style.pointerEvents=visible?'auto':'none';card.style.zIndex=String(Math.round(100-Math.abs(d)*2));
    const face=card.firstElementChild as HTMLElement;face.style.transform=flat?'none':`scale(${scale+(1-scale)*m})`;
   });
   if(ringLabel.current)ringLabel.current.style.opacity=flat?'0':String(1-m);
   if(animate&&Math.abs(target.current-turn.current)>.001)frame=requestAnimationFrame(draw);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};repaint.current=schedule;
  const preference=()=>{try{on=localStorage.getItem('portfolio-motion')!=='off';}catch{}schedule();};const visibility=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;schedule();});visibility.observe(el);window.addEventListener('portfolio-play-change',preference);document.addEventListener('visibilitychange',schedule);preference();
  const resize=new ResizeObserver(schedule);resize.observe(el);reduced.addEventListener('change',schedule);narrow.addEventListener('change',schedule);schedule();
  return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();visibility.disconnect();window.removeEventListener('portfolio-play-change',preference);document.removeEventListener('visibilitychange',schedule);reduced.removeEventListener('change',schedule);narrow.removeEventListener('change',schedule);repaint.current=()=>{};};
 },[items.length]);
 function choose(index:number){const next=clampGalleryIndex(index,items.length);setActive(next);setOpened(true);target.current=next+1;repaint.current();}
 function reset(){setOpened(false);target.current=0;setActive(0);repaint.current();}
 if(!item)return <p>{en?'Projects will appear when published.':'Proyek akan tampil setelah diterbitkan.'}</p>;
 return <div className="works-wheel" role="region" aria-label={label}>
  <div className="works-wheel-stage" ref={stage} tabIndex={0} aria-label={en?'Project wheel. Use left or right arrow keys.':'Roda proyek. Gunakan tombol panah kiri atau kanan.'}
   onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();choose(current+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1));}else if(e.key==='Home'||e.key==='End'){e.preventDefault();choose(e.key==='Home'?0:items.length-1);}}}
   onTouchStart={e=>{const p=e.touches[0];touch.current=e.touches.length===1?{x:p.clientX,y:p.clientY,id:p.identifier}:null;}}
   onTouchEnd={e=>{const start=touch.current;touch.current=null;if(!start||e.touches.length)return;const p=Array.from(e.changedTouches).find(p=>p.identifier===start.id);if(!p)return;const direction=swipeDirection(start,{x:p.clientX,y:p.clientY});if(direction){e.preventDefault();choose(current+direction);}}} onTouchCancel={()=>{touch.current=null;}}>
   <div className="works-wheel-drum" ref={wheel}>{items.map((entry,index)=><Link key={entry.id} href={entry.href} ref={node=>{cards.current[index]=node;}} className="works-wheel-card" tabIndex={index===current?0:-1} aria-label={`${en?'View':'Lihat'} ${entry.title}`} onFocus={()=>choose(index)}><span className="works-wheel-face">{entry.image?<img loading="lazy" src={entry.image} alt={entry.alt||entry.title} draggable={false}/>:<span className="works-wheel-placeholder">{entry.title}</span>}<span className="works-wheel-open"><ArrowUpRight size={16}/>{en?'View project':'Lihat proyek'}</span></span></Link>)}</div>
   <div className="works-wheel-label" ref={ringLabel} aria-hidden="true">{en?'Turn the work':'Putar karyanya'}<span>{en?'Choose a project below':'Pilih proyek di bawah'}</span></div>
  </div>
  <div className="works-wheel-bar"><span className="muted">{String(current+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><div className="works-wheel-controls"><button className="icon-button" onClick={reset} aria-label={en?'Reset wheel':'Reset roda'}><RotateCcw size={18}/></button><button className="icon-button" disabled={items.length<2||opened&&current===0} onClick={()=>choose(opened?current-1:0)} aria-label={en?'Previous project':'Proyek sebelumnya'}><ArrowLeft size={18}/></button><button className="icon-button" disabled={items.length<2||opened&&current===items.length-1} onClick={()=>choose(opened?current+1:0)} aria-label={en?'Next project':'Proyek berikutnya'}><ArrowRight size={18}/></button></div></div>
  <div className="works-wheel-reading"><div className="works-wheel-story" id={`${uid}-story`}><span className="muted small">{item.role}</span><h3>{item.title}</h3><p>{item.description}</p><p className="works-wheel-tools">{item.technologies.join(' / ')}</p>{(item.context||item.result||!!item.contributions?.length)&&<div className="case-preview">{item.context&&<details><summary>{en?'The brief':'Konteks'}</summary><p>{item.context}</p></details>}{!!item.contributions?.length&&<details><summary>{en?'My contribution':'Kontribusi saya'}</summary><ul>{item.contributions.map((point,index)=><li key={index}>{point}</li>)}</ul></details>}{item.result&&<details><summary>{en?'The outcome':'Hasilnya'}</summary><p>{item.result}</p></details>}</div>}<Link className="text-button" href={item.href}>{en?'Explore the case study':'Jelajahi studi kasus'}<ArrowUpRight size={18}/></Link></div><ol className="works-wheel-index">{items.map((entry,index)=><li key={entry.id}><button aria-pressed={index===current} aria-controls={`${uid}-story`} onClick={()=>choose(index)}><span>{String(index+1).padStart(2,'0')}</span>{entry.title}<ArrowUpRight size={16}/></button></li>)}</ol></div>
 </div>;
}
