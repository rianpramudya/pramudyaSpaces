'use client';
import {useEffect,useRef} from 'react';
import {chapterTravel,dampScroll} from '@/lib/studio-scroll';
export function StudioMotion({version}:{version:string}){
 const anchor=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  const root=anchor.current?.closest<HTMLElement>('.studio-site');if(!root)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width: 768px) and (pointer: fine)');
  const chapters=Array.from(root.querySelectorAll<HTMLElement>('#main>section,.studio-footer'));
  const visible=new Set<HTMLElement>(),values=new Map<HTMLElement,{shift:number;hero:number}>();
  let frame=0,last=0;
  const enabled=()=>!reduced.matches&&desktop.matches&&root.dataset.motion!=='off'&&document.visibilityState==='visible'&&!document.querySelector('dialog[open]');
  function reset(){cancelAnimationFrame(frame);frame=0;last=0;root!.removeAttribute('data-scroll-motion');for(const chapter of chapters){chapter.style.removeProperty('--chapter-shift');chapter.style.removeProperty('--hero-exit');}values.clear();}
  function tick(now:number){frame=0;if(!enabled()){reset();return;}root!.dataset.scrollMotion='on';const elapsed=last?now-last:16;last=now;let moving=false;
   // Read geometry together before writing styles to avoid repeated forced layout.
   const updates=Array.from(visible,chapter=>{const box=chapter.getBoundingClientRect(),target=chapterTravel(box.top,box.height,innerHeight),old=values.get(chapter)??target;
    const next={shift:dampScroll(old.shift,target.shift,elapsed),hero:dampScroll(old.hero,target.hero,elapsed)};
    if(Math.abs(next.shift-target.shift)>.03||Math.abs(next.hero-target.hero)>.0005)moving=true;
    return {chapter,next};});
   for(const {chapter,next} of updates){values.set(chapter,next);chapter.style.setProperty('--chapter-shift',`${next.shift.toFixed(2)}px`);chapter.style.setProperty('--hero-exit',next.hero.toFixed(4));}
   if(moving)frame=requestAnimationFrame(tick);else last=0;
  }
  function schedule(){if(!enabled()){reset();return;}if(!frame)frame=requestAnimationFrame(tick);}
  const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.setAttribute('data-revealed','true');reveal.unobserve(entry.target);}},{threshold:.08});
  root.querySelectorAll('[data-reveal]').forEach(element=>reveal.observe(element));
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){const chapter=entry.target as HTMLElement;if(entry.isIntersecting)visible.add(chapter);else visible.delete(chapter);}schedule();},{rootMargin:'120px'});chapters.forEach(chapter=>observer.observe(chapter));
  const overlays=new MutationObserver(schedule);overlays.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('portfolio-play-change',schedule);document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);desktop.addEventListener('change',schedule);
  return()=>{reset();observer.disconnect();reveal.disconnect();overlays.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('portfolio-play-change',schedule);document.removeEventListener('visibilitychange',schedule);reduced.removeEventListener('change',schedule);desktop.removeEventListener('change',schedule);};
 },[version]);
 return <span ref={anchor} hidden/>;
}
