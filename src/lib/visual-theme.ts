import palette from '../design/monochrome.json';
/** Shared neutral materials and lighting. Image textures retain their original color. */
export const sceneTheme=Object.freeze(palette);
export function sceneAlpha(color:string,opacity:number){const n=parseInt(color.slice(1),16);return `rgba(${n>>16},${(n>>8)&255},${n&255},${Math.max(0,Math.min(1,opacity))})`;}
