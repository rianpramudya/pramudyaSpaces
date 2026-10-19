type GuestbookUser={app_metadata?:{providers?:unknown;provider?:unknown};user_metadata?:Record<string,unknown>};
export function canWriteGuestbook(user:GuestbookUser|null,owner:boolean){
 if(!user)return false;
 const providers=user.app_metadata?.providers;
 return owner||(Array.isArray(providers)&&providers.some(p=>p==='github'||p==='google'))||['github','google'].includes(String(user.app_metadata?.provider||''));
}
export function guestbookName(user:GuestbookUser,owner:boolean,ownerName:string){
 const metadata=user.user_metadata||{};
 return String((owner&&ownerName.trim())||metadata.full_name||metadata.user_name||(owner?'Admin':'Pengunjung')).slice(0,100);
}
