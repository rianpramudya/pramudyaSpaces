import test from 'node:test';
import assert from 'node:assert/strict';
import {sculptureQuality,sculptureScroll} from '../src/lib/sculpture-motion';
test('sculpture camera progress remains bounded before and after the opening stage',()=>{
 assert.equal(sculptureScroll(80,800),0);assert.equal(sculptureScroll(-400,800),.5);assert.equal(sculptureScroll(-1600,800),1);assert.equal(sculptureScroll(10,0),0);
});
test('sculpture rendering caps mobile resolution and offers a low-memory fallback',()=>{
 assert.deepEqual(sculptureQuality(390,3,8),{pixelRatio:1.25,segments:96,webgl:true});
 assert.deepEqual(sculptureQuality(1440,3,8),{pixelRatio:1.75,segments:160,webgl:true});
 assert.equal(sculptureQuality(1440,2,2).webgl,false);
});
