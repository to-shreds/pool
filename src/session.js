/* Complete match / coaching / execution state, serialized independently of the renderer. */
(function(root){'use strict';const node=typeof module!=='undefined'&&module.exports;
const P=node?require('./physics.js'):root.CuePhysics,Q=node?require('./rules.js'):root.CueRules,A=node?require('./apa.js'):root.CueAPA,S=node?require('./settings.js'):root.CueSettings,E=node?require('./execution.js'):root.CueExecution;
const stats=()=>({shots:0,attacks:0,scoringShots:0,pots:0,scratches:0,fouls:0,defense:0,bankAttempts:0,bankMakes:0,breaks:0,breakPots:0,eightBreak:0,nineBreak:0,breakRuns:0,run:0,bestRun:0});
function create(mode,s,seed=0x73819){const skills=mode==='apa9'?[s.skill9a,s.skill9b]:[s.skill1,s.skill2];const target=mode==='apa9'?(s.handicap?skills.map(n=>A.points[n]):[s.points9,s.points9]):mode==='apa8'&&s.handicap?A.targets(...skills):[s.race,s.race];
 return {version:3,settings:S.normalize(s),seed:seed>>>0,chalk:[1,1],timeouts:[0,0],wins:[0,0],targets:target,mode,skills,rack:1,breaker:0,firstBreaker:0,rackEnded:false,winner:null,stats:[stats(),stats()],rackStartStats:[stats(),stats()],innings:0,rackStartInnings:0,records:[],lastShot:null,lag:null};}
function makeRules(session,players){const opts={players,skills:session.skills,targets:session.targets,breaker:session.breaker,lagLoser:1-session.firstBreaker};const r=['apa8','apa9'].includes(session.mode)?new A.Rules(session.mode,opts):new Q.Rules(session.mode,{players});r.turn=session.breaker;if(r.mode!=='practice')r.message=r.players[r.turn]+' to break. Cue ball can be placed in the kitchen.';return r;}
function allowance(session,r){const s=session.settings;if(s.timeouts==='off')return 0;if(r.mode==='practice'||r.break)return Infinity;if(s.timeouts==='unlimited')return Infinity;const skill=r.mode==='apa9'?session.skills[r.turn]:(r.turn===0?s.skill1:s.skill2);const total=s.timeouts==='custom'?s.timeoutCount:skill<=3?2:1;return Math.max(0,total-session.timeouts[r.turn]);}
function useTimeout(session,r){if(allowance(session,r)<=0)return false;if(r.mode!=='practice'&&!r.break)session.timeouts[r.turn]++;return true;}
function isComputer(session,r,player=r.turn){return r.mode!=='practice'&&(session.settings.opponent==='watch'||session.settings.opponent==='computer'&&player===1);}
function finish(session,w,r,pre,delivered,startWorld){const me=pre.player,st=session.stats[me],events=w.events,pots=events.filter(e=>e.type==='pocket'&&e.id>0),out=r.lastOutcome;
 st.shots++;if(pre.options.safety)st.defense++;else st.attacks++;
 const foul=out?out.foul:r.fouls[me]>(pre.foulsBefore??0)||!!r.ballInHand&&r.turn!==me;
 const scratch=events.some(e=>(e.type==='pocket'||e.type==='off')&&e.id===0);st.scratches+=scratch;st.fouls+=!!foul;
 st.pots+=pots.length;if(pots.length&&!foul&&!pre.options.safety)st.scoringShots++;
 if(pre.wasBreak&&!out?.invalidBreak){session.breaker=me;st.breaks++;st.breakPots+=pots.length;}
 const banks=pre.options.bankCount||1;if(pre.family==='bank'){st.bankAttempts++;if(!foul&&pots.some(e=>e.id===pre.options.callBall&&e.pocket===pre.options.callPocket))st.bankMakes++;}
 const run=foul?0:st.run+pots.length;st.bestRun=Math.max(st.bestRun,run);st.run=foul||r.turn!==me?0:run;
 if(out?.end==='eightBreak')st.eightBreak++;if(out?.end==='nineBreak')st.nineBreak++;
 if(r.innings!==undefined)session.innings=session.rackStartInnings+r.innings;
 else if(r.turn!==me&&me===1-session.firstBreaker)session.innings++;
 session.lastShot={shooter:me,intended:pre.intended,delivered:P.clone(delivered),startWorld,events:events.filter(e=>e.type!=='strike').slice(0,400),cueEnd:[...w.get(0).p],foul:!!foul,scratch,defense:!!pre.options.safety,pots:pots.map(e=>e.id),bankCount:banks};
 const rackWin=r.rackWinner!==null&&r.rackWinner!==undefined?r.rackWinner:r.winner;
 if(rackWin!==null&&rackWin!==undefined){
  session.rackEnded=true;
  if(rackWin==='draw'){session.winner='draw';}
  else{session.wins[rackWin]++;const other=1-rackWin;
   if(rackWin===session.breaker&&session.stats[other].shots===session.rackStartStats[other].shots&&session.stats[rackWin].fouls===session.rackStartStats[rackWin].fouls&&!['eightBreak','nineBreak'].includes(out?.end))session.stats[rackWin].breakRuns++;
   if(r.mode==='apa9'){if(r.winner!==null)session.winner=r.winner;}
   else if(['straight','3ball','rotation','practice'].includes(r.mode)||session.wins[rackWin]>=session.targets[rackWin])session.winner=rackWin;
   session.nextBreaker=['apa8','apa9'].includes(r.mode)||session.settings.breakOrder==='winner'?rackWin:1-session.breaker;
  }
  session.records.push({rack:session.rack,winner:rackWin,points:[...r.scores],dead:r.dead??0,innings:session.innings-session.rackStartInnings,defense:r.defense||session.stats.map((s,i)=>s.defense-session.rackStartStats[i].defense),result:r.message});
 }
}
function nextRack(session,r){if(!session.rackEnded||session.winner!==null)return null;session.rack++;session.breaker=session.nextBreaker??session.breaker;session.rackEnded=false;session.timeouts=[0,0];session.rackStartInnings=session.innings;session.rackStartStats=P.clone(session.stats);const out=makeRules(session,r.players);if(r.mode==='apa9')out.scores=[...r.scores];return out;}
function stalemate(session,w,r){if(!['apa8','apa9'].includes(r.mode)||session.rackEnded)return null;
 const points=[...r.scores],beforeInnings=session.innings-session.rackStartInnings;
 const dead=r.mode==='apa9'?r.dead+w.balls.filter(b=>b.active&&b.id>0).reduce((n,b)=>n+(b.id===9?2:1),0):0;
 session.records.push({rack:session.rack,winner:'stalemate',points:r.mode==='apa9'?points:[0,0],dead,innings:r.mode==='apa9'?beforeInnings:0,defense:r.mode==='apa9'?[...r.defense]:[0,0],result:'Agreed stalemate. Original breaker breaks again.'});
 if(r.mode==='apa8'){session.stats=P.clone(session.rackStartStats);session.innings=session.rackStartInnings;}
 session.stats.forEach(s=>s.run=0);session.rack++;session.timeouts=[0,0];session.lastShot=null;session.rackStartStats=P.clone(session.stats);session.rackStartInnings=session.innings;
 const next=makeRules(session,r.players);if(r.mode==='apa9')next.scores=points;return next;}
function valid(s){
 const integer=(x,min=0,max=10000000)=>Number.isInteger(x)&&x>=min&&x<=max,vec=(v,n=3)=>Array.isArray(v)&&v.length===n&&v.every(Number.isFinite),pair=(v,test)=>Array.isArray(v)&&v.length===2&&v.every(test);
 if(!s||s.version!==3||!S.valid(s.settings)||!integer(s.seed,0,4294967295)||!Q.modes[s.mode])return false;
 if(!pair(s.chalk,n=>Number.isFinite(n)&&n>=0&&n<=1)||!pair(s.timeouts,n=>integer(n))||!pair(s.wins,n=>integer(n))||!pair(s.targets,n=>integer(n,1,999))||!pair(s.skills,n=>integer(n,1,9)))return false;
 if(![null,0,1,'draw'].includes(s.winner)||![0,1].includes(s.breaker)||![0,1].includes(s.firstBreaker)||!integer(s.rack,1)||typeof s.rackEnded!=='boolean')return false;
 if(s.nextBreaker!==undefined&&![0,1].includes(s.nextBreaker))return false;
 if(s.mode==='apa8'&&s.skills.some(x=>x<2||x>7))return false;
 for(const k of ['stats','rackStartStats'])if(!pair(s[k],st=>st&&Object.keys(stats()).every(key=>integer(st[key]))))return false;
 if(!integer(s.innings)||!integer(s.rackStartInnings)||s.rackStartInnings>s.innings)return false;
 if(!Array.isArray(s.records)||s.records.length>2000||!s.records.every(r=>r&&integer(r.rack,1)&&[0,1,'draw','stalemate'].includes(r.winner)&&pair(r.points,Number.isFinite)&&Number.isFinite(r.dead)&&r.dead>=0&&integer(r.innings)&&pair(r.defense,n=>integer(n))&&typeof r.result==='string'&&r.result.length<=2000))return false;
 if(s.lag!==null){const l=s.lag;if(!l||![0,1].includes(l.player)||typeof l.awaitNext!=='boolean'||!Array.isArray(l.results)||l.results.length>2||!l.results.every(x=>x&&typeof x.invalid==='boolean'&&Number.isFinite(x.distance)))return false;}
 if(s.lastShot!==null){const l=s.lastShot;if(!l||![0,1].includes(l.shooter)||!vec(l.cueEnd)||typeof l.foul!=='boolean'||typeof l.scratch!=='boolean'||typeof l.defense!=='boolean'||!Array.isArray(l.events)||l.events.length>400)return false;
  if(!l.events.every(e=>e&&['ball','rail','pocket','off'].includes(e.type)&&Number.isFinite(e.t)&&e.t>=0&&(e.type==='ball'?integer(e.a,0,15)&&integer(e.b,0,15):integer(e.id,0,15))&&(e.type!=='pocket'||integer(e.pocket,0,5))&&(e.type!=='rail'||integer(e.rail,0,17)&&['cushion','jaw'].includes(e.kind))))return false;
  if(!l.startWorld||!Array.isArray(l.startWorld.balls)||l.startWorld.balls.length>16||!l.startWorld.balls.every(b=>integer(b.id,0,15)&&vec(b.p)&&vec(b.v)&&vec(b.w)&&vec(b.q,4)))return false;
  for(const st of [l.intended,l.delivered?.shot])if(!st||!['angle','side','up','elevation','power'].every(k=>Number.isFinite(st[k])))return false;
  if(!Array.isArray(l.pots)||!l.pots.every(id=>integer(id,1,15)))return false;
 }
 return true;
}
const api={create,makeRules,allowance,useTimeout,isComputer,finish,nextRack,stalemate,valid,stats};if(node)module.exports=api;root.CueSession=api;
})(typeof globalThis!=='undefined'?globalThis:this);
