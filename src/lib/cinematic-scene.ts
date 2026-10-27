export const CINEMATIC_SCENE={maxPixels:800_000,maxDpr:1.5,sparks:12,glow:.9,parallax:.04} as const;
export const CINEMATIC_LIGHT_PALETTE={
 warm:{shadow:[.98,.92,.82],body:[.92,.75,.54],crest:[1,.98,.91]},
 cool:{shadow:[.88,.94,.98],body:[.69,.83,.94],crest:[.97,.99,1]},
} as const;
export function cinematicQuality(width:number,reduced:boolean,coarse:boolean,memory?:number,cores?:number){return width>=768&&!reduced&&!coarse&&(memory===undefined||memory>2)&&(cores===undefined||cores>2);}
export function cinematicResolution(width:number,height:number,dpr:number){
 const w=Math.max(1,width),h=Math.max(1,height),scale=Math.min(Math.max(.1,dpr),CINEMATIC_SCENE.maxDpr,Math.sqrt(CINEMATIC_SCENE.maxPixels/(w*h)));
 return {width:Math.max(1,Math.round(w*scale)),height:Math.max(1,Math.round(h*scale))};
}
export function scrollFraction(top:number,height:number,viewport:number){return Math.max(0,Math.min(1,top/Math.max(1,height-viewport)));}
