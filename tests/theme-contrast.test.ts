import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
const files=['globals','portfolio','admin','admin-workspace','immersive','hero-experience','site-chrome','project-room','about-room'];
const rules=files.flatMap(file=>postcss.parse(fs.readFileSync(`src/app/${file}.css`,'utf8')).nodes.filter(n=>n.type==='rule'));
function declarations(selector:string){const result:Record<string,string>={};for(const rule of rules)if(rule.type==='rule'&&rule.selector===selector)rule.walkDecls(d=>{result[d.prop]=d.value;});return result;}
function luminance(hex:string){const value=hex.replace('#','');const full=value.length===3?[...value].map(c=>c+c).join(''):value;const channels=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;}
function ratio(a:string,b:string){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function resolve(value:string,tokens:Record<string,string>):string{return value.startsWith('var(')?resolve(tokens[value.slice(4,-1)],tokens):value;}
test('dark page cannot override primary foreground in a locally light section',()=>{
 const conflicting=declarations('html[data-theme=dark] .button.primary');assert.equal(conflicting.color,undefined,'Global dark override defeats locally light button contrast');
});
test('primary buttons and secondary text meet 4.5:1 across public and admin palettes',()=>{
 const primary=declarations('.button.primary');
 for(const selector of [':root','html[data-theme=dark]','.portfolio','html[data-theme=dark] .portfolio','.portfolio main>section:is(.hero,.about-section,#skills,#journey,.play-section)','.admin-shell','html[data-theme=dark] .admin-shell','.portfolio main>section#contact[data-experience=correspondence-room]','.portfolio .site-status-rail,.portfolio .arcade-lane.hero-chase','.portfolio .site-header[data-experience=sage-navigation],.portfolio .site-footer[data-experience=signature-footer]','.portfolio main>section#projects[data-experience=project-theatre]','html[data-theme=dark] .portfolio main>section#projects[data-experience=project-theatre]','.portfolio main>.about-section[data-experience=portrait-atelier]']){
  const tokens={...declarations(':root'),...declarations(selector)};
  const background=resolve(primary.background,tokens),foreground=resolve(primary.color,tokens);
  assert.ok(ratio(background,foreground)>=4.5,selector+' primary contrast');assert.ok(ratio(tokens['--muted'],tokens['--background'])>=4.5,selector+' muted contrast');
 }
});

test('active workspace navigation retains readable text on its tinted surface',()=>{
 const active=declarations('.admin-shell .admin-nav a.active');assert.equal(active.color,'var(--text)');
 for(const selector of ['.admin-shell','html[data-theme=dark] .admin-shell','.portfolio','html[data-theme=dark] .portfolio']){
  const tokens={...declarations(':root'),...declarations(selector)};
  const channels=(hex:string)=>{const value=hex.replace('#','');const full=value.length===3?[...value].map(c=>c+c).join(''):value;return [0,2,4].map(i=>parseInt(full.slice(i,i+2),16));};
  const accent=channels(tokens['--accent']),surface=channels(tokens['--surface']);
  const tint='#'+surface.map((value,index)=>Math.round(value*.89+accent[index]*.11).toString(16).padStart(2,'0')).join('');
  assert.ok(ratio(tokens['--text'],tint)>=4.5,selector+' active navigation contrast');
 }
});

test('projects stay white in light mode and switch to sage only in dark mode',()=>{
 const light=declarations('.portfolio main>section#projects[data-experience=project-theatre]');
 const dark={...light,...declarations('html[data-theme=dark] .portfolio main>section#projects[data-experience=project-theatre]')};
 assert.equal(light['--background'],'#fff');assert.equal(light['color-scheme'],'light');assert.equal(dark['--background'],'#0b1410');assert.equal(dark['color-scheme'],'dark');
 for(const palette of [light,dark]){assert.ok(ratio(palette['--text'],palette['--background'])>=4.5);assert.ok(ratio(palette['--muted'],palette['--background'])>=4.5);assert.ok(ratio(palette['--project-tag-text'],palette['--project-tag-bg'])>=4.5);}
});
