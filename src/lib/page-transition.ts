export type PagePhase='idle'|'exit'|'waiting'|'enter';
export function pageDirection(nav:readonly string[][],from:string,to:string):1|-1{
 return nav.findIndex(([id])=>id===to)<nav.findIndex(([id])=>id===from)?-1:1;
}
export function boundaryPage(nav:readonly string[][],page:string,delta:number,top:boolean,bottom:boolean):string|null{
 if(!delta||(delta>0&&!bottom)||(delta<0&&!top))return null;
 const index=nav.findIndex(([id])=>id===page);
 return index<0?null:nav[index+(delta>0?1:-1)]?.[0]||null;
}
function interruptible<T>(promise:Promise<T>,signal:AbortSignal,ms:number):Promise<T>{
 return new Promise((resolve,reject)=>{
  let timer:ReturnType<typeof setTimeout>;
  const finish=(done:()=>void)=>{clearTimeout(timer);signal.removeEventListener('abort',abort);done();};
  const abort=()=>finish(()=>reject(new Error('Transition cancelled')));
  if(signal.aborted){reject(new Error('Transition cancelled'));return;}
  signal.addEventListener('abort',abort,{once:true});
  timer=setTimeout(()=>finish(()=>reject(new Error('Transition timed out'))),ms);
  promise.then(value=>finish(()=>resolve(value)),error=>finish(()=>reject(error)));
 });
}
type TransitionPorts={
 phase:(phase:PagePhase)=>void;lock:()=>()=>void;
 exit:(signal:AbortSignal)=>Promise<void>;enter:(signal:AbortSignal)=>Promise<void>;
 cancel:()=>void;error:()=>void;
};
/** One transition owns input and animation resources; repeated gestures cannot queue work. */
export class PageTransitionLane{
 private active:AbortController|null=null;
 private disposed=false;
 constructor(private ports:TransitionPorts,private navigationMs=12000){}
 get busy(){return this.active!==null;}
 async run<T>(navigate:(signal:AbortSignal)=>Promise<T>,commit:(value:T,signal:AbortSignal)=>Promise<void>):Promise<boolean>{
  if(this.busy||this.disposed)return false;
  const controller=new AbortController(),signal=controller.signal;this.active=controller;
  const release=this.ports.lock();
  try{
   this.ports.phase('exit');
   // Start fetching while the old scene exits; attach rejection handling immediately.
   const arrival=interruptible(navigate(signal),signal,this.navigationMs).then(value=>({ok:true as const,value}),error=>({ok:false as const,error}));
   await interruptible(this.ports.exit(signal),signal,2400);
   if(signal.aborted)return false;
   this.ports.phase('waiting');
   const result=await arrival;if(signal.aborted)return false;if(!result.ok)throw result.error;
   await interruptible(commit(result.value,signal),signal,2400);
   if(signal.aborted)return false;
   this.ports.phase('enter');
   await interruptible(this.ports.enter(signal),signal,2400);
   return true;
  }catch{
   if(!signal.aborted&&!this.disposed)this.ports.error();
   return false;
  }finally{
   controller.abort();this.ports.cancel();release();this.active=null;
   if(!this.disposed)this.ports.phase('idle');
  }
 }
 dispose(){this.disposed=true;this.active?.abort();this.ports.cancel();}
}
