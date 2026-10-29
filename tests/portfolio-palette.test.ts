import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import postcss from 'postcss';
const css=postcss.parse(fs.readFileSync('src/app/portofolio/design-tokens.css','utf8'));
function values(selector:string){const vars:Record<string,string>={};css.walkRules(rule=>{if(rule.selector===selector)rule.walkDecls(d=>{vars[d.prop]=d.value;});});return vars;}
function hex(value:string){return [1,3,5].map(i=>parseInt(value.slice(i,i+2),16));}
function blend(fg:number[],bg:number[],alpha:number){return fg.map((v,i)=>v*alpha+bg[i]*(1-alpha));}
function luminance(rgb:number[]){return rgb.map(v=>{const s=v/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);}
function contrast(a:number[],b:number[]){const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (x+.05)/(y+.05);}
test('Portfolio Mode text remains readable across overlapping ambient and material tints in both themes',()=>{
 for(const dark of [false,true])for(const page of ['home','about','background','journey','projects','skills','certificates','services','playground','contact']){
  const root='.portfolio-mode-experience',variant=`${root}[data-chapter=${page}]`;
  const cool=['background','projects','skills','playground'].includes(page)?values(root+':is([data-chapter=background],[data-chapter=projects],[data-chapter=skills],[data-chapter=playground])'):{};
  const darkCool=dark&&Object.keys(cool).length?values('html[data-theme=dark] '+root+':is([data-chapter=background],[data-chapter=projects],[data-chapter=skills],[data-chapter=playground])'):{};
  const v={...values(root),...cool,...values(variant),...(dark?{...values('html[data-theme=dark] '+root),...values('html[data-theme=dark] '+variant)}:{}),...darkCool};
  const accent=v['--pm-accent-rgb'].split(' ').map(Number),secondary=v['--pm-secondary-rgb'].split(' ').map(Number),paper=hex(v['--pm-paper']);
  const background=blend(accent,blend(secondary,blend(accent,paper,.14),.08),.1);
  for(const token of ['--pm-ink','--pm-muted'])assert.ok(contrast(hex(v[token]),background)>=4.5,`${dark?'dark':'light'} ${page} ${token}`);
 }
});
