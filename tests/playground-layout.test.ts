import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import postcss from 'postcss';

test('playground introduction flex styles cannot select the game and leaderboard container',()=>{
 for(const file of ['src/app/studio.css','src/app/cinematic.css']){
  const css=postcss.parse(readFileSync(file,'utf8'));
  css.walkRules(rule=>{
   const selector=rule.selector.replace(/\s+/g,'');
   if(!selector.includes('.studio-play-panel>div'))return;
   rule.walkDecls('display',decl=>assert.notEqual(decl.value,'flex',`${file}: a positional panel selector collapses the game and leaderboard into a row`));
  });
 }
});
