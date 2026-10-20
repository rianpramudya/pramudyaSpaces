/** Three routed paths around one open core. Coordinates also define the standalone SVG. */
const route:readonly (readonly [number,number])[]=[[128,28],[209,75],[209,119],[171,141],[171,97],[128,72],[90,94]];
export const rpaMarkPaths=Array.from({length:3},(_,index)=>{
 const angle=index*Math.PI*2/3;
 return route.map(([x,y])=>[128+(x-128)*Math.cos(angle)-(y-128)*Math.sin(angle),128+(x-128)*Math.sin(angle)+(y-128)*Math.cos(angle)] as const);
});
export const rpaMarkPathData=rpaMarkPaths.map(points=>'M '+points.map(([x,y])=>`${x.toFixed(2)} ${y.toFixed(2)}`).join(' L '));
