import test from 'node:test';
import assert from 'node:assert/strict';
import {contactFieldError} from '../src/lib/contact-feedback';
test('contact feedback explains missing, whitespace-only, invalid email and bounded content in both languages',()=>{
 assert.equal(contactFieldError('   ',{minLength:2,maxLength:100},false),'Kolom ini perlu diisi.');
 assert.equal(contactFieldError('a',{minLength:2,maxLength:100},false),'Gunakan minimal 2 karakter.');
 assert.equal(contactFieldError('bad-email',{minLength:0,maxLength:254,emailInvalid:true},true),'Enter a valid email address.');
 assert.equal(contactFieldError('a'.repeat(201),{minLength:2,maxLength:200},true),'Use no more than 200 characters.');
 assert.equal(contactFieldError('A valid message',{minLength:10,maxLength:5000},true),'');
 assert.equal(contactFieldError('  a  ',{minLength:2,maxLength:100},true),'Use at least 2 characters.');
});
