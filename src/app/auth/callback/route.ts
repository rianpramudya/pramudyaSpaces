import { NextResponse } from 'next/server';
import { sessionClient } from '@/lib/supabase';
import { authSite } from '@/lib/auth-policy';
import { safeReturnPath } from '@/lib/content';
export async function GET(request:Request){
 const url=new URL(request.url);const code=url.searchParams.get('code');
 const site=authSite(request.url,process.env.SITE_URL||url.origin,request.headers.get('host')||undefined);
 if(code){const client=await sessionClient();const {error}=await client.auth.exchangeCodeForSession(code);
  if(!error)return NextResponse.redirect(new URL(safeReturnPath(url.searchParams.get('next')),site));
 }
 return NextResponse.redirect(new URL('/?auth_error=1',site));
}
