import {MOTION, revealLineDelays} from './motion-tokens';
import {scrollRevealTargets,scrollRevealFrames,type ScrollRevealEffect} from './scroll-reveal';

/** A clone travels above the exiting loader; neither live logo is moved or reparented. */
export function loaderHandoff(root: HTMLElement | null): (() => void) | undefined {
 const source=document.querySelector<HTMLImageElement>('.site-loading-identity img');
 const target=root?.querySelector<HTMLImageElement>('.studio-header .studio-brand img');
 if(!source||!target||typeof source.animate!=='function')return;
 const from=source.getBoundingClientRect(),to=target.getBoundingClientRect();
 if(!to.width||!to.height)return;
 const clone=source.cloneNode(true) as HTMLImageElement;
 clone.alt='';clone.setAttribute('aria-hidden','true');
 Object.assign(clone.style,{position:'fixed',pointerEvents:'none',zIndex:'1001',margin:'0',left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`,filter:getComputedStyle(source).filter,transformOrigin:'top left'});
 document.body.append(clone);
 const animation=clone.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width})`,opacity:1},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width})`,opacity:0}],{duration:MOTION.loader,easing:MOTION.ease,fill:'both'});
 void animation.finished.catch(()=>{});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const remove=()=>{animation.cancel();clone.remove();};
 reduced.addEventListener('change',remove);
 return ()=>{reduced.removeEventListener('change',remove);remove();};
}

/** Owns one-shot desktop entrances; existing page-mode choreography stays separate. */
export function createStudioEntrance(root: HTMLElement): () => void {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const animations=new Set<Animation>(),animationNodes=new WeakMap<Animation,Element>(),seen=new WeakSet<Element>();
 const targets=scrollRevealTargets(root),mobile=matchMedia('(max-width:767px)').matches;
 root.dataset.scrollReveal='managed';
 const allowed=()=>!reduced.matches&&root.dataset.motion!=='off';
 const ready=()=>root.dataset.ready==='true'&&!root.inert;
 let started=false,disposed=false;
 function animate(node:Element,frames:Keyframe[],delay=0,duration:number=MOTION.reveal){
  if(!allowed()||!node.animate)return;
  const animation=node.animate(frames,{duration,delay,easing:MOTION.ease,fill:'both'});animations.add(animation);animationNodes.set(animation,node);
  void animation.finished.catch(()=>{}).finally(()=>{animation.cancel();animations.delete(animation);});
 }
 function reveal(node:HTMLElement,delay=0,effect:ScrollRevealEffect='slide-up'){
  if(seen.has(node))return;seen.add(node);node.dataset.revealed='true';node.dataset.scrollReveal='done';
  const config=targets.get(node);
  if(config?.children){
   const children=Array.from(node.querySelectorAll<HTMLElement>(config.children)).filter(child=>!child.hidden).slice(0,6);
   children.forEach((child,index)=>animate(child,scrollRevealFrames('slide-up',mobile),index*(mobile?45:MOTION.stagger)));
  }else animate(node,scrollRevealFrames(effect,mobile),delay);
 }
 function showAll(){
  observer.disconnect();for(const animation of animations)animation.cancel();animations.clear();
  for(const node of targets.keys()){seen.add(node);node.dataset.revealed='true';node.dataset.scrollReveal='done';}
 }
 const focus=(event:FocusEvent)=>{
  if(!(event.target instanceof Element))return;
  for(const node of targets.keys())if(node.contains(event.target)){
   seen.add(node);node.dataset.revealed='true';node.dataset.scrollReveal='done';observer.unobserve(node);
   for(const animation of animations){const animated=animationNodes.get(animation);if(animated&&node.contains(animated)){animation.cancel();animations.delete(animation);}}
  }
 };
 const observer=new IntersectionObserver(entries=>{
  if(disposed||!ready()||!allowed())return;
  for(const entry of entries)if(entry.isIntersecting){
   const node=entry.target as HTMLElement;reveal(node,0,targets.get(node)?.effect);observer.unobserve(node);
  }
 },{threshold:0,rootMargin:'0px 0px -24px 0px'});

 function start(){
  if(disposed)return;
  if(!ready())return;
  if(!allowed()){showAll();started=true;return;}
  if(started)return;started=true;
  // Register after the loader releases inert, so hidden sections cannot consume their entrance.
  for(const node of targets.keys()){node.dataset.scrollReveal='pending';observer.observe(node);}
  const hero=root.querySelector<HTMLElement>('.studio-hero');if(!hero)return;
  hero.dataset.entrance='managed';
  const words=Array.from(hero.querySelectorAll<HTMLElement>('.studio-title-word'));
  const delays=revealLineDelays(words.map(word=>word.offsetTop),mobile?50:MOTION.stagger);
  words.forEach((word,index)=>{const inner=word.querySelector('.hero-word-inner');if(inner)animate(inner,[{transform:'translateY(105%)',opacity:0},{transform:'translateY(0)',opacity:1}],MOTION.introDelay+delays[index]);});
  for(const [index,selector] of ['.studio-hero-copy>.studio-eyebrow','.studio-hero-actions','.hero-reading-mode','.studio-hero-aside'].entries()){
   const node=hero.querySelector<HTMLElement>(selector);if(node)reveal(node,index*MOTION.stagger);
  }
  // Fade the photograph without transforming its frame beyond the hero's border.
  const portrait=hero.querySelector('.liquid-portrait');if(portrait)animate(portrait,[{opacity:0},{opacity:1}],MOTION.stagger*3);
 }
 const preference=new MutationObserver(start);preference.observe(root,{attributes:true,attributeFilter:['data-ready','inert','data-motion']});
 root.addEventListener('focusin',focus);reduced.addEventListener('change',start);window.addEventListener('portfolio-play-change',start);start();
 return ()=>{disposed=true;showAll();delete root.dataset.scrollReveal;for(const node of targets.keys())delete node.dataset.scrollReveal;root.removeEventListener('focusin',focus);preference.disconnect();reduced.removeEventListener('change',start);window.removeEventListener('portfolio-play-change',start);for(const animation of animations)animation.cancel();animations.clear();delete root.querySelector<HTMLElement>('.studio-hero')?.dataset.entrance;};
}
