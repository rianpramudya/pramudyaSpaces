import { listValue,textValue,type Profile,type Entry } from './model';
export type CareerSection={title:string;items:{title:string;meta:string;lines:string[];url:string}[]};
export function buildCareerSections(profile:Profile,records:Entry[]):CareerSection[]{
 const sorted=[...records].sort((a,b)=>a.position-b.position);
 const item=(e:Entry)=>({title:e.title,meta:[textValue(e.data,'role'),textValue(e.data,'organization'),textValue(e.data,'issuer'),textValue(e.data,'degree'),textValue(e.data,'gpa'),textValue(e.data,'level'),[textValue(e.data,'start'),e.data.current?'Present':textValue(e.data,'end')].filter(Boolean).join(' – '),textValue(e.data,'date')].filter(Boolean).join(' | '),lines:[textValue(e.data,'description'),...listValue(e.data,'bullets'),textValue(e.data,'context'),textValue(e.data,'result'),textValue(e.data,'credential')?`Credential ID: ${textValue(e.data,'credential')}`:''].filter(Boolean),url:textValue(e.data,'repository')||textValue(e.data,'url')});
 const sections:CareerSection[]=[];
 if(profile.summary)sections.push({title:'PROFESSIONAL SUMMARY',items:[{title:'',meta:'',lines:[profile.summary],url:''}]});
 const skills=sorted.filter(e=>e.kind==='skill');
 if(skills.length){const groups=new Map<string,string[]>();for(const s of skills){const key=textValue(s.data,'category')||'Skills';groups.set(key,[...(groups.get(key)||[]),s.title]);}sections.push({title:'SKILLS & COMPETENCIES',items:[...groups].map(([category,names])=>({title:'',meta:'',lines:[`${category}: ${names.join(', ')}`],url:''}))});}
 for(const [title,filter] of [
  ['WORK EXPERIENCE',(e:Entry)=>e.kind==='experience'&&e.data.type!=='organization'],
  ['PROJECTS',(e:Entry)=>e.kind==='project'],['EDUCATION',(e:Entry)=>e.kind==='education'],['CERTIFICATIONS',(e:Entry)=>e.kind==='certificate'],
  ['ORGANIZATIONAL EXPERIENCE',(e:Entry)=>e.kind==='experience'&&e.data.type==='organization'],['ACHIEVEMENTS',(e:Entry)=>e.kind==='achievement'],['LANGUAGES',(e:Entry)=>e.kind==='language'],
 ] as const){const entries=sorted.filter(filter);if(entries.length)sections.push({title,items:entries.map(item)});}
 return sections;
}
