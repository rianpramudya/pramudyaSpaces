import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {sculptureCameraDistance} from '../src/lib/sculpture-motion';
import {sculptureModel} from '../src/lib/sculpture-model';
for(const variant of ['hero','contact'] as const)test(`${variant} 3D asset has finite geometry, visible volume and fits the camera stage`,()=>{
 const model=sculptureModel(variant,96);model.updateMatrixWorld(true);const size=new THREE.Box3().setFromObject(model,true).getSize(new THREE.Vector3());
 assert.ok(size.x>2&&size.x<5);assert.ok(size.y>1.5&&size.y<5);assert.ok(size.z>.1&&size.z<5);
 const camera=new THREE.PerspectiveCamera(38,variant==='hero'?1.05:1.2,.1,60);camera.position.z=sculptureCameraDistance(variant,1);camera.updateMatrixWorld();
 for(const pitch of (variant==='hero'?[-.1,.56]:[-.3,.36]))for(const turn of [0,Math.PI/2,Math.PI,Math.PI*1.5]){model.rotation.x=pitch;model.rotation.y=turn;model.updateMatrixWorld(true);model.traverse(object=>{if(object instanceof THREE.Mesh){const position=object.geometry.getAttribute('position');for(let i=0;i<position.count;i++){const point=new THREE.Vector3().fromBufferAttribute(position,i).applyMatrix4(object.matrixWorld).project(camera);assert.ok(Math.abs(point.x)<1.05&&Math.abs(point.y)<1.05,'mesh remains inside mobile camera frame');}}});}
 let meshes=0;model.traverse(object=>{if(object instanceof THREE.Mesh){meshes++;const positions=object.geometry.getAttribute('position');assert.ok(positions.count>0);for(const number of positions.array)assert.ok(Number.isFinite(number));object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});assert.ok(meshes>=3);
});

test('opening uses the custom three-route RPA symbol, with owner metadata and no text geometry',()=>{
 const model=sculptureModel('hero',96,'DP');const mark=model.getObjectByName('rpa-linear-symbol');assert.ok(mark instanceof THREE.Group);assert.equal(mark.userData.ownerInitials,'DP');assert.equal(mark.children.filter(child=>child instanceof THREE.Mesh&&child.geometry.type==='TubeGeometry').length,3);model.traverse(child=>{if(child instanceof THREE.Mesh)assert.notEqual(child.geometry.type,'TextGeometry');});
 model.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});
});


test('personal monogram stays inside the narrow tablet stage throughout pointer, scroll and manual turns',()=>{
 const model=sculptureModel('hero',96,'RP');
 const aspect=339/456;
 const camera=new THREE.PerspectiveCamera(38,aspect,.1,60);
 camera.position.z=sculptureCameraDistance('hero',1,aspect);camera.updateMatrixWorld();
 for(const pitch of [-.26,.4])for(const yaw of [-.62,.22])for(const turn of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
  model.rotation.set(pitch,yaw+turn,-.055);model.position.y=.07;model.updateMatrixWorld(true);
  model.traverse(object=>{if(object instanceof THREE.Mesh){const positions=object.geometry.getAttribute('position');for(let i=0;i<positions.count;i++){
   const point=new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(object.matrixWorld).project(camera);
   assert.ok(Math.abs(point.x)<1&&Math.abs(point.y)<1,'tablet monogram fits without clipping');
  }}});
 }
 model.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>material.dispose());}});
});
