import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
/** Geometry is separate from the GPU renderer so framing can be verified on the CPU. */
export function portraitFit(width:number,height:number){
 const aspect=width>0&&height>0?width/height:2/3,target=2/3;
 const repeatX=aspect>target?target/aspect:1,repeatY=aspect<target?aspect/target:1;
 return {width:3,height:4.5,repeatX,repeatY,offsetX:(1-repeatX)/2,offsetY:(1-repeatY)*.7};
}
export {portraitPose} from './portrait-interaction';
export function portraitCameraDistance(width:number,height:number){const aspect=width>0&&height>0?width/height:1;return Math.max(2.95,2.3/Math.max(.1,aspect))/Math.tan(19*Math.PI/180)*1.08+1.2;}
export function portraitModel(){
 const group=new THREE.Group();
 const metal=new THREE.MeshPhysicalMaterial({color:0xb6cdbf,metalness:.94,roughness:.2,clearcoat:1,envMapIntensity:1.9});
 const dark=new THREE.MeshStandardMaterial({color:0x0b1410,metalness:.4,roughness:.5});
 const glass=new THREE.MeshPhysicalMaterial({color:0xa8cbb6,metalness:.4,roughness:.24,transparent:true,opacity:.16,depthWrite:false});
 function box(width:number,height:number,depth:number,material:THREE.Material,x=0,y=0,z=0){const radius=Math.min(.12,depth/2,width/4,height/4);const mesh=new THREE.Mesh(new RoundedBoxGeometry(width,height,depth,3,radius),material);mesh.position.set(x,y,z);group.add(mesh);return mesh;}
 // A detached rear sheet and a thin photo laminate replace the mat, stand and plinth.
 const rear=box(3.5,4.98,.09,glass,.16,.12,-.31);rear.name='portrait-rear-sheet';
 const shell=box(3.24,4.74,.18,metal);shell.name='portrait-laminate';
 box(3.1,4.6,.03,dark,0,0,.105);
 const image=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}));image.name='portrait-image';image.scale.set(3,4.5,1);image.position.z=.13;group.add(image);
 for(const x of [-1,1])for(const y of [-1,1]){
  box(.34,.035,.07,metal,x*1.66,y*2.5,.23);
  box(.035,.34,.07,metal,x*1.81,y*2.35,.23);
 }
 const center=new THREE.Box3().setFromObject(group,true).getCenter(new THREE.Vector3());group.children.forEach(child=>child.position.sub(center));
 return group;
}
