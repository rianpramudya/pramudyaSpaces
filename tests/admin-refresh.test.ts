import test from 'node:test';
import assert from 'node:assert/strict';
import {refreshWorkspace} from '../src/lib/admin-refresh';
test('failed refresh locks stale content and never replaces the existing snapshot',async()=>{
 let snapshot='old';let stale=false;const failure=new Error('network');
 await assert.rejects(()=>refreshWorkspace(async()=>{throw failure;},value=>{snapshot=value;},value=>{stale=value;}),failure);
 assert.equal(snapshot,'old');assert.equal(stale,true);
});
test('successful retry replaces content and unlocks the workspace',async()=>{
 let snapshot='old';let stale=true;
 await refreshWorkspace(async()=>'new',value=>{snapshot=value;},value=>{stale=value;});
 assert.equal(snapshot,'new');assert.equal(stale,false);
});
