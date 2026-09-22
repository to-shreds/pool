/* Provisional player-delivery model. See docs/EXECUTION.md, not an APA probability table. */
(function(root){'use strict';
const P=typeof module!=='undefined'&&module.exports?require('./physics.js'):root.CuePhysics;
const clamp=P.clamp;
function rng(seed){let a=seed>>>0;return ()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function next(seed){return ((Math.imul(seed>>>0,1664525)+1013904223)>>>0);}
function normal(r){return Math.sqrt(-2*Math.log(Math.max(1e-12,r())))*Math.cos(2*Math.PI*r());}
const N=512,random=rng(0x43554533),NOISE=Array.from({length:N},()=>Array.from({length:6},()=>normal(random)));
const profiles={2:[.85,6,.065,1.5],3:[.45,4,.04,1],4:[.23,2.4,.025,.65],5:[.14,1.8,.018,.4],6:[.08,1.1,.012,.25],7:[.035,.65,.007,.15]};
function context(world,s,player=0,condition=1,isComputer=false){return {skill:player===0?s.skill1:s.skill2,condition:clamp(condition,0,1),variation:isComputer||s.execution,miscues:s.miscues,chalk:s.chalk==='realistic',radius:P.radius(world.get(0)),mass:P.mass(world.get(0)),cfg:world.cfg};}
function candidate(intent,ctx,index){
 const n=NOISE[index%N],p=profiles[clamp(Math.round(ctx.skill),2,7)],rho=Math.hypot(intent.side,intent.up),el=intent.elevation/80;
 const hard=1+.75*rho+.9*el*el+.45*rho*(intent.power/100)**2;
 const shot={...intent};
 if(ctx.variation){shot.angle+=n[0]*p[0]*Math.PI/180*hard;shot.power=clamp(shot.power+n[1]*p[1]*hard,1,100);shot.side+=n[2]*p[2]*hard;shot.up+=n[3]*p[2]*hard;shot.elevation=clamp(shot.elevation+n[4]*p[3]*el*hard,0,80);const r=Math.hypot(shot.side,shot.up);if(r>.97){shot.side*=.97/r;shot.up*=.97/r;}}
 const base=ctx.chalk?.32+.38*ctx.condition:.70;
 const friction=Math.max(.1,base+(ctx.chalk?(1-ctx.condition)*.025*n[5]:0));
 const cfg={...P.defaults,...ctx.cfg,cueRadius:ctx.radius,cueBallMass:ctx.mass,tipFriction:friction,noMiscue:!ctx.miscues};
 const info=P.strikeInfo(shot.angle,shot.side,shot.up,shot.elevation,shot.power,cfg);
 const delivered=Math.abs(shot.angle-intent.angle)>.55*Math.PI/180||Math.abs(shot.power-intent.power)>7||Math.hypot(shot.side-intent.side,shot.up-intent.up)>.09||Math.abs(shot.elevation-intent.elevation)>3;
 const cloth=info.contactHeight<.006;
 return {shot,friction,miscue:info.miscue,deliveryError:delivered,cloth,mishit:delivered||info.miscue||cloth};
}
function risk(intent,ctx){let delivery=0,miscue=0,cloth=0,any=0;for(let i=0;i<N;i++){const r=candidate(intent,ctx,i);delivery+=r.deliveryError;miscue+=r.miscue;cloth+=r.cloth;any+=r.mishit;}return {n:N,delivery:delivery/N,miscue:miscue/N,cloth:cloth/N,any:any/N};}
function choose(intent,ctx,seed){const outSeed=next(seed);const index=Math.floor(outSeed/4294967296*N);return {...candidate(intent,ctx,index),index,seed:seed>>>0,nextSeed:outSeed};}
function fire(world,intent,ctx,seed){const r=choose(intent,ctx,seed);let result;
 if(r.cloth){world.events=[];world.time=0;world.diagnostics={eventLimit:0};world.emit('strike',{miscue:false,cloth:true});result={ok:true,cloth:true,miscue:false,speed:0};}
 else{const s=r.shot;result=world.strike(s.angle,s.side,s.up,s.elevation,s.power,{tipFriction:r.friction,noMiscue:!ctx.miscues});}
 return {...r,result};
}
function depletion(shot){const r=Math.hypot(shot.side,shot.up),p=shot.power/100,e=Math.sin(shot.elevation*Math.PI/180);return clamp(.008+.09*r*r+.025*p*p+.02*e*e*(.25+r),.008,.2);}
const api={N,profiles,rng,next,context,candidate,risk,choose,fire,depletion};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CueExecution=api;
})(typeof globalThis!=='undefined'?globalThis:this);
