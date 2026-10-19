import { z } from 'zod';
export const adminMessageQuerySchema=z.object({page:z.coerce.number().int().min(0).max(100000).default(0),search:z.string().trim().max(200).default(''),status:z.enum(['all','new','read','archived']).default('all')});
export function messageSearchFilter(search:string,guestbook:boolean){
 const pattern=JSON.stringify(`%${search.replace(/[\\%_]/g,'\\$&')}%`);
 return (guestbook?['name','body']:['name','subject','message']).map(column=>`${column}.ilike.${pattern}`).join(',');
}
