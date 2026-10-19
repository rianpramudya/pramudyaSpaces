export async function requestJSON<T=Record<string,unknown>>(url:string,body?:unknown,method?:string):Promise<T>{
 const response=await fetch(url,{method:method||(body?'POST':'GET'),headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,cache:'no-store'});
 const result=await response.json();if(!response.ok)throw new Error(result.error||'Permintaan gagal.');return result as T;
}
export const mediaURL=(path:string)=>`/api/media/${path.split('/').map(encodeURIComponent).join('/')}`;
