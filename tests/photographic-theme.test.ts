import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import {bronzeFragment,createCinematicRenderer} from '../src/lib/cinematic-renderer';
import {CINEMATIC_LIGHT_PALETTE} from '../src/lib/cinematic-scene';
test('both theme materials retain the animated particles in the final shader output',()=>{
  const material=bronzeFragment.indexOf('color=mix(color,daylight,uLight)');
  const particles=bronzeFragment.indexOf('vec2 spark=');
  const output=bronzeFragment.indexOf('gl_FragColor=');
  assert.ok(material<particles&&particles<output,'Particles must be composited after the theme material so daylight cannot erase them');
});
function vars(selector:string){const result:Record<string,string>={};postcss.parse(fs.readFileSync('src/app/design-tokens.css','utf8')).walkRules(rule=>{if(rule.selector===selector)rule.walkDecls(d=>{result[d.prop]=d.value;});});return result;}
function resolve(value:string,values:Record<string,string>):string{const match=value?.match(/^var\((--[\w-]+)\)$/);return match?resolve(values[match[1]],values):value;}
function rgb(hex:string){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
function luminance(color:number[]){return color.map(v=>{const s=v/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);}
function contrast(a:number[],b:number[]){const [light,dark]=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (light+.05)/(dark+.05);}
test('hero and footer theme materials provide genuinely light/dark surfaces and readable primary and muted text',()=>{
  const base={...vars('.studio-site'),...vars('.studio-site.cinematic-site')};
  for(const dark of [false,true]){
    const raw={...base,...(dark?{...vars('html[data-theme=dark] .studio-site'),...vars('html[data-theme=dark] .studio-site.cinematic-site')}:{})};
    const surface=rgb(resolve(raw['--photo-surface'],raw)),text=rgb(resolve(raw['--photo-text'],raw)),muted=rgb(resolve(raw['--photo-muted'],raw));
    assert.ok(dark?luminance(surface)<.05:luminance(surface)>.8);
    assert.ok(contrast(text,surface)>=4.5);assert.ok(contrast(muted,surface)>=4.5);
    // Footer secondary labels use 65% of the foreground over its directory surface.
    assert.ok(contrast(text.map((v,i)=>v*.65+surface[i]*.35),surface)>=4.5);
  }
});
test('the cinematic renderer changes its light-mode uniform without recreating the WebGL context',()=>{
  const calls:[string,number][]=[];
  const gl={createShader:()=>({}),getShaderParameter:()=>true,createProgram:()=>({}),getProgramParameter:()=>true,createBuffer:()=>({}),getAttribLocation:()=>0,getUniformLocation:(_p:unknown,name:string)=>name,uniform1f:(name:string,value:number)=>calls.push([name,value]),...Object.fromEntries(['shaderSource','compileShader','deleteShader','attachShader','linkProgram','deleteProgram','useProgram','bindBuffer','bufferData','enableVertexAttribArray','vertexAttribPointer','deleteBuffer'].map(key=>[key,()=>{}]))};
  let contexts=0;
  const canvas={getContext:()=>{contexts++;return gl;}} as unknown as HTMLCanvasElement;
  const previous=Object.getOwnPropertyDescriptor(globalThis,'cancelAnimationFrame');Object.defineProperty(globalThis,'cancelAnimationFrame',{configurable:true,value:()=>{}});
  try{const renderer=createCinematicRenderer(canvas,()=>{});renderer.theme(true);renderer.theme(false);assert.deepEqual(calls.filter(([name])=>name==='uLight'),[['uLight',1],['uLight',0]]);assert.equal(contexts,1);renderer.dispose();}
  finally{if(previous)Object.defineProperty(globalThis,'cancelAnimationFrame',previous);else Reflect.deleteProperty(globalThis,'cancelAnimationFrame');}
});
test('daylight waves have distinct warm and cool color while preserving text contrast at their darkest material',()=>{
  const raw={...vars('.studio-site'),...vars('.studio-site.cinematic-site')};
  const text=rgb(resolve(raw['--photo-text'],raw)),muted=rgb(resolve(raw['--photo-muted'],raw));
  const {warm,cool}=CINEMATIC_LIGHT_PALETTE;
  assert.ok(warm.body[0]-warm.body[2]>.25,'Warm scene must have visible apricot color');
  assert.ok(cool.body[2]-cool.body[0]>.15,'Cool scene must have visible blue color');
  for(const scene of [warm,cool])for(const color of [scene.shadow,scene.body,scene.crest]){
    const background=color.map((v:number)=>v*255);
    assert.ok(contrast(text,background)>=4.5);assert.ok(contrast(muted,background)>=4.5);
  }
  for(const name of ['--photo-glow-warm','--photo-glow-cool'])assert.ok(luminance(rgb(resolve(raw[name],raw)))>.4);
});
