'use client';
import {useEffect,useRef,useState} from 'react';
import {RotateCcw} from 'lucide-react';
import {sculptureQuality} from '@/lib/sculpture-motion';
import {heroQuality} from '@/lib/hero-scene';
import type {SculptureController,SculptureVariant} from '@/lib/sculpture-renderer';
export function SculptureStage({variant='hero',en,monogram='/'}:{variant?:SculptureVariant;en:boolean;monogram?:string}){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);const controller=useRef<SculptureController|null>(null);const [mode,setMode]=useState<'fallback'|'webgl'>('fallback');const [turn,setTurn]=useState(0);
 useEffect(()=>{
  const root=host.current,element=canvas.current;if(!root||!element)return;let disposed=false,visible=false,loading=false,failed=false,generation=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:768px)');setMode('fallback');
  const parent=variant==='hero'?root.closest('section'):null;
  function supportsHero(){const hardware=navigator as Navigator & {deviceMemory?:number};return variant!=='hero'||heroQuality(window.innerWidth,hardware.deviceMemory,reduced.matches,hardware.hardwareConcurrency).webgl;}
  function enabled(){let on=true;try{on=localStorage.getItem('portfolio-motion')!=='off';}catch{}return visible&&!reduced.matches&&on&&document.visibilityState==='visible';}
  const sync=()=>{if(!supportsHero()){generation++;controller.current?.dispose();controller.current=null;loading=false;setMode('fallback');return;}if(visible&&!controller.current)void load();controller.current?.setMotion(enabled());};
  async function load(){
   if(loading||controller.current||disposed||failed||!supportsHero())return;loading=true;const ticket=++generation;
   const memory=(navigator as Navigator & {deviceMemory?:number}).deviceMemory;if(!sculptureQuality(root!.clientWidth,devicePixelRatio||1,memory).webgl)return;
   try{const gl=element!.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl){failed=true;return;}const {createSculpture}=await import('@/lib/sculpture-renderer');if(disposed||ticket!==generation||!supportsHero())return;controller.current=createSculpture(element!,gl,root!,variant,monogram);controller.current.setMotion(enabled());setMode('webgl');}catch{failed=true;controller.current?.dispose();controller.current=null;setMode('fallback');}finally{if(ticket===generation)loading=false;}
  }
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)void load();sync();},{rootMargin:'100px',threshold:0});observer.observe(root);
  const resize=new ResizeObserver(()=>controller.current?.resize());resize.observe(root);
  const lost=(event:Event)=>{event.preventDefault();failed=true;generation++;loading=false;controller.current?.dispose();controller.current=null;if(!disposed)setMode('fallback');};element.addEventListener('webglcontextlost',lost);
  const move=(event:Event)=>{const pointer=event as PointerEvent;if(pointer.pointerType!=='mouse'||!parent)return;const box=parent.getBoundingClientRect();controller.current?.point((pointer.clientX-box.left)/box.width*2-1,(pointer.clientY-box.top)/box.height*2-1);};const leave=()=>controller.current?.point(0,0);parent?.addEventListener('pointermove',move);parent?.addEventListener('pointerleave',leave);
  desktop.addEventListener('change',sync);reduced.addEventListener('change',sync);window.addEventListener('portfolio-play-change',sync);document.addEventListener('visibilitychange',sync);
  return()=>{disposed=true;generation++;parent?.removeEventListener('pointermove',move);parent?.removeEventListener('pointerleave',leave);desktop.removeEventListener('change',sync);observer.disconnect();resize.disconnect();element.removeEventListener('webglcontextlost',lost);reduced.removeEventListener('change',sync);window.removeEventListener('portfolio-play-change',sync);document.removeEventListener('visibilitychange',sync);controller.current?.dispose();controller.current=null;};
 },[variant,monogram]);
 return <div className={`sculpture-stage sculpture-${variant}`} ref={host} role="group" aria-label={variant==='hero'?(en?`Identity monogram ${monogram}`:`Monogram identitas ${monogram}`):(en?'Interactive envelope':'Amplop interaktif')} data-renderer={mode} onPointerMove={e=>{if(variant==='hero'||e.pointerType!=='mouse')return;const box=e.currentTarget.getBoundingClientRect();controller.current?.point((e.clientX-box.left)/box.width*2-1,(e.clientY-box.top)/box.height*2-1);}} onPointerLeave={()=>controller.current?.point(0,0)}>
  <div className="sculpture-fallback" aria-hidden="true" style={{'--sculpture-turn':`${turn*90}deg`} as React.CSSProperties}>{variant==='hero'?<div className="identity-monogram-fallback">{monogram}</div>:<div className="chrome-envelope"><i/><span/></div>}</div>
  <canvas ref={canvas} className="sculpture-canvas" aria-hidden="true"/>
  <div className="sculpture-controls"><span>{variant==='hero'?(en?'A mark of my own.':'Nama sendiri. Jejak sendiri.'):(en?'Every collaboration starts with a message.':'Setiap kolaborasi dimulai dari pesan.')}</span>{variant==='hero'&&mode==='fallback'?<span>{en?'Static view':'Tampilan statis'}</span>:<button type="button" className="text-button" onClick={()=>{setTurn(value=>value+1);controller.current?.rotate();}}><RotateCcw size={14}/>{en?'Turn the object':'Putar objek'}</button>}</div>
 </div>;
}
