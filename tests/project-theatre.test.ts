import test from 'node:test';
import assert from 'node:assert/strict';
import {projectStageItems,fitProjectCover,projectCameraDistance,projectScreenPose} from '../src/lib/project-theatre';
import * as THREE from 'three';
test('project theatre uses published CMS facts, prefers featured work and retains archive IDs',()=>{
 const item=(id:string,published:boolean,position:number,featured=false)=>({id,kind:'project',title:id,published,position,data:{featured,context:'Brief '+id,result:'Result '+id,bullets:['Contribution '+id],media:['cover.png']}});
 const rows=projectStageItems([item('draft',false,0),item('plain',true,1),item('featured',true,5,true),{...item('skill',true,0),kind:'skill'}]);assert.deepEqual(rows.map(row=>row.id),['featured','plain']);assert.equal(rows[0].result,'Result featured');assert.deepEqual(rows[0].contributions,['Contribution featured']);assert.equal(rows[0].href,'/projects/featured');
});
test('wide and portrait cover art fits inside the physical screen without crop or distortion',()=>{
 for(const [w,h] of [[1600,900],[600,1000],[1,1]]){const result=fitProjectCover(w,h);assert.ok(result.width<=6.08&&result.height<=3.6);assert.ok(Math.abs(result.width/result.height-w/h)<.001);}
 assert.deepEqual(fitProjectCover(0,0),{width:6.08,height:3.6});
});
test('selected screen is fully inside mobile and desktop cameras and neighbours recede',()=>{
 for(const [w,h] of [[320,350],[768,460],[1360,600]]){const camera=new THREE.PerspectiveCamera(38,w/h,.1,60);camera.position.z=projectCameraDistance(w,h);camera.updateMatrixWorld();for(const x of [-3.25,3.25])for(const y of [-2.05,2.05]){const point=new THREE.Vector3(x,y,.12).project(camera);assert.ok(Math.abs(point.x)<1&&Math.abs(point.y)<1);}}
 assert.equal(projectScreenPose(0).x,0);assert.ok(projectScreenPose(-1).x<0&&projectScreenPose(1).x>0);assert.ok(projectScreenPose(1).z<projectScreenPose(0).z);
});
