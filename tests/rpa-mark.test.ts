import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rpaMarkPaths,rpaMarkPathData,rpaOrbit} from '../src/lib/rpa-mark';
test('downloadable logo and static hero use the same three routes as the 3D geometry',()=>{
 const svg=readFileSync(new URL('../public/brand/rpa-symbol.svg',import.meta.url),'utf8');
 const visiblePaths=[...svg.matchAll(/<path d="([^"]+)" mask=/g)].map(match=>match[1]);
 assert.deepEqual(visiblePaths,rpaMarkPathData);
 assert.equal(rpaMarkPaths.length,3);
 for(const points of rpaMarkPaths)for(const [x,y] of points){assert.ok(x>10&&x<246);assert.ok(y>10&&y<246);}
 assert.ok(!svg.includes('<text'));assert.ok(!svg.includes('<image'));
 assert.ok(svg.includes(`r="${rpaOrbit.planetRadius}"`));
 assert.ok(svg.includes(`rx="${rpaOrbit.radius}" ry="${rpaOrbit.minorRadius}"`));
 assert.ok(svg.includes(`rotate(-${rpaOrbit.tiltDegrees} 128 128)`));
});
