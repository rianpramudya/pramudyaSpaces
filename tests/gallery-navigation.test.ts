import test from 'node:test';import assert from 'node:assert/strict';
import {swipeDirection,clampGalleryIndex} from '../src/lib/gallery-navigation';
test('horizontal swipes advance only when deliberate, vertical scrolling does not switch a project',()=>{
 assert.equal(swipeDirection({x:200,y:100},{x:100,y:105}),1);assert.equal(swipeDirection({x:100,y:100},{x:200,y:105}),-1);
 assert.equal(swipeDirection({x:200,y:100},{x:180,y:105}),0);assert.equal(swipeDirection({x:200,y:100},{x:120,y:300}),0);
});
test('gallery indexes stay valid at ends and when publication removes slides',()=>{
 assert.equal(clampGalleryIndex(-1,5),0);assert.equal(clampGalleryIndex(8,5),4);assert.equal(clampGalleryIndex(4,2),1);assert.equal(clampGalleryIndex(1,0),0);
});
