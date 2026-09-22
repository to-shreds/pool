/* APA-derived local 8/9-ball rules. Sources and exact scope: docs/APA.md. */
(function(root){'use strict';
const P=typeof module!=='undefined'&&module.exports?require('./physics.js'):root.CuePhysics;
const Q=typeof module!=='undefined'&&module.exports?require('./rules.js'):root.CueRules;
const games=[['2/2','2/3','2/4','2/5','2/6','2/7'],['3/2','2/2','2/3','2/4','2/5','2/6'],['4/2','3/2','3/3','3/4','3/5','2/5'],['5/2','4/2','4/3','4/4','4/5','3/5'],['6/2','5/2','5/3','5/4','5/5','4/5'],['7/2','6/2','5/2','5/3','5/4','5/5']];
const points=[0,14,19,25,31,38,46,55,65,75];
function targets(a,b){if(!Number.isInteger(a)||!Number.isInteger(b)||a<2||a>7||b<2||b>7)throw new RangeError('APA 8-ball skills are 2 through 7.');return games[a-2][b-2].split('/').map(Number);}
Q.modes.apa8={name:'APA 8-ball',short:'Marked 8 · handicapped racks',target:1};
Q.modes.apa9={name:'APA 9-ball',short:'Handicapped point scoring',target:31};
Q.notes.apa8='APA-derived 8-ball (2026-29 manual). Only the 8 pocket is marked. A single category pocketed on the break assigns groups; both categories leave it open. Legal accidental pots count. The 8 on a legal break wins unless the cue ball is fouled. Scratch while playing the 8 loses even if the 8 stays up. Missing the 8 without scratching is ball in hand, not loss. Wrong or unmarked 8, early 8 or 8 off table loses. The last group ball and 8 require separate strokes. Legal-break foul: kitchen placement and first contact outside/on the head string. See the APA scope notes for referee and pocket-model limitations.';
Q.notes.apa9='APA-derived handicapped 9-ball (2026-29 manual). Lowest ball first; 1-8 score one point each, 9 scores two. A legal 9 ends the rack, not necessarily the match. No push-outs and no three-foul loss. Foul pots stay down as dead balls except the 9, which is spotted. Off-table object balls are spotted without automatically adding a foul. Match ends at the selected point target. The official target chart is separate from Cue Lab execution-strength settings.';
function ownRemaining(balls,group){return balls.filter(b=>b.active&&b.id>0&&Q.group(b.id)===group);}
function spot(w,ids){
 for(const id of [...new Set(ids)].filter(id=>id>0).sort((a,b)=>a-b)){
  const b=w.get(id);if(!b)continue;b.active=false;
  const r=P.radius(b),y=w.table.W/2,z=r;let x=w.table.L*.75;
  for(let n=0;n<40;n++){
   let nextX=x;
   for(const other of w.balls)if(other.active&&other.id!==id){const rr=r+P.radius(other),dy=other.p[1]-y,dz=other.p[2]-z;
    if(dy*dy+dz*dz<rr*rr){const dx=Math.sqrt(rr*rr-dy*dy-dz*dz);if(Math.abs(x-other.p[0])<dx+1e-9)nextX=Math.max(nextX,other.p[0]+dx+1e-8);}}
   if(Math.abs(nextX-x)<1e-12)break;x=nextX;
  }
  if(x>w.table.L-r){P.spot(w,id,w.table.L*.75,y);continue;}
  b.p=[x,y,r];b.active=true;b.pocket=null;P.stop(b);
 }
}
function firstHits(events){const f=events.find(e=>e.type==='ball'&&(e.a===0||e.b===0));return f?{event:f,id:f.a===0?f.b:f.a}:null;}
function railSatisfied(events,first,frozen){
 if(!first)return false;const t=first.event.t,id=first.id,fr=frozen.filter(x=>x.id===id).map(x=>x.rail);
 if(events.some(e=>e.type==='pocket'&&e.t>=t))return true;
 return events.some(e=>{if(e.type!=='rail'||e.t<t-1e-9)return false;
  if(!fr.length)return true;
  if(e.id!==id&&e.id!==0)return true;
  const intermediate=events.some(c=>c.type==='ball'&&c!==first.event&&c.t>t+1e-9&&c.t<e.t&&((c.a===e.id&&c.b!==0)||(c.b===e.id&&c.a!==0)));
  if(intermediate)return true;
  if(e.id===id)return !fr.includes(e.rail);
  const simultaneous=events.some(c=>c.type==='rail'&&c.id===0&&fr.includes(c.rail)&&Math.abs(c.t-t)<1e-7);
  return !simultaneous||!fr.includes(e.rail);
 });
}
class Rules extends Q.Rules{
 constructor(mode='apa8',options={}){super(mode,options);this.rackWinner=null;this.dead=0;this.innings=0;this.defense=[0,0];this.skills=options.skills||[4,4];this.targetScores=options.targets||(mode==='apa9'?this.skills.map(s=>points[s]):targets(...this.skills));this.target=this.targetScores[0];this.marker=null;this.lagLoser=options.lagLoser??1;this.breaker=options.breaker??0;this.turn=this.breaker;this.lastOutcome=null;}
 static from(s){const r=new Rules(s.mode,{skills:s.skills,targets:s.targetScores});Object.assign(r,P.clone(s));return r;}
 needsCall(){return false;}
 onEight(w){return this.mode==='apa8'&&!!this.groups[this.turn]&&ownRemaining(w.balls,this.groups[this.turn]).length===0;}
 start(w,opts={}){const p=super.start(w,opts);p.frozen=P.frozen(w);p.marker=opts.callPocket??this.marker;return p;}
 finish(w,pre){
  const me=pre.player,other=1-me,mode=this.mode,ev=w.events,o=pre.options,first=firstHits(ev),id=first?.id;
  const pots=ev.filter(e=>e.type==='pocket'&&e.id>0),off=ev.filter(e=>e.type==='off'&&e.id>0),scratch=ev.some(e=>(e.type==='pocket'||e.type==='off')&&e.id===0);
  const group=this.groups[me],onEight=mode==='apa8'&&!!group&&ownRemaining(pre.balls,group).length===0;
  this.shots++;this.ballInHand=null;this.pushAvailable=false;this.choice=null;this.marker=pre.marker??this.marker;
  let foul=scratch?'Cue-ball scratch':null;
  const wasBreak=pre.wasBreak;
  if(wasBreak){
   const acceptable=mode==='apa9'?[1]:pre.balls.filter(b=>b.id>0&&b.active).sort((a,b)=>a.p[0]-b.p[0]).slice(0,3).map(b=>b.id);
   const beforeRail=ev.some(e=>e.type==='rail'&&e.id===0&&(!first||e.t<first.event.t));
   const four=new Set(ev.filter(e=>e.type==='rail'&&e.id>0).map(e=>e.id)).size>=4;
   const legal=first&&acceptable.includes(id)&&!beforeRail&&(pots.length||four)&&pre.balls.find(b=>b.id===0).p[0]<=w.table.L/4+1e-8;
   if(!legal){
    const equipment={diameter:2*P.radius(w.get(0)),mass:P.mass(w.get(0))};
    // No foul can occur before the rack is struck. Otherwise a scratched illegal break changes breaker.
    if(first&&scratch)this.turn=other;
    w.balls=P.rack(mode,w.table);P.equip(w,equipment.diameter,equipment.mass);this.break=true;this.breaker=this.turn;this.ballInHand='kitchen';
    this.lastOutcome={foul:false,invalidBreak:true,shooter:me,pots:0};this.logMessage('Break not legal. Rerack; '+this.name()+' breaks again.');return;
   }
   this.break=false;
  }else{
   if(!foul&&!first)foul='No object ball contacted';
   if(!foul&&mode==='apa9'){
    const lowest=Math.min(...pre.balls.filter(b=>b.active&&b.id>0).map(b=>b.id));if(id!==lowest)foul='The '+lowest+' had to be contacted first';
   }
   if(!foul&&mode==='apa8'){
    const allowed=onEight?[8]:group?ownRemaining(pre.balls,group).map(b=>b.id):pre.balls.filter(b=>b.active&&b.id>0&&b.id!==8).map(b=>b.id);
    if(!allowed.includes(id))foul='Wrong first object ball';
   }
   if(!foul&&mode==='apa8'&&pre.hand==='kitchen'&&first){
    const targetPoint=first.event.a===id?first.event.pa:first.event.pb;
    const x=(targetPoint||pre.balls.find(b=>b.id===id).p)[0];
    if(x<w.table.L/4-1e-8)foul='First object-ball contact must be outside or on the head string';
   }
   if(!foul&&!railSatisfied(ev,first,pre.frozen||[]))foul='No qualifying rail or pocket after contact';
  }
  if(o.safety)this.defense[me]++;
  this.lastOutcome={foul:!!foul,reason:foul,shooter:me,pots:pots.length,scratch,defense:!!o.safety,break:wasBreak};
  this.fouls[me]=foul?this.fouls[me]+1:0;
  const endTurn=()=>{this.switchTurn();if(me===this.lagLoser)this.innings++;};
  if(mode==='apa8'){
   const eight=pots.find(e=>e.id===8),eightOff=off.some(e=>e.id===8);
   if(eightOff){this.lastOutcome.end='eightOff';this.rackWinner=other;this.win(other,'The 8 left the playing surface.');return;}
   if(wasBreak&&eight){this.rackWinner=foul?other:me;this.lastOutcome.end=foul?'eightBreakFoul':'eightBreak';this.win(this.rackWinner,foul?'Cue-ball foul with the 8 on the break.':'8 on the break.');return;}
   if(!wasBreak&&(eight||onEight&&scratch)){
    const legal=eight&&onEight&&!foul&&this.marker===eight.pocket;
    this.rackWinner=legal?me:other;this.lastOutcome.end=legal?'eightWin':onEight&&scratch?'eightScratch':!onEight?'earlyEight':'wrongEight';
    this.win(this.rackWinner,legal?'Marked 8 pocketed legally.':onEight&&scratch?'Scratch while playing the 8.':'Early, fouled or unmarked / wrong-pocket 8.');return;
   }
   if(!group&&(wasBreak||!foul)){
    const cats=[...new Set(pots.filter(e=>e.id!==8).map(e=>Q.group(e.id)))];
    if(cats.length===1){this.groups[me]=cats[0];this.groups[other]=cats[0]==='solids'?'stripes':'solids';}
   }
   this.pendingSpot.push(...off.map(e=>e.id));
   const keep=!foul&&pots.some(e=>!this.groups[me]||Q.group(e.id)===this.groups[me]);
   if(!keep){endTurn();spot(w,this.pendingSpot);this.pendingSpot=[];}
   else if(this.groups[me]&&!ownRemaining(w.balls,this.groups[me]).length){const own=this.pendingSpot.filter(id=>Q.group(id)===this.groups[me]);spot(w,own);this.pendingSpot=this.pendingSpot.filter(id=>!own.includes(id));}
   if(foul)this.giveHand(w,wasBreak?'kitchen':'any');
   for(let p=0;p<2;p++)this.scores[p]=this.groups[p]?7-ownRemaining(w.balls,this.groups[p]).length-this.pendingSpot.filter(id=>Q.group(id)===this.groups[p]).length:0;
  }else{
   spot(w,off.map(e=>e.id));
   if(foul){for(const e of pots)if(e.id===9)spot(w,[9]);else this.dead++;endTurn();this.giveHand(w,'any');}
   else{
    for(const e of pots){this.scores[me]=Math.min(this.targetScores[me],this.scores[me]+(e.id===9?2:1));if(this.scores[me]>=this.targetScores[me])break;}
    const nine=pots.some(e=>e.id===9);
    if(nine){this.dead+=w.balls.filter(b=>b.active&&b.id>0&&b.id<9).length;this.rackWinner=me;this.lastOutcome.end=wasBreak?'nineBreak':'nineWin';}
    if(this.scores[me]>=this.targetScores[me]){this.win(me,'Point target reached.');return;}
    if(nine){this.logMessage(this.name()+' takes the rack. Points carry into the next rack.');return;}
    if(!pots.length)endTurn();
   }
  }
  this.logMessage((foul?foul+'. ':'')+this.name()+' to play'+(this.ballInHand?' with ball in hand'+(this.ballInHand==='kitchen'?' in the kitchen':''):'')+'.');
 }
}
const api={Rules,targets,points,spot,railSatisfied,sourceVersion:'2026/27-2028/29; charts verified 2026-09-21'};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CueAPA=api;
})(typeof globalThis!=='undefined'?globalThis:this);
