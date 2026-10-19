import {textValue,listValue,type Entry} from './model';
export type ProjectSort='newest'|'oldest'|'title';
export function projectDate(value:string):number|null{
 if(!/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value))return null;
 const [year,month=1,day=1]=value.split('-').map(Number);if(year<1000||year>9999)return null;
 const time=Date.UTC(year,month-1,day),date=new Date(time);
 return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day?time:null;
}
export function catalogProjects(entries:Entry[],{sort='newest',query='',technology=''}:{sort?:ProjectSort;query?:string;technology?:string}={}){
 const search=query.trim().toLocaleLowerCase();
 return entries.filter(e=>e.kind==='project'&&e.published&&(!search||`${e.title} ${textValue(e.data,'description')} ${listValue(e.data,'technologies').join(' ')}`.toLocaleLowerCase().includes(search))&&(!technology||listValue(e.data,'technologies').includes(technology))).sort((a,b)=>{
  if(sort==='title')return a.title.localeCompare(b.title)||a.id.localeCompare(b.id);
  const left=projectDate(textValue(a.data,'date')),right=projectDate(textValue(b.data,'date'));
  if(left===null&&right!==null)return 1;if(left!==null&&right===null)return -1;
  return left!==null&&right!==null&&left!==right?(sort==='oldest'?left-right:right-left):a.position-b.position||a.id.localeCompare(b.id);
 });
}
export function displayProjectDate(value:string,en:boolean){const time=projectDate(value);if(time===null)return en?'Date not set':'Tanggal belum diisi';return new Intl.DateTimeFormat(en?'en-GB':'id-ID',{year:'numeric',...(value.length>4?{month:'short' as const}:{}),timeZone:'UTC'}).format(time);}
