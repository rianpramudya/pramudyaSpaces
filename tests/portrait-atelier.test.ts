import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {portraitModel,portraitFit,portraitCameraDistance,portraitPose} from '../src/lib/portrait-model';

test('portrait fills a 4:6 image plane without stretching the source photo',()=>{
 for(const [width,height] of [[600,800],[1600,900],[400,1800],[0,0]]){
  const fit=portraitFit(width,height);assert.equal(fit.width/fit.height,4/6);
  for(const value of [fit.repeatX,fit.repeatY])assert.ok(value>0&&value<=1);
  assert.ok(fit.offsetX>=0&&fit.offsetX+fit.repeatX<=1);assert.ok(fit.offsetY>=0&&fit.offsetY+fit.repeatY<=1);
  if(width&&height)assert.ok(Math.abs(width/height*fit.repeatX/fit.repeatY-4/6)<.00001);
 }
});
test('portrait frame is volumetric and fits mobile, tablet and desktop at every supported angle',()=>{
 const model=portraitModel();const bounds=new THREE.Box3().setFromObject(model,true).getSize(new THREE.Vector3());assert.ok(bounds.z>.2&&bounds.z<1,'portrait is a slim volumetric panel without a deep pedestal');assert.ok(model.getObjectByName('portrait-image'));
 for(const [width,height] of [[272,360],[339,500],[620,650]]){
  const camera=new THREE.PerspectiveCamera(38,width/height,.1,60);camera.position.z=portraitCameraDistance(width,height);camera.updateMatrixWorld();
  for(const turn of [0,Math.PI/4,Math.PI/2,Math.PI,Math.PI*1.5])for(const pitch of [-.28,.28])for(const pointerX of [-1,1])for(const pointerY of [-1,1]){
   const pose=portraitPose(pointerX,pointerY,turn,pitch);model.rotation.set(pose.x,pose.y,pose.z);model.updateMatrixWorld(true);
   model.traverse(object=>{if(object instanceof THREE.Mesh){const positions=object.geometry.getAttribute('position');for(let i=0;i<positions.count;i++){const point=new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(object.matrixWorld).project(camera);assert.ok(Math.abs(point.x)<1&&Math.abs(point.y)<1,'portrait stays in frame');}}});
  }
 }
 model.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>material.dispose());}});
});
