import test from 'node:test';
import assert from 'node:assert/strict';
import {heroSceneConfig,heroSceneData,heroPointer,heroQuality} from '../src/lib/hero-scene';
import {emptyProfile,type Entry} from '../src/lib/model';
test('hero annotations use only published CMS facts and do not invent a city or counts',()=>{
 const entry=(id:string,kind:string,published=true,data:Record<string,unknown>={}):Entry=>({id,kind,title:id,published,data,position:0});
 const data=heroSceneData({...emptyProfile,name:'Rian',headline:'Full Stack Developer & AI',summary:'Computer vision and machine learning',location:'Bandung'},[entry('project','project',true,{technologies:['TypeScript','Python']}),entry('TypeScript','skill'),entry('credential','certificate'),entry('secret','project',false,{technologies:['Secret tech']})],false);
 assert.deepEqual(data.technologies,['TypeScript','Python']);assert.deepEqual(data.stats.map(s=>s.value),[1,1,1]);assert.equal(data.roles.length,3);assert.ok(data.coordinates?.includes('107.6191'));assert.ok(!JSON.stringify(data).includes('Secret tech'));
 const empty=heroSceneData({...emptyProfile,location:'Another city'},[],true);assert.equal(empty.coordinates,undefined);assert.deepEqual(empty.technologies,[]);assert.deepEqual(empty.roles,[]);assert.deepEqual(empty.stats.map(s=>s.value),[0,0,0]);
});
test('hero mouse tilt is bounded to twelve degrees and quality avoids mobile, low power and reduced motion',()=>{
 assert.ok(heroSceneConfig.particleCount<=40);const point=heroPointer(10,-10);assert.ok(Math.abs(point.x)<=Math.PI/15&&Math.abs(point.y)<=Math.PI/15);
 assert.equal(heroQuality(390,8,false,8).webgl,false);assert.equal(heroQuality(1200,2,false,8).webgl,false);assert.equal(heroQuality(1200,8,true,8).animate,false);assert.equal(heroQuality(1200,8,false,2).webgl,false);assert.equal(heroQuality(1200,8,false,8).webgl,true);
});

test('ambient particles stay finite, deterministic and bounded even with excessive configuration',async()=>{
 const {heroParticles}=await import('../src/lib/hero-atmosphere');const a=heroParticles(1000),b=heroParticles(1000);assert.equal(a.getAttribute('position').count,40);assert.deepEqual(a.getAttribute('position').array,b.getAttribute('position').array);for(const value of a.getAttribute('position').array)assert.ok(Number.isFinite(value)&&Math.abs(value)<6);a.dispose();b.dispose();
});

test('scene cleanup releases particle resources and shared mesh assets exactly once',async()=>{
 const THREE=await import('three');const {disposeSceneResources}=await import('../src/lib/dispose-scene');
 const scene=new THREE.Group(),meshGeometry=new THREE.BoxGeometry(),sharedMaterial=new THREE.MeshBasicMaterial(),pointGeometry=new THREE.BufferGeometry(),pointMaterial=new THREE.PointsMaterial();
 const counts=[0,0,0,0];[meshGeometry,sharedMaterial,pointGeometry,pointMaterial].forEach((resource,index)=>resource.addEventListener('dispose',()=>counts[index]++));
 scene.add(new THREE.Mesh(meshGeometry,sharedMaterial),new THREE.Mesh(meshGeometry,sharedMaterial),new THREE.Points(pointGeometry,pointMaterial));disposeSceneResources(scene);assert.deepEqual(counts,[1,1,1,1]);
});
