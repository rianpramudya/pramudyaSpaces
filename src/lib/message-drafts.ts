export function applyMessageChange<T extends {id:string;reply?:string;status?:string}>(messages:T[],change:{id:string;remove?:boolean;reply?:string;status?:string}){
 if(change.remove)return messages.filter(m=>m.id!==change.id);
 return messages.map(m=>m.id===change.id?{...m,...(change.reply!==undefined?{reply:change.reply.trim()}:{}),...(change.status?{status:change.status}:{})}:m);
}
