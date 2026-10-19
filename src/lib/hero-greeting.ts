export function heroGreeting(seconds:number){
 const cycle=Math.floor(seconds/10);
 return {visible:cycle>0&&seconds%10<3.5,speaker:(Math.max(1,cycle)-1)%2 as 0|1};
}
