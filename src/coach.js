/* Shared bounded shot search. Evaluates actual physics, not a scripted pot. */
(function(root){'use strict';
const node=typeof module!=='undefined'&&module.exports;
const P=node?require('./physics.js'):root.CuePhysics,Q=node?require('./rules.js'):root.CueRules,A=node?require('./apa.js'):root.CueAPA,E=node?require('./execution.js'):root.CueExecution;
const PI=Math.PI,clamp=P.clamp,dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),dir=(a,b)=>{const d=dist(a,b)||1;return [(b[0]-a[0])/d,(b[1]-a[1])/d];};
function legalIds(w,r,player=r.turn){const bs=w.balls.filter(b=>b.active&&b.id>0);if(['9ball','10ball','rotation','apa9'].includes(r.mode))return bs.length?[Math.min(...bs.map(b=>b.id))]:[];
 if(['8ball','apa8'].includes(r.mode)){const g=r.groups[player];if(!g)return bs.filter(b=>b.id!==8).map(b=>b.id);const own=bs.filter(b=>Q.group(b.id)===g).map(b=>b.id);return own.length?own:[8];}
 return bs.map(b=>b.id);}
function clear(w,a,b,ignore=[],r=P.R){const dx=b[0]-a[0],dy=b[1]-a[1],len2=dx*dx+dy*dy;if(len2<1e-12)return false;
 return !w.balls.some(ob=>{if(!ob.active||ignore.includes(ob.id))return false;const t=clamp(((ob.p[0]-a[0])*dx+(ob.p[1]-a[1])*dy)/len2,0,1);return Math.hypot(ob.p[0]-a[0]-t*dx,ob.p[1]-a[1]-t*dy)<r+P.radius(ob)+.0001;});}
function powerFor(w,length,cut=1){const need=(Math.sqrt(2*w.cfg.roll*P.G*Math.max(.15,length))+.48)/Math.max(.28,cut)*1.28;let lo=8,hi=92;for(let n=0;n<12;n++){const m=(lo+hi)/2,s=P.strikeInfo(0,0,0,0,m,{...w.cfg,cueRadius:P.radius(w.get(0)),cueBallMass:P.mass(w.get(0))}).speed;if(s<need)lo=m;else hi=m;}return (lo+hi)/2;}
function direct(w,r,withHand=true){const legal=legalIds(w,r),cue=w.get(0),out=[];if(!cue)return out;
 const pockets=r.mode==='onepocket'?w.table.pockets.map((p,i)=>({...p,index:i})).filter(p=>p.index===r.pockets[r.turn]):w.table.pockets.map((p,i)=>({...p,index:i}));
 for(const id of legal){const ob=w.get(id);for(const p of pockets){const n=dir(ob.p,[p.x,p.y]),sum=P.radius(cue)+P.radius(ob),height=P.radius(cue)-P.radius(ob),contactDistance=Math.sqrt(sum*sum-height*height),ghost=[ob.p[0]-n[0]*contactDistance,ob.p[1]-n[1]*contactDistance];
  if(!clear(w,ob.p,[p.x,p.y],[0,id],P.radius(ob)))continue;
  const positions=[null];if(r.ballInHand&&withHand){for(const len of [.24,.45,.7]){const pos=[ob.p[0]-n[0]*len,ob.p[1]-n[1]*len];if(P.validPosition(w,0,...pos,r.ballInHand==='kitchen'))positions.push(pos);}}
  for(const position of positions){const cp=position||cue.p;if(!clear(w,cp,ghost,[0,id],P.radius(cue)))continue;
   if(r.mode==='apa8'&&r.ballInHand==='kitchen'&&ob.p[0]<w.table.L/4)continue;
   const incoming=dir(cp,ghost),cut=incoming[0]*n[0]+incoming[1]*n[1];if(cut<.18)continue;
   const cd=dist(cp,ghost),od=dist(ob.p,[p.x,p.y]);out.push({family:'direct',ball:id,pocket:p.index,position,angle:Math.atan2(ghost[1]-cp[1],ghost[0]-cp[0]),power:powerFor(w,cd+od,cut),side:0,up:0,elevation:0,safety:false,bankCount:1,prior:cd+od*.65+(1-cut)*3,cut,distance:cd+od,ghost});
  }
 }}return out.sort((a,b)=>a.prior-b.prior);}
function banks(w,r){const out=[],cue=w.get(0),{L,W}=w.table,legal=legalIds(w,r),rr=P.R*.96;
 for(const id of legal){const ob=w.get(id);for(let pocket=0;pocket<6;pocket++){if(r.mode==='onepocket'&&pocket!==r.pockets[r.turn])continue;const p=w.table.pockets[pocket];
  for(const [axis,wall] of [[0,rr],[0,L-rr],[1,rr],[1,W-rr]]){
   if(Math.abs((axis===0?p.x:p.y)-wall)<.1)continue;
   const mir=[p.x,p.y];mir[axis]=2*wall-mir[axis];const vec=dir(ob.p,mir),t=(wall-ob.p[axis])/(mir[axis]-ob.p[axis]);if(t<=0||t>=1)continue;
   const bounce=[ob.p[0]+t*(mir[0]-ob.p[0]),ob.p[1]+t*(mir[1]-ob.p[1])];
   if(!clear(w,ob.p,bounce,[0,id])||!clear(w,bounce,[p.x,p.y],[0,id]))continue;
   const ghost=[ob.p[0]-vec[0]*(P.radius(cue)+P.radius(ob)),ob.p[1]-vec[1]*(P.radius(cue)+P.radius(ob))];if(!clear(w,cue.p,ghost,[0,id],P.radius(cue)))continue;
   const incoming=dir(cue.p,ghost),cut=incoming[0]*vec[0]+incoming[1]*vec[1];if(cut<.25)continue;
   out.push({family:'bank',ball:id,pocket,angle:Math.atan2(ghost[1]-cue.p[1],ghost[0]-cue.p[0]),power:Math.min(85,powerFor(w,dist(cue.p,ghost)+dist(ob.p,mir),cut)*1.2),side:0,up:0,elevation:0,safety:false,bankCount:1,prior:4+dist(cue.p,ghost)+dist(ob.p,mir)+(1-cut)*4,ghost});
  }
 }}return out.sort((a,b)=>a.prior-b.prior);}
function combinations(w,r){const out=[],cue=w.get(0),legal=legalIds(w,r),bs=w.balls.filter(b=>b.active&&b.id>0);if(['banks','onepocket'].includes(r.mode))return out;
 for(const id of legal)for(const ob of bs){if(ob.id===id)continue;if(['8ball','apa8'].includes(r.mode)&&(ob.id===8||r.groups[r.turn]&&Q.group(ob.id)!==r.groups[r.turn]))continue;const first=w.get(id);
  for(let pocket=0;pocket<6;pocket++){const p=w.table.pockets[pocket],n=dir(ob.p,[p.x,p.y]),g2=[ob.p[0]-2*P.R*n[0],ob.p[1]-2*P.R*n[1]],v=dir(first.p,g2),g1=[first.p[0]-(P.radius(cue)+P.R)*v[0],first.p[1]-(P.radius(cue)+P.R)*v[1]],inc=dir(cue.p,g1),cut=inc[0]*v[0]+inc[1]*v[1];
   if(cut<.5||!clear(w,ob.p,[p.x,p.y],[0,id,ob.id])||!clear(w,first.p,g2,[0,id,ob.id])||!clear(w,cue.p,g1,[0,id,ob.id]))continue;
   out.push({family:'combination',first:id,ball:ob.id,pocket,angle:Math.atan2(g1[1]-cue.p[1],g1[0]-cue.p[0]),power:Math.min(90,powerFor(w,dist(cue.p,g1)+dist(first.p,g2)+dist(ob.p,[p.x,p.y]),cut)*1.3),side:0,up:0,elevation:0,safety:false,bankCount:1,prior:6+dist(cue.p,g1)+dist(first.p,g2),ghost:g1});
  }
 }return out.sort((a,b)=>a.prior-b.prior).slice(0,12);}
function escapes(w,r){const cue=w.get(0),out=[],{L,W}=w.table;
 for(const id of legalIds(w,r)){const b=w.get(id),a=Math.atan2(b.p[1]-cue.p[1],b.p[0]-cue.p[0]);
  for(const offset of [0,-.02,.02,-.05,.05])out.push({family:'safety',ball:id,pocket:0,angle:a+offset,power:22+dist(cue.p,b.p)*7,side:0,up:0,elevation:0,safety:true,bankCount:1,prior:12+Math.abs(offset)*10});
  for(const [axis,wall] of [[0,P.R],[0,L-P.R],[1,P.R],[1,W-P.R]]){const mir=[...b.p];mir[axis]=2*wall-mir[axis];const ang=Math.atan2(mir[1]-cue.p[1],mir[0]-cue.p[0]);out.push({family:'kick',ball:id,pocket:0,angle:ang,power:Math.min(75,powerFor(w,dist(cue.p,mir))*1.35),side:0,up:.1,elevation:0,safety:true,bankCount:1,prior:10+dist(cue.p,mir)});}
 }return out;}
function candidates(w,r){if(!w.balls.some(b=>b.active&&b.id>0))return [];if(r.break&&r.mode!=='practice'){const cue=w.get(0),apex=w.balls.filter(b=>b.id>0&&b.active).sort((a,b)=>a.p[0]-b.p[0])[0];return [88,96,80].flatMap(power=>[-.006,0,.006].map(offset=>({family:'break',ball:apex.id,pocket:0,angle:Math.atan2(apex.p[1]-cue.p[1],apex.p[0]-cue.p[0])+offset,power,side:0,up:0,elevation:0,safety:r.mode==='straight',bankCount:1,prior:0})));}
 let pots=direct(w,r);if(r.mode==='banks')pots=[];
 return [...pots.slice(0,24),...banks(w,r).slice(0,10),...combinations(w,r).slice(0,6),...escapes(w,r)].sort((a,b)=>a.prior-b.prior);}
function measure(w,r,c,context){
 const t=P.World.from(w.snapshot()),rr=Q.Rules.from(r.snapshot());
 if(c.position&&!P.place(t,0,...c.position,r.ballInHand==='kitchen'))return null;
 const opts={callBall:c.ball,callPocket:c.pocket,safety:c.safety,push:!!c.push,bankCount:c.bankCount||1};
 const pre=rr.start(t,opts),friction=context?.friction??(context?.chalk?.32+.38*context.condition:.7);
 const result=t.strike(c.angle,c.side,c.up,c.elevation,c.power,{tipFriction:friction,noMiscue:!context?.miscues});if(!result.ok)return null;
 const sim=t.simulate(35);if(!sim.settled||t.diagnostics.eventLimit)return null;
 const physicsEnd=t.snapshot(),events=t.events.slice();rr.finish(t,pre);
 const first=events.find(e=>e.type==='ball'&&(e.a===0||e.b===0));const hits=first?(first.a===0?first.b:first.a):null;
 const foul=rr.lastOutcome?rr.lastOutcome.foul||rr.lastOutcome.invalidBreak:rr.fouls[r.turn]>r.fouls[r.turn]||rr.ballInHand&&rr.turn!==r.turn;
 const won=rr.winner===r.turn||rr.rackWinner===r.turn,lost=rr.winner===1-r.turn;
 const pots=events.filter(e=>e.type==='pocket'&&e.id>0),scratch=events.some(e=>(e.type==='pocket'||e.type==='off')&&e.id===0);
 const actual=pots.some(e=>e.id===c.ball&&e.pocket===c.pocket);
 const rightPots=r.mode==='onepocket'?pots.filter(e=>e.pocket===r.pockets[r.turn]).length:['8ball','apa8'].includes(r.mode)&&r.groups[r.turn]?pots.filter(e=>Q.group(e.id)===r.groups[r.turn]).length:pots.length;
 let value=won?500:lost?-650:foul?-220:scratch?-230:0;
 if(!lost&&!foul){value+=rightPots*65;if(r.mode==='onepocket')value-=pots.filter(e=>e.pocket===r.pockets[1-r.turn]).length*95;}
 const next=direct(t,{...rr,turn:r.turn},false)[0];const opponent=direct(t,{...rr,turn:1-r.turn},false)[0];
 if(!foul&&!lost){if(rightPots)value+=next?22-Math.min(22,next.prior*4):0;else value+=opponent?-Math.max(0,25-opponent.prior*4):20;}
 const target=physicsEnd.balls.find(b=>b.id===c.ball),p=w.table.pockets[c.pocket];
 if(!actual&&target?.active&&!c.safety)value-=Math.min(50,dist(target.p,[p.x,p.y])*20);
 if(!first)value-=100;
 if(r.mode==='banks'&&!c.safety&&!won){const gain=rr.scores[r.turn]-r.scores[r.turn];if(gain<=0)value-=65;}
 return {value,actual:actual&&!foul,legal:!foul&&!lost,success:c.safety?!foul&&!scratch:actual&&!foul,scratch,foul,won,lost,pots:pots.map(e=>e.id),nextBall:next?.ball??null,nextPrior:next?.prior??null,opponentPrior:opponent?.prior??null,cueEnd:physicsEnd.balls.find(b=>b.id===0).p,firstHit:hits,events:events.filter(e=>['ball','rail','pocket','off'].includes(e.type)),world:physicsEnd};
}
function solve(input,progress=()=>{}){
 const start=Date.now(),w=P.World.from(input.world),r=Q.Rules.from(input.rules),level=clamp(input.skill||4,2,7),depth=input.depth||'balanced';
 const limits={quick:[36,3000],balanced:[100,7500],deep:[210,14000]}[depth];
 const all=candidates(w,r);if(!all.length)return {error:'No candidate can be generated from this position.'};
 const finalists=[],seen=new Set();let tested=0;
 const consider=(c)=>{if(tested>=limits[0]||Date.now()-start>limits[1])return;const key=[c.ball,c.pocket,c.angle.toFixed(5),c.power.toFixed(1),c.up,c.position?.join(',')].join('|');if(seen.has(key))return;seen.add(key);
  const m=measure(w,r,c,input.context);tested++;if(m){const data={...c,measure:m,value:m.value};finalists.push(data);finalists.sort((a,b)=>b.value-a.value);if(finalists.length>18)finalists.length=18;}if(tested%12===0)progress({tested,best:finalists[0]?{family:finalists[0].family,ball:finalists[0].ball,pocket:finalists[0].pocket}:null});};
 // Breadth first, preserving room for safety / escape candidates when pots are obstructed.
 const pool=r.break?all:[...all.filter(c=>!c.safety).slice(0,22),...all.filter(c=>c.safety).slice(0,12)];
 for(const c of pool)consider(c);
 const leaders=finalists.slice(0,6);
 for(const c of leaders){for(const da of [-.9,-.35,.35,.9])consider({...c,angle:c.angle+da*PI/180});for(const f of [.75,1.3])consider({...c,power:clamp(c.power*f,8,96)});if(level>=4)for(const up of [-.3,.25,.45])consider({...c,up});}
 if(finalists.length&&depth==='deep')for(const c of finalists.slice(0,4)){for(const da of [-.2,-.1,.1,.2])for(const f of [.85,1,1.15])consider({...c,angle:c.angle+da*PI/180,power:clamp(c.power*f,8,96)});}
 if(!finalists.length)return {error:'The search could not produce a settled trial. Try another position or a shallower budget.'};
 // Estimate robustness using a small, disclosed sample from the shared delivery model.
 const unique=[];for(const c of finalists){if(!unique.some(x=>x.ball===c.ball&&x.pocket===c.pocket&&x.family===c.family))unique.push(c);if(unique.length>=3)break;}
 for(const c of unique){const n=depth==='quick'?4:depth==='deep'?16:8;let ok=0,value=0,checked=0;
  for(let i=0;i<n;i++){if(Date.now()-start>limits[1]+4000)break;const ctx=input.context||{skill:level,variation:true,miscues:true,condition:1,chalk:false,radius:P.radius(w.get(0)),mass:P.mass(w.get(0)),cfg:w.cfg};const sample=E.candidate(c,ctx,(i*61+17)%E.N);const m=sample.cloth?null:measure(w,r,{...c,...sample.shot},{...ctx,friction:sample.friction});checked++;if(m){ok+=m.success;value+=m.value;}else value-=220;}
  c.robustness={success:ok,trials:checked};if(checked)c.value=c.measure.value*.35+(value/checked)*.65;
 }
 unique.sort((a,b)=>b.value-a.value);
 // Weaker profiles may prefer the simpler near-equivalent candidate; no special ball physics.
 if(input.role==='computer'&&level<4){const simple=unique.filter(c=>c.family==='direct'&&c.value>=unique[0].value-25).sort((a,b)=>a.prior-b.prior)[0];if(simple)unique.splice(0,0,unique.splice(unique.indexOf(simple),1)[0]);}
 return {candidates:unique.map(c=>({...c,measure:{...c.measure,world:undefined}})),tested,elapsed:Date.now()-start,limited:true};
}
function demonstration(input,c){const w=P.World.from(input.world);if(c.position&&!P.place(w,0,...c.position,input.rules.ballInHand==='kitchen'))return {error:'Suggested position is no longer valid.'};const start=w.snapshot();const result=w.strike(c.angle,c.side,c.up,c.elevation,c.power,{tipFriction:input.context?.chalk?.32+.38*input.context.condition:.7,noMiscue:!input.context?.miscues});if(!result.ok)return {error:result.reason};const frames=[];let n=0;const frame=()=>frames.push({t:w.time,balls:P.clone(w.balls)});frame();while(!w.atRest()&&w.time<40){w.step();if(++n%12===0)frame();}frame();return {frames,settled:w.atRest(),start,events:w.events};}
function lag(input){const w=P.World.from(input.world);let best=36,score=Infinity;
 for(let power=20;power<=60;power++){const t=P.World.from(w.snapshot());t.strike(0,0,0,0,power,{noMiscue:true});t.simulate(30);const rails=t.events.filter(e=>e.type==='rail'&&e.kind==='cushion'),far=rails.filter(e=>t.table.rails[e.rail].a[0]===t.table.L),side=rails.some(e=>{const r=t.table.rails[e.rail];return r.a[1]===r.b[1];});const q=far.length===1&&!side&&t.get(0).active?t.get(0).p[0]:Infinity;if(q<score){score=q;best=power;}}
 return {power:best,distance:score};}
function stalemate(input,progress=()=>{}){const choices=[];
 for(const player of [0,1]){const rules=Q.Rules.from(input.rules);rules.turn=player;rules.ballInHand='any';rules.break=false;const result=solve({...input,rules:rules.snapshot(),depth:'quick',role:'coach',context:{...input.context,variation:false,miscues:false}},progress);
  const opportunity=(result.candidates||[]).some(c=>c.measure.legal&&(c.measure.actual||c.measure.won));choices.push({player,opportunity,tested:result.tested||0});}
 return {agree:choices.every(c=>!c.opportunity&&c.tested>0),choices};}
const api={legalIds,clear,direct,banks,combinations,escapes,candidates,measure,solve,demonstration,lag,stalemate};if(node)module.exports=api;root.CueCoach=api;
})(typeof globalThis!=='undefined'?globalThis:this);
