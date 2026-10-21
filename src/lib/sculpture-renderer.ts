import {sceneTheme} from './visual-theme';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {sculptureModel} from './sculpture-model';
import {createHeroAtmosphere} from './hero-atmosphere';
import {disposeSceneResources} from './dispose-scene';
import {heroSceneConfig,heroPointer} from './hero-scene';
import {sculptureQuality,sculptureScroll,sculptureCameraDistance} from './sculpture-motion';
export type SculptureVariant='hero'|'contact';
export interface SculptureController{setMotion:(active:boolean)=>void;point:(x:number,y:number)=>void;rotate:()=>void;resize:()=>void;dispose:()=>void;}
/** Loaded only by a visible sculpture. Procedural geometry/environment; no model or HDR downloads. */
export function createSculpture(canvas:HTMLCanvasElement,context:WebGL2RenderingContext,host:HTMLElement,variant:SculptureVariant):SculptureController{
 const quality=sculptureQuality(host.clientWidth,window.devicePixelRatio||1);
 const renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true});renderer.setPixelRatio(quality.pixelRatio);renderer.setClearColor(sceneTheme.black,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(38,1,.1,60);const cameraDistance=sculptureCameraDistance(variant,0);camera.position.set(0,0,cameraDistance);
 const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();
 const assembly=sculptureModel(variant,quality.segments);scene.add(assembly);
 const atmosphere=variant==='hero'?createHeroAtmosphere(new THREE.Box3().setFromObject(assembly,true).min.y-.06):null;if(atmosphere)scene.add(atmosphere.group);

 scene.add(new THREE.HemisphereLight(sceneTheme.white,sceneTheme.gray1,1.2));const key=new THREE.DirectionalLight(sceneTheme.white,3);key.position.set(-3,4,5);scene.add(key);const rim=new THREE.DirectionalLight(sceneTheme.gray5,variant==='hero'?2+heroSceneConfig.glowIntensity*2:2);rim.position.set(4,1,-2);scene.add(rim);
 const target={x:0,y:0};let active=false,frame=0,last=0,elapsed=0,manual=0,disposed=false;const base=variant==='hero'?{x:-.08,y:-.2,z:-.025}:{x:-.12,y:-.22,z:-.08};
 function draw(now:number){
  frame=0;if(disposed)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(active)elapsed+=dt;
  const progress=sculptureScroll(host.getBoundingClientRect().top,host.clientHeight);const drift=active?Math.sin(elapsed*.33)*.12:0;
  const tilt=heroPointer(target.x,target.y);
  const wantedX=base.x+(variant==='hero'?tilt.x:target.y*.18)+progress*(variant==='hero'?.18:.3),wantedY=base.y+manual+(variant==='hero'?tilt.y:target.x*.3)+(variant==='hero'?Math.sin(elapsed*.22)*.09+progress*.2:drift);
  assembly.rotation.x=active?THREE.MathUtils.lerp(assembly.rotation.x,wantedX,.07):wantedX;assembly.rotation.y=active?THREE.MathUtils.lerp(assembly.rotation.y,wantedY,.07):wantedY;assembly.rotation.z=base.z+drift*.25;assembly.position.y=active?Math.sin(elapsed*.65)*.07:0;
  atmosphere?.update(elapsed,active);
  camera.position.z=sculptureCameraDistance(variant,progress,camera.aspect);renderer.render(scene,camera);if(active)frame=requestAnimationFrame(draw);
 }
 function request(){if(!frame&&!disposed)frame=requestAnimationFrame(draw);}
 function resize(){if(disposed)return;const w=host.clientWidth,h=Math.max(1,host.clientHeight-(host.dataset.controls==='external'?0:44));if(!w||!h)return;renderer.setPixelRatio(sculptureQuality(w,window.devicePixelRatio||1).pixelRatio);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);request();}
 resize();
 return {
  setMotion(value){if(disposed)return;active=value;last=0;if(!value){target.x=0;target.y=0;cancelAnimationFrame(frame);frame=0;}request();},
  point(x,y){if(!active||disposed)return;target.x=Math.max(-1,Math.min(1,x));target.y=Math.max(-1,Math.min(1,y));request();},
  rotate(){manual+=Math.PI/2;request();},resize,
  dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);disposeSceneResources(scene);atmosphere?.disposeTextures();environment.dispose();renderer.dispose();scene.clear();}
 };
}
