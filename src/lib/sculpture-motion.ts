export function sculptureScroll(top:number,height:number){return height>0?Math.max(0,Math.min(1,-top/height)):0;}
export function sculptureQuality(width:number,dpr:number,memory?:number){return {pixelRatio:Math.min(Math.max(1,dpr),width<768?1.25:1.75),segments:width<768?96:160,webgl:memory===undefined||memory>2};}

export function sculptureCameraDistance(variant:'hero'|'contact',progress:number,aspect=1.05){
 const bounded=Math.max(0,Math.min(1,progress));
 if(variant==='contact')return 6.1-bounded*.1;
 // Fit the 3.9-unit plinth and rotating initials in the horizontal 38° camera field.
 const horizontalFit=2.1/Math.tan(19*Math.PI/180)/Math.max(.1,aspect)*1.12+.45;
 return Math.max(7.5-bounded*.45,horizontalFit);
}
