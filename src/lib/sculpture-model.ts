import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import fontData from '../assets/helvetiker-bold.json';
/** Procedural, testable assets with no DOM, downloads or renderer dependency. */
export function sculptureModel(variant:'hero'|'contact',segments=160,monogram='RP'){
 const chrome=new THREE.MeshPhysicalMaterial({color:0xd9e4df,metalness:1,roughness:.19,clearcoat:1,clearcoatRoughness:.14,envMapIntensity:2.2});
 const paper=new THREE.MeshStandardMaterial({color:0xe1eee5,metalness:.35,roughness:.35,envMapIntensity:1.4});const dark=new THREE.MeshStandardMaterial({color:0x476555,metalness:.5,roughness:.4});
 const assembly=new THREE.Group();
 function mesh(geometry:THREE.BufferGeometry,material:THREE.Material|THREE.Material[],parent:THREE.Object3D=assembly){const result=new THREE.Mesh(geometry,material);parent.add(result);return result;}
 if(variant==='hero'){
  const font=new FontLoader().parse(fontData);
  const geometry=new TextGeometry(monogram,{font,size:2,depth:.42,curveSegments:12,bevelEnabled:true,bevelThickness:.045,bevelSize:.025,bevelSegments:3});
  geometry.computeBoundingBox();const width=geometry.boundingBox?.getSize(new THREE.Vector3()).x||1;const scale=Math.min(1,3.7/width);geometry.scale(scale,scale,scale);geometry.center();
  const mark=mesh(geometry,[chrome,dark]);mark.name='identity-monogram';mark.userData.initials=monogram;
  const base=mesh(new THREE.BoxGeometry(3.9,.08,.85),dark);base.position.y=-1.25;
  const edge=mesh(new THREE.BoxGeometry(3.9,.018,.86),paper);edge.position.y=-1.2;
 }else{
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
