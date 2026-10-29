import './design-tokens.css';
import '../portfolio-mode.css';
import {notFound,redirect} from 'next/navigation';
import {getPublicContent} from '@/lib/repository';
import {publicPageMetadata,SEO_DESCRIPTION} from '@/lib/seo';
import {siteNavigation} from '@/lib/site-navigation';
import {resolvePortfolioPage} from '@/lib/portfolio-pages';
import {PagedPortfolio} from '@/components/paged-portfolio';
export const dynamic='force-dynamic';
// An alternate presentation of the same published content; canonical stays on home.
export const metadata=publicPageMetadata('/','Portofolio per Halaman — Rian Pramudya',SEO_DESCRIPTION);
export default async function PortfolioPages({searchParams}:{searchParams:Promise<{page?:string|string[]}>}){
  const params=await searchParams;
  if(Array.isArray(params.page))notFound();
  if(params.page==='playground')redirect('/#playground');
  const content=await getPublicContent();
  const page=resolvePortfolioPage(params.page,siteNavigation(content.records,false,'pages'));
  if(!page)notFound();
  return <PagedPortfolio initial={content} page={page}/>;
}
