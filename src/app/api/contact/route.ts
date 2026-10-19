import { api,HttpError,rateLimit,readJson } from '@/lib/http';
import { serviceClient } from '@/lib/supabase';
import { contactSchema } from '@/lib/validation';
export async function POST(request:Request){return api(request,async()=>{
 const input=contactSchema.parse(await readJson(request));if(input.website)return {ok:true};
 await rateLimit(request,'contact',5,3600);
 const {website,...message}=input;const {error}=await serviceClient().from('inbox').insert(message);
 if(error)throw new HttpError(503,'Pesan belum tersimpan. Silakan coba lagi.');
 // Inbox persistence is the success criterion; optional email failure must not trigger duplicate submissions.
 if(process.env.RESEND_API_KEY&&process.env.CONTACT_NOTIFICATION_TO&&process.env.CONTACT_NOTIFICATION_FROM){
  try{await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.CONTACT_NOTIFICATION_FROM,to:process.env.CONTACT_NOTIFICATION_TO,subject:`Pesan portfolio: ${message.subject}`,text:`${message.name} <${message.email}>\n\n${message.message}`}),signal:AbortSignal.timeout(5000)});}catch{/* Message remains in Inbox. */}
 }
 return {ok:true};
});}
