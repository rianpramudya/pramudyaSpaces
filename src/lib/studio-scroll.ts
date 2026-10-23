/** Bounded visual travel; document scrolling itself stays native. */
export function chapterTravel(top:number,height:number,viewport:number){
 const progress=Math.max(0,Math.min(1,(viewport-top)/Math.max(1,viewport+height)));
 return {shift:(progress-.5)*64,hero:Math.max(0,Math.min(1,-top/Math.max(1,height)))};
}
export function dampScroll(current:number,target:number,elapsed:number){
 return current+(target-current)*(1-Math.exp(-Math.min(64,Math.max(0,elapsed))/95));
}
