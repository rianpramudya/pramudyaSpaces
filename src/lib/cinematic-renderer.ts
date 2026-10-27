import {CINEMATIC_SCENE,CINEMATIC_LIGHT_PALETTE,cinematicResolution} from './cinematic-scene';
export const bronzeVertex=`attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.0,1.0);}`;
// Adapted from the supplied Laocoön wave brief; native WebGL, with no model download.
export const bronzeFragment=`precision mediump float;
uniform float uTime;uniform vec2 uResolution;uniform vec2 uMouse;uniform float uScroll;uniform float uGlow;uniform float uLight;
float hash(float n){return fract(sin(n)*43758.5453);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*uResolution)/uResolution.y;float aspect=uResolution.x/uResolution.y;
 float time=uTime*.08;float deform=uScroll*5.0;vec2 p=uv;
 p.x+=sin(uv.y*2.5+time*.2+deform)*.35+sin(uv.y*1.2-time*.1-deform*1.5)*.25;
 p.y+=cos(uv.x*2.5-time*.15-deform*.8)*.35+cos(uv.x*1.2+time*.18+deform*1.2)*.25;
 p+=vec2(uScroll*.04,-uScroll*.02)+uMouse*vec2(aspect,1.0)*${CINEMATIC_SCENE.parallax};
 float w1=sin(dot(p,vec2(cos(.6),sin(.6)))*2.4+time);
 float w2=cos(dot(p,vec2(cos(-.7),sin(-.7)))*3.2-time*1.4+w1*.4);
 float w3=sin(dot(p,vec2(cos(1.2),sin(1.2)))*4.0+time*1.8+w2*.5);
 float field=w1*.5+w2*.35+w3*.15;
 float sheen=pow(max(0.0,1.0-abs(field-.1)),2.5)*.5+pow(max(0.0,1.0-abs(field-.15)),8.0)*.9;
 float t=smoothstep(.15,1.0,uScroll);
 vec3 shadow=mix(vec3(.004,.002,.001),vec3(.001,.003,.008),t);
 vec3 body=mix(vec3(.065,.028,.01),vec3(.01,.023,.045),t);
 vec3 crest=mix(vec3(.45,.25,.12),vec3(.15,.28,.42),t);
 vec3 color=mix(shadow,body,smoothstep(-.6,.6,field));
 color+=crest*sheen*uGlow*.75;
 color*=max(.05,1.0-dot(uv,uv)*.16);
 vec3 dayShadow=mix(vec3(${CINEMATIC_LIGHT_PALETTE.warm.shadow.map(v=>v.toFixed(3)).join(',')}),vec3(${CINEMATIC_LIGHT_PALETTE.cool.shadow.map(v=>v.toFixed(3)).join(',')}),t);
 vec3 dayBody=mix(vec3(${CINEMATIC_LIGHT_PALETTE.warm.body.map(v=>v.toFixed(3)).join(',')}),vec3(${CINEMATIC_LIGHT_PALETTE.cool.body.map(v=>v.toFixed(3)).join(',')}),t);
 vec3 dayCrest=mix(vec3(${CINEMATIC_LIGHT_PALETTE.warm.crest.map(v=>v.toFixed(3)).join(',')}),vec3(${CINEMATIC_LIGHT_PALETTE.cool.crest.map(v=>v.toFixed(3)).join(',')}),t);
 vec3 daylight=mix(dayShadow,dayBody,smoothstep(-.6,.6,field));
 daylight=mix(daylight,dayCrest,clamp(sheen*.52,0.0,.72));
 color=mix(color,daylight,uLight);
 for(int i=0;i<${CINEMATIC_SCENE.sparks};i++){
  float seed=float(i)+1.0;float depth=.35+hash(seed*7.0)*.65;
  vec2 spark=vec2((hash(seed*13.0)-.5)*aspect,fract(hash(seed*19.0)+uTime*.015*depth)-.5);
  spark.x+=sin(uTime*.15+seed)*.02+uMouse.x*.02*depth;
  float light=1.0-smoothstep(.0008,.004*depth,length(uv-spark));
  vec3 sparkTint=mix(mix(vec3(.65,.32,.12),vec3(.3,.5,.7),t),mix(vec3(-.46,-.28,-.12),vec3(-.3,-.2,-.1),t),uLight);
  color+=sparkTint*light*.5*max(.05,1.0-dot(uv,uv)*.16);
 }
 gl_FragColor=vec4(color,1.0);
}`;
export type CinematicController={resize:(width:number,height:number)=>void;point:(x:number,y:number)=>void;scroll:(progress:number)=>void;theme:(light:boolean)=>void;run:(on:boolean)=>void;dispose:()=>void};
export function createCinematicRenderer(canvas:HTMLCanvasElement,onReady:()=>void):CinematicController{
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)throw new Error('WebGL unavailable');
 let disposed=false,frame=0,running=false,ready=false,progress=0,targetProgress=0,x=0,y=0,targetX=0,targetY=0,elapsed=0,previous=0;
 function shader(type:number,source:string){const item=gl!.createShader(type);if(!item)throw new Error('Shader unavailable');gl!.shaderSource(item,source);gl!.compileShader(item);if(!gl!.getShaderParameter(item,gl!.COMPILE_STATUS)){gl!.deleteShader(item);throw new Error('Shader compilation failed');}return item;}
 const vertex=shader(gl.VERTEX_SHADER,bronzeVertex);let fragment:WebGLShader;try{fragment=shader(gl.FRAGMENT_SHADER,bronzeFragment);}catch(error){gl.deleteShader(vertex);throw error;}
 const program=gl.createProgram();if(!program){gl.deleteShader(vertex);gl.deleteShader(fragment);throw new Error('Program unavailable');}
 gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);throw new Error('Shader link failed');}
 const buffer=gl.createBuffer();if(!buffer){gl.deleteProgram(program);throw new Error('Buffer unavailable');}
 gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 const time=gl.getUniformLocation(program,'uTime'),resolution=gl.getUniformLocation(program,'uResolution'),mouse=gl.getUniformLocation(program,'uMouse'),scroll=gl.getUniformLocation(program,'uScroll');gl.uniform1f(gl.getUniformLocation(program,'uGlow'),CINEMATIC_SCENE.glow);
 function tick(now:number){frame=0;if(disposed||!running)return;elapsed+=previous?Math.min((now-previous)/1000,.05):0;previous=now;progress+=(targetProgress-progress)*.04;x+=(targetX-x)*.05;y+=(targetY-y)*.05;gl!.useProgram(program);gl!.uniform1f(time,elapsed);gl!.uniform2f(mouse,x,y);gl!.uniform1f(scroll,progress);gl!.drawArrays(gl!.TRIANGLES,0,6);if(!ready){ready=true;onReady();}frame=requestAnimationFrame(tick);}
 return {theme(light){if(disposed)return;gl.useProgram(program);gl.uniform1f(gl.getUniformLocation(program,'uLight'),light?1:0);},resize(width,height){const size=cinematicResolution(width,height,devicePixelRatio||1);canvas.width=size.width;canvas.height=size.height;gl.viewport(0,0,size.width,size.height);gl.uniform2f(resolution,size.width,size.height);},point(px,py){targetX=Math.max(-1,Math.min(1,px));targetY=Math.max(-1,Math.min(1,py));},scroll(value){targetProgress=value;if(!ready)progress=value;},run(on){if(disposed||running===on)return;running=on;previous=0;if(!on){cancelAnimationFrame(frame);frame=0;}else if(!frame)frame=requestAnimationFrame(tick);},dispose(){disposed=true;running=false;cancelAnimationFrame(frame);gl.deleteBuffer(buffer);gl.deleteProgram(program);}};
}
