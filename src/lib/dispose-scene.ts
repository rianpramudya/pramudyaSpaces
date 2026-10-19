import * as THREE from 'three';
/** Shared assets may appear on several renderables; release each resource exactly once. */
export function disposeSceneResources(root:THREE.Object3D){
 const geometry=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
 root.traverse(object=>{if(object instanceof THREE.Mesh||object instanceof THREE.Points||object instanceof THREE.Line){geometry.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>materials.add(material));}});
 geometry.forEach(value=>value.dispose());materials.forEach(value=>value.dispose());
}
