import test from 'node:test';
import assert from 'node:assert/strict';
import {MOTION,motionStyle,revealLineDelays} from '../src/lib/motion-tokens';
test('hero words on the same visual line reveal together, including subpixel layout differences',()=>{
 assert.deepEqual(revealLineDelays([0,.5,1,82,82.4,164]),[0,0,0,75,75,150]);
 assert.deepEqual(revealLineDelays([0,64,128],50),[0,50,100]);
 assert.deepEqual(revealLineDelays([]),[]);
});
test('shared motion configuration keeps the page journey within budget and CSS aligned',()=>{
 const total=MOTION.exit+Math.max(MOTION.background,MOTION.exit+7*MOTION.pageStagger+MOTION.pageReveal);
 assert.ok(total>=700&&total<=1100);
 assert.equal(motionStyle['--ux-ease' as keyof typeof motionStyle],MOTION.ease);
 assert.ok(MOTION.count>=900&&MOTION.count<=1200);
});
