import test from 'node:test';
import assert from 'node:assert/strict';
import {PageTransitionLane,pageDirection,boundaryPage} from '../src/lib/page-transition';
const nav=[['home','Home'],['about','About'],['contact','Contact']];
test('chapter direction and boundary gestures follow the shared navigation order',()=>{
 assert.equal(pageDirection(nav,'home','contact'),1);
 assert.equal(pageDirection(nav,'contact','home'),-1);
 assert.equal(boundaryPage(nav,'about',1,false,true),'contact');
 assert.equal(boundaryPage(nav,'about',-1,true,false),'home');
 assert.equal(boundaryPage(nav,'about',1,false,false),null);
 assert.equal(boundaryPage(nav,'contact',1,false,true),null);
});
test('transitions keep exit and entry in order, rejecting repeated input until finished',async()=>{
 const steps:string[]=[];let arrival!:(value:string)=>void;
 const lane=new PageTransitionLane({phase:phase=>steps.push(phase),lock:()=>{steps.push('lock');return()=>steps.push('unlock');},exit:async()=>{steps.push('exit-animation');},enter:async()=>{steps.push('enter-animation');},cancel:()=>steps.push('cancel'),error:()=>steps.push('error')});
 const task=lane.run(()=>new Promise<string>(resolve=>{arrival=resolve;}),async value=>{steps.push(value);});
 assert.equal(lane.busy,true);
 assert.equal(await lane.run(async()=>'duplicate',async()=>{}),false);
 arrival('commit');assert.equal(await task,true);
 assert.ok(steps.indexOf('exit-animation')<steps.indexOf('commit'));
 assert.ok(steps.indexOf('commit')<steps.indexOf('enter-animation'));
 assert.equal(steps.at(-1),'idle');assert.equal(lane.busy,false);
});
test('failed navigation and disposal release input and cancel animation resources',async()=>{
 for(const dispose of [false,true]){
 let releases=0,cancelled=0,errors=0;
 const lane=new PageTransitionLane({phase:()=>{},lock:()=>()=>{releases++;},exit:async()=>{},enter:async()=>{},cancel:()=>{cancelled++;},error:()=>{errors++;}});
 const task=lane.run(()=>dispose?new Promise(()=>{}):Promise.reject(new Error('offline')),async()=>{});
 if(dispose)lane.dispose();
 assert.equal(await task,false);assert.equal(releases,1);assert.ok(cancelled>0);assert.equal(errors,dispose?0:1);
 }
});

test('a stalled route times out and cannot leave input locked',async()=>{
 let releases=0,errors=0;
 const lane=new PageTransitionLane({phase:()=>{},lock:()=>()=>{releases++;},exit:async()=>{},enter:async()=>{},cancel:()=>{},error:()=>{errors++;}},5);
 assert.equal(await lane.run(()=>new Promise(()=>{}),async()=>{}),false);
 assert.equal(lane.busy,false);assert.equal(releases,1);assert.equal(errors,1);
});

import {readFileSync} from 'node:fs';
import postcss from 'postcss';
test('portfolio presentation styles cannot apply to Desktop Mode outside the mode wrapper',()=>{
 postcss.parse(readFileSync('src/app/portfolio-mode.css','utf8')).walkRules(rule=>{
  for(const selector of rule.selectors)assert.ok(selector.trim().startsWith('.portfolio-mode-experience'),selector);
 });
});
