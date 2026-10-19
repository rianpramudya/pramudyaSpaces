'use client';
import { useEffect,useRef,useState } from 'react';
export function useSelection(ids:string[],scope:string){
 const [selected,setSelected]=useState<string[]>([]);const identity=ids.join('|');
 useEffect(()=>setSelected([]),[scope]);
 const visible=selected.filter(id=>ids.includes(id));
 useEffect(()=>setSelected(old=>old.filter(id=>ids.includes(id))),[identity]);
 return {selected:visible,clear:()=>setSelected([]),toggle:(id:string)=>setSelected(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]),all:ids.length>0&&visible.length===ids.length,some:visible.length>0&&visible.length<ids.length,toggleAll:()=>setSelected(visible.length===ids.length?[]:ids)};
}
export function SelectAll({checked,mixed,disabled,onChange}:{checked:boolean;mixed:boolean;disabled:boolean;onChange:()=>void}){
 const input=useRef<HTMLInputElement>(null);useEffect(()=>{if(input.current)input.current.indeterminate=mixed;},[mixed]);
 return <label className="selection-hit"><input ref={input} className="selection-checkbox" type="checkbox" checked={checked} disabled={disabled} aria-label="Pilih semua item yang ditampilkan" aria-checked={mixed?'mixed':checked} onChange={onChange}/></label>;
}
export function BulkActions({count,busy,onPublish,onClear,documents=false}:{count:number;busy:boolean;onPublish:(published:boolean)=>void;onClear:()=>void;documents?:boolean}){
 return <div className="bulk-actions" role="group" aria-label="Publikasi pilihan"><span aria-live="polite">{count} dipilih</span><div className="button-row"><button className="button primary" disabled={busy||!count} onClick={()=>onPublish(true)}>{busy?'Memproses…':'Terbitkan pilihan'}</button><button className="button" disabled={busy||!count} onClick={()=>onPublish(false)}>Jadikan draft</button><button className="text-button" disabled={busy||!count} onClick={onClear}>Batal pilih</button></div>{documents&&<p className="form-help">Dokumen terbit dapat diakses pengunjung, termasuk kontak yang tercantum di PDF.</p>}</div>;
}
