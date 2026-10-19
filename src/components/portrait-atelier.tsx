'use client';
import {useEffect,useRef,useState,useId} from 'react';
import {sculptureQuality} from '@/lib/sculpture-motion';
import {portraitGesture,portraitDrag,portraitPose} from '@/lib/portrait-interaction';
import type {PortraitController} from '@/lib/portrait-renderer';
export function PortraitAtelier({photo,alt,name,initials,en}:{photo:string;alt:string;name:string;initials:string;en:boolean}){
 const host=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),controller=useRef<PortraitController|null>(null);const hint=useId();
 const [mode,setMode]=useState<'fallback'|'webgl'>('fallback'),[broken,setBroken]=useState(false);
 useEffect(()=>{
  setMode('fallback');setBroken(false);const root=host.current,element=canvas.current;if(!root||!element||!photo)return;
  let disposed=false,loading=false,visible=false,failed=false,animate=false,frame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
  const rotation={yaw:0,pitch:0},hover={x:0,y:0},painted=portraitPose();
  let drag:{id:number;x:number;y:number;yaw:number;pitch:number;width:number;height:number;touch:boolean;accepted:boolean}|null=null;
  function paint(){frame=0;if(disposed)return;const pose=portraitPose(animate?hover.x:0,animate?hover.y:0,rotation.yaw,rotation.pitch),factor=animate?.14:1;
   const settling=Math.abs(painted.x-pose.x)+Math.abs(painted.y-pose.y)>.001;painted.x+=(pose.x-painted.x)*factor;painted.y+=(pose.y-painted.y)*factor;
   root!.style.setProperty('--portrait-rx',`${painted.x}rad`);root!.style.setProperty('--portrait-ry',`${painted.y}rad`);if(animate&&settling)request();
  }
  function request(){if(!frame&&!disposed)frame=requestAnimationFrame(paint);}
  function sync(){let on=true;try{on=localStorage.getItem('portfolio-motion')!=='off';}catch{}animate=visible&&!reduced.matches&&on&&document.visibilityState==='visible';if(!animate){hover.x=hover.y=0;cancelAnimationFrame(frame);frame=0;}controller.current?.motion(animate);request();}
  function point(x:number,y:number){hover.x=x;hover.y=y;controller.current?.point(x,y);request();}
  function turn(yaw:number,pitch:number){rotation.yaw=yaw;rotation.pitch=Math.max(-.28,Math.min(.28,pitch));controller.current?.turn(rotation.yaw,rotation.pitch);request();}
  function end(){if(drag&&root!.hasPointerCapture(drag.id))root!.releasePointerCapture(drag.id);drag=null;root!.dataset.dragging='false';}
  function fail(){failed=true;controller.current?.dispose();controller.current=null;if(!disposed)setMode('fallback');}
  async function load(){if(disposed||failed||loading||controller.current)return;loading=true;
   const memory=(navigator as Navigator & {deviceMemory?:number}).deviceMemory;if(!sculptureQuality(root!.clientWidth,devicePixelRatio||1,memory).webgl)return;
   try{const gl=element!.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)return;const {createPortrait}=await import('@/lib/portrait-renderer');if(disposed)return;
    controller.current=createPortrait(element!,gl,root!,photo,()=>{if(!disposed)setMode('webgl');},fail);controller.current.turn(rotation.yaw,rotation.pitch);sync();
   }catch{fail();}
  }
  const down=(event:PointerEvent)=>{if(event.pointerType==='mouse'&&event.button!==0)return;if(!event.isPrimary){end();return;}const box=root.getBoundingClientRect();point(0,0);drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw:rotation.yaw,pitch:rotation.pitch,width:box.width,height:box.height,touch:event.pointerType==='touch',accepted:false};};
  const move=(event:PointerEvent)=>{
   if(drag&&!drag.touch&&event.buttons===0)end();
   if(drag&&drag.id===event.pointerId){const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.accepted){const intent=portraitGesture(dx,dy);if(intent==='pending')return;if(drag.touch&&intent==='vertical'){end();return;}drag.accepted=true;root.setPointerCapture(event.pointerId);root.dataset.dragging='true';if(!drag.touch)root.focus({preventScroll:true});}
    const pose=portraitDrag(drag.yaw,drag.pitch,dx,dy,drag.width,drag.height,!drag.touch);turn(pose.yaw,pose.pitch);if(event.cancelable)event.preventDefault();return;
   }
   if(!animate||!fine.matches||event.pointerType!=='mouse')return;const box=root.getBoundingClientRect();point(Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1)),Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1)));
  };
  const up=(event:PointerEvent)=>{if(drag?.id===event.pointerId)end();};const leave=()=>{if(drag&&!drag.accepted)end();if(!drag)point(0,0);};
  const key=(event:KeyboardEvent)=>{const delta=Math.PI/12;switch(event.key){case 'ArrowLeft':turn(rotation.yaw-delta,rotation.pitch);break;case 'ArrowRight':turn(rotation.yaw+delta,rotation.pitch);break;case 'ArrowUp':turn(rotation.yaw,rotation.pitch-.08);break;case 'ArrowDown':turn(rotation.yaw,rotation.pitch+.08);break;case 'Escape':point(0,0);turn(0,0);break;default:return;}event.preventDefault();};
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)void load();else end();sync();},{rootMargin:'100px'});observer.observe(root);
  const resize=new ResizeObserver(()=>controller.current?.resize());resize.observe(root);const lost=(event:Event)=>{event.preventDefault();fail();};element.addEventListener('webglcontextlost',lost);
  root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move);root.addEventListener('pointerup',up);root.addEventListener('pointercancel',up);root.addEventListener('lostpointercapture',up);root.addEventListener('pointerleave',leave);root.addEventListener('keydown',key);
  reduced.addEventListener('change',sync);window.addEventListener('portfolio-play-change',sync);document.addEventListener('visibilitychange',sync);sync();
  return()=>{disposed=true;end();cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();controller.current?.dispose();controller.current=null;element.removeEventListener('webglcontextlost',lost);root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',up);root.removeEventListener('lostpointercapture',up);root.removeEventListener('pointerleave',leave);root.removeEventListener('keydown',key);reduced.removeEventListener('change',sync);window.removeEventListener('portfolio-play-change',sync);document.removeEventListener('visibilitychange',sync);};
 },[photo]);
 return <figure className={`portrait-atelier ${!photo?'portrait-atelier-empty':''}`} data-room="portrait">
  <div ref={host} className="portrait-stage" role="group" tabIndex={photo?0:undefined} aria-roledescription={en?'Interactive portrait':'Potret interaktif'} aria-label={photo?alt:(en?`Portrait of ${name} is being prepared`:`Potret ${name||'pemilik'} sedang disiapkan`)} aria-describedby={photo?hint:undefined} data-renderer={photo?mode:'fallback'}>
   <span className="portrait-object-label" aria-hidden="true">{initials} / {en?'Portrait':'Potret'}</span>
   <div className="atelier-fallback" aria-hidden="true"><div className="atelier-print"><i className="portrait-corner corner-top-left"/><i className="portrait-corner corner-top-right"/><i className="portrait-corner corner-bottom-left"/><i className="portrait-corner corner-bottom-right"/>{photo&&!broken?<img src={photo} alt="" draggable={false} loading="lazy" onError={()=>setBroken(true)}/>:<span className="atelier-initials">{initials}</span>}</div><span className="portrait-ground-shadow"/></div>
   {photo&&<canvas ref={canvas} aria-hidden="true"/>}
  </div>
  <figcaption><span className="atelier-owner">{name}</span>{photo&&<span className="portrait-interaction-hint" id={hint}>{en?'Move the pointer or swipe horizontally to rotate.':'Gerakkan kursor atau geser mendatar untuk memutar.'}<span className="sr-only"> {en?'Arrow keys rotate; Escape resets.':'Tombol panah untuk memutar; Escape untuk reset.'}</span></span>}</figcaption>
 </figure>;
}
