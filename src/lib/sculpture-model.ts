import {sceneTheme} from './visual-theme';
import * as THREE from 'three';
import {rpaMarkPaths} from './rpa-mark';
/** Procedural, testable assets with no DOM, downloads or renderer dependency. */
export function sculptureModel(variant:'hero'|'contact',segments=160,monogram='RP'){
 const chrome=new THREE.MeshPhysicalMaterial({color:sceneTheme.gray5,metalness:1,roughness:.19,clearcoat:1,clearcoatRoughness:.14,envMapIntensity:2.2});
 const assembly=new THREE.Group();
 function mesh(geometry:THREE.BufferGeometry,material:THREE.Material|THREE.Material[],parent:THREE.Object3D=assembly){const result=new THREE.Mesh(geometry,material);parent.add(result);return result;}
 if(variant==='hero'){
  const mark=new THREE.Group();mark.name='rpa-linear-symbol';mark.userData.ownerInitials=monogram;assembly.add(mark);
  rpaMarkPaths.forEach((path,index)=>{
   const points=path.map(([x,y])=>new THREE.Vector3((x-128)/55,(128-y)/55,(index-1)*.25));
   const curve=new THREE.CurvePath<THREE.Vector3>();
   // Round each corner without changing the linear route or its endpoints.
   let previous=points[0];
   for(let i=1;i<points.length-1;i++){
    const corner=points[i],before=corner.clone().lerp(points[i-1],.09),after=corner.clone().lerp(points[i+1],.09);
    curve.add(new THREE.LineCurve3(previous,before));curve.add(new THREE.QuadraticBezierCurve3(before,corner,after));previous=after;
   }
   curve.add(new THREE.LineCurve3(previous,points.at(-1)!));
   const strand=mesh(new THREE.TubeGeometry(curve,Math.max(96,segments),.09,10,false),chrome,mark);strand.name=`rpa-route-${index}`;
   for(const point of [points[0],points.at(-1)!]){const terminal=mesh(new THREE.SphereGeometry(.09,12,8),chrome,mark);terminal.position.copy(point);}
  });
 }else{
  const paper=new THREE.MeshStandardMaterial({color:sceneTheme.gray5,metalness:.35,roughness:.35,envMapIntensity:1.4});const dark=new THREE.MeshStandardMaterial({color:sceneTheme.gray3,metalness:.5,roughness:.4});
  // A folded envelope and raised letter. Geometry is shallowly extruded, not a flat illustration.
  const body=mesh(new THREE.BoxGeometry(2.8,1.75,.12),paper);body.position.y=-.25;
  function triangle(points:[number,number][],material:THREE.Material,z:number,parent:THREE.Object3D=assembly){const shape=new THREE.Shape();shape.moveTo(...points[0]);points.slice(1).forEach(point=>shape.lineTo(...point));shape.closePath();const face=mesh(new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.015,bevelThickness:.015}),material,parent);face.position.z=z;return face;}
  triangle([[-1.4,-1.125],[-1.4,.625],[.1,-.3]],chrome,.07);triangle([[1.4,-1.125],[1.4,.625],[-.1,-.3]],paper,.1);triangle([[-1.4,-1.125],[1.4,-1.125],[0,-.15]],paper,.17);
  const flap=new THREE.Group();flap.position.set(0,.625,.035);assembly.add(flap);triangle([[-1.4,0],[1.4,0],[0,-1]],chrome,0,flap);flap.rotation.x=2.4;
  const letter=new THREE.Group();letter.position.set(0,.6,-.13);assembly.add(letter);mesh(new THREE.BoxGeometry(2.22,1.7,.035),paper,letter);
  for(let i=0;i<4;i++){const line=mesh(new THREE.BoxGeometry(i===3?.75:1.55,.035,.01),dark,letter);line.position.set(i===3?-.4:0,.46-i*.22,.025);}
  const seal=mesh(new THREE.TorusGeometry(.16,.045,12,48),chrome);seal.position.set(0,-.65,.24);
  assembly.rotation.set(-.12,-.22,-.08);
 }
 assembly.rotation.set(0,0,0);
 const center=new THREE.Box3().setFromObject(assembly,true).getCenter(new THREE.Vector3());
 assembly.children.forEach(child=>child.position.sub(center));
 return assembly;
}
