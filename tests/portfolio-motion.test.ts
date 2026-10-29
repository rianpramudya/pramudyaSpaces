import test from 'node:test';
import assert from 'node:assert/strict';
import {PRESENTATION_MOTION,chapterEntrance,chapterCamera,chapterTransition,transitionCover,transitionLight} from '../src/lib/portfolio-motion-presets';
import {createPortfolioMotion} from '../src/lib/portfolio-motion';
function harness(reduced:boolean){
 const saved=new Map<string,PropertyDescriptor|undefined>(),listeners=new Set<string>();let disconnected=0;
 function global(name:string,value:unknown){saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{configurable:true,writable:true,value});}
 const events=(key:string)=>({addEventListener:(name:string)=>listeners.add(key+name),removeEventListener:(name:string)=>listeners.delete(key+name)});
 const calls:{name:string;frames:Keyframe[];options:KeyframeAnimationOptions;cancelled:boolean}[]=[];
 const element=(name:string,children:unknown[]=[])=>({hidden:false,children,matches:(selector:string)=>selector.split(',').includes(name),animate:(frames:Keyframe[],options:KeyframeAnimationOptions)=>{const call={name,frames,options,cancelled:false};calls.push(call);return {finished:Promise.resolve(),cancel:()=>{call.cancelled=true;},pause:()=>{},play:()=>{}};}});
 const heading=element('h2'),paragraph=element('p'),header=element('header',[paragraph,heading]);
 const main={...element('main'),querySelectorAll:()=>[{children:[header]}]};
 const background=element('background'),orb=element('orb'),wipe=element('veil'),label=element('light');
 const site={dataset:{ready:'true',motion:'on'},inert:false};
 const root={dataset:{pmPhase:'idle',chapter:'journey'},querySelector:(selector:string)=>selector==='.portfolio'?site:selector==='#main'?main:selector==='.pm-atmosphere'?background:selector==='.pm-transition-veil'?wipe:selector==='.pm-transition-light'?label:null,querySelectorAll:()=>[orb]} as unknown as HTMLElement;
 global('matchMedia',(query:string)=>({matches:query.includes('reduced')?reduced:true,...events(query)}));
 global('MutationObserver',class{observe(){}disconnect(){disconnected++;}});
 global('window',events('window'));
 global('document',{body:{},visibilityState:'visible',querySelector:()=>null,...events('document')});
 global('cancelAnimationFrame',()=>{});
 const motion=createPortfolioMotion(root);
 return {motion,calls,listeners,get disconnected(){return disconnected;},restore(){for(const [name,descriptor]of saved){if(descriptor)Object.defineProperty(globalThis,name,descriptor);else Reflect.deleteProperty(globalThis,name);}}};
}
test('reduced motion uses opacity-only crossfades and removes animation/listener resources',async()=>{
 const h=harness(true);
 try{
  await h.motion.exit(1);await h.motion.enter(-1);h.motion.idle();
  assert.ok(h.calls.length>0);
  for(const call of h.calls)for(const frame of call.frames)assert.deepEqual(Object.keys(frame),['opacity']);
  h.motion.dispose();assert.equal(h.listeners.size,0);assert.equal(h.disconnected,2);
  assert.ok(h.calls.every(call=>call.cancelled));
 }finally{h.restore();}
});
test('full motion follows direction, reveals title before body, and fits the transition duration budget',async()=>{
 const h=harness(false);
 try{
  await h.motion.exit(1);await h.motion.enter(-1);
  const main=h.calls.filter(call=>call.name==='main');
  assert.ok(String(main[0].frames[1].transform).includes('-100px'));
  assert.ok(String(main[1].frames[0].transform).includes('-100px'));
  const wipe=h.calls.filter(call=>call.name==='veil');
  assert.equal(wipe.length,2);
  assert.equal(wipe[0].frames[0].opacity,0);
  assert.equal(wipe[1].frames.at(-1)?.opacity,0,'the themed veil clears after entering');
  const entering=h.calls.filter(call=>!call.cancelled),heading=entering.find(call=>call.name==='h2'),paragraph=entering.find(call=>call.name==='p');
  assert.ok(Number(heading?.options.delay)<Number(paragraph?.options.delay));
  const total=PRESENTATION_MOTION.exit+Math.max(...entering.map(call=>Number(call.options.duration)+Number(call.options.delay||0)));
  assert.ok(total>=700&&total<=1100);
  for(const call of h.calls)for(const frame of call.frames)assert.ok(Object.keys(frame).every(key=>['transform','opacity','filter','offset'].includes(key)));
  h.motion.dispose();assert.equal(h.listeners.size,0);assert.ok(h.calls.every(call=>call.cancelled));
 }finally{h.restore();}
});


test('presentation gives portraits and project previews different choreography, with gentler mobile travel',()=>{
 const portrait=chapterEntrance('about','visual',1,false),project=chapterEntrance('projects','visual',1,false);
 assert.notEqual(portrait[0].transform,project[0].transform);
 assert.ok(String(project[0].transform).includes('scale(1.08)'));
 assert.ok(String(chapterEntrance('about','visual',-1,false)[0].transform).includes('96px'));
 assert.ok(String(chapterEntrance('about','visual',1,true)[0].transform).includes(`${-96*.6}px`));
 assert.equal(chapterCamera('focus',1,true,true)[0].filter,'blur(0px)');
 assert.equal(portrait.at(-1)?.opacity,1);
 const longest=PRESENTATION_MOTION.exit+Math.max(PRESENTATION_MOTION.background,PRESENTATION_MOTION.delay+7*PRESENTATION_MOTION.stagger+PRESENTATION_MOTION.reveal);
 assert.ok(longest<=1100,'eight staggered targets must still fit the full journey budget');
});


test('chapters share five modern photographic families and the light sweep follows navigation',()=>{
 const chapters=['home','about','background','journey','projects','skills','certificates','services','playground','contact'];
 assert.equal(new Set(chapters.map(chapterTransition)).size,5);
 for(const style of ['depth','lateral','focus','cascade','folio'] as const){
  assert.ok(Number(transitionCover(style,1,false).at(-1)?.opacity)<=.2,'incoming motion stays visible');
  assert.equal(transitionCover(style,1,true).at(-1)?.opacity,0);
  assert.notEqual(transitionLight(style,1,true).at(-1)?.transform,transitionLight(style,-1,true).at(-1)?.transform);
 }
 assert.equal(chapterTransition('unknown'),'lateral');
 for(const chapter of chapters)for(const kind of ['title','visual','body'] as const){
  const frames=chapterEntrance(chapter,kind,1,false);
  assert.ok(!String(frames[0].transform).includes('rotate'),'photographic content should remain level');
  assert.equal(frames.at(-1)?.opacity,1);
 }
});

test('chapters vary the full camera composition as well as their headings',()=>{
 const styles=['depth','lateral','focus','cascade','folio'] as const;
 const transformations=styles.map(style=>chapterCamera(style,1,true,false)[0].transform);
 assert.equal(new Set(transformations).size,5);
 for(const style of styles)assert.equal(chapterCamera(style,1,true,false).at(-1)?.opacity,1);
});
