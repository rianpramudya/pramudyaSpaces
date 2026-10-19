import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sceneTheme} from '../src/lib/visual-theme';
import {sculptureModel} from '../src/lib/sculpture-model';
import {portraitModel} from '../src/lib/portrait-model';
import * as THREE from 'three';
test('CSS and 3D share black, white and exactly five neutral gray steps',()=>{assert.equal(Object.keys(sceneTheme).length,7);const css=fs.readFileSync('src/app/design-tokens.css','utf8');for(const [name,hex] of Object.entries(sceneTheme)){assert.match(hex,/^#([0-9a-f]{2})\1\1$/);assert.ok(css.includes(`--${name}:${hex};`));}});
test('sculpture and portrait surfaces have neutral materials without altering image textures',()=>{for(const group of [sculptureModel('hero'),sculptureModel('contact'),portraitModel()])group.traverse(object=>{if(object instanceof THREE.Mesh){for(const material of Array.isArray(object.material)?object.material:[object.material]){const color=(material as THREE.MeshStandardMaterial).color;if(color){assert.ok(Math.abs(color.r-color.g)<1e-7);assert.ok(Math.abs(color.g-color.b)<1e-7);}}}});});
