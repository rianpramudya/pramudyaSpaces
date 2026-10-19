const loopback=(host:string)=>['localhost','127.0.0.1','[::1]'].includes(host);
export function allowedOrigin(origin:string|null,requestURL:string,siteURL?:string){
 if(!origin)return true;
 try{
  const source=new URL(origin),request=new URL(requestURL),configured=new URL(siteURL||requestURL);
  if(source.origin===configured.origin)return true;
  // Local previews may use a different port; never extend this exception to a deployed site.
  return loopback(configured.hostname)&&loopback(request.hostname)&&loopback(source.hostname)&&source.protocol===request.protocol&&source.port===request.port;
 }catch{return false;}
}
