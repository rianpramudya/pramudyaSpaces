type Point={x:number;y:number};
export function swipeDirection(start:Point,end:Point){const dx=start.x-end.x,dy=start.y-end.y;return Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)?(dx>0?1:-1):0;}
export function clampGalleryIndex(index:number,count:number){return Math.max(0,Math.min(index,Math.max(0,count-1)));}
