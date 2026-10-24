import type { Entry, PublicContent } from './model';

const topics: [RegExp,string][] = [
  [/\b(proyek|project|karya|portfolio|portofolio)\b/i,'project'],
  [/\b(skill|skills|kompetensi|keahlian|teknologi|technologies|tools)\b/i,'skill'],
  [/\b(pengalaman|experience|pekerjaan|karier|career)\b/i,'experience'],
  [/\b(pendidikan|education|kuliah|universitas|university)\b/i,'education'],
  [/\b(sertifikat|certificate|certification|sertifikasi)\b/i,'certificate'],
  [/\b(layanan|service|services)\b/i,'service'],
  [/\b(bahasa|language|languages)\b/i,'language'],
  [/\b(prestasi|achievement|achievements)\b/i,'achievement'],
];
const fields = ['description','role','organization','technologies','context','result','category','issuer','date','degree','gpa','level','start','end','current','bullets'] as const;
function excerpt(value: string, limit: number) {
  return value.length > limit ? `${value.slice(0,limit-1)}…` : value;
}
function compactEntry(entry: Entry) {
  const data: Record<string,unknown> = {};
  for (const key of fields) {
    const value=entry.data[key];
    if (typeof value==='string') data[key]=excerpt(value,key==='description'||key==='context'||key==='result'?240:120);
    else if (typeof value==='boolean') data[key]=value;
    else if (Array.isArray(value)) data[key]=value.filter((v):v is string=>typeof v==='string').slice(0,key==='bullets'?2:8).map(v=>excerpt(v,80));
  }
  return {kind:entry.kind,title:excerpt(entry.title,240),...(entry.kind==='project'?{url:`/projects/${entry.id}`}:{section:entry.kind==='skill'?'#skills':undefined}),data};
}

/** Select only public, relevant excerpts. Budget is characters, not a provider token estimate. */
export function chatFacts(content: PublicContent, question: string, previousQuestion='') {
  const p=content.profile;
  const profile=p.published?{name:p.name,headline:p.headline,summary:excerpt(p.summary,500),location:p.location,status:p.status,
    ...(p.show_email?{email:p.email}:{}),...(p.show_phone?{phone:p.phone}:{}),
  }:{name:'',summary:''};
  const visible=content.records.filter(e=>e.published);
  const query=`${question} ${previousQuestion}`;
  // Prefer the current topic; prior questions only help resolve follow-ups.
  const currentTopics=topics.filter(([pattern])=>pattern.test(question)).map(([,kind])=>kind);
  const kinds=currentTopics.length?currentTopics:topics.filter(([pattern])=>pattern.test(previousQuestion)).map(([,kind])=>kind);
  const words=[...new Set(query.toLowerCase().match(/[\p{L}\p{N}+#.-]{3,}/gu)||[])];
  const ranked=visible.map((entry,index)=>{
    const compact=compactEntry(entry);
    const title=entry.title.toLowerCase();
    const text=JSON.stringify(compact.data).toLowerCase();
    const score=(kinds.includes(entry.kind)?10:0)+words.reduce((sum,word)=>sum+(title.includes(word)?4:text.includes(word)?1:0),0);
    return {compact,score,index};
  }).sort((a,b)=>b.score-a.score||a.index-b.index);
  const facts={profile,totals:Object.fromEntries(topics.map(([,kind])=>[kind,visible.filter(e=>e.kind===kind).length])),records:[] as ReturnType<typeof compactEntry>[]};
  for(const {compact} of ranked){
    if(facts.records.length===8)break;
    facts.records.push(compact);
    if(JSON.stringify(facts).length>4500)facts.records.pop();
  }
  return facts;
}
