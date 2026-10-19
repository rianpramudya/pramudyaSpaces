'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,RotateCcw,Move3D} from 'lucide-react';
import {pointerTilt,shouldAnimateSpatial} from '@/lib/spatial-motion';
/** CSS scene: content remains ordinary links, with no canvas/WebGL dependency. */
export function SpatialScene({name,headline,skills,en}:{name:string;headline:string;skills:string[];en:boolean}){
 const root=useRef<HTMLDivElement>(null);const frame=useRef(0);const pending=useRef({x:0,y:0});const [enabled,setEnabled]=useState(false);const [turn,setTurn]=useState(0);
 const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(word=>Array.from(word)[0]).join('')||'↗';
 useEffect(()=>{
  const el=root.current;if(!el)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const fine=matchMedia('(hover: hover) and (pointer: fine)');let visible=false;
  const read=()=>{let on=true;try{on=localStorage.getItem('portfolio-motion')!=='off';}catch{}const running=shouldAnimateSpatial(reduced.matches,on,visible,document.visibilityState==='visible');setEnabled(running&&fine.matches);el.dataset.motion=running?'on':'off';if(!running||!fine.matches){cancelAnimationFrame(frame.current);frame.current=0;pending.current={x:0,y:0};el.style.setProperty('--pointer-x','0deg');el.style.setProperty('--pointer-y','0deg');}};
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;read();},{threshold:.1});observer.observe(el);read();
  reduced.addEventListener('change',read);fine.addEventListener('change',read);document.addEventListener('visibilitychange',read);window.addEventListener('portfolio-play-change',read);
  return()=>{observer.disconnect();cancelAnimationFrame(frame.current);reduced.removeEventListener('change',read);fine.removeEventListener('change',read);document.removeEventListener('visibilitychange',read);window.removeEventListener('portfolio-play-change',read);};
 },[]);
 function paint(){frame.current=0;root.current?.style.setProperty('--pointer-x',`${pending.current.x}deg`);root.current?.style.setProperty('--pointer-y',`${pending.current.y}deg`);}
 return <div className="spatial-scene" ref={root} data-motion="off" onPointerMove={e=>{if(!enabled||e.pointerType!=='mouse')return;const box=e.currentTarget.getBoundingClientRect();pending.current=pointerTilt(e.clientX-box.left,e.clientY-box.top,box.width,box.height);if(!frame.current)frame.current=requestAnimationFrame(paint);}} onPointerLeave={()=>{pending.current={x:0,y:0};if(!frame.current)frame.current=requestAnimationFrame(paint);}}>
  <div className="scene-coordinate"><Move3D size={15}/><span>{en?'A little perspective':'Sudut pandang yang berbeda'}</span></div>
  <div className="spatial-assembly" style={{'--turn':`${turn*90}deg`} as React.CSSProperties}>
   <div className="scene-portal" aria-hidden="true"><i/><i/><i/><i/></div><div className="scene-ground" aria-hidden="true"/><div className="scene-orbit orbit-one" aria-hidden="true"/><div className="scene-orbit orbit-two" aria-hidden="true"/>
   <div className="identity-cube" aria-hidden="true"><div className="cube-face cube-front">{initials}<span>{en?'Ideas into systems':'Ide menjadi sistem'}</span></div><div className="cube-face cube-right">&lt;/&gt;<span>{headline}</span></div><div className="cube-face cube-back">{initials}<span>{en?'Built with intention':'Dibangun dengan tujuan'}</span></div><div className="cube-face cube-left">↗<span>{name}</span></div><div className="cube-face cube-top"/><div className="cube-face cube-bottom"/></div>
   {skills.slice(0,3).map((skill,index)=><a key={`${skill}-${index}`} className={`scene-skill scene-skill-${index}`} href="#skills"><span className="scene-skill-dot"/>{skill}<ArrowUpRight size={13}/></a>)}
   <a className="scene-project-link" href="#projects"><span>{en?'From concept to code':'Dari konsep menjadi kode'}</span><strong>{en?'Explore the work':'Jelajahi karya'}<ArrowUpRight size={22}/></strong></a>
  </div>
  <div className="scene-controls"><button className="text-button" onClick={()=>setTurn(value=>value+1)}><RotateCcw size={15}/>{en?'Turn the object':'Putar objek'}<span className="sr-only">{en?'Quarter turn':'Seperempat putaran'}</span></button><span className="scene-hint">{en?'Move your pointer · or tap to turn':'Gerakkan pointer · atau ketuk untuk memutar'}</span></div>
 </div>;
}
