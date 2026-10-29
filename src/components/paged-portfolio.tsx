'use client';
import {useEffect,useLayoutEffect,useRef,useState,useTransition,type MouseEvent} from 'react';
import {useRouter} from 'next/navigation';
import type {PublicContent} from '@/lib/model';
import {siteNavigation} from '@/lib/site-navigation';
import {focusChapterHeading,pageForHash,pageHref,resolvePortfolioPage} from '@/lib/portfolio-pages';
import {PageTransitionLane,boundaryPage,pageDirection,type PagePhase} from '@/lib/page-transition';
import {chapterTransition} from '@/lib/portfolio-motion-presets';
import {createPortfolioMotion} from '@/lib/portfolio-motion';
import {motionStyle} from '@/lib/motion-tokens';
import {lockBodyScroll} from '@/lib/scroll-lock';
import {Portfolio} from './portfolio';
type Snapshot={initial:PublicContent;page:string};
type Arrival={resolve:(snapshot:Snapshot)=>void};
export function PagedPortfolio({initial,page}:Snapshot){
 const router=useRouter(),[,startTransition]=useTransition();
 const host=useRef<HTMLDivElement>(null),scene=useRef<HTMLDivElement>(null);
 const [shown,setShown]=useState<Snapshot>({initial,page}),[phase,setPhase]=useState<PagePhase>('idle'),[status,setStatus]=useState('');
 const shownRef=useRef(shown),incoming=useRef<Snapshot>({initial,page}),latest=useRef({initial,router});
 const lane=useRef<PageTransitionLane|null>(null),arrival=useRef<Arrival|null>(null),commit=useRef<(()=>void)|null>(null);
 const perform=useRef<(target:string,href?:string,snapshot?:Snapshot,intro?:boolean)=>boolean>(()=>false);
 const readyCheck=useRef<()=>void>(()=>{}),initialized=useRef(false),direction=useRef<1|-1>(1),commitFrame=useRef(0);
 latest.current={initial,router};
 useLayoutEffect(()=>{
  shownRef.current=shown;
  if(commit.current){
   const done=commit.current;commit.current=null;
   window.scrollTo({top:0,behavior:'instant'});
   commitFrame.current=requestAnimationFrame(()=>{commitFrame.current=0;done();});
  }
 },[shown]);
 useEffect(()=>{
  const root=host.current,plane=scene.current;if(!root||!plane)return;
  let disposed=false,intro=false,lastGesture=0,wheelSum=0,wheelTime=0;
  let touch:{x:number;y:number}|null=null;
  const motion=createPortfolioMotion(root);
  const navigation=()=>siteNavigation(latest.current.initial.records,false,'pages');
  const currentURL=()=>resolvePortfolioPage(new URL(location.href).searchParams.get('page')||undefined,navigation());
  function finishFocus(){
   if(disposed)return;
   let target:HTMLElement|null=null;
   try{target=location.hash?document.getElementById(decodeURIComponent(location.hash.slice(1))):null;}catch{}
   if(target&&!target.hidden)target.scrollIntoView({block:'start',behavior:'instant'});
   const section=root!.querySelector<HTMLElement>(`#${shownRef.current.page}`);
   if(section)focusChapterHeading(target||section);
  }
  const machine=new PageTransitionLane({
   phase(next){
    root.dataset.pmPhase=next;setPhase(next);
    if(next==='idle'){intro=false;lastGesture=performance.now();motion.idle();}
   },
   lock(){
    const previous=document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter='stable';
    plane.inert=true;
    const release=lockBodyScroll();
    return()=>{plane.inert=false;release();document.documentElement.style.scrollbarGutter=previous;};
   },
   exit:()=>intro?Promise.resolve():motion.exit(direction.current),
   enter:()=>motion.enter(direction.current),cancel:motion.cancel,
   error(){setStatus(document.documentElement.lang==='en'?'This page could not open. Please try the navigation again.':'Halaman belum bisa dibuka. Silakan coba navigasi lagi.');},
  });
  lane.current=machine;
  perform.current=(target,href,snapshot,initialEntry=false)=>{
   if(machine.busy||disposed||(!initialized.current&&!initialEntry))return false;
   if(!initialEntry&&target===shownRef.current.page)return false;
   direction.current=pageDirection(navigation(),shownRef.current.page,target);
   root.dataset.pmDirection=String(direction.current);root.dataset.pmTarget=target;root.dataset.pmTransition=chapterTransition(target);intro=initialEntry;setStatus('');
   const task=machine.run(signal=>{
    if(snapshot)return Promise.resolve(snapshot);
    return new Promise<Snapshot>(resolve=>{
     const pending:Arrival={resolve:value=>{if(arrival.current===pending)arrival.current=null;signal.removeEventListener('abort',abort);resolve(value);}};
     const abort=()=>{if(arrival.current===pending)arrival.current=null;resolve(shownRef.current);};
     arrival.current=pending;signal.addEventListener('abort',abort,{once:true});
     startTransition(()=>latest.current.router.push(href||pageHref(target),{scroll:false}));
    });
   },async next=>{
    direction.current=pageDirection(navigation(),shownRef.current.page,next.page);
    root.dataset.pmDirection=String(direction.current);root.dataset.pmTarget=next.page;root.dataset.pmTransition=chapterTransition(next.page);
    if(next===shownRef.current)return;
    await new Promise<void>(resolve=>{commit.current=resolve;setShown(next);});
   });
   void task.then(ok=>{
    if(disposed)return;
    if(ok)finishFocus();
    const newest=incoming.current;
    if(newest.page!==shownRef.current.page&&newest.page===currentURL())perform.current(newest.page,undefined,newest);
   });
   return true;
  };
  readyCheck.current=()=>{
   const site=root.querySelector<HTMLElement>('.portfolio');
   if(initialized.current||site?.dataset.ready!=='true'||site.inert)return;
   const snapshot=incoming.current,hashPage=pageForHash(location.hash,navigation());
   if(snapshot.page!==currentURL()||(hashPage&&hashPage!==snapshot.page))return;
   initialized.current=true;perform.current(snapshot.page,undefined,snapshot,true);
  };
  const readyObserver=new MutationObserver(readyCheck.current);readyObserver.observe(root,{subtree:true,attributes:true,attributeFilter:['data-ready','inert']});readyCheck.current();
  const blockedTarget=(target:EventTarget|null)=>target instanceof Element&&!!target.closest('dialog,.drawer,.studio-nav-popover,.runner-experience,.studio-gallery-stage,input,textarea,select,[contenteditable="true"],[role="slider"],[role="tablist"]');
  function nestedScroll(target:EventTarget|null){
   let node=target instanceof Element?target:null;
   while(node&&node!==root){const style=getComputedStyle(node);if(/auto|scroll/.test(style.overflowY+style.overflowX)&&(node.scrollHeight>node.clientHeight+2||node.scrollWidth>node.clientWidth+2))return true;node=node.parentElement;}
   return false;
  }
  function gesture(delta:number){
   if(machine.busy||!initialized.current||document.querySelector('dialog[open]')||performance.now()-lastGesture<350)return false;
   const top=scrollY<=4,bottom=scrollY+innerHeight>=document.documentElement.scrollHeight-4;
   const target=boundaryPage(navigation(),shownRef.current.page,delta,top,bottom);
   return target?perform.current(target):false;
  }
  function wheel(event:WheelEvent){
   if(event.ctrlKey||event.metaKey)return;
   if(machine.busy){event.preventDefault();return;}
   if(blockedTarget(event.target)||nestedScroll(event.target)||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
   const now=performance.now();if(now-wheelTime>180||Math.sign(wheelSum)!==Math.sign(event.deltaY))wheelSum=0;wheelTime=now;
   wheelSum+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
   if(Math.abs(wheelSum)>90&&gesture(wheelSum)){wheelSum=0;event.preventDefault();}
  }
  function key(event:KeyboardEvent){
   if(event.altKey||event.ctrlKey||event.metaKey)return;
   if(machine.busy){if(['Tab','Enter',' ','ArrowLeft','ArrowRight','ArrowDown','ArrowUp','PageDown','PageUp'].includes(event.key))event.preventDefault();return;}
   if(blockedTarget(event.target)||document.querySelector('dialog[open]'))return;
   if(event.target instanceof Element&&event.target.closest('button,a,summary,[role="button"]'))return;
   if(['PageDown','PageUp'].includes(event.key)){if(gesture(event.key==='PageDown'?1:-1))event.preventDefault();return;}
   if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
   const nav=navigation(),index=nav.findIndex(([id])=>id===shownRef.current.page),target=nav[index+(event.key==='ArrowRight'?1:-1)]?.[0];
   if(target&&perform.current(target))event.preventDefault();
  }
  const touchStart=(event:TouchEvent)=>{if(event.touches.length!==1||blockedTarget(event.target)||nestedScroll(event.target)||!(event.target instanceof Element)||event.target.closest('a,button,summary')){touch=null;return;}touch={x:event.touches[0].clientX,y:event.touches[0].clientY};};
  const touchCancel=()=>{touch=null;};
  const touchMove=(event:TouchEvent)=>{if(machine.busy&&event.touches.length===1)event.preventDefault();};
  const touchEnd=(event:TouchEvent)=>{
   const start=touch;touch=null;if(!start||!event.changedTouches.length||machine.busy||document.querySelector('dialog[open]'))return;
   const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;
   if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.3){
    const nav=navigation(),index=nav.findIndex(([id])=>id===shownRef.current.page),target=nav[index+(dx<0?1:-1)]?.[0];if(target&&perform.current(target))event.preventDefault();
   }else if(Math.abs(dy)>100&&gesture(-dy))event.preventDefault();
  };
  const pop=()=>{const target=currentURL();if(machine.busy&&target===shownRef.current.page)arrival.current?.resolve(shownRef.current);};
  window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',key);window.addEventListener('touchstart',touchStart,{passive:true});window.addEventListener('touchmove',touchMove,{passive:false});window.addEventListener('touchend',touchEnd,{passive:false});window.addEventListener('touchcancel',touchCancel,{passive:true});window.addEventListener('popstate',pop);
  return()=>{disposed=true;machine.dispose();lane.current=null;arrival.current=null;commit.current=null;initialized.current=false;perform.current=()=>false;readyCheck.current=()=>{};cancelAnimationFrame(commitFrame.current);readyObserver.disconnect();motion.dispose();window.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key);window.removeEventListener('touchstart',touchStart);window.removeEventListener('touchmove',touchMove);window.removeEventListener('touchend',touchEnd);window.removeEventListener('touchcancel',touchCancel);window.removeEventListener('popstate',pop);};
 },[]);
 useEffect(()=>{
  const snapshot={initial,page};incoming.current=snapshot;
  const nav=siteNavigation(initial.records,false,'pages'),hash=pageForHash(location.hash,nav);
  if(hash&&hash!==page){
   if(initialized.current)perform.current(hash,`${pageHref(hash)}${location.hash}`);
   else router.replace(`${pageHref(hash)}${location.hash}`);
   return;
  }
  const target=resolvePortfolioPage(new URL(location.href).searchParams.get('page')||undefined,nav);
  if(page===target)arrival.current?.resolve(snapshot);
  if(initialized.current&&!lane.current?.busy&&page!==shownRef.current.page)perform.current(page,undefined,snapshot);
  readyCheck.current();
 },[initial,page,router]);
 useEffect(()=>{
  if(phase!=='idle')return;
  const nav=siteNavigation(shown.initial.records,false,'pages'),index=nav.findIndex(([id])=>id===shown.page);
  for(const item of [nav[index-1],nav[index+1]])if(item)router.prefetch(pageHref(item[0]));
 },[shown.page,shown.initial.records,phase,router]);
 function navigate(event:MouseEvent<HTMLDivElement>){
  if(lane.current?.busy){event.preventDefault();event.stopPropagation();return;}
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');
  if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!=='/portofolio')return;
  const nav=siteNavigation(initial.records,false,'pages'),target=pageForHash(url.hash,nav)||resolvePortfolioPage(url.searchParams.get('page')||undefined,nav);
  if(!target||target===shownRef.current.page&&url.hash)return;
  event.preventDefault();if(target!==shownRef.current.page)perform.current(target,`${pageHref(target)}${url.hash}`);
 }
 const nav=siteNavigation(shown.initial.records,false,'pages'),index=nav.findIndex(([id])=>id===shown.page);
 return <div ref={host} className="portfolio-mode-experience" style={motionStyle} data-chapter={shown.page} data-pm-phase={phase} aria-busy={phase!=='idle'} onClickCapture={navigate}>
  <div className="pm-atmosphere" aria-hidden="true"><div className="pm-parallax"><i className="pm-orbit pm-orbit-primary"/><i className="pm-orbit pm-orbit-secondary"/><span className="pm-lines"/></div></div>
  <div className="pm-grain" aria-hidden="true"/>
  <div className="pm-continuity" aria-hidden="true"><i style={{transform:`scaleX(${(index+1)/Math.max(1,nav.length)})`}}/></div>
  <div ref={scene} className="pm-scene" inert={phase!=='idle'}><Portfolio initial={shown.initial} page={shown.page} transitionManaged/></div>
  <div className="pm-transition-veil" aria-hidden="true"><i className="pm-transition-light"/></div>
  <div className="pm-curtain" aria-hidden="true"><i/><i/><i/></div>
  {status&&<p className="pm-status" role="status">{status}</p>}
 </div>;
}
