(function(){
'use strict';
const P=window.CuePhysics, Q=window.CueRules;
const {R,DT,World,ball,clone,clamp,place,spot,validPosition}=P;
let L=P.L,W=P.W;
const CS=window.CueSettings,CE=window.CueExecution,CM=window.CueSession;
let settings=CS.normalize(),session=CM.create('8ball',settings,0x619297),renderer3d=null;
let aiThinking=false,computerPaused=false,analysisWorker=null,analysisJob=null,jobCounter=0,generation=0,aiTimer=0;
let cameraLook=false,d3gesture=null,cameraAnchor=null,coachState=null,coachOverlay=null,appliedFamily=null;
let settingsDraft=null,settingsPage=0,settingsGroup='Gameplay',coachPage=0,paceStart=performance.now(),frozenCache=[];
let riskCache=null;
const $=id=>document.getElementById(id),canvas=$('table');
let ctx=canvas.getContext('2d');
const KEY='cue-lab.state.v1',LAYOUT='cue-lab.position.v1';
let world=new World(P.rack()),rules=new Q.Rules(),angle=0,side=0,up=0,elevation=0,power=90;
let guide=true,trails=true,sound=false,timeScale=1,arranging=false,placing=false,editId=0;
let shotRunning=false,shotPre=null,undoStack=[],record=[],lastReplay=null,replay=null,trace=[],sinks=[];
let accumulator=0,lastFrame=0,frameTicks=0,seenEvents=0,toastTimer=null,storageWarning=false;
let view={scale:1,ox:0,oy:0,w:0,h:0},audio=null,aimPointer=null,tipPointer=null,fineBase=0;
let editorState=null,placementDrag=null,nudgeDelay=null,nudgeTimer=null,readerFrame=0;
const readers={},pages={shot:'aim',table:'drills',match:'setup'};
const colors=['#f0f0dc','#e6ba35','#3677be','#c94537','#784d9d','#e67c34','#388d64','#9d3437','#17202a',
 '#e6ba35','#3677be','#c94537','#784d9d','#e67c34','#388d64','#9d3437'];
const cssColor=(id)=>colors[id]||'#fff';
const toScreen=(x,y)=>[view.ox+x*view.scale,view.oy-y*view.scale];
function fromScreen(clientX,clientY){const b=canvas.getBoundingClientRect();return [(clientX-b.left-view.ox)/view.scale,(view.oy-(clientY-b.top))/view.scale];}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4200);}
function data(){return {schema:'cue-lab-save-v1',world:world.snapshot(),rules:rules.snapshot(),shot:{angle,side,up,elevation,power},session:clone(session),declaration:{ball:$('callBall').value,pocket:$('callPocket').value,safety:$('safety').checked,push:$('push').checked,bankCount:Number($('bankCount').value)},preferences:{guide,trails,sound,cloth:$('cloth').value}};}
function storageSet(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(e){if(!storageWarning){toast('This browser blocked local saves. Use Export save to keep your position.');storageWarning=true;}return false;}}
function persist(){if(!shotRunning&&!replay)storageSet(KEY,data());}
function validSave(s){
 if(s?.session&&!CM.valid(s.session))return false;
 if(s?.declaration){const d=s.declaration;if(!d||typeof d.ball!=='string'||!/^([1-9]|1[0-5])?$/.test(d.ball)||typeof d.pocket!=='string'||!/^([1-6])?$/.test(d.pocket)||typeof d.safety!=='boolean'||typeof d.push!=='boolean'||![1,2,3].includes(d.bankCount))return false;}
 if(s?.session&&s.session.mode!==s.rules?.mode)return false;
 if(!s||s.schema!=='cue-lab-save-v1'||!s.world||!Array.isArray(s.world.balls)||s.world.balls.length>16||!s.rules||!Q.modes[s.rules.mode]||!s.shot)return false;
 const ids=new Set();
 for(const b of s.world.balls){if(b.radius!==undefined&&(!Number.isFinite(b.radius)||b.radius<.025||b.radius>.032))return false;if(b.mass!==undefined&&(!Number.isFinite(b.mass)||b.mass<.12||b.mass>.23))return false;
 if(!Number.isInteger(b.id)||b.id<0||b.id>15||ids.has(b.id))return false;ids.add(b.id);
  for(const k of ['p','v','w'])if(!Array.isArray(b[k])||b[k].length!==3||!b[k].every(Number.isFinite))return false;
  if(!Array.isArray(b.q)||b.q.length!==4||!b.q.every(Number.isFinite)||typeof b.active!=='boolean')return false;
  if(Math.abs(b.p[0])>5||Math.abs(b.p[1])>5||b.p[2]<0||b.p[2]>5||P.norm(b.v)>100||P.norm(b.w)>10000)return false;
 }
 for(const b of s.world.balls){const qn=Math.hypot(...b.q);if(Math.abs(qn-1)>.001)return false;}
 if(s.world.cfg?.tableLength!==undefined&&(!Number.isFinite(s.world.cfg.tableLength)||s.world.cfg.tableLength<1.8||s.world.cfg.tableLength>3))return false;
 if(s.world.cfg?.tableWidth!==undefined&&(!Number.isFinite(s.world.cfg.tableWidth)||s.world.cfg.tableWidth<.9||s.world.cfg.tableWidth>1.5))return false;
 if(!ids.has(0)||(!s.world.balls.find(b=>b.id===0).active&&s.rules.winner===null)||!World.from(s.world).atRest())return false;
 const r=s.rules;
 for(const k of ['break','pushAvailable'])if(typeof r[k]!=='boolean')return false;
 for(const k of ['shots','strokes'])if(!Number.isInteger(r[k])||r[k]<0||r[k]>1000000)return false;
 if(![0,1].includes(r.turn)||![null,0,1,'draw'].includes(r.winner)||!Array.isArray(r.players)||r.players.length!==2||!r.players.every(n=>typeof n==='string'&&n.length<=24)||!Number.isFinite(r.target)||r.target<0||r.target>999)return false;
 for(const k of ['scores','runs','high','fouls','owed'])if(!Array.isArray(r[k])||r[k].length!==2||!r[k].every(Number.isFinite))return false;
 if(!Array.isArray(r.scored)||r.scored.length!==2||!r.scored.every(a=>Array.isArray(a)&&a.every(n=>Number.isInteger(n)&&n>=1&&n<=15)))return false;
 if(!Array.isArray(r.pendingSpot)||!r.pendingSpot.every(n=>Number.isInteger(n)&&n>=1&&n<=15)||!Array.isArray(r.log)||!r.log.every(x=>typeof x==='string')||r.log.length>30)return false;
 if(!Array.isArray(r.roundScores)||r.roundScores.length!==2||!r.roundScores.every(a=>Array.isArray(a)&&a.length<=999&&a.every(Number.isFinite)))return false;
 if(!Array.isArray(r.groups)||r.groups.length!==2||!r.groups.every(g=>[null,'solids','stripes'].includes(g))||!Array.isArray(r.pockets)||r.pockets.length!==2||r.pockets.some(p=>![2,3].includes(p))||r.pockets[0]===r.pockets[1])return false;
 if(![null,'any','kitchen'].includes(r.ballInHand)||typeof r.message!=='string'||r.message.length>2000)return false;
 if(r.choice&&(!['push','return','straightBreak'].includes(r.choice.type)||![0,1].includes(r.choice.shooter)))return false;
 if(['apa8','apa9'].includes(r.mode)&&(![null,0,1,2,3,4,5].includes(r.marker)||![0,1].includes(r.lagLoser)||![0,1].includes(r.breaker)||!Array.isArray(r.targetScores)||r.targetScores.length!==2||!r.targetScores.every(n=>Number.isFinite(n)&&n>=1&&n<=150)||!Array.isArray(r.skills)||r.skills.length!==2||!r.skills.every(n=>Number.isInteger(n)&&n>=1&&n<=9)||!Array.isArray(r.defense)||r.defense.length!==2||!r.defense.every(n=>Number.isFinite(n)&&n>=0)||!Number.isFinite(r.dead)||r.dead<0||!Number.isFinite(r.innings)||r.innings<0||![null,0,1].includes(r.rackWinner)))return false;
 if(!['angle','side','up','elevation','power'].every(k=>Number.isFinite(s.shot[k])))return false;
 if(Math.hypot(s.shot.side,s.shot.up)>.971||s.shot.elevation<0||s.shot.elevation>80||s.shot.power<1||s.shot.power>100)return false;
 const limits={slide:[.05,.4],roll:[.003,.04],spin:[1,40],ballRestitution:[.7,1],ballFriction:[0,.15],railRestitution:[.5,.9],railFriction:[0,.4],slateRestitution:[0,.6],cueMass:[.2,1],cueRestitution:[.2,.95],tipFriction:[.1,1.2],deflection:[0,5]};
 if(!s.world.cfg)return false;for(const [k,[lo,hi]] of Object.entries(limits)){const v=s.world.cfg[k];if(!Number.isFinite(v)||v<lo||v>hi)return false;}
 return true;
}
function restore(s){
 if(!validSave(s))throw new Error('This is not a valid, settled Cue Lab save.');
 if(editorState)closePrecision(false);
 cancelAnalysis();generation++;coachState=null;coachOverlay=null;
 world=World.from(s.world);rules=Q.Rules.from(s.rules);
 session=s.session?clone(s.session):CM.create(rules.mode,CS.normalize({guide:s.preferences?.guide!==false,trails:s.preferences?.trails!==false,sound:!!s.preferences?.sound,clothPreset:s.preferences?.cloth||'normal'}));
 settings=session.settings;syncDimensions();
 ({angle,side,up,elevation,power}=s.shot);
 guide=s.preferences?.guide!==false;trails=s.preferences?.trails!==false;sound=!!s.preferences?.sound;
 $('cloth').value=['normal','fast','slow'].includes(s.preferences?.cloth)?s.preferences.cloth:'normal';
 shotRunning=false;shotPre=null;replay=null;arranging=false;placing=false;trace=[];sinks=[];accumulator=0;
 refresh();if(s.declaration){$('callBall').value=s.declaration.ball;$('callPocket').value=s.declaration.pocket;$('safety').checked=s.declaration.safety;$('push').checked=s.declaration.push;$('bankCount').value=String(s.declaration.bankCount);refreshShot();}

}
function changed(){coachOverlay=null;riskCache=null;refreshShot();persist();}
function refresh(){
 $('mode').value=rules.mode;$('gameTitle').textContent=Q.modes[rules.mode].name;
 $('target').value=rules.target;$('targetRow').hidden=!['straight','3ball'].includes(rules.mode);
 $('swapPockets').hidden=rules.mode!=='onepocket'||!rules.break||rules.shots>0;
 $('matchInfo').textContent=rules.mode==='straight'?'RACE TO '+rules.target:rules.mode==='3ball'?rules.target+' ROUNDS · LOW SCORE WINS':'CLUB RULES · v0.1';
 for(let i=0;i<2;i++){
  $('name'+i).textContent=rules.players[i];$('editName'+i).value=rules.players[i];$('score'+i).textContent=rules.scores[i];
  $('player'+i).classList.toggle('active',rules.turn===i&&rules.winner===null);
  let desc='';
  if(rules.mode==='8ball')desc=rules.groups[i]?rules.groups[i][0].toUpperCase()+rules.groups[i].slice(1)+' · '+(7-rules.scores[i])+' left':'Open table';
  else if(['9ball','10ball','rotation'].includes(rules.mode))desc=rules.fouls[i]+' consecutive foul'+(rules.fouls[i]===1?'':'s');
  else if(rules.mode==='straight')desc='Run '+rules.runs[i]+' · best '+rules.high[i];
  else if(rules.mode==='onepocket')desc='Pocket '+world.table.pockets[rules.pockets[i]].label+(rules.owed[i]?' · owes '+rules.owed[i]:'');
  else if(rules.mode==='banks')desc='First to 5'+(rules.owed[i]?' · owes '+rules.owed[i]:'');
  else if(rules.mode==='3ball')desc='Rounds: '+rules.roundScores[i].length+(i===rules.turn?' · '+rules.strokes+' strokes':'');
  else desc=i===0?'Balls pocketed':'Free practice';
  $('detail'+i).textContent=desc;
 }
 $('player1').style.visibility=rules.mode==='practice'?'hidden':'visible';
 scheduleReaders();
 $('status').textContent=rules.message;$('shotCount').textContent='SHOT '+(rules.shots+1);
 const old=$('callBall').value;$('callBall').replaceChildren(new Option('Choose',''));
 for(const b of world.balls.filter(b=>b.active&&b.id>0).sort((a,b)=>a.id-b.id))$('callBall').add(new Option(String(b.id),String(b.id)));
 if([...$('callBall').options].some(o=>o.value===old))$('callBall').value=old;
 $('callControls').hidden=!rules.needsCall();$('bankCountLabel').hidden=rules.mode!=='banks';
 $('pushControl').hidden=!rules.pushAvailable;if(!rules.pushAvailable)$('push').checked=false;
 $('choice').hidden=!rules.choice;
 if(rules.choice){$('choiceText').textContent=rules.message;$('returnShot').textContent=rules.choice.type==='straightBreak'?'Demand rebreak':'Return shot';}
 $('guide').classList.toggle('selected',guide);$('guide').setAttribute('aria-pressed',String(guide));
 $('arrange').classList.toggle('selected',arranging);$('arrange').textContent=arranging?'Done arranging':'Arrange balls';$('precisionBall').disabled=!arranging||shotRunning||!!replay;$('placeCue').classList.toggle('selected',placing);
 $('placeCue').disabled=shotRunning||!!replay||!(rules.ballInHand||rules.mode==='practice');
 $('trails').checked=trails;$('sound').checked=sound;
 $('power').value=power;$('elevation').value=elevation;
 $('editBall').value=String(editId);
 $('undo').disabled=undoStack.length===0;$('replay').disabled=!lastReplay&&!replay;
 $('newGame').disabled=false;$('finish').hidden=!shotRunning;
 refreshShot();refreshFeatures();
}
function refreshShot(){
 const info=P.strikeInfo(angle,side,up,elevation,power,{...world.cfg,cueRadius:P.radius(world.get(0)),cueBallMass:P.mass(world.get(0)),tipFriction:tipFriction(),noMiscue:!settings.miscues});
 $('elevationValue').value=elevation+'°';$('powerValue').value=power+'%';$('speedEstimate').textContent=info.speed.toFixed(1)+' m/s impulse';
 const labels=[];if(Math.abs(up)>.03)labels.push(up>0?'Follow':'Draw');if(Math.abs(side)>.03)labels.push(side>0?'Right English':'Left English');
 $('tipDescription').textContent=labels.join(' + ')||'Center ball';
 $('spinSummary').textContent=$('tipDescription').textContent;$('angleSummary').textContent=elevation?'Cue '+elevation+'°':'Cue level';
 const bad=info.contactHeight<.006;
 $('tipWarning').hidden=!info.miscue&&!bad;
 $('tipWarning').textContent=bad?'Tip would hit the cloth. Choose a higher contact point.':info.miscue?'Outside the chalk grip limit: expect a miscue.':'';
 const needCall=rules.needsCall()&&!$('safety').checked&&!$('push').checked&&(!$('callBall').value||!$('callPocket').value);
 $('shoot').disabled=shotRunning||!!replay||!!rules.choice||rules.winner!==null||arranging||placing||bad||needCall;
 $('shotMode').textContent=replay?'REPLAY':arranging?'ARRANGE':rules.winner!==null?'GAME OVER':shotRunning?'IN MOTION':rules.break?'BREAK':'AIM';
 let hint='Drag on the table to aim. Nothing fires until you press Shoot.';
 if(needCall)hint='Aim tab: choose a ball and pocket, or select Safety.';
 if(placing)hint='Fine-tune the preview, then press Place here. Cancel leaves the position unchanged.';
 if(arranging)hint='Select a ball on Practice, then tap the table to place it.';
 if(shotRunning)hint='The balls are moving. Finish shot skips the animation, not the physics.';
 if(replay)hint='Replay is view-only. Press Replay again to return to the live table.';
 $('shotHint').textContent=hint;
 $('statusDot').classList.toggle('busy',shotRunning||!!replay);
 for(const id of ['power','elevation','tip','fineAim','callBall','callPocket','safety','push','bankCount','cloth','target','swapPockets','editName0','editName1','centerTip','aimLeft','aimRight']){
  if(id!=='tip')$(id).disabled=shotRunning||!!replay||rules.winner!==null||aiThinking;
 }
 for(const b of document.querySelectorAll('[data-spin],[data-elevation]'))b.disabled=shotRunning||!!replay||rules.winner!==null;
 drawTip();drawElevation();refreshFeatureShot();
}
function layoutMode(){document.querySelector('.app').classList.toggle('focus-aim',!$('tab-shot').hidden&&pages.shot==='aim');}
function selectTab(name){for(const b of document.querySelectorAll('[data-tab]')){const chosen=b.dataset.tab===name;b.classList.toggle('selected',chosen);b.setAttribute('aria-selected',String(chosen));}for(const n of ['shot','table','match'])$('tab-'+n).hidden=n!==name;layoutMode();resize();scheduleReaders();}
function confirmReplace(){return (!shotRunning&&rules.shots===0)||confirm('Replace this game or position? Export a save first to keep it.');}
function newGame(mode,force=false){
 if(!force&&!confirmReplace()){$('mode').value=rules.mode;return false;}
 if(editorState)closePrecision(false);cancelAnalysis();generation++;
 if($('coachDialog')?.open)$('coachDialog').close();coachState=coachOverlay=null;
 const names=rules.players.slice();settings.rules=['apa8','apa9'].includes(mode)?'apa':'club';
 session=CM.create(mode,settings,CE.next(session.seed));settings=session.settings;
 if(settings.firstBreak==='random')session.breaker=session.firstBreaker=session.seed%2;
 rules=CM.makeRules(session,names);world=new World(P.rack(mode,P.table(CS.geometry(settings).tableLength,CS.geometry(settings).tableWidth)),{...P.defaults,...CS.geometry(settings),...CS.cloth(settings)});
 equipWorld();syncDimensions();
 angle=0;side=up=elevation=0;power=mode==='straight'||mode==='onepocket'?40:85;arranging=placing=false;
 shotRunning=false;replay=null;undoStack=[];lastReplay=null;trace=[];sinks=[];accumulator=0;computerPaused=false;cameraAnchor=null;paceStart=performance.now();
 $('callBall').value='';$('callPocket').value='';$('safety').checked=false;
 if(settings.firstBreak==='lag'&&mode!=='practice')startLag();
 refresh();persist();return true;
}
function beginShot(computer=false){
 if(editorState||shotRunning||replay||arranging||placing||session.rackEnded||(!computer&&$('shoot').disabled))return false;
 if(anyDialog())return false;
 if(session.lag)return beginLagShot(computer);
 const saved=data(),pre=rules.start(world,{callBall:$('callBall').value?Number($('callBall').value):null,
  callPocket:$('callPocket').value?Number($('callPocket').value)-1:null,safety:$('safety').checked,push:$('push').checked,bankCount:Number($('bankCount').value)});
 pre.foulsBefore=rules.fouls[pre.player];pre.intended=currentStroke();pre.family=appliedFamily;pre.startWorld=world.snapshot();
 if(settings.chalk!=='off'&&((rules.mode==='practice'&&settings.autoPracticeChalk)||(computer&&settings.autoComputerChalk&&session.chalk[pre.player]<.75)))session.chalk[pre.player]=1;
 const delivered=CE.fire(world,pre.intended,executionContext(computer),session.seed),result=delivered.result;
 if(!result.ok){toast(result.reason);return false;}
 pre.delivery=delivered;session.seed=delivered.nextSeed;
 if(settings.chalk!=='off')session.chalk[pre.player]=Math.max(0,session.chalk[pre.player]-CE.depletion(delivered.shot));
 cameraAnchor=[...pre.startWorld.balls.find(b=>b.id===0).p];appliedFamily=null;coachOverlay=null;riskCache=null;vibrate(12);
 undoStack.push(saved);undoStack=undoStack.slice(-12);storageSet(KEY,saved);
 shotRunning=true;shotPre=pre;record=[];trace=[];sinks=[];seenEvents=0;frameTicks=0;accumulator=0;
 recordFrame();audioHit('cue',.5);
 $('status').textContent=result.cloth?'The delivered tip struck the cloth; no cue-ball contact.':result.miscue?'Miscue. The tip slipped outside its friction limit.':'Shot in motion.';
 $('finish').hidden=false;refreshShot();$('undo').disabled=false;$('placeCue').disabled=true;return true;
}
function recordFrame(){
 const bs=world.balls.map(b=>({id:b.id,p:[...b.p],q:[...b.q],active:b.active,pocket:b.pocket,radius:b.radius,mass:b.mass}));record.push({t:world.time,balls:bs});
 const cue=world.get(0);if(cue.active){const prev=trace[trace.length-1];if(!prev||Math.hypot(cue.p[0]-prev[0],cue.p[1]-prev[1])>.002)trace.push([...cue.p]);}
 if(record.length>7200)record.shift();
}
function processEvents(){
 for(;seenEvents<world.events.length;seenEvents++){
  const e=world.events[seenEvents];if(e.type==='pocket'){sinks.push({...e,start:performance.now()});audioHit('pocket',.25);}
  if(e.type==='ball'&&e.impulse>.015)audioHit('ball',Math.min(.4,e.impulse*.5));
  if(e.type==='rail'&&e.impulse>.02)audioHit('rail',Math.min(.35,e.impulse*.4));
 }
}
function stepOnce(){world.step();frameTicks++;if(frameTicks%8===0)recordFrame();}
function endShot(){
 if(session.lag){endLagShot();return;}
 recordFrame();lastReplay=record;shotRunning=false;accumulator=0;
 rules.finish(world,shotPre);CM.finish(session,world,rules,shotPre,shotPre.delivery,shotPre.startWorld);equipWorld();shotPre=null;paceStart=performance.now();
 $('safety').checked=false;$('push').checked=false;$('callBall').value='';$('callPocket').value=rules.mode==='apa8'&&rules.marker!==null?String(rules.marker+1):'';
 refresh();persist();scheduleNextRack();
 if(world.diagnostics.eventLimit)toast('This shot reached a collision-iteration limit. Its result needs review. Undo can restore it.');
}
function finishNow(){
 if(!shotRunning)return;
 const before=sound;sound=false;
 try{let n=0;while(!world.atRest()&&world.time<90&&n++<480*90)stepOnce();
  seenEvents=world.events.length;
  if(world.atRest())endShot();else{undo();toast('This shot did not settle within the simulation limit. The previous position was restored.');}
 }finally{sound=before;persist();}
}
function undo(){if(!undoStack.length)return;cancelAnalysis();const saved=undoStack.pop();restore(saved);computerPaused=CM.isComputer(session,rules);lastReplay=null;refresh();persist();toast(computerPaused?'Previous shot restored. Press Resume AI to continue.':'Restored the complete previous shot, including randomness and chalk.');}
function startReplay(){
 if(replay){const demo=replay.demo;replay=null;refresh();if(demo&&coachState)openCoachResult();return;}
 if(!lastReplay||shotRunning)return;
 replay={frames:lastReplay,clock:0,index:0};refreshShot();
}
function setDrill(kind){
 if(!confirmReplace())return false;
 if(editorState)closePrecision(false);
 cancelAnalysis();generation++;rules=new Q.Rules('practice',{players:rules.players});session=CM.create('practice',settings,session.seed);settings=session.settings;const cfg=world.cfg;
 side=up=elevation=0;angle=0;power=53;
 let balls=[ball(0,.84,W/2),ball(1,1.28,W/2)];
 if(kind==='draw')up=-.50;
 if(kind==='follow')up=.50;
 if(kind==='stun'){up=-.12;power=60;}
 if(kind==='english'){balls=[ball(0,.76,.52)];side=.50;up=.08;elevation=4;angle=.48;power=55;}
 if(kind==='masse'){balls=[ball(0,.8,.4),ball(8,1.1,.5),ball(1,1.7,.9)];side=.46;up=.02;elevation=68;angle=.12;power=54;}
 if(kind==='jump'){balls=[ball(0,.65,W/2),ball(8,.94,W/2),ball(1,1.62,W/2)];elevation=60;power=92;}
 world=new World(balls,cfg);equipWorld();syncDimensions();rules.message='Practice: '+kind+'. Change one control, then use Undo to compare.';
 arranging=placing=shotRunning=false;replay=null;lastReplay=null;undoStack=[];trace=[];sinks=[];accumulator=0;
 $('safety').checked=false;refresh();selectTab('shot');selectPage('shot',['masse','jump'].includes(kind)?'angle':['draw','follow','english'].includes(kind)?'spin':'aim');persist();return true;
}
function initSound(){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch(e){sound=false;}}
function audioHit(type,gain){
 if(!sound||document.hidden)return;initSound();if(!audio)return;
 try{const osc=audio.createOscillator(),g=audio.createGain();osc.type='triangle';
  const t=audio.currentTime;osc.frequency.setValueAtTime(type==='ball'?1500:type==='rail'?210:type==='pocket'?95:640,t);
  osc.frequency.exponentialRampToValueAtTime(type==='ball'?650:70,t+.035);
  g.gain.setValueAtTime(gain*.16*settings.volume,t);g.gain.exponentialRampToValueAtTime(.0001,t+.055);
  osc.connect(g);g.connect(audio.destination);osc.start(t);osc.stop(t+.06);
 }catch(e){}
}
function resize(){
 const r=$('tableWrap').getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
 if(r.width<1||r.height<1)return;
 canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 const scale=Math.min(r.width/(L+.36),r.height/(W+.40));
 view={scale,ox:(r.width-L*scale)/2,oy:(r.height+W*scale)/2,w:r.width,h:r.height};
 if(editorState)resizePrecision();scheduleReaders();
}
function rounded(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r);}
function line(points,color,width,dash=[]){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>{const [x,y]=toScreen(...p);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.restore();}
const noise=document.createElement('canvas');noise.width=noise.height=100;const nc=noise.getContext('2d');
let rng=17;for(let n=0;n<2100;n++){rng=(1664525*rng+1013904223)>>>0;const x=rng%100;rng=(1664525*rng+1013904223)>>>0;nc.fillStyle=n%2?'#ffffff0b':'#0000000b';nc.fillRect(x,rng%100,.8,.8);}const feltNoise=ctx.createPattern(noise,'repeat');
function drawTable(){
 const s=view.scale,x=view.ox,y=view.oy-W*s;
 ctx.clearRect(0,0,view.w,view.h);
 ctx.save();ctx.shadowColor='#0009';ctx.shadowBlur=26;ctx.shadowOffsetY=12;
 const wood=ctx.createLinearGradient(x,y,x+L*s,y+W*s);const tone=themeColors();wood.addColorStop(0,tone[0]);wood.addColorStop(.18,tone[1]);wood.addColorStop(.8,tone[1]);wood.addColorStop(1,tone[0]);
 rounded(ctx,x-.127*s,y-.127*s,(L+.254)*s,(W+.254)*s,.058*s);ctx.fillStyle=wood;ctx.fill();ctx.restore();
 rounded(ctx,x-.137*s,y-.137*s,(L+.274)*s,(W+.274)*s,.061*s);ctx.strokeStyle='#af98704d';ctx.lineWidth=1;ctx.stroke();
 rounded(ctx,x-.091*s,y-.091*s,(L+.182)*s,(W+.182)*s,.037*s);ctx.fillStyle='#142b28';ctx.fill();
 const felt=ctx.createRadialGradient(x+L*s*.45,y+W*s*.45,.1*s,x+L*s*.5,y+W*s*.5,1.6*s);
 felt.addColorStop(0,CS.felt(settings));felt.addColorStop(1,darken(CS.felt(settings),.72));
 ctx.fillStyle=felt;ctx.fillRect(x,y,L*s,W*s);ctx.fillStyle=feltNoise;ctx.fillRect(x,y,L*s,W*s);
 // Small inner falloff gives the rails depth without changing collision geometry.
 const shade=ctx.createLinearGradient(0,y,0,y+.055*s);shade.addColorStop(0,'#062c2e80');shade.addColorStop(1,'#062c2e00');ctx.fillStyle=shade;ctx.fillRect(x,y,L*s,.055*s);
 if(rules.ballInHand==='kitchen'||placing){ctx.fillStyle='#d6e4ba0b';ctx.fillRect(x,y,L*s/4,W*s);line([[L/4,0],[L/4,W]],'#d8e6ce3c',1,[3,6]);}
 for(const p of world.table.pockets){const [px,py]=toScreen(p.x,p.y);ctx.beginPath();ctx.arc(px,py,.076*s,0,Math.PI*2);ctx.fillStyle='#342c22';ctx.fill();ctx.strokeStyle='#bb9a654a';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(px,py,.064*s,0,Math.PI*2);ctx.fillStyle='#060e10';ctx.fill();
  const hole=ctx.createRadialGradient(px,py-.01*s,0,px,py,.063*s);hole.addColorStop(0,'#000');hole.addColorStop(1,'#0b1718');ctx.fillStyle=hole;ctx.fill();
 }
 // Draw precisely the face segments used by the physics engine.
 for(const r of world.table.rails){
  let a=r.a,b=r.b,offset=[0,0];
  if(r.kind==='cushion')offset=a[1]===b[1]?[0,a[1]===0?-.022:.022]:[a[0]===0?-.022:.022,0];
  line([[a[0]+offset[0],a[1]+offset[1]],[b[0]+offset[0],b[1]+offset[1]]],darken(CS.felt(settings),r.kind==='jaw'?.65:.85),r.kind==='jaw'?.028*s:.047*s);
  line([a,b],'#73a0878c',Math.max(1,.004*s));
 }
 for(let i=1;i<8;i++)if(i!==4)for(const yy of [-.090,W+.090]){const [dx,dy]=toScreen(L*i/8,yy);ctx.save();ctx.translate(dx,dy);ctx.rotate(Math.PI/4);ctx.fillStyle='#c4b998';ctx.fillRect(-1.8,-1.8,3.6,3.6);ctx.restore();}
 for(const xx of [-.090,L+.090])for(let i=1;i<4;i++){const [dx,dy]=toScreen(xx,W*i/4);ctx.save();ctx.translate(dx,dy);ctx.rotate(Math.PI/4);ctx.fillStyle='#c4b998';ctx.fillRect(-1.8,-1.8,3.6,3.6);ctx.restore();}
 for(const xx of [L/4,L*.75]){const [px,py]=toScreen(xx,W/2);ctx.beginPath();ctx.arc(px,py,Math.max(1,.003*s),0,Math.PI*2);ctx.fillStyle='#e3e3c8a8';ctx.fill();}
 world.table.pockets.forEach((p,i)=>{const [px,py]=toScreen(p.x,p.y),sy=p.y>W/2?-1:1;ctx.fillStyle='#a7b3a5';ctx.font=Math.max(7,s*.028)+'px ui-sans-serif,system-ui';ctx.textAlign='center';ctx.textBaseline='middle';if(settings.pocketLabels)ctx.fillText(p.label,px,py+sy*.091*s);
  if(rules.mode==='onepocket'){const owner=rules.pockets.indexOf(i);if(owner>=0){ctx.beginPath();ctx.arc(px,py,.067*s,0,Math.PI*2);ctx.strokeStyle=owner===0?'#d3e8a1':'#edb891';ctx.lineWidth=2;ctx.stroke();}}
  if($('callPocket').value&&Number($('callPocket').value)-1===i&&!shotRunning&&!replay){ctx.beginPath();ctx.arc(px,py,.069*s,0,Math.PI*2);ctx.strokeStyle='#e5eeaf';ctx.lineWidth=2;ctx.stroke();}
 });
}
function qrot(q,v){const [w,x,y,z]=q,t=P.mul(P.cross([x,y,z],v),2);return P.add(v,P.add(P.mul(t,w),P.cross([x,y,z],t)));}
function drawBall(b,alpha=1,shrink=1){
 const s=view.scale,[bx,by]=toScreen(b.p[0],b.p[1]),height=Math.max(0,b.p[2]-P.radius(b)),r=P.radius(b)*s*shrink;
 const x=bx,y=by-height*s*.72;
 if(r<.2)return;
 ctx.save();ctx.globalAlpha=alpha;
 ctx.beginPath();ctx.ellipse(bx+.008*s,by+.012*s,r*(1+height*1.2),r*.74,0,0,Math.PI*2);ctx.fillStyle='#001b1e80';ctx.fill();
 ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
 ctx.fillStyle=b.id>8?'#e9eee0':cssColor(b.id);ctx.fillRect(x-r,y-r,r*2,r*2);
 if(b.id>8){const axis=qrot(b.q,[0,1,0]),rot=Math.atan2(-axis[0],axis[1]);ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=cssColor(b.id);ctx.fillRect(-r,-r*.49,2*r,r*.98);ctx.restore();}
 const shadow=ctx.createRadialGradient(x-r*.33,y-r*.37,r*.05,x-r*.08,y-r*.15,r*1.2);
 shadow.addColorStop(0,'#ffffff5c');shadow.addColorStop(.5,'#ffffff00');shadow.addColorStop(1,'#061b249c');ctx.fillStyle=shadow;ctx.fillRect(x-r,y-r,r*2,r*2);
 if(b.id===0){
  for(const v of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const p=qrot(b.q,v);if(p[2]<=.12)continue;
   ctx.beginPath();ctx.ellipse(x+p[0]*r*.82,y-p[1]*r*.82,Math.max(.5,r*.10),Math.max(.3,r*.10*p[2]),0,0,Math.PI*2);ctx.fillStyle='#c1483d';ctx.fill();}
 }else{
  ctx.beginPath();ctx.arc(x,y,r*.46,0,Math.PI*2);ctx.fillStyle='#f3f0df';ctx.fill();
  ctx.fillStyle='#132026';ctx.font='700 '+Math.max(5.3,r*.70)+'px ui-sans-serif,system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.id,x,y+r*.035);
 }
 ctx.beginPath();ctx.ellipse(x-r*.32,y-r*.43,r*.17,r*.09,-.6,0,Math.PI*2);ctx.fillStyle='#ffffff80';ctx.fill();ctx.restore();
 ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle='#021c254d';ctx.lineWidth=.6;ctx.stroke();ctx.restore();
}
function drawAim(){
 if(shotRunning||replay||arranging||placing||session.rackEnded||rules.winner!==null||rules.choice)return;
 const cue=world.get(0);if(!cue?.active)return;
 const g=aimGeometry(),s=view.scale,d=[Math.cos(angle),Math.sin(angle)],info=P.strikeInfo(angle,side,up,elevation,power,{...world.cfg,cueRadius:P.radius(cue),cueBallMass:P.mass(cue)});
 if(guide&&g){line(g.line,'#f0edc578',1.05,[5,7]);
  if(settings.ghost){const [x,y]=toScreen(...g.end);ctx.beginPath();ctx.arc(x,y,P.radius(cue)*s,0,Math.PI*2);ctx.strokeStyle='#f1efc68c';ctx.lineWidth=1;ctx.stroke();}
  if(settings.objectLine&&g.object)line(g.object,'#f1efc67a',1,[3,5]);
  if(settings.tangent&&g.tangent)line(g.tangent,'#8aceeb99',1,[3,5]);
 }
 const tip=[cue.p[0]+info.r[0]-d[0]*.055,cue.p[1]+info.r[1]-d[1]*.055],len=.83*Math.cos(elevation*Math.PI/180),butt=[tip[0]-d[0]*len,tip[1]-d[1]*len];
 line([butt,tip],settings.cueLook==='carbon'?'#85979e':settings.cueLook==='burgundy'?'#b68678':'#ddc799',Math.max(3,.014*s));
 line([[tip[0]-d[0]*.013,tip[1]-d[1]*.013],tip],'#7ab4ae',Math.max(2,.011*s));
}
function drawTrace(){if(!trails||trace.length<2)return;line(trace,'#d9eeb26e',Math.max(1,view.scale*.003));}
function draw(){
 if(editorState){drawPrecision();return;}
 const in3d=use3D();$('table3d').hidden=!in3d;canvas.style.opacity='1';
 if(!in3d){drawTable();if(!replay)drawTrace();}
 let bs=world.balls;
 if(replay){const f=replay.frames;while(replay.index<f.length-1&&f[replay.index+1].t<=replay.clock)replay.index++;bs=f[replay.index].balls;}
 if(in3d){try{renderer3d=renderer3d||new window.Cue3D($('table3d'));renderer3d.draw(world,currentStroke(),settings,{balls:bs,moving:shotRunning,replay:!!replay,trace,anchor:cameraAnchor,guide:!shotRunning&&!replay?aimGeometry():null,noCue:arranging||placing||session.rackEnded,markedPocket:rules.mode==='apa8'?rules.marker:null});draw3DOverlay();}catch(err){settings.camera='2d';settings.replayCamera='2d';toast(err.message);$('table3d').hidden=true;canvas.style.opacity='1';refreshFeatures();}drawMinimap(bs);}
 else{drawAim();
 bs.filter(b=>b.active).sort((a,b)=>a.p[2]-b.p[2]).forEach(b=>drawBall(b));
 if(!replay){const now=performance.now();sinks=sinks.filter(e=>now-e.start<330);for(const e of sinks){const f=(now-e.start)/330;drawBall({id:e.id,p:e.p,q:[1,0,0,0]},1-f,1-f*.8);}}
 if(placing||arranging){const b=world.get(arranging?editId:0);if(b&&b.active){const [x,y]=toScreen(...b.p);ctx.beginPath();ctx.arc(x,y,R*view.scale+5,0,Math.PI*2);ctx.strokeStyle='#d3e8a1';ctx.lineWidth=1.6;ctx.stroke();}}
 drawFeatureOverlay();}
 refreshFrameFeatures();
 const cue=world.get(0);
 $('motionReadout').textContent=replay?'REPLAY · '+replay.clock.toFixed(1)+' s':shotRunning&&cue.active?P.stateName(cue).toUpperCase()+'  '+P.norm(cue.v).toFixed(2)+' m/s  ·  '+(cue.p[2]>R+.005?((cue.p[2]-R)*100).toFixed(1)+' cm high':Math.round(P.norm(cue.w)*60/(2*Math.PI))+' rpm'):'';
}
function drawTip(){
 const c=$('tip').getContext('2d'),s=340,x=s/2,y=s/2,r=s*.38;
 c.clearRect(0,0,s,s);c.beginPath();c.arc(x,y,r,0,Math.PI*2);
 const g=c.createRadialGradient(x-r*.35,y-r*.42,1,x,y,r*1.1);g.addColorStop(0,'#fffef4');g.addColorStop(.64,'#e8e9da');g.addColorStop(1,'#a4b6ac');c.fillStyle=g;c.fill();
 c.strokeStyle='#1d343321';c.lineWidth=2;c.beginPath();c.moveTo(x-r,y);c.lineTo(x+r,y);c.moveTo(x,y-r);c.lineTo(x,y+r);c.stroke();
 c.setLineDash([7,7]);c.strokeStyle='#33514466';c.lineWidth=2;
 const mu=tipFriction(),lim=settings.miscues?mu/Math.sqrt(1+mu**2):.97;c.beginPath();c.arc(x,y,r*lim,0,Math.PI*2);c.stroke();c.setLineDash([]);
 c.fillStyle='#adc0b5';c.font='17px ui-sans-serif,system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('FOLLOW',x,18);c.fillText('DRAW',x,s-15);c.fillText('L',12,y);c.fillText('R',s-12,y);
 const px=x+side*r,py=y-up*r;c.beginPath();c.arc(px,py,13,0,Math.PI*2);c.fillStyle=Math.hypot(side,up)>lim?'#e4a07e':'#244d45';c.fill();c.lineWidth=4;c.strokeStyle='#f5f5d7';c.stroke();
 c.strokeStyle='#d3e8a1';c.lineWidth=2;c.beginPath();c.moveTo(px-6,py);c.lineTo(px+6,py);c.moveTo(px,py-6);c.lineTo(px,py+6);c.stroke();
 $('tip').setAttribute('aria-label','Cue tip: '+$('tipDescription').textContent+'. Arrow keys adjust contact.');
}
function drawElevation(){
 const c=$('elevationDiagram').getContext('2d');c.clearRect(0,0,400,200);
 c.fillStyle='#214b42';c.fillRect(0,146,400,5);c.fillStyle='#334743';c.fillRect(0,151,400,3);
 const cx=290,cy=114,r=31,th=elevation*Math.PI/180;
 const g=c.createRadialGradient(cx-10,cy-10,1,cx,cy,r);g.addColorStop(0,'#ffffec');g.addColorStop(1,'#adbeb2');c.fillStyle=g;c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.fill();
 const cr=P.radius(world.get(0)),info=P.strikeInfo(0,side,up,elevation,power,{...world.cfg,cueRadius:cr,cueBallMass:P.mass(world.get(0)),tipFriction:tipFriction(),noMiscue:!settings.miscues});const tx=cx+info.r[0]/cr*r,ty=cy-info.r[2]/cr*r;
 c.lineCap='round';c.lineWidth=9;c.strokeStyle='#d7c496';c.beginPath();c.moveTo(tx-200*Math.cos(th),ty-200*Math.sin(th));c.lineTo(tx-5*Math.cos(th),ty-5*Math.sin(th));c.stroke();c.strokeStyle='#87c4b2';c.lineWidth=6;c.beginPath();c.moveTo(tx-8*Math.cos(th),ty-8*Math.sin(th));c.lineTo(tx,ty);c.stroke();
 c.strokeStyle='#d3e8a13a';c.lineWidth=1;c.setLineDash([5,6]);c.beginPath();c.moveTo(20,cy);c.lineTo(cx,cy);c.stroke();c.setLineDash([]);
}
function frame(now){
 const dt=lastFrame?Math.min(.055,(now-lastFrame)/1000):0;lastFrame=now;
 if(!document.hidden){
  if(shotRunning){accumulator+=dt*timeScale;let n=0;
   while(accumulator>=DT&&n++<160){stepOnce();accumulator-=DT;if(world.atRest())break;}
   processEvents();if(world.atRest())endShot();
   if(world.time>90){undo();toast('This shot did not settle within the simulation limit. The previous position was restored.');}
  }
  if(replay){replay.clock+=dt*timeScale;if(replay.clock>replay.frames[replay.frames.length-1].t+1){const demo=replay.demo;replay=null;refresh();if(demo&&coachState)openCoachResult();}}
  draw();
 }
 requestAnimationFrame(frame);
}
// Pointer capture avoids stray shots and lost drags. Aiming never shoots.
canvas.addEventListener('pointerdown',e=>{
 if(shotRunning||replay||rules.choice||rules.winner!==null||editorState||aiThinking||CM.isComputer(session,rules)||session.rackEnded)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);aimPointer=e.pointerId;
 if(use3D()&&!arranging){d3gesture={id:e.pointerId,x:e.clientX,y:e.clientY,angle,orbit:settings.orbit,moved:false};return;}
 const [x,y]=fromScreen(e.clientX,e.clientY);
 if(markPocketAt(x,y)){aimPointer=null;return;}
 if(arranging){
  const id=editId,kitchen=false;
  if(id===0){openPrecision(0,true);editorState.set(x,y,true);updatePrecision();return;}
  if(place(world,id,x,y,kitchen)){refresh();persist();}
  else toast('Choose a clear spot'+(kitchen?' inside the kitchen':' on the cloth')+'.');aimPointer=null;return;
 }
 const cue=world.get(0);if(Math.hypot(x-cue.p[0],y-cue.p[1])>.015){angle=Math.atan2(y-cue.p[1],x-cue.p[0]);changed();}
});
canvas.addEventListener('pointermove',e=>{if(d3gesture&&d3gesture.id===e.pointerId){const dx=e.clientX-d3gesture.x;if(Math.abs(dx)>3)d3gesture.moved=true;if(cameraLook)settings.orbit=clamp(d3gesture.orbit-dx*.3,-180,180);else angle=d3gesture.angle-dx*.14*Math.PI/180;refreshShot();return;}if(e.pointerId!==aimPointer||shotRunning||replay||arranging||placing)return;
 const [x,y]=fromScreen(e.clientX,e.clientY),cue=world.get(0);if(Math.hypot(x-cue.p[0],y-cue.p[1])>.03){angle=Math.atan2(y-cue.p[1],x-cue.p[0]);refreshShot();}});
function endAim(e){if(d3gesture&&d3gesture.id===e.pointerId){if(!d3gesture.moved&&e.type!=='pointercancel'&&!cameraLook&&renderer3d){const pt=renderer3d.point(e.clientX,e.clientY);if(pt&&!markPocketAt(...pt)){const cue=world.get(0);if(Math.hypot(pt[0]-cue.p[0],pt[1]-cue.p[1])>.04)angle=Math.atan2(pt[1]-cue.p[1],pt[0]-cue.p[0]);}}d3gesture=null;refreshShot();}if(e.pointerId===aimPointer){aimPointer=null;persist();}}
canvas.addEventListener('pointerup',endAim);canvas.addEventListener('pointercancel',endAim);
function tipAt(e){if(CM.isComputer(session,rules)||aiThinking)return;const b=$('tip').getBoundingClientRect(),size=Math.min(b.width,b.height);side=(e.clientX-b.left-b.width/2)/(size*.38);up=-(e.clientY-b.top-b.height/2)/(size*.38);const s=Math.hypot(side,up);if(s>.97){side*=.97/s;up*=.97/s;}changed();}
$('tip').addEventListener('pointerdown',e=>{if(shotRunning||replay)return;e.preventDefault();tipPointer=e.pointerId;$('tip').setPointerCapture(e.pointerId);tipAt(e);});
$('tip').addEventListener('pointermove',e=>{if(e.pointerId===tipPointer)tipAt(e);});
for(const n of ['pointerup','pointercancel'])$('tip').addEventListener(n,()=>tipPointer=null);
$('tip').addEventListener('keydown',e=>{if(shotRunning||replay||CM.isComputer(session,rules)||aiThinking)return;const d={ArrowLeft:[-.025,0],ArrowRight:[.025,0],ArrowUp:[0,.025],ArrowDown:[0,-.025]}[e.key];if(d){e.preventDefault();side+=d[0];up+=d[1];const r=Math.hypot(side,up);if(r>.97){side*=.97/r;up*=.97/r;}changed();}});
$('centerTip').onclick=()=>{if(shotRunning||replay)return;side=up=0;changed();};
$('power').oninput=()=>{power=Number($('power').value);changed();};$('elevation').oninput=()=>{elevation=Number($('elevation').value);changed();};
$('fineAim').onpointerdown=()=>fineBase=angle;$('fineAim').onfocus=()=>fineBase=angle;
$('fineAim').oninput=()=>{if(!shotRunning&&!replay){angle=fineBase+Number($('fineAim').value)*Math.PI/180;refreshShot();}};
$('fineAim').onchange=()=>{fineBase=angle;$('fineAim').value=0;persist();};
function aimBy(d){if(!shotRunning&&!replay&&!arranging&&!placing){angle+=d*Math.PI/180;changed();}}
$('aimLeft').onclick=()=>aimBy(.1);$('aimRight').onclick=()=>aimBy(-.1);
for(const id of ['callBall','callPocket','safety','push','bankCount'])$(id).onchange=changed;
$('shoot').onclick=()=>beginShot(false);$('undo').onclick=undo;$('finish').onclick=finishNow;$('replay').onclick=startReplay;
$('newGame').onclick=()=>newGame(rules.mode);$('mode').onchange=()=>newGame($('mode').value);
$('guide').onclick=()=>{guide=!guide;settings.guide=guide;refresh();persist();};
$('placeCue').onclick=()=>openPrecision(0,false);
$('speed').onclick=()=>{const speeds=[1,.5,.25,2];timeScale=speeds[(speeds.indexOf(timeScale)+1)%speeds.length];$('speed').innerHTML=(timeScale===.25?'¼':timeScale===.5?'½':timeScale)+'× <span>Speed</span>';};
$('take').onclick=()=>{rules.choose(world,true);refresh();persist();};$('returnShot').onclick=()=>{rules.choose(world,false);refresh();persist();};
$('arrange').onclick=()=>{
 if(shotRunning||replay){toast('Finish this shot first.');return;}
 if(rules.mode!=='practice'){
  if(!confirm('Switch to free practice and edit this position? The competitive score will be reset.'))return;
  rules=new Q.Rules('practice',{players:rules.players});session=CM.create('practice',settings,session.seed);settings=session.settings;cancelAnalysis();generation++;undoStack=[];lastReplay=null;
 }
 arranging=!arranging;placing=false;refresh();persist();
};
$('editBall').onchange=()=>{editId=Number($('editBall').value);};
$('removeBall').onclick=()=>{if(!arranging){toast('Turn on Arrange balls first.');return;}if(editId===0){toast('The cue ball must stay on the table.');return;}const b=world.get(editId);if(b){b.active=false;b.v=[0,0,0];b.w=[0,0,0];refresh();persist();}};
$('saveLayout').onclick=()=>{if(shotRunning||replay){toast('Finish the shot before saving.');return;}if(storageSet(LAYOUT,data()))toast('Position saved on this device.');};
$('loadLayout').onclick=()=>{try{const s=JSON.parse(localStorage.getItem(LAYOUT));if(!s){toast('Save a position first.');return;}if(!confirmReplace())return;restore(s);undoStack=[];lastReplay=null;refresh();persist();toast('Saved position restored.');}catch(e){toast(e.message||'Could not load the saved position.');}};
$('export').onclick=()=>{if(shotRunning||replay){toast('Finish the shot before exporting.');return;}const url=URL.createObjectURL(new Blob([JSON.stringify(data(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='cue-lab-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);};
$('import').onclick=()=>$('importFile').click();$('importFile').onchange=async e=>{
 try{const f=e.target.files[0];if(!f)return;if(f.size>2000000)throw new Error('That save file is too large.');const s=JSON.parse(await f.text());if(!validSave(s))throw new Error('This file is not a valid Cue Lab save.');if(!confirmReplace())return;restore(s);undoStack=[];lastReplay=null;refresh();persist();toast('Save imported.');}catch(err){toast(err.message);}finally{e.target.value='';}
};
$('cloth').onchange=()=>{if(shotRunning||replay||aiThinking){toast('Change cloth between shots.');return;}const cfg={normal:[.20,.011,8],fast:[.17,.0075,7],slow:[.23,.017,10]}[$('cloth').value];[world.cfg.slide,world.cfg.roll,world.cfg.spin]=cfg;settings.clothPreset=$('cloth').value;persist();};
$('trails').onchange=()=>{trails=$('trails').checked;settings.trails=trails;persist();};$('sound').onchange=()=>{sound=$('sound').checked;settings.sound=sound;initSound();persist();};
for(let i=0;i<2;i++)$('editName'+i).onchange=()=>{rules.players[i]=$('editName'+i).value.trim().slice(0,24)||'Player '+(i+1);refresh();persist();};
$('target').onchange=()=>{if(rules.shots||shotRunning){$('target').value=rules.target;toast('Set the target before the first shot.');return;}rules.target=clamp(Math.round(Number($('target').value)||1),1,999);refresh();persist();};
$('swapPockets').onclick=()=>{if(rules.mode==='onepocket'&&rules.break&&rules.shots===0){rules.pockets.reverse();refresh();persist();}};
for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>selectTab(b.dataset.tab);
for(const b of document.querySelectorAll('[data-drill]'))b.onclick=()=>setDrill(b.dataset.drill);
$('help').onclick=$('fullRules').onclick=()=>showHelp();
$('statusDetails').onclick=()=>showHelp(rules.message,'Shot result');$('closeHelp').onclick=()=>$('helpDialog').close();
$('helpDialog').onclick=e=>{if(e.target===$('helpDialog')){const r=$('helpDialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('helpDialog').close();}};
$('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(e){toast('Fullscreen is not available in this browser.');}};
document.addEventListener('keydown',e=>{
 if($('placementDialog').open){
  if(['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName))return;
  const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];
  if(d){e.preventDefault();nudge(...d);}return;
 }
 if(['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)||document.activeElement===$('tip')||anyDialog())return;
 if(e.code==='Space'){e.preventDefault();beginShot();}if(e.key.toLowerCase()==='a')aimBy(.1);if(e.key.toLowerCase()==='d')aimBy(-.1);if(e.key.toLowerCase()==='u')undo();});
document.addEventListener('visibilitychange',()=>{lastFrame=0;accumulator=0;if(!document.hidden)scheduleComputer();});
/* Included inside app.js's closure by build.py. This layer owns UI only. */
function selectPage(group,name){
 if(!['shot','table','match'].includes(group))return;
 if(!document.querySelector('[data-pane="'+group+':'+name+'"]'))return;
 pages[group]=name;
 for(const b of document.querySelectorAll('[data-group="'+group+'"]')){
  const on=b.dataset.page===name;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));
 }
 for(const el of document.querySelectorAll('[data-pane^="'+group+':"]'))el.hidden=el.dataset.pane!==group+':'+name;
 layoutMode();scheduleReaders();
}
for(const b of document.querySelectorAll('[data-page]'))b.onclick=()=>selectPage(b.dataset.group,b.dataset.page);
for(const b of document.querySelectorAll('[data-spin]'))b.onclick=()=>{
 if(shotRunning||replay||rules.winner!==null)return;[side,up]=b.dataset.spin.split(',').map(Number);changed();
};
for(const b of document.querySelectorAll('[data-elevation]'))b.onclick=()=>{
 if(shotRunning||replay||rules.winner!==null)return;elevation=Number(b.dataset.elevation);$('elevation').value=elevation;changed();
};
const HELP_TEXT=`PLAY A SHOT
Drag on the table to aim. Aim has fine corrections, Spin sets exact cue-tip contact, and Cue angle raises the cue. Set power, then Shoot. Aiming never fires. A/D fine-tune aim, Space shoots, and U undoes when the table has keyboard focus.

CHOOSE YOUR EXPERIENCE
Settings has 12 categories, search, paged controls and individual explanations. Arcade delivers the human stroke exactly and removes chalk and miscue penalties. Simulation enables modeled human execution variation, miscues and chalk. Custom lets you mix them. Changes are a draft until Apply. Equipment, table dimensions, player/handicap and match changes ask to start a new match rather than quietly changing a live position.

2D AND 3D
View cycles between overhead, shooter, elevated and broadcast. Camera settings control distance, height, field of view, orbit, shot follow and replay views. In 3D, Look switches dragging from aiming to orbiting. The small overview returns to 2D. Rendering never changes the shot result. If WebGL fails, the game falls back to 2D. Ball placement and arrangement use overhead for precision.

PLACE A BALL
Place cue opens a close-up. Drag anywhere without covering the ball with your finger. Tap the overview to move elsewhere. Arrows nudge 1, 5 or 10 mm; holding repeats. Green is valid. Place here confirms; Cancel and Escape leave the position unchanged. Practice also permits precise object-ball placement.

SPIN, CHALK AND RISK
Follow is above center, draw below, English to either side. The contact diagram is viewed along the cue, so its vertical direction tilts with elevation. The dashed circle is the modeled friction limit. Chalking improves the available friction in Simulation. Risk is the percentage of 512 possible delivered strokes that meet the displayed model's mishit definition. The same model executes the actual stroke. These are provisional simulation probabilities, not measured APA player statistics. Tap Risk for definitions. A requested tip point below the cloth is blocked, not converted into an impossible shot.

COMPUTER OPPONENTS
Players settings select two humans, human versus computer, or watch two computers, with separate playing-strength profiles 2 through 7. APA 9-ball handicap numbers 1 through 9 are separate from execution strength. The opponent searches actual simulated pots, banks, combinations, kicks and defensive contacts. Its search is bounded and its strength labels are provisional, not verified APA equivalents. Use Pause computer to stop thinking between strokes; Resume continues. Undo pauses the computer so the restored position stays usable.

COACHING TIMEOUT
Coach evaluates the current position using the same search engine as the computer. It explains recommended power, contact, pocket or safety, the next evaluated ball and the ideal cue-ball finish. Demo plays a ghost copy and leaves the live table and controls intact. Apply changes the setup but never fires. Simulation still applies your execution uncertainty when you shoot. The success count is a small sample, not a guaranteed make. Timeouts can be APA-style, custom, unlimited or off; practice and pre-break advice are uncharged when coaching is enabled.

RULES AND MATCHES
The game menu keeps all nine Club/practice modes and adds separate APA-derived 8-ball and 9-ball. Club called-shot controls appear when required. APA 8-ball only marks the 8 pocket: tap a pocket or select it when on the 8. APA 9-ball scores points across racks and has no push-out. APA races use the official chart values, not an attempted calculation of the Equalizer handicap. Match settings provide lag or first-break choice, race/points and next-rack behavior. Defense records intent; in APA a legal defensive pot can still keep the turn. Match has a scorecard, event-based referee record and agreed stalemate for APA modes.

SAVES AND PRACTICE
Undo restores the complete prior position, score, settings, chalk and random seed. Repeating the identical restored shot does not reroll the outcome. Replay is view-only. Finish shot skips animation, not physics. Practice offers six presets, editable balls, 20 named drill slots and instant undo. Export makes a portable JSON backup; old 0.1/0.2 saves migrate with defaults. Local-file and hosted browser saves are separate: export then import to move between them. Settings and saves can be blocked by browser storage policy, so keep an exported backup.

MODEL LIMITATIONS
This is not a calibrated digital twin or a complete tournament referee. Cushion elasticity, pocket capture, tip friction, shaft deflection, chalk wear, elevated shots and skill variability remain provisional. Cue-shaft obstruction, double-hit detection and some physical/referee and compound-foul exceptions remain outside the model. Bank and kick search uses finite candidates rather than guaranteed optimal play. The Club kitchen escape and special-rerack clearance retain documented approximations; APA has separate head-string logic. There is no online multiplayer. The source documentation records the boundaries and verification results.`;
let helpText=HELP_TEXT;
function showHelp(text=HELP_TEXT,title='How Cue Lab works'){
 helpText=text;$('helpTitle').textContent=title;delete readers.help;
 if(!$('helpDialog').open)$('helpDialog').showModal();scheduleReaders();
}
// Fit text into actual available space, then use previous/next pages, never scroll.
function scheduleReaders(){if(readerFrame)return;readerFrame=requestAnimationFrame(()=>{readerFrame=0;refreshReaders();});}
function fitReader(key,id,text,prev,next,label){
 const el=$(id);if(!el.getClientRects().length||el.clientHeight<20||el.clientWidth<20)return;
 const sig=text+'|'+el.clientWidth+'|'+el.clientHeight+'|'+getComputedStyle(el).fontSize;
 let r=readers[key];
 if(!r||r.sig!==sig){
  const tokens=text.match(/\S+\s*/g)||['Nothing to show yet.'];const chunks=[];let chunk='';
  for(const token of tokens){
   el.textContent=chunk+token;
   if(chunk&&el.scrollHeight>el.clientHeight+1){chunks.push(chunk.trim());chunk=token;}
   else chunk+=token;
  }
  if(chunk)chunks.push(chunk.trim());
  r={sig,text,chunks,index:r&&r.text===text?Math.min(r.index,chunks.length-1):0};readers[key]=r;
 }
 el.textContent=r.chunks[r.index];$(prev).disabled=r.index===0;$(next).disabled=r.index>=r.chunks.length-1;
 $(label).textContent=(r.index+1)+' / '+r.chunks.length;
}
function refreshReaders(){
 fitReader('rules','rulesBrief',Q.notes[rules.mode],'rulesPrev','rulesNext','rulesPage');
 fitReader('log','shotLog',rules.log.join('\n\n')||'Your shot history will appear here. Tap the message below the table to read the full current result.','logPrev','logNext','logPage');
 fitReader('help','helpBody',helpText,'helpPrev','helpNext','helpPage');
}
for(const [key,prev,next] of [['rules','rulesPrev','rulesNext'],['log','logPrev','logNext'],['help','helpPrev','helpNext']]){
 $(prev).onclick=()=>{const r=readers[key];if(r)r.index=Math.max(0,r.index-1);refreshReaders();};
 $(next).onclick=()=>{const r=readers[key];if(r)r.index=Math.min(r.chunks.length-1,r.index+1);refreshReaders();};
}
function openPrecision(id=0,fromArrange=false){
 if(shotRunning||replay||rules.choice||rules.winner!==null||aiThinking||session.rackEnded||CM.isComputer(session,rules))return false;
 if(fromArrange&&!arranging)return false;
 if(!fromArrange&&!(rules.ballInHand||rules.mode==='practice'))return false;
 if(editorState)return false;
 editorState=new window.CuePlacement(world,id,!fromArrange&&rules.ballInHand==='kitchen');
 placing=true;placementDrag=null;aimPointer=null;
 $('placementTitle').textContent=id===0?'Place the cue ball':'Place ball '+id;$('nudgeStep').value='.001';
 $('placementDialog').showModal();resizePrecision();updatePrecision();refreshShot();
 $('precisionTable').focus({preventScroll:true});return true;
}
function closePrecision(commit=false){
 if(!editorState)return false;
 if(commit&&!editorState.commit()){updatePrecision();return false;}
 const id=editorState.id;stopNudge();placementDrag=null;editorState=null;placing=false;
 $('placementDialog').close();refresh();if(commit){trace=[];sinks=[];persist();toast((id===0?'Cue ball':'Ball '+id)+' placed.');}
 return true;
}
function resizePrecision(){
 if(!editorState)return;
 const r=$('precisionWrap').getBoundingClientRect(),c=$('precisionTable'),dpr=Math.min(devicePixelRatio||1,2);
 if(r.width<1||r.height<1)return;
 c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr);c.getContext('2d').setTransform(dpr,0,0,dpr,0,0);
 editorState.layout(r.width,r.height);
}
function updatePrecision(){
 if(!editorState)return;
 $('placementValidity').textContent=editorState.reason();$('confirmPlacement').disabled=!editorState.valid();
 document.querySelector('.precision-caption').classList.toggle('invalid',!editorState.valid());
 $('placementCoords').textContent='Ball center: '+(editorState.x*1000).toFixed(1)+' mm from left · '+(editorState.y*1000).toFixed(1)+' mm from bottom';
 $('zoomValue').value=editorState.zoom+'×';$('zoomOut').disabled=editorState.zoom<=2;$('zoomIn').disabled=editorState.zoom>=10;
}
function drawPrecision(){
 if(!editorState)return;
 const oldCtx=ctx,oldView=view,e=editorState;
 try{
  ctx=$('precisionTable').getContext('2d');view=e.view;drawTable();
  for(const b of world.balls)if(b.active&&b.id!==e.id)drawBall(b);
  const old=world.get(e.id);if(old?.active&&Math.hypot(old.p[0]-e.x,old.p[1]-e.y)>.003)drawBall(old,.18);
  drawBall({id:e.id,p:[e.x,e.y,e.R],radius:e.R,q:old?.q||[1,0,0,0]});
  const [x,y]=e.screen(),r=e.R*e.scale;
  ctx.save();ctx.beginPath();ctx.arc(x,y,r+5,0,Math.PI*2);ctx.strokeStyle=e.valid()?'#d3e8a1':'#ff9578';ctx.lineWidth=2;ctx.stroke();
  ctx.strokeStyle='#203932';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.moveTo(x,y-5);ctx.lineTo(x,y+5);ctx.stroke();ctx.restore();
 }finally{ctx=oldCtx;view=oldView;}
 drawPlacementMap();
}
function drawPlacementMap(){
 const e=editorState;if(!e)return;
 const c=$('placementMap').getContext('2d'),w=360,h=204,s=305/L,ox=(w-L*s)/2,oy=(h+W*s)/2;
 c.clearRect(0,0,w,h);c.fillStyle='#255e51';c.fillRect(ox,oy-W*s,L*s,W*s);
 if(e.kitchen){c.fillStyle='#d3e8a12b';c.fillRect(ox,oy-W*s,L*s/4,W*s);c.strokeStyle='#c3d1a9';c.setLineDash([4,4]);c.beginPath();c.moveTo(ox+L*s/4,oy);c.lineTo(ox+L*s/4,oy-W*s);c.stroke();c.setLineDash([]);}
 for(const p of world.table.pockets){c.beginPath();c.arc(ox+p.x*s,oy-p.y*s,7,0,Math.PI*2);c.fillStyle='#071315';c.fill();}
 for(const b of world.balls)if(b.active&&b.id!==e.id){c.beginPath();c.arc(ox+b.p[0]*s,oy-b.p[1]*s,Math.max(3,R*s),0,Math.PI*2);c.fillStyle=cssColor(b.id);c.fill();}
 const left=e.cx-e.width/(2*e.scale),top=e.cy+e.height/(2*e.scale);
 c.save();c.beginPath();c.rect(ox,oy-W*s,L*s,W*s);c.clip();c.fillStyle='#d3e8a122';c.strokeStyle='#d3e8a1';c.lineWidth=1.5;
 c.fillRect(ox+left*s,oy-top*s,e.width/e.scale*s,e.height/e.scale*s);c.strokeRect(ox+left*s,oy-top*s,e.width/e.scale*s,e.height/e.scale*s);c.restore();
 c.beginPath();c.arc(ox+e.x*s,oy-e.y*s,5,0,Math.PI*2);c.fillStyle=e.valid()?'#f4f6e3':'#ff9578';c.fill();c.strokeStyle='#142721';c.lineWidth=1;c.stroke();
}
function nudge(dx,dy){if(editorState){editorState.nudge(dx,dy);const [x,y]=editorState.screen();if(x<30||x>editorState.width-30||y<30||y>editorState.height-30)editorState.center();updatePrecision();}}
function stopNudge(){clearTimeout(nudgeDelay);clearInterval(nudgeTimer);nudgeDelay=nudgeTimer=null;}
for(const b of document.querySelectorAll('[data-nudge]')){
 const d=b.dataset.nudge.split(',').map(Number);
 b.addEventListener('pointerdown',e=>{if(!editorState)return;e.preventDefault();b.setPointerCapture(e.pointerId);stopNudge();nudge(...d);nudgeDelay=setTimeout(()=>{nudgeTimer=setInterval(()=>nudge(...d),80);},350);});
 for(const n of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(n,stopNudge);
 b.onclick=e=>{if(e.detail===0)nudge(...d);};
}
window.addEventListener('blur',stopNudge);
$('nudgeStep').onchange=()=>{if(editorState)editorState.step=Number($('nudgeStep').value);};
$('zoomIn').onclick=()=>{if(editorState){editorState.setZoom(editorState.zoom+1);updatePrecision();}};
$('zoomOut').onclick=()=>{if(editorState){editorState.setZoom(editorState.zoom-1);updatePrecision();}};
$('recenterPlacement').onclick=()=>{if(editorState){editorState.center();updatePrecision();}};
$('resetPlacement').onclick=()=>{if(editorState){editorState.reset();updatePrecision();}};
$('confirmPlacement').onclick=()=>closePrecision(true);$('cancelPlacement').onclick=()=>closePrecision(false);
$('placementDialog').addEventListener('cancel',e=>{e.preventDefault();closePrecision(false);});
$('precisionBall').onclick=()=>{if(!arranging){toast('Turn on Arrange balls first.');return;}openPrecision(editId,true);};
const pc=$('precisionTable');
pc.addEventListener('pointerdown',e=>{
 if(!editorState||placementDrag)return;e.preventDefault();pc.setPointerCapture(e.pointerId);
 placementDrag={id:e.pointerId,sx:e.clientX,sy:e.clientY,x:editorState.x,y:editorState.y,scale:editorState.scale,moved:false};
});
pc.addEventListener('pointermove',e=>{
 const d=placementDrag;if(!editorState||!d||d.id!==e.pointerId)return;
 const dx=e.clientX-d.sx,dy=e.clientY-d.sy;if(Math.hypot(dx,dy)>3)d.moved=true;
 if(d.moved){editorState.set(d.x+dx/d.scale,d.y-dy/d.scale);updatePrecision();}
});
pc.addEventListener('pointerup',e=>{
 const d=placementDrag;if(!editorState||!d||d.id!==e.pointerId)return;
 if(!d.moved){const r=pc.getBoundingClientRect();editorState.set(...editorState.point(e.clientX-r.left,e.clientY-r.top));}
 placementDrag=null;const [x,y]=editorState.screen();if(x<30||x>editorState.width-30||y<30||y>editorState.height-30)editorState.center();updatePrecision();
});
pc.addEventListener('pointercancel',e=>{const d=placementDrag;if(d?.id===e.pointerId){if(editorState)editorState.set(d.x,d.y);placementDrag=null;updatePrecision();}});
pc.addEventListener('wheel',e=>{if(editorState){e.preventDefault();editorState.setZoom(editorState.zoom+(e.deltaY<0?1:-1));updatePrecision();}},{passive:false});
$('placementMap').addEventListener('pointerdown',e=>{
 if(!editorState)return;e.preventDefault();const r=$('placementMap').getBoundingClientRect();
 const x=(e.clientX-r.left)*360/r.width,y=(e.clientY-r.top)*204/r.height;
 const scale=305/L;editorState.set((x-(360-L*scale)/2)/scale,((204+W*scale)/2-y)/scale,true);placementDrag=null;updatePrecision();
});

// Cue Lab 0.3 UI and state coordination. Physics and decision search remain independent.
function currentStroke(){return {angle,side,up,elevation,power};}
function syncDimensions(){L=world.table.L;W=world.table.W;$('tableLabel').textContent=(L/.0254).toFixed(0)+' × '+(W/.0254).toFixed(0)+' IN · '+(settings.rules==='apa'?'APA-DERIVED':'CLUB');}
function equipWorld(){const e=CS.equipment(settings);const cb=world.get(0);if(cb&&(P.radius(cb)!==e.diameter/2||P.mass(cb)!==e.mass||cb.radius===undefined))P.equip(world,e.diameter,e.mass);}
function executionContext(computer=CM.isComputer(session,rules)){const condition=rules.mode==='practice'&&settings.autoPracticeChalk?1:session.chalk[rules.turn];return CE.context(world,settings,rules.turn,condition,computer);}
function tipFriction(){return settings.chalk==='realistic'?.32+.38*(rules.mode==='practice'&&settings.autoPracticeChalk?1:session.chalk[rules.turn]):.7;}
function strokeRisk(){const stroke=currentStroke(),context=executionContext(),key=JSON.stringify([stroke,context]);if(!riskCache||riskCache.key!==key)riskCache={key,value:CE.risk(stroke,context)};return riskCache.value;}
function anyDialog(){return !!document.querySelector('dialog[open]');}
function use3D(){return !session.lag&&!arranging&&(replay&&settings.replayCamera!=='same'?settings.replayCamera!=='2d':settings.camera!=='2d');}
function vibrate(ms){if(settings.haptics&&navigator.vibrate)navigator.vibrate(ms);}
function themeColors(){return settings.theme==='diamond'?['#52616c','#202b33']:settings.theme==='rasson'?['#89949a','#384148']:settings.theme==='brunswick'?['#bd9866','#60462e']:['#8b6c47','#4a392a'];}
function darken(hex,k){return '#'+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*k).toString(16).padStart(2,'0')).join('');}
function aimGeometry(){const cue=world.get(0);if(!cue?.active)return null;const d=[Math.cos(angle),Math.sin(angle)],cr=P.radius(cue);let distance=3.5,target=null;
 for(const b of world.balls)if(b.active&&b.id!==0){const dx=b.p[0]-cue.p[0],dy=b.p[1]-cue.p[1],t=dx*d[0]+dy*d[1],h=dx*dx+dy*dy-t*t,rad2=(cr+P.radius(b))**2-(cr-P.radius(b))**2;if(t>0&&h<rad2){const hit=t-Math.sqrt(rad2-h);if(hit>=0&&hit<distance){distance=hit;target=b;}}}
 const bounds=[];if(Math.abs(d[0])>1e-8)bounds.push(((d[0]>0?L-cr:cr)-cue.p[0])/d[0]);if(Math.abs(d[1])>1e-8)bounds.push(((d[1]>0?W-cr:cr)-cue.p[1])/d[1]);const edge=Math.min(...bounds.filter(t=>t>0));if(edge<distance){distance=edge;target=null;}
 const end=[cue.p[0]+d[0]*distance,cue.p[1]+d[1]*distance];let object=null,tangent=null;if(target){const n=P.unit([target.p[0]-end[0],target.p[1]-end[1],0]);object=[target.p,[target.p[0]+n[0]*.4,target.p[1]+n[1]*.4]];tangent=[[end[0]+n[1]*.3,end[1]-n[0]*.3],[end[0]-n[1]*.3,end[1]+n[0]*.3]];}
 return {line:[[cue.p[0]+d[0]*cr*1.2,cue.p[1]+d[1]*cr*1.2],end],end,object,tangent,target:target?.id};
}
function drawFeatureOverlay(){
 if(settings.frozenHints&&!shotRunning&&!replay)for(const f of frozenCache){const b=world.get(f.id);if(b?.active){const [x,y]=toScreen(...b.p);ctx.strokeStyle='#edc48a';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,P.radius(b)*view.scale+3,0,Math.PI*2);ctx.stroke();}}
 if(rules.mode==='apa8'&&rules.marker!==null){const p=world.table.pockets[rules.marker];if(p){const [x,y]=toScreen(p.x+(p.x<L/2?.1:-.1),p.y);ctx.fillStyle='#d6e89f';ctx.beginPath();ctx.arc(x,y,.032*view.scale,0,Math.PI*2);ctx.fill();ctx.fillStyle='#213128';ctx.font='bold '+Math.max(7,.031*view.scale)+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('8',x,y);}}
 if(coachOverlay&&!shotRunning&&!replay){const end=coachOverlay.measure.cueEnd,[x,y]=toScreen(...end);ctx.fillStyle='#d3e8a122';ctx.strokeStyle='#d3e8a1';ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(x,y,.10*view.scale,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.setLineDash([]);}
}
function draw3DOverlay(){
 ctx.clearRect(0,0,view.w,view.h);if(!renderer3d?.pv)return;
 const project=p=>renderer3d.project(p);
 ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
 if(settings.pocketLabels){ctx.font='bold 12px system-ui';for(const p of world.table.pockets){const a=project([p.x,p.y,.10]);if(!a)continue;ctx.fillStyle='#102324d9';ctx.beginPath();ctx.arc(a[0],a[1],10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#edf2cf';ctx.fillText(p.label,a[0],a[1]);}}
 if(settings.frozenHints&&!shotRunning&&!replay){ctx.font='10px system-ui';for(const f of frozenCache){const b=world.get(f.id);if(!b?.active)continue;const a=project([b.p[0],b.p[1],P.radius(b)*2+.025]);if(a){ctx.fillStyle='#ecc58a';ctx.fillText('FROZEN '+(b.id||'CUE'),a[0],a[1]);}}}
 if(coachOverlay&&!shotRunning&&!replay){const end=coachOverlay.measure.cueEnd,pts=Array.from({length:49},(_,i)=>project([end[0]+Math.cos(i/48*Math.PI*2)*.10,end[1]+Math.sin(i/48*Math.PI*2)*.10,.005]));if(pts.every(Boolean)){ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.setLineDash([4,4]);ctx.fillStyle='#d3e8a129';ctx.strokeStyle='#d3e8a1';ctx.fill();ctx.stroke();}}
 ctx.restore();
}
function drawMinimap(balls){const el=$('mini3d');el.hidden=!use3D()||!settings.minimap;if(el.hidden)return;const c=el.getContext('2d'),s=126/L,ox=7,oy=78;c.clearRect(0,0,140,88);c.fillStyle=CS.felt(settings);c.fillRect(ox,oy-W*s,L*s,W*s);for(const p of world.table.pockets){c.beginPath();c.arc(ox+p.x*s,oy-p.y*s,3,0,6.283);c.fillStyle='#03080c';c.fill();}for(const b of balls)if(b.active){c.beginPath();c.arc(ox+b.p[0]*s,oy-b.p[1]*s,Math.max(2,P.radius(b)*s),0,6.283);c.fillStyle=cssColor(b.id);c.fill();}}
function markPocketAt(x,y){if(rules.mode!=='apa8'||!rules.onEight(world)||shotRunning)return false;const i=world.table.pockets.findIndex(p=>Math.hypot(p.x-x,p.y-y)<.12);if(i<0)return false;rules.marker=i;$('callPocket').value=String(i+1);refresh();persist();toast('8-ball pocket marked: '+world.table.pockets[i].label+'.');return true;}
function refreshFeatures(){
 if(!$('settingsButton'))return;layoutMode();guide=settings.guide;trails=settings.trails;sound=settings.sound;$('cloth').value=settings.clothPreset;
 frozenCache=P.frozen(world);$('settingsButton').disabled=shotRunning||!!replay||placing;
 $('viewButton').textContent=settings.camera==='2d'?'View: 2D':'View: 3D';$('lookButton').hidden=!use3D();$('lookButton').textContent=cameraLook?'Look: on':'Look';$('mini3d').hidden=!use3D()||!settings.minimap;
 const count=CM.allowance(session,rules);$('coachButton').textContent='Coach'+(Number.isFinite(count)?' · '+count:'');
 $('coachButton').disabled=shotRunning||!!replay||placing||arranging||session.rackEnded||aiThinking||CM.isComputer(session,rules)||count<=0||!!session.lag;
 $('computerButton').hidden=settings.opponent==='human'||rules.mode==='practice';$('computerButton').textContent=aiThinking?'Stop AI':computerPaused?'Resume AI':'Pause AI';
 $('nextRackButton').hidden=!session.rackEnded||session.winner!==null;$('nextRackButton').textContent='Next rack';
 $('statisticsButton').disabled=shotRunning||placing;$('refereeButton').disabled=!session.lastShot||shotRunning;
 $('stalemateButton').hidden=!['apa8','apa9'].includes(rules.mode);$('stalemateButton').disabled=shotRunning||!!replay||session.rackEnded;
 if(['apa8','apa9'].includes(rules.mode)){
  for(let i=0;i<2;i++){
   if(rules.mode==='apa8'){$('score'+i).textContent=session.wins[i];$('detail'+i).textContent=(rules.groups[i]||'Open table')+' · race '+session.targets[i];}
   else{$('score'+i).textContent=rules.scores[i];$('detail'+i).textContent='Target '+session.targets[i]+' · SL '+session.skills[i];}
  }
 }
 $('matchInfo').textContent=(settings.style==='arcade'?'ARCADE':settings.style==='simulation'?'SIMULATION':'CUSTOM')+' · RACK '+session.rack;
 if(session.rackEnded){$('shotMode').textContent=session.winner===null?'RACK OVER':'MATCH OVER';$('status').textContent=rules.message+(session.winner===null?' Select Next rack to continue.':'');}
 const onEight=rules.mode==='apa8'&&rules.onEight(world);
 if(rules.mode==='apa8'){
  $('callControls').hidden=!onEight;$('callBall').parentElement.hidden=true;
  if(onEight&&rules.marker!==null)$('callPocket').value=String(rules.marker+1);
 }else $('callBall').parentElement.hidden=false;
 $('defenseButton').classList.toggle('selected',$('safety').checked);$('defenseButton').disabled=shotRunning||!!replay||CM.isComputer(session,rules)||session.rackEnded;
 if(session.lag){$('status').textContent=lagMessage();$('shotMode').textContent='LAG';$('callControls').hidden=true;$('nextRackButton').hidden=!session.lag.awaitNext;$('nextRackButton').textContent='Next lag';$('placeCue').disabled=true;}
 refreshFeatureShot();scheduleComputer();
}
function hostObstruction(){if(session.lag)return '';const e=elevation*Math.PI/180;if(!settings.allowMasse&&elevation>=40&&Math.hypot(side,up)>.18)return 'Massé-style strokes are disabled by House settings.';
 if(!settings.allowJump&&elevation>=25){const temp=new World([clone(world.get(0))],world.cfg);temp.strike(angle,side,up,elevation,power,{noMiscue:true});if(temp.get(0).v[2]>.25)return 'Jump-style strokes are disabled by House settings.';}
 return '';
}
function refreshFeatureShot(){if(!$('riskButton'))return;
 $('replay').disabled=!lastReplay&&!replay;
 const active=shotRunning||!!replay,comp=CM.isComputer(session,rules),risk=strokeRisk(),percent=Math.round(risk.any*100);
 $('riskButton').hidden=settings.riskDisplay==='off';$('riskButton').textContent=!settings.execution&&!settings.miscues&&!comp?'Exact stroke':(settings.riskDisplay==='detailed'?'Risk '+percent+'% · slip '+Math.round(risk.miscue*100)+'%':'Risk '+percent+'%');$('riskButton').dataset.risk=percent>=25?'high':percent>=8?'medium':'low';
 const chalk=session.chalk[rules.turn];$('chalkButton').hidden=settings.chalk==='off';$('chalkButton').textContent='Chalk: '+(settings.chalkDisplay==='percent'?Math.round(chalk*100)+'%':chalk>.8?'Fresh':chalk>.5?'Good':chalk>.25?'Low':'Now');$('chalkButton').classList.toggle('low',chalk<.35&&settings.chalkWarning);$('chalkButton').disabled=active||comp||aiThinking;
 const reason=hostObstruction();if(reason){$('tipWarning').hidden=false;$('tipWarning').textContent=reason;}
 const onEight=rules.mode==='apa8'&&rules.onEight(world);const needMark=onEight&&rules.marker===null&&!$('callPocket').value;
 $('shoot').disabled=$('shoot').disabled||comp||aiThinking||session.rackEnded||!!reason||needMark||!!session.lag?.awaitNext;
 if(needMark)$('shotHint').textContent='Mark the 8-ball pocket: choose it above, or tap the pocket on the table.';
 if(comp&&!active)$('shotHint').textContent=computerPaused?'Computer paused. Press Resume AI.':aiThinking?'Computer is comparing simulated shots.':'Computer to play.';
 if(session.lag){$('shoot').textContent='Lag';if(!session.lag.awaitNext&&!comp&&!active)$('shoot').disabled=false;$('shotHint').textContent='Use power to send the ball to the far rail and back near the head rail.';}
 else $('shoot').innerHTML='Shoot <span>↗</span>';
 for(const el of document.querySelectorAll('#tab-shot input,#tab-shot select,#tab-shot [data-spin],#tab-shot [data-elevation],#centerTip,#aimLeft,#aimRight'))if(comp||aiThinking)el.disabled=true;
}
function refreshFrameFeatures(){if(!$('paceBadge'))return;
 $('paceBadge').hidden=settings.pace==='off'||shotRunning||!!replay;const sec=Math.floor((performance.now()-paceStart)/1000);$('paceBadge').textContent=sec+'s'+(sec>45?' · take your shot':sec>20?' · pace guide':'');
 if(coachState?.ready&&$('coachDialog').open&&settings.timeoutClock){const left=Math.max(0,60-Math.floor((performance.now()-coachState.readyAt)/1000));$('coachClock').textContent=left?left+'s coaching':'Time to resume';}else $('coachClock').textContent='';
}
function showRisk(){const r=strokeRisk(),pct=n=>(n*100).toFixed(n>0&&n<.01?1:0)+'%';showHelp('MODELED SHOT RISK\n\nMeaningful delivery error: '+pct(r.delivery)+'\nTrue tip-slip miscue: '+pct(r.miscue)+'\nTip contacting cloth: '+pct(r.cloth)+'\nCombined risk: '+pct(r.any)+'\n\nThese categories overlap; they must not be added. The estimate counts '+r.n+' possible deliveries. Shoot selects one from that same discrete model. It is an exact probability within this provisional model, not a measured real-world or official APA percentage.\n\nMeaningful error means more than 0.55 degrees of aim error, 7 power points, 9% of the ball radius in tip displacement, or 3 degrees of elevation error. Actual outcomes still depend on the shot. The same input after Undo keeps its random sample.\n\nHigher offsets, cue elevation, poor chalk condition and lower skill can increase risk. Even perfect execution cannot guarantee pocketing.','Mishit risk');}
function chalkUp(){if(shotRunning||replay||aiThinking||CM.isComputer(session,rules))return;session.chalk[rules.turn]=1;riskCache=null;vibrate(18);audioHit('rail',.2);refreshShot();persist();}
function openSettings(){if(shotRunning||replay||placing)return;cancelAnalysis();settingsDraft=clone(settings);settingsPage=0;$('settingsSearch').value='';$('settingsGroup').value=settingsGroup;$('settingsDialog').showModal();renderSettings();}
function settingPageSize(){return innerHeight<620?2:3;}
function filteredSettings(){const q=$('settingsSearch').value.trim().toLowerCase();return CS.fields.filter(f=>q?(f.label+' '+f.detail+' '+f.group).toLowerCase().includes(q):f.group===$('settingsGroup').value);}
function renderSettings(){if(!settingsDraft||!$('settingsDialog').open)return;const all=filteredSettings(),size=settingPageSize(),count=Math.max(1,Math.ceil(all.length/size));settingsPage=clamp(settingsPage,0,count-1);$('settingsFields').replaceChildren();
 for(const f of all.slice(settingsPage*size,settingsPage*size+size)){
  const row=document.createElement('section');row.className='setting-card';const header=document.createElement('div');header.className='setting-card-top';const label=document.createElement('label');label.htmlFor='setting-'+f.key;label.textContent=f.label;const info=document.createElement('button');info.className='setting-help';info.textContent='?';info.setAttribute('aria-label','Explain '+f.label);info.onclick=()=>showHelp(f.detail+(f.restart?'\n\nThis change starts a fresh match; it cannot resize a live table.':''),f.label);header.append(label,info);
  let input;if(f.type==='select'){input=document.createElement('select');for(const [v,l] of Object.entries(f.options))input.add(new Option(l,v));input.value=settingsDraft[f.key];}
  else{input=document.createElement('input');input.type=f.type==='boolean'?'checkbox':f.type; if(f.type==='boolean')input.checked=settingsDraft[f.key];else input.value=settingsDraft[f.key];if(f.type==='number'){input.min=f.min;input.max=f.max;input.step=f.step;}}
  input.id='setting-'+f.key;input.onchange=()=>{if(f.type==='number'&&!input.checkValidity()){input.reportValidity();return;}const val=f.type==='boolean'?input.checked:f.type==='number'?Number(input.value):input.value;settingsDraft[f.key]=val;if(f.key==='style'){settingsDraft=CS.preset(settingsDraft,val);renderSettings();}else if(['execution','miscues','chalk','cueBall'].includes(f.key))settingsDraft.style='custom';renderSettingsNotice();};
  const hint=document.createElement('p');hint.className='setting-hint';hint.textContent=f.detail;hint.title=f.detail;row.append(header,input,hint);$('settingsFields').append(row);
 }
 if(!all.length){const p=document.createElement('p');p.textContent='No matching setting. Try “spin”, “camera”, “chalk” or “timeout”.';$('settingsFields').append(p);}
 $('settingsPager').textContent=(settingsPage+1)+' / '+count+' · '+all.length+' settings';$('settingsPrev').disabled=settingsPage===0;$('settingsNext').disabled=settingsPage===count-1;renderSettingsNotice();
}
function renderSettingsNotice(){const changed=CS.fields.filter(f=>settingsDraft[f.key]!==settings[f.key]);const restart=changed.some(f=>f.restart);$('settingsNotice').textContent=changed.length?changed.length+' changes'+(restart?' · starts a new match':' · keeps your position'):'Changes apply only when you press Apply.';$('applySettings').textContent=restart?'Apply & new match':'Apply';}
function applySettings(values,opts={}){if(shotRunning||replay||placing)return false;const merged=CS.normalize({...settings,...values}),next=Object.hasOwn(values,'style')&&values.style!==settings.style&&Object.keys(values).length<4?CS.preset(merged,merged.style):merged,changed=CS.fields.filter(f=>next[f.key]!==settings[f.key]),restart=changed.some(f=>f.restart);
 if(restart&&opts.confirm!==false&&!confirm('These settings change the match or physical table. Start a fresh match? Export your current save first to keep it.'))return false;
 cancelAnalysis();generation++;settings=next;session.settings=settings;guide=settings.guide;trails=settings.trails;sound=settings.sound;riskCache=null;
 let mode=rules.mode;if(settings.rules==='apa'){if(mode==='8ball')mode='apa8';if(mode==='9ball')mode='apa9';}else{if(mode==='apa8')mode='8ball';if(mode==='apa9')mode='9ball';}
 if($('settingsDialog').open)$('settingsDialog').close();settingsDraft=null;
 if(restart)newGame(mode,true);else{refresh();persist();}return true;
}
function cancelAnalysis(){clearTimeout(aiTimer);aiTimer=0;if(analysisWorker)analysisWorker.terminate();analysisWorker=null;if(analysisJob){clearTimeout(analysisJob.timeout);analysisJob=null;}aiThinking=false;}
function analyze(action,input,candidate,onResult,onProgress=()=>{}){
 cancelAnalysis();const id=++jobCounter,epoch=generation;
 try{const blob=new Blob([atob(window.CueWorkerSource)],{type:'text/javascript'}),url=URL.createObjectURL(blob);analysisWorker=new Worker(url);URL.revokeObjectURL(url);
  const timer=setTimeout(()=>{if(analysisJob?.id===id){cancelAnalysis();onResult({error:'The analysis time limit was reached. Your position is unchanged.'});}},action==='demo'?30000:24000);
  analysisJob={id,timeout:timer};analysisWorker.onmessage=e=>{if(e.data.id!==id||epoch!==generation||!analysisJob)return;if(e.data.progress){onProgress(e.data.progress);return;}const result=e.data.error?{error:e.data.error}:e.data.result;cancelAnalysis();onResult(result);};
  analysisWorker.onerror=e=>{if(epoch!==generation)return;cancelAnalysis();onResult({error:'The local analysis worker failed: '+(e.message||'worker unavailable')});};analysisWorker.postMessage({id,action,input,candidate});
 }catch(err){cancelAnalysis();onResult({error:'This browser could not start the local analysis worker. '+err.message});}
}
function analysisInput(role='coach'){const isCPU=role==='computer';const ctx=executionContext(isCPU);if(!isCPU&&!settings.coachSkill)ctx.variation=false;return {world:world.snapshot(),rules:rules.snapshot(),context:ctx,skill:rules.turn===0?settings.skill1:settings.skill2,depth:isCPU?settings.aiSearch:settings.coachDepth,role};}
function scheduleComputer(){clearTimeout(aiTimer);aiTimer=0;if(shotRunning||replay||placing||arranging||session.rackEnded||aiThinking||computerPaused||document.hidden||anyDialog()||!CM.isComputer(session,rules)||session.lag?.awaitNext)return;aiTimer=setTimeout(runComputer,300);}
function runComputer(){if(aiThinking||shotRunning||replay||placing||arranging||anyDialog()||session.rackEnded||!CM.isComputer(session,rules))return false;computerPaused=false;
 if(session.lag){runComputerLag();return true;}
 if(rules.choice){rules.choose(world,true);refresh();persist();return true;}
 if(settings.autoComputerChalk&&session.chalk[rules.turn]<.8)session.chalk[rules.turn]=1;
 const epoch=generation;analyze('solve',analysisInput('computer'),null,result=>{
  if(epoch!==generation)return;
  if(result.error||!result.candidates?.length){computerPaused=true;toast(result.error||'No candidate found.');refresh();return;}
  const c=result.candidates[0];aiThinking=true;if(!applyCandidate(c)){aiThinking=false;computerPaused=true;toast('The suggested cue-ball position was not valid. The table is unchanged.');refresh();return;}refreshShot();const delay=settings.aiPace==='quick'?100:settings.aiPace==='slow'?1800:700;
  aiTimer=setTimeout(()=>{aiThinking=false;if(epoch!==generation||anyDialog()||computerPaused)return;refreshShot();beginShot(true);refreshFeatures();},delay);
 },progress=>{$('status').textContent='Computer: '+progress.tested+' trial strokes evaluated.';});
 aiThinking=true;refreshShot();$('status').textContent='Computer is evaluating the table.';return true;
}
function applyCandidate(c){if(c.position){if(!place(world,0,...c.position,rules.ballInHand==='kitchen'))return false;}
 angle=c.angle;side=c.side;up=c.up;elevation=c.elevation;power=Math.round(c.power*10)/10;
 $('callBall').value=String(c.ball);$('callPocket').value=String(c.pocket+1);$('safety').checked=!!c.safety;$('push').checked=!!c.push;$('bankCount').value=String(c.bankCount||1);if(rules.mode==='apa8'&&rules.onEight(world))rules.marker=c.pocket;appliedFamily=c.family;riskCache=null;refresh();return true;
}
function requestCoach(){if(shotRunning||replay||placing||arranging||session.rackEnded||aiThinking||CM.isComputer(session,rules)||session.lag||CM.allowance(session,rules)<=0)return false;
 const input=analysisInput('coach');coachState={input,ready:false,index:0,epoch:generation,source:JSON.stringify([world.snapshot(),rules.snapshot()])};coachPage=0;
 $('coachDialog').showModal();$('coachBody').textContent='Comparing simulated pots, banks, kicks and safeties. Your live table is not being changed.';$('coachSummary').textContent='Analyzing…';$('coachApply').disabled=true;$('coachDemo').disabled=true;$('coachAlternative').hidden=true;$('coachPageLabel').textContent='';
 analyze('solve',input,null,result=>{if(!coachState)return;if(result.error||!result.candidates?.length){$('coachBody').textContent=result.error||'No settled recommendation found.';$('coachSummary').textContent='No timeout charged';return;}
  coachState.result=result;coachState.ready=true;coachState.readyAt=performance.now();CM.useTimeout(session,rules);persist();renderCoach();if(settings.demoAuto)demoCoach();
 },p=>{$('coachSummary').textContent=p.tested+' strokes evaluated';});return true;
}
function coachText(c){const m=c.measure,p=world.table.pockets[c.pocket],spin=(Math.abs(c.up)<.01?'center height':(Math.abs(c.up)*100).toFixed(0)+'% '+(c.up>0?'above':'below')+' center')+(Math.abs(c.side)>.01?', '+(Math.abs(c.side)*100).toFixed(0)+'% '+(c.side>0?'right':'left'):'');
 let text=(!m.legal?'NO VERIFIED LEGAL SHOT IN THIS OPTION':c.safety?'PLAY FOR SAFETY / CONTACT':'RECOMMENDED '+c.family.toUpperCase())+'\n\n'+(c.safety?'Contact the '+(c.first||c.ball)+' and leave a difficult reply.':'Play the '+c.ball+' toward pocket '+p.label+' ('+p.name.toLowerCase()+').')+'\nPower: '+c.power.toFixed(1)+'%. Tip: '+spin+'. Cue: '+c.elevation.toFixed(0)+'°.\n';
 if(c.position)text+='Ball in hand: use the proposed position at '+(c.position[0]*1000).toFixed(0)+' mm from the head rail and '+(c.position[1]*1000).toFixed(0)+' mm from the lower side. Apply asks the live table to use this spot.\n';
 if(settings.coachType==='coach'&&settings.explanation==='detailed'){
  text+='\nWHY THIS OPTION\n';
  text+=m.won?'The ideal trial completes the rack or reaches the game target. ':m.actual?'The intended ball went into the intended pocket in the ideal trial. ':'This is a contact / defensive option; the ideal trial did not pocket the target as called. ';
  text+=m.nextBall?'The resulting position offers the '+m.nextBall+' as the next evaluated direct shot. ':'The search did not identify a straightforward next direct pot. ';
  text+=m.scratch?'The ideal trial scratched: this option is risky and should not be accepted blindly. ':'The ideal trial did not scratch. ';
  text+='\n\nCUE-BALL PLAN\nIdeal finish: '+(m.cueEnd[0]*1000).toFixed(0)+' mm from the head rail, '+(m.cueEnd[1]*1000).toFixed(0)+' mm from the lower side. '+m.events.filter(e=>e.type==='rail'&&e.id===0&&e.kind==='cushion').length+' main-cushion contacts in that trial. The highlighted zone is a 10 cm target around the ideal finish, not a statistical confidence region.';
 }
 const rob=c.robustness;if(rob?.trials)text+='\n\nMODEL CHECK\n'+rob.success+' of '+rob.trials+' perturbed test strokes achieved the tested objective. This is a small sample inside the provisional execution model, not your measured real-world success rate.';
 if(session.chalk[rules.turn]<.5&&settings.chalk==='realistic')text+='\nChalk is low. Chalk before attempting demanding tip offsets.';
 text+='\n\nThe recommendation is the best evaluated option within a bounded search of '+coachState.result.tested+' trial strokes, not proof of the best possible play. The demo shows an ideal stroke, not a guaranteed result. Apply copies the controls; your actual skill/chalk model still governs the live shot.';
 return text;
}
function renderCoach(){if(!coachState?.ready)return;const list=coachState.result.candidates,c=list[coachState.index];$('coachSummary').textContent=(c.safety?'Safety / contact':c.ball+' → '+world.table.pockets[c.pocket].label)+' · '+c.power.toFixed(1)+'% power';$('coachApply').disabled=!settings.applySuggestion||!c.measure.legal;$('coachDemo').disabled=false;$('coachAlternative').hidden=!settings.alternatives||list.length<2;$('coachAlternative').textContent='Option '+(coachState.index+1)+' / '+list.length;fitReader('coach','coachBody',coachText(c),'coachPrev','coachNext','coachPageLabel');}
function openCoachResult(){if(!coachState)return;if(!$('coachDialog').open)$('coachDialog').showModal();renderCoach();}
function demoCoach(){if(!coachState?.ready)return;const c=coachState.result.candidates[coachState.index];$('coachDemo').disabled=true;$('coachSummary').textContent='Preparing an isolated demonstration…';
 analyze('demo',coachState.input,c,result=>{if(!coachState)return;if(result.error||!result.settled){toast(result.error||'The demonstration did not settle.');renderCoach();return;}
  $('coachDialog').close();replay={frames:result.frames,clock:0,index:0,demo:true};cameraAnchor=result.start.balls.find(b=>b.id===0).p;refresh();});
}
function closeCoach(){cancelAnalysis();if($('coachDialog').open)$('coachDialog').close();coachState=null;refresh();}
function applyCoach(){if(!coachState?.ready||!settings.applySuggestion||!coachState.result.candidates[coachState.index].measure.legal)return;const c=coachState.result.candidates[coachState.index];if(coachState.epoch!==generation){toast('The table changed. Request fresh advice.');closeCoach();return;}
 if(applyCandidate(c)){coachOverlay=c;$('coachDialog').close();coachState=null;selectTab('shot');selectPage('shot','aim');refresh();persist();toast('Suggestion applied. You still take the shot.');}
}
function advanceRack(){if(session.lag?.awaitNext){nextLag();return;}
 const next=CM.nextRack(session,rules);if(!next)return;const marker=rules.marker;cancelAnalysis();generation++;rules=next;if(rules.mode==='apa8')rules.marker=marker;world=new World(P.rack(rules.mode,world.table),world.cfg);equipWorld();syncDimensions();angle=side=up=elevation=0;power=85;trace=[];sinks=[];lastReplay=null;undoStack=[];cameraAnchor=null;coachState=coachOverlay=null;paceStart=performance.now();$('callBall').value='';$('callPocket').value=marker!==null&&marker!==undefined?String(marker+1):'';refresh();persist();}
function scheduleNextRack(){if(!settings.autoNext||!session.rackEnded||session.winner!==null)return;const epoch=generation;setTimeout(()=>{if(epoch===generation&&session.rackEnded&&!anyDialog()&&!replay)advanceRack();},2500);}
function statsText(){let text=Q.modes[rules.mode].name+' · rack '+session.rack+'\n'+(session.winner===null?'Match in progress.':session.winner==='draw'?'Match drawn.':rules.players[session.winner]+' won the match.')+'\n\n';
 for(let i=0;i<2;i++){const st=session.stats[i];text+=rules.players[i].toUpperCase()+'\nRacks won: '+session.wins[i]+'\nShots: '+st.shots+'; balls pocketed: '+st.pots+'\nScoring attacking strokes: '+st.scoringShots+' / '+st.attacks+(st.attacks?' ('+Math.round(st.scoringShots/st.attacks*100)+'%)':'')+'\nScratches: '+st.scratches+'; fouls: '+st.fouls+'\nDeclared defenses: '+st.defense+'\nTagged bank makes: '+st.bankMakes+' / '+st.bankAttempts+'\nBest run: '+st.bestRun+'\n8 on break: '+st.eightBreak+'; 9 on break: '+st.nineBreak+'; break-and-runs: '+st.breakRuns+'\n\n';}
 text+='COMPLETE INNINGS: '+session.innings+'\n\n';for(const r of session.records)text+='Rack '+r.rack+': '+r.result+' Points '+r.points.join(' : ')+', dead '+r.dead+', innings '+r.innings+'.\n';text+='\nStats are local Cue Lab game records, not an official APA skill rating. “Scoring stroke” means an attacking stroke that pocketed a ball without a recorded foul, not the probability of making a particular planned ball. Banks are tagged when selected through the coach or AI.';return text;}
function showReferee(){const ls=session.lastShot;if(!ls)return;const e=ls.events;let text='LAST SHOT CONTACT RECORD\n\n';for(const item of e.slice(0,100)){text+=item.t.toFixed(5)+' s · '+(item.type==='ball'?'Ball '+item.a+' → '+item.b:item.type==='rail'?'Ball '+item.id+' → '+item.kind+' '+item.rail:item.type==='pocket'?'Ball '+item.id+' → pocket '+world.table.pockets[item.pocket]?.label:'Ball '+item.id+' off table')+'\n';}text+='\nContacts at the same simulated time can form one simultaneous group. These are events produced by the model, not higher precision than its collision model supports. Use Replay at ¼ speed to watch the stored trajectory.';showHelp(text,'Referee record');}
function downloadJSON(obj,name){const url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function namedDrills(){try{const x=JSON.parse(localStorage.getItem('cue-lab.drills.v1')||'[]');return Array.isArray(x)?x.filter(i=>i&&typeof i.name==='string'&&validSave(i.data)).slice(0,20):[];}catch{return [];}}
function refreshDrills(){const sel=$('namedList');sel.replaceChildren();namedDrills().forEach((d,i)=>sel.add(new Option(d.name,String(i))));$('loadNamed').disabled=!sel.options.length;$('deleteNamed').disabled=!sel.options.length;}
function saveNamed(){const name=$('drillName').value.trim().slice(0,40);if(!name){$('drillName').focus();return;}const list=namedDrills(),snapshot=data();snapshot.rules=new Q.Rules('practice',{players:rules.players}).snapshot();snapshot.session=CM.create('practice',settings,session.seed);const i=list.findIndex(d=>d.name===name);if(i>=0){if(!confirm('Replace the drill “'+name+'”?'))return;list[i]={name,data:snapshot};}else{if(list.length>=20){toast('Twenty drills are saved. Remove one before adding another.');return;}list.push({name,data:snapshot});}if(storageSet('cue-lab.drills.v1',list)){refreshDrills();toast('Named practice position saved.');}}
function acceptStalemate(){const next=CM.stalemate(session,world,rules);if(!next)return;cancelAnalysis();generation++;rules=next;world=new World(P.rack(rules.mode,world.table),world.cfg);equipWorld();undoStack=[];lastReplay=null;trace=[];sinks=[];coachState=coachOverlay=null;refresh();persist();toast('Stalemate recorded. The original breaker breaks again.');}
function stalemate(){if(shotRunning||replay||session.rackEnded||aiThinking)return;
 if(settings.opponent!=='human'){
  const epoch=generation;analyze('stalemate',analysisInput('coach'),null,result=>{if(epoch!==generation)return;if(result.error){toast(result.error);refresh();return;}if(result.agree){acceptStalemate();}else{toast('The computer found a possible scoring option with ball in hand and declined the stalemate.');refresh();}});aiThinking=true;refreshShot();$('status').textContent='Checking whether a stalemate makes sense for both sides.';return;
 }
 const message=rules.mode==='apa8'?'Both players agree to a stalemate? This voids this rack’s score record and restarts with its original breaker.':'Both players agree to a stalemate? Points, innings and defenses stay. Remaining balls become dead under the special stalemate rule, and the original breaker breaks again.';
 if(confirm(message))acceptStalemate();}
function startLag(){session.lag={player:0,results:[],awaitNext:false};rules.turn=0;prepareLagWorld();}
function prepareLagWorld(){const y=W*(session.lag.player===0?.25:.75);world=new World([ball(0,L/4,y)],world.cfg);equipWorld();angle=side=up=elevation=0;power=36;shotRunning=false;replay=null;trace=[];sinks=[];rules.turn=session.lag.player;session.lag.awaitNext=false;}
function lagMessage(){if(session.lag?.awaitNext)return rules.players[session.lag.player]+' lag complete. Select Next lag.';return rules.players[session.lag?.player??0]+': lag to the far rail and back. Closest to the head rail wins.';}
function beginLagShot(computer){if(shotRunning||session.lag.awaitNext)return false;const saved=data();const intended={angle:0,side:0,up:0,elevation:0,power};const actual=CE.fire(world,intended,executionContext(computer),session.seed);if(!actual.result.ok)return false;session.seed=actual.nextSeed;undoStack.push(saved);shotRunning=true;shotPre={lag:true};record=[];trace=[];frameTicks=seenEvents=0;accumulator=0;recordFrame();refresh();return true;}
function endLagShot(){recordFrame();lastReplay=record;shotRunning=false;const rails=world.events.filter(e=>e.type==='rail'&&e.kind==='cushion'),far=rails.filter(e=>world.table.rails[e.rail].a[0]===L),sideRail=rails.some(e=>world.table.rails[e.rail].a[1]===world.table.rails[e.rail].b[1]),cb=world.get(0),invalid=!cb.active||far.length!==1||sideRail;
 session.lag.results[session.lag.player]={invalid,distance:cb.p[0]-P.radius(cb)};session.lag.awaitNext=true;refresh();persist();
 if(CM.isComputer(session,rules)){const epoch=generation;setTimeout(()=>{if(epoch===generation&&session.lag?.awaitNext)nextLag();},800);}}
function nextLag(){if(!session.lag)return;if(session.lag.player===0){session.lag.player=1;prepareLagWorld();refresh();persist();return;}
 const [a,b]=session.lag.results;const av=a.invalid?Infinity:a.distance,bv=b.invalid?Infinity:b.distance;if(av===bv||Math.abs(av-bv)<.0005){toast('Lag tied or both invalid. Lag again.');startLag();refresh();persist();return;}
 const win=av<bv?0:1;session.lag=null;session.breaker=session.firstBreaker=win;rules=CM.makeRules(session,rules.players);world=new World(P.rack(rules.mode,world.table),world.cfg);equipWorld();power=85;angle=side=up=elevation=0;undoStack=[];lastReplay=null;trace=[];refresh();persist();toast(rules.players[win]+' wins the lag and breaks.');}
function runComputerLag(){if(aiThinking)return;const epoch=generation;
 analyze('lag',analysisInput('computer'),null,result=>{if(epoch!==generation||!session.lag||computerPaused)return;if(result.error){computerPaused=true;toast(result.error);refresh();return;}power=result.power;aiThinking=false;beginLagShot(true);});aiThinking=true;refreshShot();}
function initFeatures(){
 for(const g of CS.groups)$('settingsGroup').add(new Option(g,g));
 $('settingsButton').onclick=openSettings;$('settingsClose').onclick=()=>{settingsDraft=null;$('settingsDialog').close();refresh();};$('settingsDialog').addEventListener('cancel',()=>{settingsDraft=null;setTimeout(refresh,0);});
 $('settingsGroup').onchange=()=>{settingsGroup=$('settingsGroup').value;settingsPage=0;renderSettings();};$('settingsSearch').oninput=()=>{settingsPage=0;renderSettings();};$('settingsPrev').onclick=()=>{settingsPage--;renderSettings();};$('settingsNext').onclick=()=>{settingsPage++;renderSettings();};$('applySettings').onclick=()=>applySettings(settingsDraft);
 $('resetSettings').onclick=()=>{if(confirm('Reset the draft settings to classic Arcade defaults? Your game is unchanged until Apply.')){settingsDraft=CS.normalize();renderSettings();}};
 $('viewButton').onclick=()=>{settings.camera=settings.camera==='2d'?'shooter':'2d';refresh();persist();};$('lookButton').onclick=()=>{cameraLook=!cameraLook;refresh();};$('mini3d').onclick=()=>{settings.camera='2d';refresh();persist();};
 $('riskButton').onclick=showRisk;$('chalkButton').onclick=chalkUp;$('coachButton').onclick=requestCoach;
 $('coachClose').onclick=closeCoach;$('coachDialog').addEventListener('cancel',e=>{e.preventDefault();closeCoach();});$('coachDemo').onclick=demoCoach;$('coachApply').onclick=applyCoach;
 $('coachAlternative').onclick=()=>{coachState.index=(coachState.index+1)%coachState.result.candidates.length;delete readers.coach;renderCoach();};
 $('coachPrev').onclick=()=>{if(readers.coach)readers.coach.index=Math.max(0,readers.coach.index-1);renderCoach();};$('coachNext').onclick=()=>{if(readers.coach)readers.coach.index=Math.min(readers.coach.chunks.length-1,readers.coach.index+1);renderCoach();};
 $('computerButton').onclick=()=>{if(aiThinking){cancelAnalysis();computerPaused=true;refresh();}else{computerPaused=!computerPaused;if(!computerPaused)runComputer();refresh();}};
 $('nextRackButton').onclick=advanceRack;$('defenseButton').onclick=()=>{$('safety').checked=!$('safety').checked;refresh();};
 $('statisticsButton').onclick=()=>showHelp(statsText(),'Match scorecard');$('exportStats').onclick=()=>downloadJSON({mode:rules.mode,table:world.table,players:rules.players,stats:session.stats,records:session.records,innings:session.innings},'cue-lab-scorecard.json');$('refereeButton').onclick=showReferee;$('stalemateButton').onclick=stalemate;
 $('namedDrills').onclick=()=>{if(shotRunning||replay)return;refreshDrills();$('drillsDialog').showModal();};$('drillsClose').onclick=()=>$('drillsDialog').close();$('saveNamed').onclick=saveNamed;
 $('loadNamed').onclick=()=>{const d=namedDrills()[Number($('namedList').value)];if(d&&confirmReplace()){$('drillsDialog').close();restore(d.data);undoStack=[];lastReplay=null;refresh();persist();}};
 $('deleteNamed').onclick=()=>{const l=namedDrills(),i=Number($('namedList').value);if(l[i]&&confirm('Delete “'+l[i].name+'”?')){l.splice(i,1);storageSet('cue-lab.drills.v1',l);refreshDrills();}};
 new ResizeObserver(()=>{renderSettings();if(coachState?.ready)renderCoach();}).observe($('settingsDialog'));
 new ResizeObserver(()=>{if(coachState?.ready)renderCoach();}).observe($('coachBody'));
}

initFeatures();
window.addEventListener('resize',resize);new ResizeObserver(resize).observe($('tableWrap'));
new ResizeObserver(scheduleReaders).observe(document.querySelector('.controls'));
new ResizeObserver(scheduleReaders).observe($('helpBody'));
new ResizeObserver(()=>{if(editorState)resizePrecision();}).observe($('precisionWrap'));
for(const [key,v] of Object.entries(Q.modes))$('mode').add(new Option(v.name,key));
world.table.pockets.forEach((p,i)=>$('callPocket').add(new Option(p.label+' · '+p.name,String(i+1))));
for(let i=0;i<=15;i++)$('editBall').add(new Option(i===0?'Cue ball':'Ball '+i,String(i)));
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&validSave(saved))restore(saved);}catch(e){}
equipWorld();syncDimensions();refresh();resize();requestAnimationFrame(frame);
// Small read/test surface, useful for reproducible regression fixtures.
window.CueLab={version:'0.3.0',settings:()=>clone(settings),session:()=>clone(session),setSettings:applySettings,coach:requestCoach,nextRack:advanceRack,computer:runComputer,markPocket:i=>{rules.marker=i;$('callPocket').value=String(i+1);refresh();},risk:()=>strokeRisk(),placement:()=>editorState?{id:editorState.id,x:editorState.x,y:editorState.y,zoom:editorState.zoom,step:editorState.step,valid:editorState.valid(),view:{...editorState.view}}:null,snapshot:data,validateSave:validSave,getWorld:()=>world,getRules:()=>rules,
 setDrill,shoot:beginShot,finish:finishNow,undo,restore,setShot:s=>{if(shotRunning)return;({angle=angle,side=side,up=up,elevation=elevation,power=power}=s);refresh();},
 status:()=>({shotRunning,replay:!!replay,arranging,placing,aiThinking,rackEnded:session.rackEnded,undoCount:undoStack.length,replayFrames:lastReplay?.length||0})};
})();
