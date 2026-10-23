import test from 'node:test';
import assert from 'node:assert/strict';
import {transitionTheme} from '../src/lib/theme-transition';

test('theme reveal preserves updates through reduced motion, fallback, failures and repeated clicks',async t=>{
 function stub(key:string,value:unknown){const descriptor=Object.getOwnPropertyDescriptor(globalThis,key);Object.defineProperty(globalThis,key,{value,writable:true,configurable:true});t.after(()=>{if(descriptor)Object.defineProperty(globalThis,key,descriptor);else Reflect.deleteProperty(globalThis,key);});}
 const dataset:Record<string,string>={},animations:{frames:Keyframe[]|PropertyIndexedKeyframes;options?:number|KeyframeAnimationOptions}[]=[];
 const root={dataset,animate:(frames:Keyframe[]|PropertyIndexedKeyframes,options?:number|KeyframeAnimationOptions)=>{animations.push({frames,options});}};
 let reduced=false,paused=false,updates=0;
 stub('document',{documentElement:root,startViewTransition:undefined});
 stub('matchMedia',()=>({matches:reduced}));
 stub('localStorage',{getItem:()=>paused?'off':null});
 stub('innerWidth',1200);stub('innerHeight',800);
 const update=()=>{updates++;};
 reduced=true;await transitionTheme(update);assert.equal(updates,1);assert.equal(dataset.themeTransition,undefined);
 reduced=false;paused=true;await transitionTheme(update);assert.equal(updates,2);paused=false;
 const fade=transitionTheme(update);assert.equal(dataset.themeTransition,'fade');await transitionTheme(update);assert.equal(updates,3);await fade;assert.equal(dataset.themeTransition,undefined);
 const doc=document as unknown as {startViewTransition?:unknown};
 doc.startViewTransition=(callback:()=>void)=>{callback();return {ready:Promise.resolve(),finished:Promise.resolve(),skipTransition:()=>{}};};
 await transitionTheme(update,{getBoundingClientRect:()=>({left:100,top:50,width:40,height:40})} as HTMLElement);
 assert.equal(updates,4);assert.equal(animations.length,1);assert.equal((animations[0].options as KeyframeAnimationOptions).pseudoElement,'::view-transition-new(root)');
 assert.equal(((animations[0].frames as PropertyIndexedKeyframes).clipPath as string[])[0],'circle(0px at 120px 70px)');assert.equal(dataset.themeTransition,undefined);
 let skipped=false;doc.startViewTransition=(callback:()=>void)=>{callback();return {ready:Promise.reject(new Error('snapshot unavailable')),finished:Promise.resolve(),skipTransition:()=>{skipped=true;}};};
 await transitionTheme(update);assert.equal(updates,5);assert.equal(skipped,true);assert.equal(dataset.themeTransition,undefined);
 doc.startViewTransition=()=>{throw new Error('API failed');};await transitionTheme(update);assert.equal(updates,6);assert.equal(dataset.themeTransition,undefined);
});
