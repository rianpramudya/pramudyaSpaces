/** Tune the atmosphere here. Palette is inherited from the public sage/off-white system. */
export const heroSceneConfig={glowIntensity:.78,parallaxStrength:1,particleCount:24} as const;
import {type Profile,type Entry,listValue} from './model';
export function heroPointer(x:number,y:number,strength:number=heroSceneConfig.parallaxStrength){const limit=Math.PI/15;const clamp=(n:number)=>Math.max(-1,Math.min(1,n));return {x:clamp(y*strength)*limit,y:clamp(x*strength)*limit};}
export function heroQuality(width:number,memory?:number,reduced=false,cores?:number){const webgl=width>=768&&!reduced&&(memory===undefined||memory>=4)&&(cores===undefined||cores>2);return {webgl,animate:webgl};}
export function heroSceneData(profile:Profile,records:Entry[],en:boolean){
 const published=records.filter(item=>item.published),projects=published.filter(item=>item.kind==='project'),skills=published.filter(item=>item.kind==='skill');
 const technologies=[...new Set([...projects.flatMap(item=>listValue(item.data,'technologies')),...skills.map(item=>item.title)].filter(Boolean))].slice(0,5);
 const source=[profile.headline,profile.summary,...published.map(item=>item.title+' '+JSON.stringify(item.data))].join(' ');
 const roles:string[]=[];if(profile.headline)roles.push(/full[ -]?stack/i.test(profile.headline)?'Full Stack Developer':profile.headline);
 if(/machine learning|\bml\b|truncated.?svd|k.?means/i.test(source))roles.push('ML Engineer');
 if(/computer vision|\byolo|acnescan/i.test(source))roles.push('Computer Vision');
 return {technologies,roles:[...new Set(roles)],coordinates:/\bbandung\b/i.test(profile.location)?'6.9175° S / 107.6191° E':undefined,
  stats:[{value:projects.length,label:en?'Projects':'Proyek'},{value:skills.length,label:en?'Skills':'Kompetensi'},{value:published.filter(item=>item.kind==='certificate').length,label:en?'Certificates':'Sertifikat'}]};
}
