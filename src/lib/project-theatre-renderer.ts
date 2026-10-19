import {sceneTheme} from './visual-theme';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {fitProjectCover,projectCameraDistance,projectScreenPose,type ProjectStageItem} from './project-theatre';
import {sculptureQuality} from './sculpture-motion';
export interface TheatreController{select:(index:number)=>void;motion:(value:boolean)=>void;point:(x:number,y:number)=>void;resize:()=>void;dispose:()=>void;}
/** Real project covers inside physical display objects; on-demand rendering. */
export function createProjectTheatre(canvas:HTMLCanvasElement,context:WebGL2RenderingContext,host:HTMLElement,items:ProjectStageItem[],onReady:()=>void):TheatreController{
 const renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true});renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,80),assembly=new THREE.Group();scene.add(assembly);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();const environment=pmrem.fromScene(room,.06);scene.environment=environment.texture;room.dispose();pmrem.dispose();
 const frameGeometry=new RoundedBoxGeometry(6.5,4.05,.16,3,.075),planeGeometry=new THREE.PlaneGeometry(1,1);
 const metal=new THREE.MeshStandardMaterial({color:sceneTheme.gray4,metalness:.92,roughness:.23,envMapIntensity:1.9}),glass=new THREE.MeshStandardMaterial({color:sceneTheme.gray1,metalness:.2,roughness:.6});
 const displays=new Map<number,{group:THREE.Group;cover:THREE.Mesh;material:THREE.MeshBasicMaterial;loaded:boolean}>(),textures=new Set<THREE.Texture>();
 let active=0,moving=false,disposed=false,frame=0,ready=false;const pointer={x:0,y:0};
 function announce(){if(!ready&&!disposed){ready=true;onReady();}}
 function placeholder(title:string){const surface=document.createElement('canvas');surface.width=1024;surface.height=640;const ctx=surface.getContext('2d');if(ctx){ctx.fillStyle=sceneTheme.gray1;ctx.fillRect(0,0,1024,640);ctx.fillStyle=sceneTheme.gray5;ctx.font='500 56px Arial';const words=title.split(' ');let line='',y=245;for(const word of words){if(ctx.measureText(line+' '+word).width>850&&line){ctx.fillText(line,80,y);line=word;y+=70;}else line+=(line?' ':'')+word;}ctx.fillText(line,80,y);}const texture=new THREE.CanvasTexture(surface);texture.colorSpace=THREE.SRGBColorSpace;textures.add(texture);return texture;}
 function ensure(index:number,initialOffset=index-active){if(index<0||index>=items.length||displays.has(index))return;const item=items[index],group=new THREE.Group();assembly.add(group);
  group.add(new THREE.Mesh(frameGeometry,metal));const screen=new THREE.Mesh(planeGeometry,glass);screen.scale.set(6.18,3.7,1);screen.position.z=.085;group.add(screen);
  const material=new THREE.MeshBasicMaterial({map:placeholder(item.title),toneMapped:false});const cover=new THREE.Mesh(planeGeometry,material);cover.scale.set(6.08,3.6,1);cover.position.z=.095;group.add(cover);
  const pose=projectScreenPose(initialOffset);group.position.set(pose.x,pose.y,pose.z);group.rotation.y=pose.rotation;group.scale.setScalar(pose.scale);const display={group,cover,material,loaded:false};displays.set(index,display);
  if(item.image)new THREE.TextureLoader().load(item.image,texture=>{if(disposed){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.add(texture);const previous=material.map;material.map=texture;material.needsUpdate=true;if(previous){previous.dispose();textures.delete(previous);}const image=texture.image as {width:number;height:number};const fit=fitProjectCover(image.width,image.height);cover.scale.set(fit.width,fit.height,1);display.loaded=true;request();},undefined,()=>{if(!disposed){display.loaded=true;request();}});else display.loaded=true;
 }
 function request(){if(!frame&&!disposed)frame=requestAnimationFrame(draw);}
 function draw(){frame=0;if(disposed)return;let settling=false;
  const factor=moving?.13:1;
  for(const [index,display] of displays){const pose=projectScreenPose(index-active),group=display.group;const target=new THREE.Vector3(pose.x,pose.y,pose.z);if(group.position.distanceTo(target)>.002||Math.abs(group.rotation.y-pose.rotation)>.002||Math.abs(group.scale.x-pose.scale)>.002)settling=true;group.position.lerp(target,factor);group.rotation.y=THREE.MathUtils.lerp(group.rotation.y,pose.rotation,factor);group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x,pose.scale,factor));group.visible=Math.abs(index-active)<=1||Math.abs(group.position.x)<9;}
  const targetX=moving?pointer.y*.055:0,targetY=moving?pointer.x*.08:0;if(Math.abs(assembly.rotation.x-targetX)>.001||Math.abs(assembly.rotation.y-targetY)>.001)settling=true;assembly.rotation.x=THREE.MathUtils.lerp(assembly.rotation.x,targetX,factor);assembly.rotation.y=THREE.MathUtils.lerp(assembly.rotation.y,targetY,factor);
  renderer.render(scene,camera);if(displays.get(active)?.loaded)announce();if(moving&&settling)request();
 }
 const key=new THREE.DirectionalLight(sceneTheme.white,3);key.position.set(-3,5,6);scene.add(key);const rim=new THREE.DirectionalLight(sceneTheme.gray5,3);rim.position.set(5,2,-1);scene.add(rim);scene.add(new THREE.HemisphereLight(sceneTheme.gray5,sceneTheme.gray1,1));
 function select(index:number){const previous=active;active=Math.max(0,Math.min(items.length-1,index));const initial=(slot:number)=>Math.max(-2,Math.min(2,slot-previous));ensure(active,initial(active));ensure(active-1,initial(active-1));ensure(active+1,initial(active+1));request();}
 function resize(){if(disposed)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setPixelRatio(sculptureQuality(w,devicePixelRatio||1).pixelRatio);renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=projectCameraDistance(w,h);camera.updateProjectionMatrix();request();}
 select(0);resize();
 return {select,motion(value){moving=value;if(!value){pointer.x=0;pointer.y=0;cancelAnimationFrame(frame);frame=0;}request();},point(x,y){if(!moving||disposed)return;pointer.x=Math.max(-1,Math.min(1,x));pointer.y=Math.max(-1,Math.min(1,y));request();},resize,dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);textures.forEach(texture=>texture.dispose());displays.forEach(display=>display.material.dispose());frameGeometry.dispose();planeGeometry.dispose();metal.dispose();glass.dispose();environment.dispose();renderer.dispose();scene.clear();}};
}
