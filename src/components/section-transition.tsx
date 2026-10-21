import type {CSSProperties} from 'react';
const surfaces={
 home:['black','black'],projects:['white','gray1'],about:['gray1','gray1'],
 journey:['gray1','gray1'],skills:['gray1','gray1'],background:['white','black'],
 certificates:['black','black'],services:['white','black'],playground:['gray1','gray1'],
 contact:['black','black'],page:['white','gray1'],footer:['gray1','gray1'],
} as const;
export type SectionSurface=keyof typeof surfaces;
/** Separate color field keeps gradients outside text, images and interactive controls. */
export function SectionTransition({from,to}:{from:SectionSurface;to:SectionSurface}){
 const start=surfaces[from],end=surfaces[to];
 return <div className="section-transition" aria-hidden="true" data-from={from} data-to={to} data-light-match={start[0]===end[0]} data-dark-match={start[1]===end[1]} style={{
  '--blend-from-light':`var(--${start[0]})`,'--blend-to-light':`var(--${end[0]})`,
  '--blend-from-dark':`var(--${start[1]})`,'--blend-to-dark':`var(--${end[1]})`,
 } as CSSProperties}/>;
}
