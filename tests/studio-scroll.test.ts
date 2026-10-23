import test from 'node:test';
import assert from 'node:assert/strict';
import {chapterTravel,dampScroll} from '../src/lib/studio-scroll';
test('chapter motion is bounded across long sections, anchor jumps and overscroll',()=>{
 for(const height of [0,400,2000])for(const top of [-10000,-400,0,500,10000]){
  const state=chapterTravel(top,height,800);assert.ok(state.shift>=-32&&state.shift<=32);assert.ok(state.hero>=0&&state.hero<=1);
 }
 assert.equal(chapterTravel(0,800,800).hero,0);
 assert.equal(chapterTravel(-800,800,800).hero,1);
 assert.equal(chapterTravel(800,800,800).shift,-32);
});
test('scroll damping approaches targets without overshoot and is independent of frame rate',()=>{
 for(const target of [-32,0,32])for(const dt of [-10,0,8,16,10000]){
  const value=dampScroll(10,target,dt);assert.ok(value>=Math.min(10,target)&&value<=Math.max(10,target));
 }
 let fine=0,normal=0;for(let i=0;i<120;i++)fine=dampScroll(fine,32,8);for(let i=0;i<60;i++)normal=dampScroll(normal,32,16);
 assert.ok(Math.abs(fine-normal)<.00001);assert.ok(Math.abs(normal-32)<.01);assert.equal(dampScroll(2,30,0),2);
});
