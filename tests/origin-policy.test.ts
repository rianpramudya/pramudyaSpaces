import test from 'node:test';
import assert from 'node:assert/strict';
import { allowedOrigin } from '../src/lib/origin-policy';
test('local setup accepts same-origin requests on the active local port',()=>{
 assert.equal(allowedOrigin('http://127.0.0.1:3000','http://localhost:3000/api/auth','http://127.0.0.1:3100'),true);
 assert.equal(allowedOrigin('http://localhost:3101','http://localhost:3101/api/auth','http://127.0.0.1:3100'),true);
});
test('local setup rejects external sites and other unconfigured ports',()=>{
 assert.equal(allowedOrigin('https://evil.test','http://localhost:3000/api/auth','http://127.0.0.1:3100'),false);
 assert.equal(allowedOrigin('http://localhost:3001','http://localhost:3000/api/auth','http://127.0.0.1:3100'),false);
});
test('deployed sites only accept configured origin',()=>{
 assert.equal(allowedOrigin('https://spaces.test','http://localhost:3000/api/auth','https://spaces.test'),true);
 assert.equal(allowedOrigin('http://localhost:3000','http://localhost:3000/api/auth','https://spaces.test'),false);
});
