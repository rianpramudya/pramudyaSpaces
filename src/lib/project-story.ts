import {textValue,listValue} from './model';
export const RESULT_TODO='TODO: isi hasil terverifikasi';
function safeURL(value:string){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?value:'';}catch{return '';}}
/** CMS remains the source of truth. Missing evidence must never become an invented claim. */
export function projectStory(data:Record<string,unknown>){
 const context=textValue(data,'context'),description=textValue(data,'description'),rawResult=textValue(data,'result'),resultSource=safeURL(textValue(data,'result_source'));
 const problem=(context||description).split(/(?<=[.!?])\s+/)[0]||'TODO: isi masalah proyek';
 const links=[['Demo','url'],['Repository','repository'],['Paper','paper']].flatMap(([label,key])=>{const url=safeURL(textValue(data,key));return url?[{label,url}]:[];});
 return {problem,result:rawResult&&resultSource?rawResult:RESULT_TODO,authoredResult:rawResult,resultSource,missingResult:!rawResult||!resultSource,contributions:listValue(data,'bullets'),links};
}
