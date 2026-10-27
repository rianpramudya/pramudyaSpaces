'use client';
import {useId,useState} from 'react';
import {ArrowRight,Plus} from 'lucide-react';
import {type Entry,textValue,listValue} from '@/lib/model';
import {selectedProjects} from '@/lib/project-relations';
import {SectionHeading} from '@/components/ui/section-heading';
import {ProjectCover} from '@/components/projects/project-cover';
import {RelatedWorkLinks} from '@/components/related-work-links';
import {RelatedCertificates} from '@/components/related-certificates';
export function ExperienceSection({experiences,projects,certificates=[],title,description,en}:{
  experiences:Entry[];projects:Entry[];certificates?:Entry[];title:string;description?:string;en:boolean;
}){
  const uid=useId(),[selection,setSelection]=useState('');
  const current=Math.max(0,experiences.findIndex(entry=>entry.id===selection));
  const period=(entry:Entry)=>[textValue(entry.data,'start'),entry.data.current?(en?'Present':'Sekarang'):textValue(entry.data,'end')].filter(Boolean).join(' — ');
  if(!experiences.length)return null;
  return <section id="journey" className="studio-journey studio-shell">
    <SectionHeading label={en?'Experience':'Pengalaman'} title={title} description={description}/>
    <div className="experience-spread" data-reveal>
      <nav className="experience-index" aria-label={en?'Choose an experience':'Pilih pengalaman'}>
        {experiences.map((entry,index)=><button key={entry.id} type="button" className="experience-choice"
          id={`${uid}-choice-${index}`} aria-controls={`${uid}-panel-${index}`} aria-pressed={index===current}
          onClick={()=>setSelection(entry.id)}>
          <span className="experience-choice-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
          <span><strong>{textValue(entry.data,'organization')||entry.title}</strong><small>{period(entry)}</small></span>
          <ArrowRight size={16} aria-hidden="true"/>
        </button>)}
      </nav>
      <div className="experience-reading">
        {experiences.map((entry,index)=>{
          const organization=textValue(entry.data,'organization'),proof=selectedProjects(entry,projects)?.[0];
          return <article key={entry.id} className="experience-chapter" id={`${uid}-panel-${index}`}
            aria-labelledby={`${uid}-title-${index}`} hidden={index!==current}>
            <header className="experience-opening">
              <div>
                <p className="studio-eyebrow">{period(entry)}</p>
                <h3 id={`${uid}-title-${index}`}>{organization||entry.title}</h3>
                {organization&&<p className="experience-role">{entry.title}</p>}
              </div>
              <span className="experience-page-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>
            </header>
            <div className="experience-body" data-proof={!!proof}>
              <div className="experience-narrative">
                {textValue(entry.data,'description')&&<p>{textValue(entry.data,'description')}</p>}
                {listValue(entry.data,'bullets').length>0&&<details className="experience-contributions">
                  <summary>{en?'Explore contributions':'Lihat kontribusi'}<Plus size={17} aria-hidden="true"/></summary>
                  <ul>{listValue(entry.data,'bullets').map((item,i)=><li key={i}>{item}</li>)}</ul>
                </details>}
                <RelatedWorkLinks entry={entry} projects={projects} en={en}/>
                <RelatedCertificates entry={entry} certificates={certificates} en={en}/>
              </div>
              {proof&&<figure className="experience-proof">
                <div><ProjectCover entry={proof} en={en}/></div>
                <figcaption>{en?'From this experience':'Dari pengalaman ini'}<strong>{proof.title}</strong></figcaption>
              </figure>}
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
