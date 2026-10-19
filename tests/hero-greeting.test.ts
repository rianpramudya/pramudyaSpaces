import test from 'node:test';
import assert from 'node:assert/strict';
import {heroGreeting} from '../src/lib/hero-greeting';
test('greetings begin at 10 seconds, last 3.5 seconds and alternate characters',()=>{
 assert.equal(heroGreeting(9.99).visible,false);assert.deepEqual(heroGreeting(10),{visible:true,speaker:0});assert.equal(heroGreeting(13.5).visible,false);assert.deepEqual(heroGreeting(20),{visible:true,speaker:1});assert.deepEqual(heroGreeting(30),{visible:true,speaker:0});
});
