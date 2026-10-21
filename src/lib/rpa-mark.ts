/** Three routed paths around an orbital core. Coordinates also define the standalone SVG. */
export const rpaOrbit={radius:31,minorRadius:11,planetRadius:14,strokeWidth:4,tiltDegrees:30} as const;
const route:readonly (readonly [number,number])[]=[[128,28],[209,75],[209,119],[171,141],[171,97],[128,72],[90,94]];
export const rpaMarkPaths=Array.from({length:3},(_,index)=>{
 const angle=index*Math.PI*2/3;
 return route.map(([x,y])=>[128+(x-128)*Math.cos(angle)-(y-128)*Math.sin(angle),128+(x-128)*Math.sin(angle)+(y-128)*Math.cos(angle)] as const);
});
export const rpaMarkPathData=rpaMarkPaths.map(points=>'M '+points.map(([x,y])=>`${x.toFixed(2)} ${y.toFixed(2)}`).join(' L '));
