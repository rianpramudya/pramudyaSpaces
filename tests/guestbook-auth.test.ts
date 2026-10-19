import test from 'node:test';
import assert from 'node:assert/strict';
import { canWriteGuestbook,guestbookName } from '../src/lib/guestbook-auth';
test('owner email account can write without a social provider',()=>{
 assert.equal(canWriteGuestbook({app_metadata:{providers:['email']}},true),true);
 assert.equal(guestbookName({user_metadata:{}},true,'Rian Pramudya Amanda'),'Rian Pramudya Amanda');
});
test('only authenticated social visitors or the verified owner can write',()=>{
 assert.equal(canWriteGuestbook(null,true),false);
 assert.equal(canWriteGuestbook({app_metadata:{providers:['email']}},false),false);
 assert.equal(canWriteGuestbook({app_metadata:{providers:['github']}},false),true);
 assert.equal(canWriteGuestbook({app_metadata:{provider:'google'}},false),true);
 assert.equal(canWriteGuestbook({app_metadata:{},user_metadata:{providers:['github'],is_owner:true}},false),false);
});
test('visitor identity comes from their profile and owner identity from CMS',()=>{
 assert.equal(guestbookName({user_metadata:{full_name:'Guest'}},false,'Owner'),'Guest');
 assert.equal(guestbookName({user_metadata:{full_name:'Guest'}},true,'Owner'),'Owner');
});
