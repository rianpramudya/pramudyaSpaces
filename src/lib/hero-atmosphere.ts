import {sceneTheme,sceneAlpha} from './visual-theme';
import * as THREE from 'three';
import {heroSceneConfig} from './hero-scene';
import {rpaMarkPaths} from './rpa-mark';
/** Small deterministic particle cloud. Kept CPU-testable and bounded. */
export function heroParticles(count:number=heroSceneConfig.particleCount){
 const positions=new Float32Array(Math.max(0,Math.min(40,Math.floor(count)))*3);
 let seed=71;const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
 for(let i=0;i<positions.length;i+=3){positions[i]=(random()-.5)*8;positions[i+1]=(random()-.5)*5;positions[i+2]=-1-random()*4;}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));return geometry;
}
export function createHeroAtmosphere(floorY:number){
 const group=new THREE.Group(),textures:THREE.Texture[]=[];
 const particles=new THREE.Points(heroParticles(),new THREE.PointsMaterial({color:sceneTheme.gray5,size:.028,transparent:true,opacity:.5,depthWrite:false}));group.add(particles);
 const props=new THREE.Group();group.add(props);
 for(const [index,geometry] of [new THREE.TorusGeometry(.36,.065,8,36),new THREE.BoxGeometry(.45,.45,.45),new THREE.SphereGeometry(.33,10,8)].entries()){
  const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:sceneTheme.gray4,wireframe:true,transparent:true,opacity:.2,depthWrite:false}));mesh.position.set(index===0?-2.6:2.6,index===1?-.8:1.25,index===2?-3:-1.7);mesh.rotation.set(.5,index*.7,.4);props.add(mesh);
 }
 function texture(draw:(ctx:CanvasRenderingContext2D)=>void){const surface=document.createElement('canvas');surface.width=512;surface.height=256;const ctx=surface.getContext('2d');if(ctx)draw(ctx);const map=new THREE.CanvasTexture(surface);map.colorSpace=THREE.SRGBColorSpace;textures.push(map);return map;}
 const shadow=texture(ctx=>{ctx.translate(256,128);ctx.scale(2,1);const gradient=ctx.createRadialGradient(0,0,4,0,0,128);gradient.addColorStop(0,sceneAlpha(sceneTheme.black,.8));gradient.addColorStop(.5,sceneAlpha(sceneTheme.black,.36));gradient.addColorStop(1,sceneAlpha(sceneTheme.black,0));ctx.fillStyle=gradient;ctx.fillRect(-128,-128,256,256);});
 // A softly blurred floor projection avoids an extra reflective render pass on every frame.
 const reflection=texture(ctx=>{ctx.filter='blur(9px)';ctx.strokeStyle=sceneTheme.gray5;ctx.lineWidth=10;ctx.lineCap='round';ctx.lineJoin='round';ctx.translate(256,128);ctx.scale(1.2,-.75);ctx.translate(-128,-128);for(const points of rpaMarkPaths){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}});
 function floor(map:THREE.Texture,width:number,depth:number,z:number,opacity:number){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,depth),new THREE.MeshBasicMaterial({map,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.set(0,floorY,z);group.add(mesh);return mesh;}
 floor(shadow,5.8,2.1,0,.75);floor(reflection,3.9,2.8,1.65,.15).position.y+=.004;
 return {group,update(elapsed:number,active:boolean){if(!active)return;particles.rotation.y=Math.sin(elapsed*.065)*.12;props.children.forEach((prop,index)=>{prop.rotation.y=elapsed*.08+index*.7;prop.position.y=(index===1?-.8:1.25)+Math.sin(elapsed*.45+index)*.08;});},disposeTextures(){textures.forEach(value=>value.dispose());}};
}
