import {MOTION} from './motion-tokens';
/** Portfolio-only choreography; the scrolling site's motion remains independent. */
export const PRESENTATION_MOTION={ease:MOTION.ease,exit:260,settle:520,reveal:420,stagger:24,delay:120,background:620,exposure:400} as const;
export type ChapterTransition='depth'|'lateral'|'focus'|'cascade'|'folio';
const chapterTransitions:Record<string,ChapterTransition>={home:'depth',about:'depth',background:'folio',journey:'lateral',projects:'focus',skills:'cascade',certificates:'folio',services:'lateral',playground:'focus',contact:'depth'};
export function chapterTransition(chapter:string):ChapterTransition{return chapterTransitions[chapter]||'lateral';}
const identity='translate3d(0,0,0) scale(1)';
export function chapterCamera(style:ChapterTransition,direction:number,enter:boolean,mobile:boolean):Keyframe[]{
 const distance=mobile?.6:1;
 const offset=style==='depth'?`translate3d(${direction*36*distance}px,0,0) scale(1.045)`:style==='lateral'?`translate3d(${direction*100*distance}px,0,0)`:style==='focus'?'scale(.94)':style==='cascade'?`translate3d(0,${direction*54*distance}px,0)`:`translate3d(${direction*40*distance}px,${direction*32*distance}px,0) scale(.985)`;
 const active={opacity:1,transform:identity,filter:'blur(0px)'};
 const hidden={opacity:0,transform:offset,filter:!mobile&&style==='focus'?'blur(3px)':'blur(0px)'};
 return enter?[hidden,active]:[active,hidden];
}
export function chapterEntrance(chapter:string,kind:'title'|'visual'|'body',direction:number,mobile:boolean):Keyframe[]{
 const travel=mobile?.6:1,style=chapterTransition(chapter);
 let transform:string;
 if(kind==='title')transform=style==='lateral'?`translate3d(${-direction*70*travel}px,0,0)`:style==='focus'?'scale(1.04)':style==='folio'?`translate3d(0,${direction*64*travel}px,0)`:`translate3d(0,${48*travel}px,0)`;
 else if(kind==='visual'){
  if(style==='depth')transform=`translate3d(${-direction*96*travel}px,0,0) scale(1.04)`;
  else if(style==='focus')transform=`translate3d(${direction*70*travel}px,0,0) scale(1.08)`;
  else if(style==='folio')transform=`translate3d(${direction*32*travel}px,${direction*80*travel}px,0)`;
  else if(style==='cascade')transform=`translate3d(0,${direction*64*travel}px,0) scale(.98)`;
  else transform=`translate3d(${direction*70*travel}px,0,0)`;
 }else transform=`translate3d(${direction*16*travel}px,${28*travel}px,0)`;
 return [{opacity:0,transform},{opacity:1,transform:identity}];
}
/** A translucent lighting bridge leaves the incoming composition visible. */
export function transitionCover(style:ChapterTransition,direction:number,enter:boolean):Keyframe[]{
 const offset=style==='lateral'?`translateX(${direction*12}px)`:'scale(1.015)';
 return enter?[{opacity:.16,transform:identity},{opacity:0,transform:offset}]:[{opacity:0,transform:offset},{opacity:.16,transform:identity}];
}
export function transitionLight(style:ChapterTransition,direction:number,enter:boolean):Keyframe[]{
 const slope=style==='focus'?-12:style==='depth'?12:0;
 return enter?[{opacity:.32,transform:`translateX(0%) rotate(${slope}deg)`},{opacity:0,transform:`translateX(${-direction*90}%) rotate(${slope}deg)`}]:[{opacity:0,transform:`translateX(${direction*90}%) rotate(${slope}deg)`},{opacity:.32,transform:`translateX(0%) rotate(${slope}deg)`}];
}
