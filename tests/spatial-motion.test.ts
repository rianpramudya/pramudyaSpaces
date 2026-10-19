import test from 'node:test';
import assert from 'node:assert/strict';
import {pointerTilt,shouldAnimateSpatial} from '../src/lib/spatial-motion';
test('pointer tilt is bounded and safe for zero-size or out-of-bounds scenes',()=>{
 assert.deepEqual(pointerTilt(50,50,100,100),{x:0,y:0});
 assert.deepEqual(pointerTilt(200,-100,100,100),{x:8,y:10});
 assert.deepEqual(pointerTilt(10,10,0,0),{x:0,y:0});
});
test('spatial motion stops for reduced motion, user pause, invisible scenes and hidden documents',()=>{
 assert.equal(shouldAnimateSpatial(false,true,true,true),true);
 for(const args of [[true,true,true,true],[false,false,true,true],[false,true,false,true],[false,true,true,false]] as const)assert.equal(shouldAnimateSpatial(args[0],args[1],args[2],args[3]),false);
});
