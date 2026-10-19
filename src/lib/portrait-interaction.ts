/** Horizontal touch controls rotation; vertical/ambiguous intent belongs to page scrolling. */
export function portraitGesture(dx:number,dy:number){if(Math.hypot(dx,dy)<8)return 'pending';return Math.abs(dx)>Math.abs(dy)*1.15?'horizontal':'vertical';}
export function portraitDrag(yaw:number,pitch:number,dx:number,dy:number,width:number,height:number,allowPitch:boolean){return {yaw:yaw+dx/Math.max(1,width)*Math.PI*1.6,pitch:allowPitch?Math.max(-.28,Math.min(.28,pitch+dy/Math.max(1,height)*.65)):pitch};}

export function portraitPose(x=0,y=0,yaw=0,pitch=0){const clamp=(n:number)=>Math.max(-1,Math.min(1,n));return {x:-.04+Math.max(-.28,Math.min(.28,pitch))-clamp(y)*.12,y:-.16+yaw+clamp(x)*.35,z:-.018};}
