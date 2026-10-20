import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {sceneTheme} from './visual-theme';
/** One laminate material and edge construction for portrait and project displays. */
export function displayFrameMaterials(){return {
 metal:new THREE.MeshPhysicalMaterial({color:sceneTheme.gray4,metalness:.94,roughness:.2,clearcoat:1,envMapIntensity:1.9}),
 dark:new THREE.MeshStandardMaterial({color:sceneTheme.gray1,metalness:.4,roughness:.5}),
 glass:new THREE.MeshPhysicalMaterial({color:sceneTheme.gray4,metalness:.4,roughness:.24,transparent:true,opacity:.16,depthWrite:false})
};}
export function displayFrame(width:number,height:number,materials=displayFrameMaterials(),prefix='display'){
 const group=new THREE.Group();group.name=`${prefix}-frame`;
 function box(w:number,h:number,d:number,material:THREE.Material,x=0,y=0,z=0){const radius=Math.min(.12,d/2,w/4,h/4);const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,radius),material);mesh.position.set(x,y,z);group.add(mesh);return mesh;}
 const rear=box(width+.5,height+.48,.09,materials.glass,.16,.12,-.31);rear.name=`${prefix}-rear-sheet`;
 const shell=box(width+.24,height+.24,.18,materials.metal);shell.name=`${prefix}-laminate`;
 box(width+.1,height+.1,.03,materials.dark,0,0,.105);
 for(const x of [-1,1])for(const y of [-1,1]){
  box(.34,.035,.07,materials.metal,x*(width/2+.16),y*(height/2+.25),.23);
  box(.035,.34,.07,materials.metal,x*(width/2+.31),y*(height/2+.1),.23);
 }
 return group;
}
/** Resizing releases geometry while retaining the renderer's shared materials. */
export function disposeFrameGeometry(frame:THREE.Object3D){frame.traverse(object=>{if(object instanceof THREE.Mesh)object.geometry.dispose();});}
