'use client';
import {useEffect,useTransition,type MouseEvent} from 'react';
import {useRouter} from 'next/navigation';
import type {PublicContent} from '@/lib/model';
import {siteNavigation} from '@/lib/site-navigation';
import {pageForHash,pageHref,resolvePortfolioPage} from '@/lib/portfolio-pages';
import {Portfolio} from './portfolio';
export function PagedPortfolio({initial,page}:{initial:PublicContent;page:string}){
  const router=useRouter(),[pending,startTransition]=useTransition();
  const nav=siteNavigation(initial.records,false);
  useEffect(()=>{
    const target=pageForHash(location.hash,nav);
    if(target&&target!==page)router.replace(`${pageHref(target)}${location.hash}`);
  },[page,initial.records,router]);
  function navigate(event:MouseEvent<HTMLDivElement>){
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin||url.pathname!=='/portofolio')return;
    const target=pageForHash(url.hash,nav)||resolvePortfolioPage(url.searchParams.get('page')||undefined,nav);
    if(!target)return;
    if(target===page&&url.hash)return;
    event.preventDefault();
    if(target===page)return;
    startTransition(()=>router.push(`${pageHref(target)}${url.hash}`,{scroll:false}));
  }
  return <div onClickCapture={navigate} aria-busy={pending} data-page-pending={pending}>
    <Portfolio initial={initial} page={page}/>
  </div>;
}
