import test from 'node:test';
import assert from 'node:assert/strict';
import {createStudioEntrance} from '../src/lib/studio-entrance';
import {scrollRevealFrames} from '../src/lib/scroll-reveal';
import {MOTION} from '../src/lib/motion-tokens';

function harness(group=false){
 const saved=new Map<string,PropertyDescriptor|undefined>(),events=new Map<string,EventListener>(),observed=new Set<unknown>();
 const set=(key:string,value:unknown)=>{saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,writable:true,configurable:true});};
 const calls:{frames:Keyframe[];options:KeyframeAnimationOptions;cancelled:boolean}[]=[];
 let intersect!:IntersectionObserverCallback,mutate!:MutationCallback,disconnected=0;
 class FakeElement{
  dataset:Record<string,string>={};hidden=false;children:FakeElement[]=[];
  matches(){return false;}
  contains(node:unknown){return node===this||this.children.includes(node as FakeElement);}
  querySelectorAll(){return this.children;}
  animate(frames:Keyframe[],options:KeyframeAnimationOptions){const call={frames,options,cancelled:false};calls.push(call);return {finished:new Promise(()=>{}),cancel(){call.cancelled=true;}};}
 }
 const node=new FakeElement();if(group)node.children=Array.from({length:8},()=>new FakeElement());
 const root={dataset:{motion:'on',ready:'true',scrollReveal:''},inert:true,querySelector:()=>null,
  querySelectorAll:(selector:string)=>selector==='[data-reveal]'||group&&selector==='.studio-stats-panel'?[node]:[],
  addEventListener:(name:string,handler:EventListener)=>events.set('root:'+name,handler),removeEventListener:(name:string)=>events.delete('root:'+name)};
 const media={matches:false,addEventListener:(name:string,handler:EventListener)=>events.set('media:'+name,handler),removeEventListener:(name:string)=>events.delete('media:'+name)};
 set('matchMedia',()=>media);set('Element',FakeElement);
 set('window',{addEventListener:(name:string,handler:EventListener)=>events.set('window:'+name,handler),removeEventListener:(name:string)=>events.delete('window:'+name)});
 set('IntersectionObserver',class{constructor(callback:IntersectionObserverCallback){intersect=callback;}observe(target:unknown){observed.add(target);}unobserve(target:unknown){observed.delete(target);}disconnect(){disconnected++;observed.clear();}});
 set('MutationObserver',class{constructor(callback:MutationCallback){mutate=callback;}observe(){}disconnect(){disconnected++;}});
 const cleanup=createStudioEntrance(root as unknown as HTMLElement);
 return {node,root,media,events,calls,observed,cleanup,get disconnected(){return disconnected;},ready(){root.inert=false;mutate([],{} as MutationObserver);},enter(visible=true){intersect([{isIntersecting:visible,target:node}] as unknown as IntersectionObserverEntry[],{} as IntersectionObserver);},restore(){cleanup();for(const [key,descriptor]of saved){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else Reflect.deleteProperty(globalThis,key);}}};
}
test('scroll entrances wait for loader release and viewport, reveal once and release resources',()=>{
 const h=harness();
 try{
  assert.equal(h.observed.size,0);h.ready();assert.equal(h.observed.size,1);
  h.enter(false);assert.equal(h.calls.length,0);
  h.enter();h.enter();assert.equal(h.calls.length,1);
  assert.equal(h.observed.size,0);assert.equal(h.node.dataset.scrollReveal,'done');
  h.cleanup();assert.equal(h.disconnected,2);assert.equal(h.events.size,0);assert.ok(h.calls.every(call=>call.cancelled));
 }finally{h.restore();}
});
test('viewport groups stagger at most six children and restore keyboard visibility immediately',()=>{
 const h=harness(true);
 try{
  h.ready();h.enter();assert.equal(h.calls.length,6);
  assert.deepEqual(h.calls.map(call=>call.options.delay),[0,1,2,3,4,5].map(i=>i*MOTION.stagger));
  h.events.get('root:focusin')?.({target:h.node.children[0]} as unknown as Event);
  assert.ok(h.calls.every(call=>call.cancelled));assert.equal(h.node.dataset.scrollReveal,'done');
 }finally{h.restore();}
});
test('switching reduced motion on cancels running effects and reveals pending content without replay',()=>{
 const h=harness();
 try{
  h.ready();h.enter();h.media.matches=true;
  h.events.get('media:change')?.({} as Event);
  assert.ok(h.calls.every(call=>call.cancelled));assert.equal(h.node.dataset.scrollReveal,'done');
  h.media.matches=false;h.events.get('media:change')?.({} as Event);h.enter();assert.equal(h.calls.length,1);
 }finally{h.restore();}
});
test('fade, slide and scale effects use compositor properties and reduce mobile travel',()=>{
 const effects=['fade','slide-up','scale-up'] as const;
 assert.equal(new Set(effects.map(effect=>JSON.stringify(scrollRevealFrames(effect,false)[0]))).size,3);
 assert.deepEqual(Object.keys(scrollRevealFrames('fade',false)[0]),['opacity']);
 assert.ok(String(scrollRevealFrames('slide-up',true)[0].transform).includes(`${MOTION.distance*MOTION.intensity*.65}px`));
 for(const effect of effects)for(const frame of scrollRevealFrames(effect,false))assert.ok(Object.keys(frame).every(key=>['transform','opacity'].includes(key)));
});
