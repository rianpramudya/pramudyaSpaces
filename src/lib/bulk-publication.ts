import { z } from 'zod';
export const bulkPublicationSchema=z.object({ids:z.array(z.uuid()).min(1).max(500).transform(ids=>[...new Set(ids)]),published:z.boolean()});
type Query={in:(column:string,ids:string[])=>Query;eq:(column:string,value:string)=>Query;select:(columns:string)=>PromiseLike<{data:{id:string}[]|null;error:{message:string}|null}>};
export async function updatePublication(db:{from:(table:string)=>{update:(value:Record<string,unknown>)=>Query}},table:'entries'|'documents',ids:string[],published:boolean,kind?:string){
 let query=db.from(table).update(table==='entries'?{published,updated_at:new Date().toISOString()}:{published}).in('id',ids);
 if(kind)query=query.eq('kind',kind);
 const {data,error}=await query.select('id');if(error)throw new Error(error.message);return data?.length||0;
}
