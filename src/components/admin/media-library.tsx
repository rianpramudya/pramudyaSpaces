'use client';
import { useEffect,useState } from 'react';
import { Image,Trash2,ExternalLink } from 'lucide-react';
import { requestJSON,mediaURL } from '@/lib/client-api';
type Media={path:string;name:string;mime:string;size:number;created_at:string};
export function MediaLibrary({notify}:{notify:(m:string)=>void}){
 const [media,setMedia]=useState<Media[]>([]);const [error,setError]=useState('');async function load(){try{const result=await requestJSON<{media:Media[]}>('/api/admin/media');setMedia(result.media);}catch(err){setError((err as Error).message);}}
 useEffect(()=>{void load();},[]);
 return <><div className="admin-panel"><h2>Pustaka media</h2><p>Unggah melalui form Profil, konten, atau Dokumen. Pilih kembali berkas tersimpan tanpa mengunggah ulang. Media yang masih digunakan tidak dapat dihapus.</p></div>{error&&<p>{error}</p>}<div className="table-wrap"><table className="admin-table"><thead><tr><th>Media</th><th>Ukuran</th><th>Aksi</th></tr></thead><tbody>{media.map(m=><tr key={m.path}><td><div className="row-actions">{m.mime.startsWith('image/')&&<img src={mediaURL(m.path)} alt="Pratinjau media" style={{width:45,height:36,objectFit:'cover',borderRadius:4}}/>}<span className="table-title">{m.name}</span></div></td><td>{Math.round(m.size/1024)} KB</td><td><div className="row-actions"><a className="icon-button small" href={mediaURL(m.path)} target="_blank" title="Buka media"><ExternalLink size={16}/></a><button className="icon-button small danger-button" title="Hapus media" onClick={async()=>{if(!confirm('Hapus media ini secara permanen?'))return;try{await requestJSON('/api/admin/media',{path:m.path},'DELETE');await load();notify('Media dihapus.');}catch(err){notify((err as Error).message);}}}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>{!media.length&&<div className="admin-empty"><Image/><p>Belum ada media.</p></div>}</div></>;
}
