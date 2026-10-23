/** Snapshot reveal keeps text/background pairs intact while the theme changes. */
export async function transitionTheme(update:()=>void,origin?:HTMLElement){
 const root=document.documentElement;
 if(root.dataset.themeTransition)return;
 let paused=false;try{paused=localStorage.getItem('portfolio-motion')==='off';}catch{}
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||paused){update();return;}
 const box=origin?.getBoundingClientRect(),x=box?box.left+box.width/2:innerWidth/2,y=box?box.top+box.height/2:innerHeight/2;
 const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
 if(!document.startViewTransition){
  root.dataset.themeTransition='fade';
  try{update();await new Promise(resolve=>setTimeout(resolve,320));}finally{delete root.dataset.themeTransition;}
  return;
 }
 root.dataset.themeTransition='reveal';
 try{
  const transition=document.startViewTransition(update);
  try{
   await transition.ready;
   root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`]},{duration:580,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::view-transition-new(root)',fill:'both'});
  }catch{transition.skipTransition();}
  await transition.finished.catch(()=>{});
 }catch{update();}finally{delete root.dataset.themeTransition;}
}
