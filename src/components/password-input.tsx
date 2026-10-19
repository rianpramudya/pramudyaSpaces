'use client';
import { useState,type InputHTMLAttributes } from 'react';
import { Eye,EyeOff } from 'lucide-react';
export function PasswordInput({label,hint,...props}:InputHTMLAttributes<HTMLInputElement>&{label:string;hint?:string}){
 const [visible,setVisible]=useState(false);
 return <label>{label}<div className="password-input"><input {...props} type={visible?'text':'password'}/><button type="button" className="icon-button" aria-label={visible?'Sembunyikan password':'Tampilkan password'} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>{hint&&<span className="form-help">{hint}</span>}</label>;
}
