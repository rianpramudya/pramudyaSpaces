import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {displayFrame,displayFrameMaterials,disposeFrameGeometry} from '../src/lib/display-frame';
import {fitProjectCover,projectCameraDistance} from '../src/lib/project-theatre';
import {disposeSceneResources} from '../src/lib/dispose-scene';
test('landscape project laminate preserves readable imagery and stays inside phone, tablet and desktop cameras',()=>{
 for(const [imageWidth,imageHeight] of [[1600,900],[600,1000],[1000,1000]]){
  const fit=fitProjectCover(imageWidth,imageHeight),frame=displayFrame(fit.width,fit.height,undefined,'project');
  const laminate=frame.getObjectByName('project-laminate') as THREE.Mesh,back=frame.getObjectByName('project-rear-sheet') as THREE.Mesh;
  assert.ok(back.position.z<laminate.position.z);const size=new THREE.Box3().setFromObject(laminate).getSize(new THREE.Vector3());assert.ok(Math.abs(size.x-fit.width-.24)<.001);assert.ok(Math.abs(size.y-fit.height-.24)<.001);
  assert.ok(Math.abs(fit.width/fit.height-imageWidth/imageHeight)<.00001);
  for(const [width,height] of [[375,330],[768,460],[1280,580]]){
   const camera=new THREE.PerspectiveCamera(38,width/height,.1,80);camera.position.z=projectCameraDistance(width,height);camera.updateMatrixWorld();
   for(const direction of [-1,1]){frame.rotation.set(direction*.055,direction*.08,0);frame.updateMatrixWorld(true);frame.traverse(object=>{if(object instanceof THREE.Mesh){const positions=object.geometry.getAttribute('position');for(let i=0;i<positions.count;i++){const p=new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(object.matrixWorld).project(camera);assert.ok(Math.abs(p.x)<1&&Math.abs(p.y)<1,'frame and corner markers fit');}}});}
  }
  disposeSceneResources(frame);
 }
});
test('resizing releases old geometry while keeping shared laminate materials usable',()=>{
 const materials=displayFrameMaterials(),frame=displayFrame(6.08,3.6,materials);let geometryDisposed=0,materialDisposed=0;
 frame.traverse(object=>{if(object instanceof THREE.Mesh)object.geometry.addEventListener('dispose',()=>geometryDisposed++);});Object.values(materials).forEach(material=>material.addEventListener('dispose',()=>materialDisposed++));
 disposeFrameGeometry(frame);assert.equal(geometryDisposed,11);assert.equal(materialDisposed,0);Object.values(materials).forEach(material=>material.dispose());assert.equal(materialDisposed,3);
});
