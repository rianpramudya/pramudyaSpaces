import {MOTION} from './motion-tokens';
import {PRESENTATION_MOTION as PRESENTATION,chapterEntrance,chapterCamera,chapterTransition,transitionCover,transitionLight} from './portfolio-motion-presets';
const EASE=MOTION.ease;
function revealTargets(main:HTMLElement):HTMLElement[]{
 const result:HTMLElement[]=[];
 for(const section of main.querySelectorAll<HTMLElement>(':scope > section')){
  for(const child of Array.from(section.children) as HTMLElement[]){
   if(child.matches('.cinematic-surface,.studio-hero-vignette,.studio-hero-watermark'))continue;
   const copy=child.matches('.studio-hero-content')?child.querySelector<HTMLElement>('.studio-hero-copy'):child;
   if(copy?.matches('header,.studio-about-statement,.studio-contact-copy,.studio-hero-copy')){result.push(...Array.from(copy.children) as HTMLElement[]);if(child.matches('.studio-hero-content')){const aside=child.querySelector<HTMLElement>('.studio-hero-aside');if(aside)result.push(aside);}}
   else if(child.matches('.studio-workspace')){
    const panel=child.querySelector<HTMLElement>('.workspace-panel');if(panel)result.push(panel);
    result.push(...Array.from(child.querySelectorAll<HTMLElement>('.workspace-categories>button')).slice(0,3));
   }else if(child.matches('.studio-service-studio,.studio-credential-gallery,.experience-spread,.studio-learning-folio')){
    result.push(...Array.from(child.querySelectorAll<HTMLElement>(':scope>.service-work-stage,:scope>.service-selector,:scope>.credential-stage,:scope>.credential-index,:scope>.experience-index,:scope>.experience-reading,.academic-pages,.learning-languages,:scope>.learning-achievements')));
   }else result.push(child);
  }
 }
 const priority=(node:HTMLElement)=>node.matches('h1,h2')?0:node.matches('.studio-eyebrow')?1:node.matches('p')?2:3;
 return result.filter(node=>!node.hidden).sort((a,b)=>priority(a)-priority(b)).slice(0,8);
}
/** Native WAAPI keeps routing independent of animation and adds no runtime dependency. */
export function createPortfolioMotion(host:HTMLElement){
 const transitions=new Set<Animation>(),ambient=new Set<Animation>();
 let disposed=false,pointerFrame=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 const scene=()=>host.querySelector<HTMLElement>('.portfolio');
 const ready=()=>scene()?.dataset.ready==='true'&&!scene()?.inert;
 const full=()=>!reduced.matches&&scene()?.dataset.motion!=='off';
 const canIdle=()=>!disposed&&ready()&&full()&&host.dataset.pmPhase==='idle'&&document.visibilityState==='visible'&&!document.querySelector('dialog[open]');
 function animate(node:Element|null,frames:Keyframe[],duration:number,delay=0){
  if(!node||typeof node.animate!=='function')return;
  const mobile=!fine.matches;
  const adjusted=frames.map(frame=>({...frame,...(typeof frame.transform==='string'?{transform:frame.transform.replace(/(-?[\d.]+)px/g,(_,value:string)=>`${Number(value)*MOTION.intensity}px`)}:{}),...(mobile&&frame.filter?{filter:'blur(0px)'}:{})}));
  const animation=node.animate(adjusted,{duration,delay,easing:EASE,fill:'both'});transitions.add(animation);return animation.finished.catch(()=>{});
 }
 function cover(direction:number,enter:boolean){
  const style=chapterTransition(host.dataset.pmTarget||host.dataset.chapter||'home');
  const duration=enter?PRESENTATION.exposure:PRESENTATION.exit;
  const jobs=[animate(host.querySelector('.pm-transition-veil'),transitionCover(style,direction,enter),duration),animate(host.querySelector('.pm-transition-light'),transitionLight(style,direction,enter),duration)];
  return jobs;
 }
 function cancel(){for(const animation of transitions)animation.cancel();transitions.clear();}
 function pauseAmbient(){for(const animation of ambient)animation.pause();cancelAnimationFrame(pointerFrame);pointerFrame=0;}
 function idle(){
  if(!canIdle()){pauseAmbient();return;}
  if(!ambient.size){host.querySelectorAll('.pm-orbit').forEach((node,index)=>{
   if(typeof node.animate!=='function')return;
   const animation=node.animate([{transform:'translate3d(0,0,0) scale(1)'},{transform:`translate3d(${index?-8:10}px,${index?6:-8}px,0) scale(1.02)`}],{duration:index?MOTION.ambientSecondary:MOTION.ambientPrimary,direction:'alternate',iterations:Infinity,easing:EASE});
   void animation.finished.catch(()=>{});ambient.add(animation);
  });}
  for(const animation of ambient)animation.play();
 }
 function preference(){host.dataset.pmReduced=String(!full());cancel();if(!full()){for(const animation of ambient)animation.cancel();ambient.clear();const plane=host.querySelector<HTMLElement>('.pm-parallax');if(plane)plane.style.removeProperty('transform');}idle();}
 const point=(event:PointerEvent)=>{
  if(!canIdle()||!fine.matches||event.pointerType!=='mouse'||pointerFrame)return;
  const x=(event.clientX/innerWidth-.5)*14,y=(event.clientY/innerHeight-.5)*12;
  pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const plane=host.querySelector<HTMLElement>('.pm-parallax');if(plane)plane.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;});
 };
 const themeObserver=new MutationObserver(preference);themeObserver.observe(host,{subtree:true,attributes:true,attributeFilter:['data-motion']});
 const overlayObserver=new MutationObserver(idle);overlayObserver.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 reduced.addEventListener('change',preference);window.addEventListener('portfolio-play-change',preference);window.addEventListener('pointermove',point,{passive:true});document.addEventListener('visibilitychange',idle);
 host.dataset.pmReduced=String(!full());
 return {
  async exit(direction:number){
   pauseAmbient();cancel();
   const main=host.querySelector<HTMLElement>('#main');if(!main)return;
   const jobs:(Promise<unknown>|undefined)[]=[];
   if(!full())jobs.push(animate(main,[{opacity:1},{opacity:0}],MOTION.fadeOut));
   else{
    const style=chapterTransition(host.dataset.pmTarget||host.dataset.chapter||'home');
    jobs.push(animate(main,chapterCamera(style,-direction,false,!fine.matches),PRESENTATION.exit));
    revealTargets(main).reverse().forEach((node,index)=>jobs.push(animate(node,[{opacity:1,transform:'translate3d(0,0,0)'},{opacity:0,transform:`translate3d(${-direction*36}px,-16px,0)`}],MOTION.exitItem,index*MOTION.exitStagger)));
    jobs.push(animate(host.querySelector('.pm-atmosphere'),[{opacity:1,transform:'translateX(0) scale(1)'},{opacity:.3,transform:`translateX(${-direction*8}%) scale(1.05)`}],PRESENTATION.exit));
    jobs.push(...cover(direction,false));

   }
   await Promise.all(jobs);
  },
  async enter(direction:number){
   cancel();const main=host.querySelector<HTMLElement>('#main');if(!main)return;
   const jobs:(Promise<unknown>|undefined)[]=[];
   if(!full())jobs.push(animate(main,[{opacity:0},{opacity:1}],MOTION.fadeIn));
   else{
    const mobile=!fine.matches,chapter=host.dataset.chapter||'home';
    jobs.push(animate(main,chapterCamera(chapterTransition(chapter),direction,true,mobile),PRESENTATION.settle));
    revealTargets(main).forEach((node,index)=>{
     const kind=node.matches('h1,h2')?'title':node.matches('.liquid-portrait,.studio-about-portrait,.studio-gallery,.studio-learning-folio,.experience-spread,.studio-workspace,.workspace-panel,.service-work-stage,.credential-stage,.experience-reading,.academic-pages,.studio-credential-gallery,.studio-services,.studio-play-panel,.studio-contact-compose')?'visual':'body';
     const delay=kind==='title'?60:PRESENTATION.delay+index*(mobile?12:PRESENTATION.stagger);
     jobs.push(animate(node,chapterEntrance(chapter,kind,direction,mobile),PRESENTATION.reveal,delay));
    });
    jobs.push(animate(host.querySelector('.pm-atmosphere'),[{opacity:.3,transform:`translateX(${direction*8}%) scale(1.05)`},{opacity:1,transform:'translateX(0%) scale(1)'}],PRESENTATION.background));
    jobs.push(...cover(direction,true));

   }
   await Promise.all(jobs);
  },
  cancel,idle,
  dispose(){disposed=true;cancel();pauseAmbient();for(const animation of ambient)animation.cancel();ambient.clear();themeObserver.disconnect();overlayObserver.disconnect();reduced.removeEventListener('change',preference);window.removeEventListener('portfolio-play-change',preference);window.removeEventListener('pointermove',point);document.removeEventListener('visibilitychange',idle);},
 };
}
