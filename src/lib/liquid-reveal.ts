export function coverRect(sw:number,sh:number,w:number,h:number){
 const scale=Math.max(w/Math.max(sw,1),h/Math.max(sh,1));
 return {x:(w-sw*scale)/2,y:(h-sh*scale)/2,width:sw*scale,height:sh*scale};
}
export function brushPoints(from:{x:number;y:number}|null,to:{x:number;y:number},radius:number){
 const start=from||to,n=Math.max(1,Math.min(60,Math.ceil(Math.hypot(to.x-start.x,to.y-start.y)/Math.max(radius*.3,1))));
 return Array.from({length:n},(_,i)=>({x:start.x+(to.x-start.x)*(i+1)/n,y:start.y+(to.y-start.y)*(i+1)/n}));
}
