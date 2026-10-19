import test from 'node:test';
import assert from 'node:assert/strict';
import { adminMessageQuerySchema,messageSearchFilter } from '../src/lib/admin-message-policy';
import { applyMessageChange } from '../src/lib/message-drafts';
test('saving one reply preserves every other message and draft representation',()=>{
 const messages=[{id:'a',reply:'old'},{id:'b',reply:'Unsaved B'}];const result=applyMessageChange(messages,{id:'a',reply:' new A '});
 assert.equal(result[0].reply,'new A');assert.equal(result[1],messages[1]);assert.equal(messages[0].reply,'old');
});
test('removing a message only removes its ID',()=>{assert.deepEqual(applyMessageChange([{id:'a'},{id:'b'}],{id:'a',remove:true}),[{id:'b'}]);});
test('message pagination and status inputs are bounded',()=>{
 assert.deepEqual(adminMessageQuerySchema.parse({page:'2',search:' keyword ',status:'read'}),{page:2,search:'keyword',status:'read'});
 assert.equal(adminMessageQuerySchema.safeParse({page:-1}).success,false);assert.equal(adminMessageQuerySchema.safeParse({status:'hidden'}).success,false);assert.equal(adminMessageQuerySchema.safeParse({search:'x'.repeat(201)}).success,false);
});
test('message search quotes punctuation rather than introducing additional filters',()=>{
 const filter=messageSearchFilter('a,b"%_',true);assert.ok(filter.startsWith('name.ilike."'));assert.ok(filter.includes('body.ilike."'));assert.ok(filter.includes('\\"'));assert.ok(!filter.includes('subject.ilike'));
 const inbox=messageSearchFilter('hello',false);assert.ok(inbox.includes('subject.ilike'));assert.ok(inbox.includes('message.ilike'));
});
