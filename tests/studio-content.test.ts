import test from 'node:test';import assert from 'node:assert/strict';import {studioContent} from '../src/lib/studio-content';import {emptyProfile,type Entry} from '../src/lib/model';import {coverRect,brushPoints} from '../src/lib/liquid-reveal';import {projectPublicContent,publicMediaPaths} from '../src/lib/content';import {profileSchema} from '../src/lib/validation';
test('studio derives selected work, technologies and truthful counts from published CMS data',()=>{
 const record=(id:string,kind:string,published=true,data:Record<string,unknown>={}):Entry=>({id,kind,published,data,title:id,position:0});const records=[record('old','project'),record('featured','project',true,{featured:true,technologies:['Python','TypeScript']}),record('draft','project',false,{technologies:['Private']}),record('Python','skill'),record('certificate','certificate'),record('job','experience',true,{organization:'Real organization'})];
 const d=studioContent(emptyProfile,records,true);assert.deepEqual(d.projects.map(p=>p.id),['featured','old']);assert.deepEqual(d.technologies,['Python','TypeScript']);assert.deepEqual(d.stats.map(s=>s.value),[2,1,1,1]);assert.deepEqual(d.organizations,['Real organization']);assert.ok(!JSON.stringify(d).includes('Private'));assert.deepEqual(studioContent(emptyProfile,[],false).stats.map(s=>s.value),[0,0,0,0]);
});
test('hero photos are managed by the profile, published together and protected when unpublished',()=>{
 const profile={...emptyProfile,published:true,hero_photo:'uploads/base.webp',hero_reveal_photo:'uploads/warm.webp',hero_photo_alt:'Actual portrait'};assert.equal(profileSchema.parse(profile).hero_reveal_photo,'uploads/warm.webp');
 const content=projectPublicContent(profile,[]);assert.equal(content.profile.hero_photo,'uploads/base.webp');assert.ok(publicMediaPaths(content).has('uploads/warm.webp'));
 const draft=projectPublicContent({...profile,published:false},[]);assert.ok(!publicMediaPaths(draft).has('uploads/base.webp'));assert.ok(!draft.profile.hero_photo_alt);
 assert.equal(profileSchema.safeParse({...profile,hero_photo:'../private.webp'}).success,false);
 assert.equal(studioContent({...emptyProfile,photo:'uploads/fallback.webp'},[],true).photo,'uploads/fallback.webp');
});
test('cover math keeps both photo layers aligned without distorting aspect ratio',()=>{
 const landscape=coverRect(1600,900,1440,900);assert.equal(landscape.height,900);assert.equal(landscape.width,1600);assert.equal(landscape.x,-80);
 const mobile=coverRect(1600,900,375,900);assert.equal(mobile.width,1600);assert.equal(mobile.x,-612.5);assert.ok(Object.values(coverRect(0,0,1,1)).every(Number.isFinite));
});
test('brush interpolation covers gaps, keeps the endpoint and bounds queued work',()=>{
 assert.deepEqual(brushPoints(null,{x:20,y:30},143),[{x:20,y:30}]);const points=brushPoints({x:0,y:0},{x:100000,y:100000},143);assert.equal(points.length,60);assert.deepEqual(points.at(-1),{x:100000,y:100000});assert.ok(points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
});
