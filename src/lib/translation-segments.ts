import { sourceFingerprint,translationInput,translatePublicContent } from './content';
import type { PublicContent } from './model';
export type TranslationRow={id:string;source_hash:string;automatic:unknown;override:unknown|null};
export function translationSegments(content:PublicContent){
 const input=translationInput(content);const segments:{id:string;hash:string;value:unknown}[]=[];
 for(const key of ['headline','summary','photo_alt'] as const){if(!input.profile[key])continue;const value={profile:{[key]:input.profile[key]}};segments.push({id:`en:profile:${key}`,hash:sourceFingerprint(value),value});}
 for(const [key,text] of Object.entries(input.profile.section_copy)){if(!text)continue;const value={profile:{section_copy:{[key]:text}}};segments.push({id:`en:copy:${key}`,hash:sourceFingerprint(value),value});}
 for(const record of input.records){const value={records:[record]};segments.push({id:`en:entry:${record.id}`,hash:sourceFingerprint(value),value});}
 return segments;
}
export function applyTranslationRows(content:PublicContent,rows:TranslationRow[]){
 let result=content;
 for(const segment of translationSegments(content)){const row=rows.find(r=>r.id===segment.id&&r.source_hash===segment.hash);if(row)result=translatePublicContent(result,row.override??row.automatic);}
 return result;
}
