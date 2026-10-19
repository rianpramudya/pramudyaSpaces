export type Body={x:number;y:number;width:number;height:number;vx:number;vy:number};
const clamp=(n:number,min:number,max:number)=>Math.min(Math.max(min,max),Math.max(min,n));
const columns=(width:number)=>width<520?1:width<800?2:3;
export function arenaHeight(count:number,width:number){return Math.max(width<520?185:210,Math.ceil(Math.min(count,6)/columns(width))*62+20);}
export function createBodies(labels:string[],width:number,height:number):Body[]{
 return labels.slice(0,6).map((label,i)=>{const w=Math.min(Math.max(90,label.length*9+42),Math.min(250,width/columns(width)-12));return {x:clamp((i%columns(width))*(width/columns(width))+6,0,width-w),y:clamp(10+Math.floor(i/columns(width))*62,0,height-46),width:w,height:46,vx:(i%2?1:-1)*12,vy:0};});
}
export function placeBody(bodies:Body[],index:number,x:number,y:number,width:number,height:number){return bodies.map((b,i)=>i===index?{...b,x:clamp(x,0,width-b.width),y:clamp(y,0,height-b.height),vx:0,vy:0}:b);}
export function stepBodies(bodies:Body[],width:number,height:number,elapsed:number,held:number|null):Body[]{
 const dt=Math.min(elapsed,1/30);const next=bodies.map((body,i)=>{
  if(i===held)return {...body};const b={...body};b.vy+=700*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.x<0||b.x+b.width>width)b.vx*=-.45;
  if(b.y+b.height>=height){b.vy=Math.abs(b.vy)<24?0:-b.vy*.28;b.vx*=.9;}
  b.x=clamp(b.x,0,width-b.width);b.y=clamp(b.y,0,height-b.height);return b;
 });
 for(let pass=0;pass<6;pass++)for(let i=0;i<next.length;i++)for(let j=i+1;j<next.length;j++){
  const a=next[i],b=next[j];const ox=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x);const oy=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);
  if(ox<=0||oy<=0)continue;
  if(ox<oy){const sign=a.x+a.width/2<b.x+b.width/2?-1:1;const portion=i===held?0:j===held?1:.5;a.x+=sign*(ox+.1)*portion;b.x-=sign*(ox+.1)*(1-portion);a.vx*=.4;b.vx*=.4;}
  else{const upper=a.y+a.height/2<b.y+b.height/2?a:b;const lower=upper===a?b:a;const upperIndex=upper===a?i:j;if(upperIndex!==held){upper.y=lower.y-upper.height-.05;upper.vy=0;upper.vx*=.9;}}
  for(const body of [a,b]){body.x=clamp(body.x,0,width-body.width);body.y=clamp(body.y,0,height-body.height);}
 }
 return next;
}
export function runnerPosition(seconds:number,width:number,size:number){const span=Math.max(0,width-size);if(!span)return {x:0,direction:1};const distance=(Math.max(0,seconds)*70)%(span*2);return {x:distance<=span?distance:span*2-distance,direction:distance<span?1:-1};}
