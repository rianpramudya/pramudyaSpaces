/** Tune the atmosphere here. Palette comes from visual-theme and shared neutral CSS tokens. */
export const heroSceneConfig={glowIntensity:.35,parallaxStrength:.45,particleCount:12} as const;
import {type Profile,type Entry,listValue,textValue} from './model';
export function heroPointer(x:number,y:number,strength:number=heroSceneConfig.parallaxStrength){const limit=Math.PI/15;const clamp=(n:number)=>Math.max(-1,Math.min(1,n));return {x:clamp(y*strength)*limit,y:clamp(x*strength)*limit};}
export function heroQuality(width:number,memory?:number,reduced=false,cores?:number){const webgl=width>=768&&!reduced&&(memory===undefined||memory>=4)&&(cores===undefined||cores>2);return {webgl,animate:webgl};}
export function heroSceneData(profile:Profile,records:Entry[],en:boolean){
 const published=records.filter(item=>item.published),projects=published.filter(item=>item.kind==='project'),skills=published.filter(item=>item.kind==='skill');
 const technologies=[...new Set([...projects.flatMap(item=>listValue(item.data,'technologies')),...skills.map(item=>item.title)].filter(Boolean))].slice(0,5);
 const rolesInProjects=[...new Set(projects.map(item=>textValue(item.data,'role')).filter(Boolean))].slice(0,2);
 const experience=published.find(item=>item.kind==='experience');
 const facts=[...rolesInProjects.map(value=>({value,label:en?'Project contribution':'Kontribusi proyek'})),...(experience?[{value:textValue(experience.data,'organization')||experience.title,label:en?'Experience':'Pengalaman'}]:[])];
 if(!facts.length&&technologies.length)facts.push({value:technologies.slice(0,3).join(' / '),label:en?'Used in my work':'Digunakan dalam karya'});
 const source=[profile.headline,profile.summary,...published.map(item=>item.title+' '+JSON.stringify(item.data))].join(' ');
 const roles:string[]=[];if(profile.headline)roles.push(/full[ -]?stack/i.test(profile.headline)?'Full Stack Developer':profile.headline);
 if(/machine learning|\bml\b|truncated.?svd|k.?means/i.test(source))roles.push('ML Engineer');
 if(/computer vision|\byolo|acnescan/i.test(source))roles.push('Computer Vision');
 return {technologies,roles:[...new Set(roles)],coordinates:/\bbandung\b/i.test(profile.location)?'6.9175° S / 107.6191° E':undefined,
  facts};
}
