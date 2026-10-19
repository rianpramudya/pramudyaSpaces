export async function refreshWorkspace<T>(load:()=>Promise<T>,replace:(content:T)=>void,setStale:(stale:boolean)=>void){
 try{const content=await load();replace(content);setStale(false);}catch(error){setStale(true);throw error;}
}
