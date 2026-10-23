'use client';
import { useEffect,useRef,type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Drawer({title,subtitle,onClose,children}:{title:string;subtitle?:string;onClose:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current;const focus=document.activeElement as HTMLElement;dialog?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return ()=>{dialog?.close();document.body.style.overflow=old;focus?.focus();};},[]);
 return <dialog ref={ref} className="drawer" aria-labelledby="drawer-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current){const rect=ref.current.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)onClose();}}}>
  <div className="drawer-heading"><div><p className="muted">{subtitle}</p><h2 id="drawer-title">{title}</h2></div><button className="icon-button" aria-label="Tutup / Close" onClick={onClose}><X/></button></div>{children}
 </dialog>;
}
