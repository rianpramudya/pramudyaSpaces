import { oauthProviders } from '@/lib/oauth-providers';
import { authSite } from '@/lib/auth-policy';
import { api } from '@/lib/http';
import { requireOwner,serviceClient } from '@/lib/supabase';
export async function GET(request:Request){return api(request,async()=>{
 await requireOwner();const providers=await oauthProviders();
 const {count}=await serviceClient().from('inbox').select('*',{count:'exact',head:true}).eq('status','new');
 return {database:true,gemini:Boolean(process.env.GEMINI_API_KEY),google:providers.google??null,github:providers.github??null,emailNotifications:Boolean(process.env.RESEND_API_KEY&&process.env.CONTACT_NOTIFICATION_TO&&process.env.CONTACT_NOTIFICATION_FROM),newMessages:count||0,oauthSetup:{siteURL:authSite(request.url,process.env.SITE_URL||new URL(request.url).origin,request.headers.get('host')||undefined),callbackURL:`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,projectRef:new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]}};
});}
