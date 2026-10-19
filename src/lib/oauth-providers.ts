import 'server-only';
export async function oauthProviders():Promise<{google:boolean|null;github:boolean|null}>{
 try{
  const response=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,{headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!},signal:AbortSignal.timeout(5000),cache:'no-store'});
  if(response.ok){const settings=await response.json();return {google:Boolean(settings.external?.google),github:Boolean(settings.external?.github)};}
 }catch{/* An unavailable settings endpoint must not look like a configured provider. */}
 return {google:null,github:null};
}
