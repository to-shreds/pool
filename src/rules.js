/* Rules are separate from the simulation. This release deliberately uses a
 * documented Club v0.1 preset, not a claim of complete tournament compliance. */
(function(root){
'use strict';
const P=typeof module!=='undefined'&&module.exports?require('./physics.js'):root.CuePhysics;
const {R,L,W,clone,ball,rack,rackPositions,spot,place}=P;
const modes={
 '8ball':{name:'8-ball',short:'Solids & stripes',target:1},
 '9ball':{name:'9-ball',short:'Rotation to the 9',target:1},
 'straight':{name:'14.1 straight pool',short:'Continuous racks',target:50},
 '3ball':{name:'3-ball',short:'Fewest strokes wins',target:3},
 'onepocket':{name:'One-pocket',short:'Your pocket. Eight balls.',target:8},
 '10ball':{name:'10-ball',short:'Called-shot rotation',target:1},
 'banks':{name:'Bank pool',short:'Short rack, first to five',target:5},
 'rotation':{name:'Rotation',short:'Lowest ball first, 61 points',target:61},
 'practice':{name:'Free practice',short:'No opponent. No fouls.',target:0}
};
const notes={
 '8ball':'Call a ball and pocket after the break, or declare a safety. Groups are assigned by the first legal called pot, not on the break. Clear your group before calling the 8. An early, wrong-pocket or fouled 8 loses. A break-shot 8 is spotted. Four object balls must reach a rail on a dry break.',
 '9ball':'Contact the lowest ball first. A legal 9 wins, including combinations and the break. A push-out is available immediately after a legal break; the opponent can take the table or return the shot. A fouled 9 is spotted. Three consecutive fouls lose, with an on-screen warning at two.',
 'straight':'Call a ball and pocket, or declare safety. Every ball pocketed on a legal called shot scores one. Uncalled and fouled pots are spotted. Ordinary fouls cost one point; three consecutive fouls cost an additional 15 and require a fresh opening break. Fourteen balls are reracked while preserving the break ball. Opening break: score a called ball, or send the cue ball and at least two object balls to rails.',
 '3ball':'Each player clears a fresh three-ball rack. Count every stroke, including the break. A scratch or ball off the table adds one penalty stroke; an object ball off the table is spotted. Lowest total after the selected number of rounds wins. Tied totals are a draw. There is no rail-after-contact requirement in this house variant.',
 'onepocket':'Player 1 owns the upper-right foot pocket (C); Player 2 owns the lower-right (D), unless swapped before the break. First to eight wins. Opponent-pocket pots normally score for your opponent. Other pots are spotted at the end of the inning. A foul costs a scored ball or creates a one-ball debt. Scratch: cue ball in the kitchen. Three consecutive fouls lose.',
 '10ball':'Lowest ball first. Call ball and pocket after the break. The 10 wins only when it is the last object ball and is legally called; an early or break-shot 10 is spotted. Wrongfully pocketing a ball gives the incoming player a take-or-return choice. Push-outs work as in 9-ball. Three consecutive fouls lose.',
 'banks':'Short-rack banks: nine balls, first to five. Call the ball, pocket and number of banks. Score only a direct cue-ball-to-called-ball bank without another ball collision, kiss, or cue-ball kick first. Other pocketed balls are spotted at inning end. Break pots do not score, but a legal pot continues the inning. A foul costs a ball or creates a debt.',
 'rotation':'Club rotation: contact the lowest-numbered ball first. A legal pot scores its face value; 61 points wins. Combinations count. Fouls give the other player ball in hand; balls pocketed on a foul are spotted. This is a named house variant, not a regional rotation rules claim.',
 'practice':'Arrange any position, add or remove balls, and experiment with tip contact, stroke power and cue elevation. Undo restores the whole shot. Replay does not change the score or table. Practice layouts switch to this mode so edited tables cannot silently corrupt a competitive game.'
};
function group(id){return id<8?'solids':id>8?'stripes':null;}
function objects(w){return w.balls.filter(b=>b.active&&b.id>0);}
function rackInterferes(b){
 // Rack outline (including frame clearance), expanded by one ball radius.
 const x0=.75*L-1.2*R,x1=.75*L+4*Math.sqrt(3)*R+1.2*R;
 if(b.p[0]<x0-R||b.p[0]>x1+R)return false;
 const half=(b.p[0]-x0)/Math.sqrt(3)+R;
 return Math.abs(b.p[1]-W/2)<half;
}
function rerackStraight(w){
 const live=objects(w),cue=w.get(0),last=live[0];
 const ci=cue&&cue.active&&rackInterferes(cue),li=last&&rackInterferes(last);
 let full=!last||(ci&&li),hand=null,desc='Fourteen reracked; the break ball stays in position.';
 const ids=w.balls.filter(b=>b.id>0).map(b=>b.id);
 while(ids.length<15){for(let n=1;n<=15;n++)if(!ids.includes(n)){ids.push(n);break;}}
 if(full){
  const pos=rackPositions(15);
  w.balls=[cue,...ids.map((id,i)=>ball(id,...pos[i]))];
  if(ci){cue.active=false;spot(w,0,L*.25,W/2);hand='kitchen';}
  desc='All fifteen reracked.'+(hand?' Cue ball in the kitchen.':'');
 }else{
  if(li){
   const hx=L*.25;const blocked=cue.active&&Math.hypot(cue.p[0]-hx,cue.p[1]-W/2)<2*R+.002;
   last.p=[blocked?L/2:hx,W/2,R];desc='Break ball moved to the '+(blocked?'center':'head')+' spot.';
  }
  if(ci){
   if(last.p[0]>=L/4){hand='kitchen';cue.active=false;spot(w,0,L/4,W/2);}
   else{const blocked=Math.hypot(last.p[0]-L/4,last.p[1]-W/2)<2*R+.002;
    cue.active=false;spot(w,0,blocked?L/2:L/4,W/2);}
  }
  const pos=rackPositions(15).slice(1),others=ids.filter(id=>id!==last.id);
  w.balls=[cue,last,...others.map((id,i)=>ball(id,...pos[i]))];
 }
 return {hand,desc};
}
class Rules{
 constructor(mode='8ball',options={}){
  if(!modes[mode])throw new Error('Unknown game mode.');
  this.mode=mode;this.players=options.players||['Player 1','Player 2'];
  this.target=options.target||modes[mode].target;this.turn=0;this.scores=[0,0];this.runs=[0,0];this.high=[0,0];
  this.groups=[null,null];this.fouls=[0,0];this.owed=[0,0];this.scored=[[],[]];this.pendingSpot=[];
  this.break=true;this.shots=0;this.winner=null;this.ballInHand='kitchen';this.pushAvailable=false;
  this.choice=null;this.pockets=options.pockets||[2,3];this.strokes=0;this.roundScores=[[],[]];
  this.log=[];this.message=mode==='practice'?'Free practice. Set up a shot.':'Player 1 to break. Cue ball can be placed in the kitchen.';
  if(mode==='practice')this.ballInHand=null;
 }
 snapshot(){return clone(this);}
 static from(s){const r=new Rules(s.mode);Object.assign(r,clone(s));return r;}
 needsCall(){return ['8ball','straight','10ball','banks'].includes(this.mode)&&(!this.break||this.mode==='straight');}
 name(){return this.players[this.turn];}
 start(w,options={}){
  return {balls:clone(w.balls),options:{callBall:null,callPocket:null,safety:false,push:false,bankCount:1,...options},
   wasBreak:this.break,hand:this.ballInHand,player:this.turn,pushAvailable:this.pushAvailable};
 }
 logMessage(text){this.message=text;this.log.unshift(text);this.log=this.log.slice(0,30);}
 switchTurn(){this.runs[this.turn]=0;this.turn=1-this.turn;}
 win(player,text){this.winner=player;this.logMessage((player==='draw'?'Draw':this.players[player]+' wins')+'. '+text);}
 giveHand(w,area){this.ballInHand=area;const cue=w.get(0);if(!cue.active){spot(w,0,area==='kitchen'?L*.25:L*.3,W/2);}}
 respot(w,ids){for(const id of [...new Set(ids)].sort((a,b)=>a-b))if(id>0)spot(w,id);}
 flush(w){this.respot(w,this.pendingSpot);this.pendingSpot=[];}
 scoreBall(id,owner){
  if(this.owed[owner]){this.owed[owner]--;this.pendingSpot.push(id);}
  else{this.scored[owner].push(id);this.scores[owner]++;}
 }
 penaltyBall(player){if(this.scored[player].length){this.pendingSpot.push(this.scored[player].pop());this.scores[player]--;}
  else this.owed[player]++;}
 choose(w,take){
  if(!this.choice)return;
  const c=this.choice;this.choice=null;
  if(c.type==='straightBreak'){
   if(!take){w.balls=rack('straight');this.turn=c.shooter;this.break=true;this.ballInHand='kitchen';this.logMessage(this.name()+' must rebreak.');}
   else{this.turn=1-c.shooter;this.break=false;this.logMessage(this.name()+' accepts the table.');}
  }else{this.turn=take?1-c.shooter:c.shooter;this.logMessage(this.name()+(take?' takes the table.':' has the shot returned.'));}
 }
 finish(w,pre){
  const me=pre.player,other=1-me,o=pre.options,mode=this.mode,ev=w.events;
  this.shots++;this.ballInHand=null;this.pushAvailable=false;
  const pots=ev.filter(e=>e.type==='pocket'&&e.id>0),off=ev.filter(e=>e.type==='off'),scratched=ev.some(e=>(e.type==='pocket'||e.type==='off')&&e.id===0);
  const first=ev.find(e=>e.type==='ball'&&(e.a===0||e.b===0));
  const hit=first?(first.a===0?first.b:first.a):null;
  const preObjs=pre.balls.filter(b=>b.active&&b.id>0),lowest=Math.min(...preObjs.map(b=>b.id));
  const rails=first?ev.filter(e=>e.type==='rail'&&e.t>=first.t):[];
  const called=pots.some(e=>e.id===o.callBall&&e.pocket===o.callPocket);
  const push=o.push&&pre.pushAvailable&&['9ball','10ball'].includes(mode);
  let reason=scratched?'Cue-ball scratch':off.length?'Ball off the table':null;
  if(!reason&&!push&&!first)reason='No object ball contacted';
  if(!reason&&!push&&['9ball','10ball','rotation'].includes(mode)&&hit!==lowest)reason='The '+lowest+' ball had to be contacted first';
  if(!reason&&!pre.wasBreak&&mode==='8ball'){
   const legal=this.groups[me]?preObjs.filter(b=>group(b.id)===this.groups[me]).map(b=>b.id):preObjs.filter(b=>b.id!==8).map(b=>b.id);
   if(!(legal.length?legal:[8]).includes(hit))reason='Wrong ball contacted first';
  }
  if(!reason&&!push&&first&&!rails.length&&!pots.length)reason='No rail or pocket after contact';
  if(!reason&&pre.wasBreak&&['8ball','9ball','10ball','banks'].includes(mode)&&!pots.length&&new Set(rails.filter(e=>e.id>0).map(e=>e.id)).size<4)reason='Illegal break: fewer than four object balls reached rails';
  let breakFoul=false;
  if(mode==='straight'&&pre.wasBreak&&!called){
   const good=rails.some(e=>e.id===0)&&new Set(rails.filter(e=>e.id>0).map(e=>e.id)).size>=2;
   if(!good){reason='Opening break requirement not met';breakFoul=true;}
  }
  // Kitchen escape is evaluated from the initial cue/object position and rails
  // before first contact. Frozen-rail and double-hit exceptions remain out of scope.
  if(!reason&&!push&&pre.hand==='kitchen'&&first&&!pre.wasBreak){
   const target=pre.balls.find(b=>b.id===hit);
   const leftKitchen=ev.some(e=>e.type==='rail'&&e.id===0&&e.t<first.t);
   if(target&&target.p[0]<L/4&&!leftKitchen)reason='Shoot out of the kitchen before contacting a ball inside it';
  }
  let foul=!!reason;
  this.break=false;
  if(mode==='practice'){
   this.scores[0]+=pots.length;if(scratched)this.giveHand(w,'any');
   this.logMessage(pots.length?pots.length+' ball'+(pots.length===1?'':'s')+' pocketed.':'Try another shot.');return;
  }
  if(mode==='3ball'){
   const penalty=scratched||off.length?1:0;this.strokes+=1+penalty;
   this.respot(w,off.filter(e=>e.id>0).map(e=>e.id));if(scratched)this.giveHand(w,'kitchen');
   if(objects(w).length===0){
    this.roundScores[me].push(this.strokes);this.scores[me]+=this.strokes;
    const result=this.players[me]+' cleared in '+this.strokes+' strokes.';this.strokes=0;
    if(this.roundScores[0].length>=this.target&&this.roundScores[1].length>=this.target){
     this.win(this.scores[0]===this.scores[1]?'draw':this.scores[0]<this.scores[1]?0:1,result);return;}
    this.switchTurn();w.balls=rack('3ball');this.break=true;this.ballInHand='kitchen';this.logMessage(result+' '+this.name()+' starts a fresh rack.');
   }else this.logMessage(this.strokes+' stroke'+(this.strokes===1?'':'s')+(penalty?' (includes one foul penalty).':'.'));
   return;
  }
  if(foul){this.fouls[me]++;}else this.fouls[me]=0;
  if(foul&&this.fouls[me]>=3&&['9ball','10ball','onepocket','banks'].includes(mode)){
   this.win(other,'Three consecutive fouls.');return;}
  if(mode==='8ball'){
   const eight=pots.find(e=>e.id===8),eightOff=off.some(e=>e.id===8);
   if(pre.wasBreak){
    if(eight||eightOff)this.respot(w,[8]);
    if(!pots.length||foul)this.switchTurn();
    if(foul)this.giveHand(w,'kitchen');
    this.logMessage((foul?reason+'. ':'')+(eight?'The 8 is spotted. ':'')+this.name()+' to play. Table is open.');return;
   }
   if(eight||eightOff){
    const cleared=this.groups[me]&&!preObjs.some(b=>group(b.id)===this.groups[me]);
    const legal=eight&&!foul&&cleared&&o.callBall===8&&o.callPocket===eight.pocket&&!o.safety;
    this.win(legal?me:other,legal?'The called 8 was pocketed legally.':'The 8 was pocketed or driven off illegally.');return;
   }
   if(!this.groups[me]&&!foul&&called&&!o.safety&&group(o.callBall)){
    this.groups[me]=group(o.callBall);this.groups[other]=this.groups[me]==='solids'?'stripes':'solids';
   }
   const keep=!foul&&!o.safety&&called&&group(o.callBall)===this.groups[me];
   if(!keep)this.switchTurn();if(foul)this.giveHand(w,'any');
   for(let i=0;i<2;i++)this.scores[i]=this.groups[i]?7-objects(w).filter(b=>group(b.id)===this.groups[i]).length:0;
  }else if(mode==='9ball'||mode==='10ball'){
   const key=mode==='9ball'?9:10,keyPot=pots.find(e=>e.id===key);
   if(keyPot||off.some(e=>e.id===key)){
    const winning=keyPot&&!foul&&!push&&(mode==='9ball'||(!pre.wasBreak&&preObjs.length===1&&called&&!o.safety));
    if(winning){this.win(me,'The '+key+' was pocketed legally.');return;}this.respot(w,[key]);
   }
   if(foul){this.switchTurn();this.giveHand(w,'any');}
   else if(push){this.turn=other;this.choice={type:'push',shooter:me};this.logMessage(this.name()+': take the table or return the push-out.');return;}
   else{
    const keep=pre.wasBreak?pots.length>0:mode==='9ball'?pots.length>0:called&&!o.safety;
    if(!keep)this.switchTurn();
    if(mode==='10ball'&&!pre.wasBreak&&!keep&&(pots.length||o.safety)){
     this.choice={type:'return',shooter:me};this.logMessage(this.name()+': take the table or return the shot.');return;}
    if(pre.wasBreak)this.pushAvailable=true;
   }
  }else if(mode==='straight'){
   if(foul||!called||o.safety)this.respot(w,[...pots.map(e=>e.id),...off.map(e=>e.id)]);
   if(foul){
    this.scores[me]-=breakFoul?2:1;
    if(this.fouls[me]>=3&&!breakFoul){
     this.scores[me]-=15;this.fouls[me]=0;w.balls=rack('straight');this.break=true;this.ballInHand='kitchen';this.runs[me]=0;
     this.logMessage('Three consecutive fouls: 16 points deducted on this shot. '+this.name()+' must break a new rack.');return;
    }
    this.switchTurn();if(scratched)this.giveHand(w,'kitchen');
    if(breakFoul){this.fouls[me]--;this.choice={type:'straightBreak',shooter:me};this.logMessage('Opening-break foul: two points deducted. '+this.name()+' may accept or demand a rebreak.');return;}
   }else if(called&&!o.safety){
    this.scores[me]+=pots.length;this.runs[me]+=pots.length;this.high[me]=Math.max(this.high[me],this.runs[me]);
    if(this.scores[me]>=this.target){this.win(me,'Target of '+this.target+' reached.');return;}
    if(objects(w).length<=1){const r=rerackStraight(w);this.ballInHand=r.hand;this.logMessage(r.desc+' Run: '+this.runs[me]+'.');return;}
   }else this.switchTurn();
  }else if(mode==='onepocket'||mode==='banks'){
   let keep=false;
   if(mode==='onepocket'){
    for(const pot of pots){
     const owner=this.pockets.indexOf(pot.pocket);
     if(owner<0||foul&&(owner===me||scratched)){this.pendingSpot.push(pot.id);continue;}
     this.scoreBall(pot.id,owner);if(owner===me)keep=true;
    }
   }else{
    let valid=false;
    if(!pre.wasBreak&&called&&!foul&&!o.safety&&hit===o.callBall){
     const pot=pots.find(e=>e.id===o.callBall&&e.pocket===o.callPocket);
     const bankEvents=ev.filter(e=>e.type==='rail'&&e.kind!=='jaw'&&e.id===o.callBall&&e.t>first.t&&e.t<pot.t);
     const interfered=ev.some(e=>e.type==='ball'&&e!==first&&(e.a===o.callBall||e.b===o.callBall)&&e.t<=pot.t);
     const kick=ev.some(e=>e.type==='rail'&&e.id===0&&e.t<first.t);
     valid=!interfered&&!kick&&bankEvents.length===o.bankCount;
    }
    for(const pot of pots){if(valid&&pot.id===o.callBall){this.scoreBall(pot.id,me);keep=true;}else this.pendingSpot.push(pot.id);}
    if(pre.wasBreak&&!foul&&pots.length)keep=true;
   }
   this.pendingSpot.push(...off.filter(e=>e.id>0).map(e=>e.id));
   if(foul){this.penaltyBall(me);keep=false;}
   // In a simultaneous win the shooter wins when they scored legally.
   for(const owner of [me,other])if(this.scores[owner]>=this.target){this.win(owner,'Target reached.');return;}
   if(!keep||foul||o.safety){this.switchTurn();this.flush(w);}else if(objects(w).length===0)this.flush(w);
   if(scratched)this.giveHand(w,'kitchen');
  }else if(mode==='rotation'){
   if(foul){this.respot(w,[...pots.map(e=>e.id),...off.map(e=>e.id)]);this.switchTurn();this.giveHand(w,'any');}
   else{this.scores[me]+=pots.reduce((s,e)=>s+e.id,0);if(this.scores[me]>=61){this.win(me,'61 points reached.');return;}if(!pots.length)this.switchTurn();}
  }
  const warning=this.fouls[this.turn]===2&&['9ball','10ball','onepocket','banks','straight'].includes(mode)?' Warning: two consecutive fouls.':'';
  this.logMessage((foul?reason+'. ':'')+this.name()+' to play'+(this.ballInHand?' with ball in hand'+(this.ballInHand==='kitchen'?' in the kitchen':''):'')+'.'+warning);
 }
}
const api={Rules,modes,notes,group,objects,rerackStraight,rackInterferes};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CueRules=api;
})(typeof globalThis!=='undefined'?globalThis:this);
