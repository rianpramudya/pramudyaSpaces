import test from 'node:test';
import assert from 'node:assert/strict';
import { createBodies,stepBodies,placeBody,runnerPosition } from '../src/lib/play-physics';
test('blocks have real arena movement, remain in bounds and settle without overlap',()=>{
 let bodies=createBodies(['Developer','TypeScript','UI/UX'],600,220);
 bodies=placeBody(bodies,0,350,40,600,220);
 assert.ok(bodies[0].x>300);
 for(let i=0;i<600;i++)bodies=stepBodies(bodies,600,220,1/60,null);
 for(const b of bodies){assert.ok(b.x>=0&&b.x+b.width<=600);assert.ok(b.y>=0&&b.y+b.height<=220);}
 for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){const a=bodies[i],b=bodies[j];assert.ok(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)<1||Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)<1);}
});
test('dragged block does not advance under gravity and is clamped to arena',()=>{
 let bodies=createBodies(['A'],320,180);bodies=placeBody(bodies,0,999,-90,320,180);const before={...bodies[0]};
 const result=stepBodies(bodies,320,180,1/60,0);
 assert.deepEqual(result[0],before);assert.equal(before.y,0);assert.equal(before.x,320-before.width);
});
test('running character traverses full lane and reverses at its boundaries',()=>{
 assert.equal(runnerPosition(0,500,44).x,0);assert.equal(runnerPosition(456/70,500,44).x,456);assert.equal(runnerPosition(456/70*2,500,44).x,0);
 assert.equal(runnerPosition(456/70+1,500,44).direction,-1);
});
test('six long CMS labels remain readable in a narrow mobile arena',async()=>{
 const {arenaHeight}=await import('../src/lib/play-physics');const width=284,height=arenaHeight(6,width);
 let bodies=createBodies(Array.from({length:6},(_,i)=>`Very long professional skill label ${i}`),width,height);
 for(let i=0;i<600;i++)bodies=stepBodies(bodies,width,height,1/60,null);
 for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){const a=bodies[i],b=bodies[j];assert.ok(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)<1||Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)<1);}
});
