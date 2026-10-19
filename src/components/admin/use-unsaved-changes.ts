'use client';
import {useEffect} from 'react';
export function requestAdminExit(){return window.dispatchEvent(new Event('admin-before-exit',{cancelable:true}));}
export function installUnsavedGuard(dirty:boolean,busy=false){
  if(!dirty&&!busy)return;
  const currentURL=location.href,currentState=history.state;
  const confirmLeave=()=>!busy&&(!dirty||window.confirm('Perubahan belum disimpan. Tinggalkan form?'));
  const leave=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
  const exit=(event:Event)=>{if(!confirmLeave())event.preventDefault();};
  const historyNavigation=(event:PopStateEvent)=>{
   if(confirmLeave())return;
   event.stopImmediatePropagation();
   // Keep the mounted editor and its history state when a SPA Back/Forward is cancelled.
   history.pushState(currentState,'',currentURL);
  };
  const navigate=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=event.target instanceof Element?event.target.closest('a'):null;
   if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
   const destination=new URL(link.href,location.href);
   if(destination.pathname===location.pathname&&destination.search===location.search)return;
   if(!confirmLeave()){event.preventDefault();event.stopPropagation();}
  };
  window.addEventListener('beforeunload',leave);window.addEventListener('admin-before-exit',exit);window.addEventListener('popstate',historyNavigation,true);document.addEventListener('click',navigate,true);
  return()=>{window.removeEventListener('beforeunload',leave);window.removeEventListener('admin-before-exit',exit);window.removeEventListener('popstate',historyNavigation,true);document.removeEventListener('click',navigate,true);};
}
export function useUnsavedChanges(dirty:boolean,busy=false){
 useEffect(()=>installUnsavedGuard(dirty,busy),[dirty,busy]);
 return ()=>!busy&&(!dirty||window.confirm('Perubahan belum disimpan. Tutup form?'));
}
