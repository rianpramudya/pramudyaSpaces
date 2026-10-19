import {sceneTheme} from './visual-theme';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {portraitModel,portraitPose,portraitFit,portraitCameraDistance} from './portrait-model';
import {sculptureQuality} from './sculpture-motion';
export interface PortraitController{turn:(yaw:number,pitch:number)=>void;motion:(value:boolean)=>void;point:(x:number,y:number)=>void;resize:()=>void;dispose:()=>void;}
/** A photograph suspended in a slim laminated display. No idle render loop. */
export function createPortrait(canvas:HTMLCanvasElement,context:WebGL2RenderingContext,host:HTMLElement,url:string,onReady:()=>void,onError:()=>void):PortraitController{
 const renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true});renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,60),model=portraitModel();scene.add(model);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.05);scene.environment=environment.texture;room.dispose();pmrem.dispose();
 const key=new THREE.DirectionalLight(sceneTheme.white,3);key.position.set(-4,5,6);scene.add(key);const rim=new THREE.DirectionalLight(sceneTheme.gray5,3);rim.position.set(5,2,-2);scene.add(rim);scene.add(new THREE.HemisphereLight(sceneTheme.gray5,sceneTheme.gray1,1.4));
 let frame=0,disposed=false,motion=false,texture:THREE.Texture|undefined,loaded=false,announced=false;const pointer={x:0,y:0},rotation={yaw:0,pitch:0};
 const image=model.getObjectByName('portrait-image') as THREE.Mesh<THREE.PlaneGeometry,THREE.MeshBasicMaterial>;
 function request(){if(!frame&&!disposed)frame=requestAnimationFrame(draw);}
 function draw(){frame=0;if(disposed)return;const pose=portraitPose(motion?pointer.x:0,motion?pointer.y:0,rotation.yaw,rotation.pitch);const settling=Math.abs(model.rotation.x-pose.x)+Math.abs(model.rotation.y-pose.y)>.001;
  model.rotation.x=THREE.MathUtils.lerp(model.rotation.x,pose.x,motion?.12:1);model.rotation.y=THREE.MathUtils.lerp(model.rotation.y,pose.y,motion?.12:1);model.rotation.z=pose.z;
  renderer.render(scene,camera);if(loaded&&!announced){announced=true;onReady();}if(motion&&settling)request();
 }
 function resize(){if(disposed)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setPixelRatio(sculptureQuality(w,devicePixelRatio||1).pixelRatio);renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=portraitCameraDistance(w,h);camera.updateProjectionMatrix();request();}
 new THREE.TextureLoader().load(url,value=>{if(disposed){value.dispose();return;}texture=value;value.colorSpace=THREE.SRGBColorSpace;value.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());image.material.map=value;image.material.needsUpdate=true;const photo=value.image as {width:number;height:number};const fit=portraitFit(photo.width,photo.height);image.scale.set(fit.width,fit.height,1);value.repeat.set(fit.repeatX,fit.repeatY);value.offset.set(fit.offsetX,fit.offsetY);loaded=true;request();},undefined,()=>{if(!disposed)onError();});
 resize();
 return {turn(yaw,pitch){rotation.yaw=yaw;rotation.pitch=pitch;request();},motion(value){motion=value;if(!value){pointer.x=0;pointer.y=0;cancelAnimationFrame(frame);frame=0;}request();},point(x,y){if(!motion||disposed)return;pointer.x=Math.max(-1,Math.min(1,x));pointer.y=Math.max(-1,Math.min(1,y));request();},resize,dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);texture?.dispose();const materials=new Set<THREE.Material>();model.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>materials.add(material));}});materials.forEach(material=>material.dispose());environment.dispose();renderer.dispose();scene.clear();}};
}
