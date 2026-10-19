import test from 'node:test';
import assert from 'node:assert/strict';
import { ownerResetMatches,oauthOutcome,authSite } from '../src/lib/auth-policy';
test('password recovery follows current owner email after email changes',()=>{
 assert.equal(ownerResetMatches('new@test.com','new@test.com'),true);assert.equal(ownerResetMatches('old@test.com','new@test.com'),false);assert.equal(ownerResetMatches('new@test.com',undefined),false);
});
test('OAuth failure reopens guestbook and shows retry feedback',()=>{
 assert.deepEqual(oauthOutcome('?auth_error=1'),{openGuestbook:true,authError:true});
});

test('OAuth keeps local callback on the browser host and uses canonical domain in production',()=>{
 assert.equal(authSite('http://localhost:3000/api/auth','http://127.0.0.1:3100'),'http://localhost:3000');
 assert.equal(authSite('http://127.0.0.1:3100/auth/callback','http://127.0.0.1:3000'),'http://127.0.0.1:3100');
 assert.equal(authSite('https://attacker.test/api/auth','https://portfolio.test'),'https://portfolio.test');
});

test('local auth URLs use the actual request host when Next normalizes it to localhost',()=>{
 assert.equal(authSite('http://localhost:3100/api/auth','http://127.0.0.1:3100','127.0.0.1:3100'),'http://127.0.0.1:3100');
 assert.equal(authSite('http://localhost:3100/api/auth','http://127.0.0.1:3100','evil.test:3100'),'http://localhost:3100');
 assert.equal(authSite('http://localhost:3100/api/auth','https://portfolio.test','127.0.0.1:3100'),'https://portfolio.test');
});
