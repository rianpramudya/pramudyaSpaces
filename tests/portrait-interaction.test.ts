import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {portraitGesture,portraitDrag} from '../src/lib/portrait-interaction';
import {PortraitAtelier} from '../src/components/portrait-atelier';
test('touch waits for direction and leaves vertical or ambiguous gestures to page scrolling',()=>{
 assert.equal(portraitGesture(3,4),'pending');assert.equal(portraitGesture(50,5),'horizontal');assert.equal(portraitGesture(4,50),'vertical');assert.equal(portraitGesture(20,22),'vertical');
});
test('direct rotation supports full turns, preserves touch scroll axis and bounds mouse pitch',()=>{
 const touch=portraitDrag(0,0,600,400,300,450,false);assert.ok(touch.yaw>Math.PI*2);assert.equal(touch.pitch,0);
 const mouse=portraitDrag(0,0,50,1000,300,450,true);assert.equal(mouse.pitch,.28);assert.ok(mouse.yaw>0);
});
test('portrait has direct interaction and keyboard instructions without viewpoint buttons',()=>{
 const html=renderToStaticMarkup(React.createElement(PortraitAtelier,{photo:'photo.png',alt:'Owner portrait',name:'Owner',initials:'OW',en:false}));
 assert.ok(!html.includes('<button'));assert.ok(!html.includes('portrait-view-controls'));assert.ok(html.includes('tabindex="0"'));assert.ok(html.includes('geser mendatar'));assert.ok(html.includes('Escape'));assert.ok(html.includes('Owner portrait'));
});
