import {selectedProjects} from './project-relations';
import {type Entry,textValue,listValue} from './model';
export function hasConceptMedia(entry:Entry){return /\bdummy\b|bukan screenshot|not (?:an? )?(?:actual|real) screenshot/i.test(textValue(entry.data,'alt'));}
const topics=['web','website','dashboard','api','data','learning','vision','rekomendasi','recommendation','logistik','logistics'];
export function serviceProjects(service:Entry,projects:Entry[]){
 const selected=selectedProjects(service,projects);if(selected!==undefined)return selected;
 const tokens=(value:string)=>new Set(value.toLowerCase().match(/[a-z]+/g)||[]);
 const terms=tokens(service.title+' '+textValue(service.data,'description'));
 if(terms.has('ai')){terms.add('learning');terms.add('vision');}
 if(terms.has('website'))terms.add('web');
 const wanted=topics.filter(t=>terms.has(t));
 return projects.filter(p=>p.published&&p.kind==='project'&&wanted.some(t=>tokens([p.title,textValue(p.data,'description'),textValue(p.data,'role'),...listValue(p.data,'technologies'),...listValue(p.data,'bullets')].join(' ')).has(t)));
}
