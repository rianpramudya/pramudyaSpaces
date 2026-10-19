export function pointerTilt(x:number,y:number,width:number,height:number){
 if(width<=0||height<=0)return {x:0,y:0};
 const clamp=(v:number)=>Math.max(-1,Math.min(1,v));
 return {x:(-clamp(y/height*2-1)*8)||0,y:clamp(x/width*2-1)*10};
}
export function shouldAnimateSpatial(reduced:boolean,enabled:boolean,visible:boolean,documentVisible:boolean){return !reduced&&enabled&&visible&&documentVisible;}
