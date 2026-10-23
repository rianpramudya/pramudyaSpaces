import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sceneTheme} from '../src/lib/visual-theme';
test('shared admin, PDF and chibi neutrals retain their original palette',()=>{assert.equal(Object.keys(sceneTheme).length,7);const css=fs.readFileSync('src/app/design-tokens.css','utf8');for(const [name,hex] of Object.entries(sceneTheme)){assert.match(hex,/^#([0-9a-f]{2})\1\1$/);assert.ok(css.includes(`--${name}:${hex};`));}});
