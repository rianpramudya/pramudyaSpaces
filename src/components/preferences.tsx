'use client';
import { useEffect,useState } from 'react';
export function usePreferences(){
 const [language,setLanguage]=useState<'id'|'en'>('id');const [theme,setTheme]=useState<'light'|'dark'>('light');const [ready,setReady]=useState(false);
 useEffect(()=>{
  let savedLanguage:string|null=null;let savedTheme:string|null=null;try{savedLanguage=localStorage.getItem('portfolio-language');savedTheme=localStorage.getItem('portfolio-theme');}catch{}
  if(savedLanguage==='en')setLanguage('en');
  setTheme(savedTheme==='dark'||!savedTheme&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');setReady(true);
 },[]);
 useEffect(()=>{if(!ready)return;document.documentElement.dataset.theme=theme;try{localStorage.setItem('portfolio-theme',theme);}catch{}},[theme,ready]);
 useEffect(()=>{if(!ready)return;document.documentElement.lang=language;try{localStorage.setItem('portfolio-language',language);}catch{}},[language,ready]);
 return {language,setLanguage,theme,setTheme};
}
