'use client';
import {useEffect,useRef,type HTMLAttributes,type ReactNode} from 'react';
import {pointerTilt,shouldAnimateSpatial} from '@/lib/spatial-motion';
type Room='portrait'|'education'|'skills'|'service'|'journey'|'credential'|'play'|'contact'|'archive'|'case';
interface Props extends HTMLAttributes<HTMLElement>{as?:'div'|'article';room:Room;children?:ReactNode;}
/** Progressive depth on the actual content plane; no pointer-driven React renders.
 * Touch, reduced-motion and keyboard focus keep the reading plane still. */
export function DepthSurface({as:Tag='div',room,className='',children,...props}:Props){
 const root=useRef<HTMLElement|null>(null);const enabled=useRef(false);const frame=useRef(0);const bounds=useRef<DOMRect|null>(null);const next=useRef({x:0,y:0});
 useEffect(()=>{
  const el=root.current;if(!el)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const fine=matchMedia('(hover:hover) and (pointer:fine)');let visible=false;
  const reset=()=>{cancelAnimationFrame(frame.current);frame.current=0;next.current={x:0,y:0};el.style.setProperty('--depth-x','0deg');el.style.setProperty('--depth-y','0deg');};
  const read=()=>{let on=true;try{on=localStorage.getItem('portfolio-motion')!=='off';}catch{}enabled.current=shouldAnimateSpatial(reduced.matches,on,visible,document.visibilityState==='visible')&&fine.matches&&room!=='play';el.dataset.depth=enabled.current?'on':'off';if(!enabled.current)reset();};
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;read();});observer.observe(el);read();reduced.addEventListener('change',read);fine.addEventListener('change',read);window.addEventListener('portfolio-play-change',read);document.addEventListener('visibilitychange',read);
  return()=>{observer.disconnect();reset();reduced.removeEventListener('change',read);fine.removeEventListener('change',read);window.removeEventListener('portfolio-play-change',read);document.removeEventListener('visibilitychange',read);};
 },[room]);
 function paint(){frame.current=0;root.current?.style.setProperty('--depth-x',`${next.current.x*.35}deg`);root.current?.style.setProperty('--depth-y',`${next.current.y*.35}deg`);}
 return <Tag {...props} ref={node=>{root.current=node;}} className={`depth-surface ${className}`} data-room={room} data-depth="off"
  onPointerEnter={e=>{bounds.current=e.currentTarget.getBoundingClientRect();}}
  onPointerMove={e=>{if(!enabled.current||e.pointerType!=='mouse')return;const box=bounds.current;if(!box)return;next.current=pointerTilt(e.clientX-box.left,e.clientY-box.top,box.width,box.height);if(!frame.current)frame.current=requestAnimationFrame(paint);}}
  onPointerLeave={()=>{next.current={x:0,y:0};if(!frame.current)frame.current=requestAnimationFrame(paint);}}
 >{children}</Tag>;
}
