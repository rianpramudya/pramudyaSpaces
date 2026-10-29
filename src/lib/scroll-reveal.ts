import {MOTION} from './motion-tokens';
export type ScrollRevealEffect='fade'|'slide-up'|'scale-up';
export type ScrollReveal={effect:ScrollRevealEffect;children?:string};
/** Only transform/opacity; original layout, media and business state remain unchanged. */
export function scrollRevealFrames(effect:ScrollRevealEffect,mobile:boolean):Keyframe[]{
 const distance=MOTION.distance*MOTION.intensity*(mobile?.65:1);
 const from:Keyframe={opacity:0};
 if(effect==='slide-up')from.transform=`translate3d(0,${distance}px,0)`;
 if(effect==='scale-up')from.transform=`translate3d(0,${distance*.5}px,0) scale(${mobile?.985:.965})`;
 return [from,effect==='fade'?{opacity:1}:{opacity:1,transform:'translate3d(0,0,0) scale(1)'}];
}
export function scrollRevealTargets(root:HTMLElement):Map<HTMLElement,ScrollReveal>{
 const targets=new Map<HTMLElement,ScrollReveal>();
 root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(node=>{
  if(!node.matches('.experience-spread'))targets.set(node,{effect:'slide-up'});
 });
 const groups:[string,ScrollReveal][]=[
  ['.studio-section-heading,.studio-about-statement,.studio-contact-copy',{effect:'fade',children:':scope>*'}],
  ['.studio-about-portrait,.academic-entry,.studio-gallery-stage,.workspace-panel,.credential-stage,.service-work-stage',{effect:'scale-up'}],
  ['.studio-stats-panel',{effect:'fade',children:':scope>.studio-metrics-intro,:scope>dl>div'}],
  ['.learning-languages',{effect:'fade',children:':scope>h3,:scope>article'}],
  ['.experience-index',{effect:'fade',children:':scope>button'}],
  ['.experience-reading',{effect:'slide-up'}],
  ['.studio-gallery-story',{effect:'fade',children:':scope>div'}],
  ['.studio-gallery-index,.workspace-categories',{effect:'fade',children:':scope>button'}],
  ['.credential-index,.service-selector',{effect:'fade',children:':scope>p,:scope>article'}],
  ['.studio-contact-compose',{effect:'slide-up'}],
  ['.studio-play-panel,.studio-footer-directory',{effect:'fade'}],
  ['.studio-footer-opening',{effect:'fade',children:':scope>*'}],
 ];
 for(const [selector,config] of groups)root.querySelectorAll<HTMLElement>(selector).forEach(node=>targets.set(node,config));
 // A group owns its descendants; avoid multiplying parent and child transforms.
 for(const [parent,config] of targets)if(config.children)for(const node of targets.keys())if(node!==parent&&parent.contains(node))targets.delete(node);
 return targets;
}
