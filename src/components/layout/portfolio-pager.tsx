import {ArrowLeft,ArrowRight} from 'lucide-react';
import {pageHref} from '@/lib/portfolio-pages';
export function PortfolioPager({nav,page,en}:{nav:string[][];page:string;en:boolean}){
 const index=nav.findIndex(([id])=>id===page),previous=nav[index-1],next=nav[index+1];
 return <footer className="portfolio-page-footer studio-shell">
  <nav className="portfolio-pager" aria-label={en?'Portfolio pages':'Halaman portofolio'}>
   <div>{previous&&<a href={pageHref(previous[0])} rel="prev"><ArrowLeft size={18} aria-hidden="true"/><span><small>{en?'Previous':'Sebelumnya'}</small>{previous[1]}</span></a>}</div>
   <p aria-live="polite"><span>{String(index+1).padStart(2,'0')} / {String(nav.length).padStart(2,'0')}</span><strong>{nav[index]?.[1]}</strong></p>
   <div>{next&&<a href={pageHref(next[0])} rel="next"><span><small>{en?'Next':'Berikutnya'}</small>{next[1]}</span><ArrowRight size={18} aria-hidden="true"/></a>}</div>
  </nav>
  <a className="portfolio-scroll-link" href={`/#${page}`}>{en?'View the scrolling website':'Lihat website versi scroll'} <ArrowRight size={14} aria-hidden="true"/></a>
 </footer>;
}
