import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import postcss from 'postcss';
import {cinematicQuality,cinematicResolution,scrollFraction,CINEMATIC_SCENE} from '../src/lib/cinematic-scene';
import {createCinematicRenderer} from '../src/lib/cinematic-renderer';
import {CinematicSurface,CinematicChapters} from '../src/components/cinematic-surface';

test('cinematic rendering uses static alternatives on touch, reduced motion and constrained devices',()=>{
 assert.equal(cinematicQuality(1440,false,false,8,8),true);
 for(const [width,reduced,coarse,memory,cores] of [[375,false,true,8,8],[1440,true,false,8,8],[1440,false,false,2,8],[1440,false,false,8,2]] as const)assert.equal(cinematicQuality(width,reduced,coarse,memory,cores),false);
 assert.equal(cinematicQuality(1440,false,false),true);
});
test('cinematic buffer stays within its pixel budget even on large high-DPI screens',()=>{
 for(const [w,h,dpr] of [[3840,2160,3],[1440,900,2],[768,1024,1],[0,0,1]]){const size=cinematicResolution(w,h,dpr);assert.ok(size.width>=1&&size.height>=1);assert.ok(size.width*size.height<=CINEMATIC_SCENE.maxPixels*1.01);}
 for(const top of [-200,0,500,100000])assert.ok(scrollFraction(top,2000,800)>=0&&scrollFraction(top,2000,800)<=1);
 assert.equal(scrollFraction(10,0,0),1);
});
test('cinematic surface starts with readable static fallback and chapters use real anchors',()=>{
 const surface=renderToStaticMarkup(React.createElement(CinematicSurface));assert.ok(surface.includes('data-renderer="static"'));assert.ok(surface.includes('aria-hidden="true"'));assert.ok(surface.includes('<canvas'));
 const html=renderToStaticMarkup(React.createElement(CinematicChapters,{nav:[['home','Home'],['projects','Projects']],active:'projects',en:true}));assert.ok(html.includes('href="#projects"'));assert.ok(html.includes('aria-current="location"'));assert.ok(html.includes('data-visited="true"'));
 assert.throws(()=>createCinematicRenderer({getContext:()=>null} as unknown as HTMLCanvasElement,()=>{}),/WebGL unavailable/);
});
test('cinematic display font is valid and no reference identity replaces the real CMS content',()=>{
 const font=readFileSync('src/assets/fonts/italiana-latin.woff2');assert.equal(font.subarray(0,4).toString(),'wOF2');
 const source=readFileSync('src/components/sections/hero-section.tsx','utf8');assert.ok(source.includes('aria-label={headline}'));assert.ok(!source.includes('Bronze and Time'));assert.ok(!source.includes('bronze_horse'));
 const css=readFileSync('src/app/cinematic.css','utf8');assert.ok(!css.includes('cursor:none'));assert.ok(!css.includes('900vh'));assert.ok(css.includes('prefers-reduced-motion'));
});
test('combined palette keeps body and muted reading text accessible in both themes',()=>{
 const ast=postcss.parse(readFileSync('src/app/design-tokens.css','utf8'));
 function tokens(selector:string){const values:Record<string,string>={};ast.walkRules(rule=>{if(rule.selector===selector)rule.walkDecls(d=>{values[d.prop]=d.value;});});return values;}
 function luminance(hex:string){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((n,c,i)=>n+c*[.2126,.7152,.0722][i],0);}
 function contrast(a:string,b:string){const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (values[0]+.05)/(values[1]+.05);}
 const base=tokens('.studio-site.cinematic-site');for(const t of [base,{...base,...tokens('html[data-theme=dark] .studio-site.cinematic-site')}])for(const [fg,bg] of [['--studio-text','--studio-paper'],['--studio-muted','--studio-paper'],['--studio-muted','--studio-surface']])assert.ok(contrast(t[fg],t[bg])>=4.5,fg+' / '+bg);
});
