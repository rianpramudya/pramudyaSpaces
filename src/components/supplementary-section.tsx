import type {ReactNode} from 'react';
/** Native disclosure keeps CMS content available without giving every chapter equal visual weight. */
export function SupplementarySection({id,title,description,en,children,className=''}:{id:string;title:string;description?:string;en:boolean;children:ReactNode;className?:string}){
 return <section id={id} className={`page-section page-width competence-section supplementary-section ${className}`}><details data-section-disclosure="true"><summary><div><h2>{title}</h2>{description&&<p>{description}</p>}</div><span className="section-disclosure-label"><span>{en?'Explore':'Lihat selengkapnya'}</span><span className="section-disclosure-plus" aria-hidden="true">+</span></span></summary><div className="section-expansion">{children}</div></details></section>;
}
