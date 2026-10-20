import {sceneTheme} from './visual-theme';
import * as THREE from 'three';
import {displayFrame} from './display-frame';
/** Geometry is separate from the GPU renderer so framing can be verified on the CPU. */
export function portraitFit(width:number,height:number){
 const aspect=width>0&&height>0?width/height:2/3,target=2/3;
 const repeatX=aspect>target?target/aspect:1,repeatY=aspect<target?aspect/target:1;
 return {width:3,height:4.5,repeatX,repeatY,offsetX:(1-repeatX)/2,offsetY:(1-repeatY)*.7};
}
export {portraitPose} from './portrait-interaction';
export function portraitCameraDistance(width:number,height:number){const aspect=width>0&&height>0?width/height:1;return Math.max(2.95,2.3/Math.max(.1,aspect))/Math.tan(19*Math.PI/180)*1.08+1.2;}
export function portraitModel(){
 const group=displayFrame(3,4.5,undefined,'portrait');
 const image=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:sceneTheme.white,toneMapped:false}));image.name='portrait-image';image.scale.set(3,4.5,1);image.position.z=.13;group.add(image);
 const center=new THREE.Box3().setFromObject(group,true).getCenter(new THREE.Vector3());group.children.forEach(child=>child.position.sub(center));
 return group;
}
