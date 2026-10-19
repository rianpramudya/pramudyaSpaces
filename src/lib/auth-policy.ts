export function ownerResetMatches(requested:string,currentOwnerEmail:string|undefined){return Boolean(currentOwnerEmail)&&requested.toLowerCase()===currentOwnerEmail!.toLowerCase();}
export function oauthOutcome(search:string){const params=new URLSearchParams(search);return {openGuestbook:params.has('guestbook')||params.has('auth_error'),authError:params.has('auth_error')};}
export function authSite(requestURL:string,siteURL:string,requestHost?:string){
 const request=new URL(requestURL),site=new URL(siteURL);
 const local=(host:string)=>['localhost','127.0.0.1','[::1]'].includes(host);
 if(local(request.hostname)&&local(site.hostname)){
  if(requestHost){try{const host=new URL(`${request.protocol}//${requestHost}`);if(local(host.hostname)&&host.port===request.port)return host.origin;}catch{/* Fall back to the parsed request URL. */}}
  return request.origin;
 }
 return site.origin;
}
