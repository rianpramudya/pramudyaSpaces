import {ArrowUpRight,Download} from 'lucide-react';
import type {Profile,CareerDocument} from '@/lib/model';
import {mediaURL} from '@/lib/client-api';
import {heroIdentity} from '@/lib/hero-identity';
import {PortraitAtelier} from './portrait-atelier';
export function AboutProfile({profile,cv,en}:{profile:Profile;cv?:CareerDocument;en:boolean}){
 const identity=heroIdentity(profile.name);
 const paragraphs=profile.summary.trim().split(/\n\s*\n/).filter(Boolean);
 return <section id="about" className="about-section page-width" data-experience="portrait-atelier" aria-labelledby="about-title">
  <header className="about-masthead"><div><p className="about-kicker">{en?'The person behind the work':'Di balik karya'}</p><h2 id="about-title">{en?'About':'Tentang'}<span>{en?'me.':'saya.'}</span></h2></div><a className="text-button about-work-link" href="#projects">{en?'Get to know my work':'Kenali lewat karya saya'}<ArrowUpRight size={18}/></a></header>
  <div className="about-composition">
   <PortraitAtelier key={profile.photo} photo={profile.photo?mediaURL(profile.photo):''} alt={profile.photo_alt||profile.name} name={profile.name} initials={identity.initials} en={en}/>
   <div className="about-reading">
    {profile.headline&&<h3 className="about-focus">{profile.headline}</h3>}
    <div className="about-biography">{paragraphs.length?paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>):<p>{en?'The profile is being prepared. Published work and experience will appear here.':'Profil sedang disiapkan. Karya dan pengalaman yang diterbitkan akan tampil di sini.'}</p>}</div>
    <div className="about-actions">{cv&&<a className="button primary" href={`${mediaURL(cv.path)}?download=1`}><Download size={17}/>{en?'Download CV':'Unduh CV'}<span className="button-meta">PDF</span></a>}<a className={`button ${cv?'':'primary'}`} href="#contact">{en?'Get in touch':'Hubungi'}<ArrowUpRight size={17}/></a></div>
   </div>
  </div>
 </section>;
}
