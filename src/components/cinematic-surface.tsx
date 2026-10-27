'use client';
import {useEffect,useRef} from 'react';
import {cinematicQuality,scrollFraction} from '@/lib/cinematic-scene';
import type {CinematicController} from '@/lib/cinematic-renderer';
export function CinematicSurface({themeAware=false}:{themeAware?:boolean}){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const root=host.current,element=canvas.current;if(!root||!element)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),coarse=matchMedia('(pointer: coarse)'),hardware=navigator as Navigator & {deviceMemory?:number};
  let controller:CinematicController|undefined,disposed=false,visible=false,loading=false,failed=false;
  const allowed=()=>{let enabled=true;try{enabled=localStorage.getItem('portfolio-motion')!=='off';}catch{}return enabled&&visible&&document.visibilityState==='visible'&&!document.querySelector('dialog[open]')&&cinematicQuality(innerWidth,reduced.matches,coarse.matches,hardware.deviceMemory,hardware.hardwareConcurrency);};
  const syncTheme=()=>controller?.theme(themeAware&&document.documentElement.dataset.theme!=='dark');
  const themeObserver=themeAware?new MutationObserver(syncTheme):undefined;themeObserver?.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const progress=()=>controller?.scroll(scrollFraction(window.scrollY,document.documentElement.scrollHeight,innerHeight));
  async function sync(){const on=allowed();controller?.run(on);if(!on){root!.dataset.renderer='static';return;}if(controller){root!.dataset.renderer='webgl';return;}if(loading||failed||disposed)return;loading=true;try{const {createCinematicRenderer}=await import('@/lib/cinematic-renderer');if(disposed)return;controller=createCinematicRenderer(element!,()=>{if(!disposed&&allowed())root!.dataset.renderer='webgl';});syncTheme();controller.resize(root!.clientWidth,root!.clientHeight);progress();controller.run(allowed());}catch{failed=true;root!.dataset.renderer='static';controller?.dispose();controller=undefined;}finally{loading=false;}}
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;void sync();});observer.observe(root);
  const resize=new ResizeObserver(()=>{controller?.resize(root.clientWidth,root.clientHeight);void sync();});resize.observe(root);
  const change=()=>{void sync();},point=(event:PointerEvent)=>{if(!allowed()||event.pointerType!=='mouse')return;const box=root.getBoundingClientRect();controller?.point((event.clientX-box.left)/box.width*2-1,1-(event.clientY-box.top)/box.height*2);};
  const lost=(event:Event)=>{event.preventDefault();failed=true;controller?.dispose();controller=undefined;root.dataset.renderer='static';};
  const overlays=new MutationObserver(change);overlays.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open'],childList:true});
  element.addEventListener('webglcontextlost',lost);window.addEventListener('scroll',progress,{passive:true});window.addEventListener('pointermove',point,{passive:true});window.addEventListener('portfolio-play-change',change);document.addEventListener('visibilitychange',change);reduced.addEventListener('change',change);coarse.addEventListener('change',change);
  return()=>{disposed=true;themeObserver?.disconnect();observer.disconnect();resize.disconnect();overlays.disconnect();controller?.dispose();element.removeEventListener('webglcontextlost',lost);window.removeEventListener('scroll',progress);window.removeEventListener('pointermove',point);window.removeEventListener('portfolio-play-change',change);document.removeEventListener('visibilitychange',change);reduced.removeEventListener('change',change);coarse.removeEventListener('change',change);};
 },[themeAware]);
 return <div className="cinematic-surface" ref={host} data-renderer="static" aria-hidden="true"><canvas ref={canvas}/></div>;
}
export function CinematicChapters({nav,active,en}:{nav:string[][];active:string;en:boolean}){
 const index=Math.max(0,nav.findIndex(([id])=>id===active));
 return <nav className="cinematic-chapters" aria-label={en?'Page chapters':'Bab halaman'}>{nav.map(([id,label],i)=><a key={id} href={`#${id}`} aria-label={label} title={label} aria-current={active===id?'location':undefined} data-visited={i<index}><span/><span className="sr-only">{label}</span></a>)}</nav>;
}
