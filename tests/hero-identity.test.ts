import test from 'node:test';
import assert from 'node:assert/strict';
import {heroIdentity} from '../src/lib/hero-identity';
test('hero identity derives its name and mark from CMS instead of a fixed designer alias',()=>{
 assert.deepEqual(heroIdentity('Rian Pramudya Amanda'),{givenName:'Rian',familyName:'Pramudya Amanda',initials:'RP'});
 assert.deepEqual(heroIdentity('  Dewi   Putri '),{givenName:'Dewi',familyName:'Putri',initials:'DP'});
 assert.deepEqual(heroIdentity('Rian'),{givenName:'Rian',familyName:'',initials:'R'});
 assert.deepEqual(heroIdentity(''),{givenName:'',familyName:'',initials:'/'});
});
