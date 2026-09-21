(function(){
'use strict';
const P=window.CuePhysics, Q=window.CueRules;
const {R,L,W,DT,World,ball,clone,clamp,place,spot,validPosition}=P;
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
function data(){return {schema:'cue-lab-save-v1',world:world.snapshot(),rules:rules.snapshot(),shot:{angle,side,up,elevation,power},preferences:{guide,trails,sound,cloth:$('cloth').value}};}
function storageSet(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch(e){if(!storageWarning){toast('This browser blocked local saves. Use Export save to keep your position.');storageWarning=true;}return false;}}
function persist(){if(!shotRunning&&!replay)storageSet(KEY,data());}
function validSave(s){
 if(!s||s.schema!=='cue-lab-save-v1'||!s.world||!Array.isArray(s.world.balls)||s.world.balls.length>16||!s.rules||!Q.modes[s.rules.mode]||!s.shot)return false;
 const ids=new Set();
 for(const b of s.world.balls){if(!Number.isInteger(b.id)||b.id<0||b.id>15||ids.has(b.id))return false;ids.add(b.id);
  for(const k of ['p','v','w'])if(!Array.isArray(b[k])||b[k].length!==3||!b[k].every(Number.isFinite))return false;
  if(!Array.isArray(b.q)||b.q.length!==4||!b.q.every(Number.isFinite)||typeof b.active!=='boolean')return false;
  if(Math.abs(b.p[0])>5||Math.abs(b.p[1])>5||b.p[2]<0||b.p[2]>5||P.norm(b.v)>100||P.norm(b.w)>10000)return false;
 }
 for(const b of s.world.balls){const qn=Math.hypot(...b.q);if(Math.abs(qn-1)>.001)return false;}
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
 if(!['angle','side','up','elevation','power'].every(k=>Number.isFinite(s.shot[k])))return false;
 if(Math.hypot(s.shot.side,s.shot.up)>.971||s.shot.elevation<0||s.shot.elevation>80||s.shot.power<1||s.shot.power>100)return false;
 const limits={slide:[.05,.4],roll:[.003,.04],spin:[1,40],ballRestitution:[.7,1],ballFriction:[0,.15],railRestitution:[.5,.9],railFriction:[0,.4],slateRestitution:[0,.6],cueMass:[.2,1],cueRestitution:[.2,.95],tipFriction:[.1,1.2],deflection:[0,5]};
 if(!s.world.cfg)return false;for(const [k,[lo,hi]] of Object.entries(limits)){const v=s.world.cfg[k];if(!Number.isFinite(v)||v<lo||v>hi)return false;}
 return true;
}
function restore(s){
 if(!validSave(s))throw new Error('This is not a valid, settled Cue Lab save.');
 if(editorState)closePrecision(false);
 world=World.from(s.world);rules=Q.Rules.from(s.rules);
 ({angle,side,up,elevation,power}=s.shot);
 guide=s.preferences?.guide!==false;trails=s.preferences?.trails!==false;sound=!!s.preferences?.sound;
 $('cloth').value=['normal','fast','slow'].includes(s.preferences?.cloth)?s.preferences.cloth:'normal';
 shotRunning=false;shotPre=null;replay=null;arranging=false;placing=false;trace=[];sinks=[];accumulator=0;
 refresh();
}
function changed(){refreshShot();persist();}
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
  else if(rules.mode==='onepocket')desc='Pocket '+P.pockets[rules.pockets[i]].label+(rules.owed[i]?' · owes '+rules.owed[i]:'');
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
 refreshShot();
}
function refreshShot(){
 const info=P.strikeInfo(angle,side,up,elevation,power,world.cfg);
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
  if(id!=='tip')$(id).disabled=shotRunning||!!replay||rules.winner!==null;
 }
 for(const b of document.querySelectorAll('[data-spin],[data-elevation]'))b.disabled=shotRunning||!!replay||rules.winner!==null;
 drawTip();drawElevation();
}
function selectTab(name){for(const b of document.querySelectorAll('[data-tab]')){const chosen=b.dataset.tab===name;b.classList.toggle('selected',chosen);b.setAttribute('aria-selected',String(chosen));}for(const n of ['shot','table','match'])$('tab-'+n).hidden=n!==name;resize();scheduleReaders();}
function confirmReplace(){return (!shotRunning&&rules.shots===0)||confirm('Replace this game or position? Export a save first to keep it.');}
function newGame(mode){
 if(!confirmReplace()){$('mode').value=rules.mode;return;}
 if(editorState)closePrecision(false);
 const names=rules.players.slice(),cfg={...world.cfg};rules=new Q.Rules(mode,{players:names});world=new World(P.rack(mode),cfg);
 angle=0;side=up=elevation=0;power=mode==='straight'||mode==='onepocket'?40:85;arranging=placing=false;
 shotRunning=false;replay=null;undoStack=[];lastReplay=null;trace=[];sinks=[];accumulator=0;
 $('callBall').value='';$('callPocket').value='';$('safety').checked=false;refresh();persist();
}
function beginShot(){
 if(editorState||$('shoot').disabled)return false;
 const saved=data(),pre=rules.start(world,{callBall:$('callBall').value?Number($('callBall').value):null,
  callPocket:$('callPocket').value?Number($('callPocket').value)-1:null,safety:$('safety').checked,push:$('push').checked,bankCount:Number($('bankCount').value)});
 const result=world.strike(angle,side,up,elevation,power);if(!result.ok){toast(result.reason);return false;}
 undoStack.push(saved);undoStack=undoStack.slice(-12);storageSet(KEY,saved);
 shotRunning=true;shotPre=pre;record=[];trace=[];sinks=[];seenEvents=0;frameTicks=0;accumulator=0;
 recordFrame();audioHit('cue',.5);
 $('status').textContent=result.miscue?'Miscue. The tip slipped outside its friction limit.':'Shot in motion.';
 $('finish').hidden=false;refreshShot();$('undo').disabled=false;$('placeCue').disabled=true;return true;
}
function recordFrame(){
 const bs=world.balls.map(b=>({id:b.id,p:[...b.p],q:[...b.q],active:b.active,pocket:b.pocket}));record.push({t:world.time,balls:bs});
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
 recordFrame();lastReplay=record;shotRunning=false;accumulator=0;
 rules.finish(world,shotPre);shotPre=null;
 $('safety').checked=false;$('push').checked=false;$('callBall').value='';$('callPocket').value='';
 refresh();persist();
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
function undo(){if(!undoStack.length)return;const saved=undoStack.pop();restore(saved);lastReplay=null;refresh();persist();toast('Restored the complete previous shot.');}
function startReplay(){
 if(replay){replay=null;refreshShot();return;}
 if(!lastReplay||shotRunning)return;
 replay={frames:lastReplay,clock:0,index:0};refreshShot();
}
function setDrill(kind){
 if(!confirmReplace())return false;
 if(editorState)closePrecision(false);
 rules=new Q.Rules('practice',{players:rules.players});const cfg=world.cfg;
 side=up=elevation=0;angle=0;power=53;
 let balls=[ball(0,.84,W/2),ball(1,1.28,W/2)];
 if(kind==='draw')up=-.50;
 if(kind==='follow')up=.50;
 if(kind==='stun'){up=-.12;power=60;}
 if(kind==='english'){balls=[ball(0,.76,.52)];side=.50;up=.08;elevation=4;angle=.48;power=55;}
 if(kind==='masse'){balls=[ball(0,.8,.4),ball(8,1.1,.5),ball(1,1.7,.9)];side=.46;up=.02;elevation=68;angle=.12;power=54;}
 if(kind==='jump'){balls=[ball(0,.65,W/2),ball(8,.94,W/2),ball(1,1.62,W/2)];elevation=60;power=92;}
 world=new World(balls,cfg);rules.message='Practice: '+kind+'. Change one control, then use Undo to compare.';
 arranging=placing=shotRunning=false;replay=null;lastReplay=null;undoStack=[];trace=[];sinks=[];accumulator=0;
 $('safety').checked=false;refresh();selectTab('shot');selectPage('shot',['masse','jump'].includes(kind)?'angle':['draw','follow','english'].includes(kind)?'spin':'aim');persist();return true;
}
function initSound(){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch(e){sound=false;}}
function audioHit(type,gain){
 if(!sound||document.hidden)return;initSound();if(!audio)return;
 try{const osc=audio.createOscillator(),g=audio.createGain();osc.type='triangle';
  const t=audio.currentTime;osc.frequency.setValueAtTime(type==='ball'?1500:type==='rail'?210:type==='pocket'?95:640,t);
  osc.frequency.exponentialRampToValueAtTime(type==='ball'?650:70,t+.035);
  g.gain.setValueAtTime(gain*.16,t);g.gain.exponentialRampToValueAtTime(.0001,t+.055);
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
 const wood=ctx.createLinearGradient(x,y,x+L*s,y+W*s);wood.addColorStop(0,'#8b6c47');wood.addColorStop(.18,'#514330');wood.addColorStop(.8,'#4a392a');wood.addColorStop(1,'#8b6c48');
 rounded(ctx,x-.127*s,y-.127*s,(L+.254)*s,(W+.254)*s,.058*s);ctx.fillStyle=wood;ctx.fill();ctx.restore();
 rounded(ctx,x-.137*s,y-.137*s,(L+.274)*s,(W+.274)*s,.061*s);ctx.strokeStyle='#af98704d';ctx.lineWidth=1;ctx.stroke();
 rounded(ctx,x-.091*s,y-.091*s,(L+.182)*s,(W+.182)*s,.037*s);ctx.fillStyle='#142b28';ctx.fill();
 const felt=ctx.createRadialGradient(x+L*s*.45,y+W*s*.45,.1*s,x+L*s*.5,y+W*s*.5,1.6*s);
 felt.addColorStop(0,'#267b6c');felt.addColorStop(1,'#18594f');
 ctx.fillStyle=felt;ctx.fillRect(x,y,L*s,W*s);ctx.fillStyle=feltNoise;ctx.fillRect(x,y,L*s,W*s);
 // Small inner falloff gives the rails depth without changing collision geometry.
 const shade=ctx.createLinearGradient(0,y,0,y+.055*s);shade.addColorStop(0,'#062c2e80');shade.addColorStop(1,'#062c2e00');ctx.fillStyle=shade;ctx.fillRect(x,y,L*s,.055*s);
 if(rules.ballInHand==='kitchen'||placing){ctx.fillStyle='#d6e4ba0b';ctx.fillRect(x,y,L*s/4,W*s);line([[L/4,0],[L/4,W]],'#d8e6ce3c',1,[3,6]);}
 for(const p of P.pockets){const [px,py]=toScreen(p.x,p.y);ctx.beginPath();ctx.arc(px,py,.076*s,0,Math.PI*2);ctx.fillStyle='#342c22';ctx.fill();ctx.strokeStyle='#bb9a654a';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(px,py,.064*s,0,Math.PI*2);ctx.fillStyle='#060e10';ctx.fill();
  const hole=ctx.createRadialGradient(px,py-.01*s,0,px,py,.063*s);hole.addColorStop(0,'#000');hole.addColorStop(1,'#0b1718');ctx.fillStyle=hole;ctx.fill();
 }
 // Draw precisely the face segments used by the physics engine.
 for(const r of P.rails){
  let a=r.a,b=r.b,offset=[0,0];
  if(r.kind==='cushion')offset=a[1]===b[1]?[0,a[1]===0?-.022:.022]:[a[0]===0?-.022:.022,0];
  line([[a[0]+offset[0],a[1]+offset[1]],[b[0]+offset[0],b[1]+offset[1]]],r.kind==='jaw'?'#235d4e':'#286858',r.kind==='jaw'?.028*s:.047*s);
  line([a,b],'#73a0878c',Math.max(1,.004*s));
 }
 for(let i=1;i<8;i++)if(i!==4)for(const yy of [-.090,W+.090]){const [dx,dy]=toScreen(L*i/8,yy);ctx.save();ctx.translate(dx,dy);ctx.rotate(Math.PI/4);ctx.fillStyle='#c4b998';ctx.fillRect(-1.8,-1.8,3.6,3.6);ctx.restore();}
 for(const xx of [-.090,L+.090])for(let i=1;i<4;i++){const [dx,dy]=toScreen(xx,W*i/4);ctx.save();ctx.translate(dx,dy);ctx.rotate(Math.PI/4);ctx.fillStyle='#c4b998';ctx.fillRect(-1.8,-1.8,3.6,3.6);ctx.restore();}
 for(const xx of [L/4,L*.75]){const [px,py]=toScreen(xx,W/2);ctx.beginPath();ctx.arc(px,py,Math.max(1,.003*s),0,Math.PI*2);ctx.fillStyle='#e3e3c8a8';ctx.fill();}
 P.pockets.forEach((p,i)=>{const [px,py]=toScreen(p.x,p.y),sy=p.y>W/2?-1:1;ctx.fillStyle='#a7b3a5';ctx.font=Math.max(7,s*.028)+'px ui-sans-serif,system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.label,px,py+sy*.091*s);
  if(rules.mode==='onepocket'){const owner=rules.pockets.indexOf(i);if(owner>=0){ctx.beginPath();ctx.arc(px,py,.067*s,0,Math.PI*2);ctx.strokeStyle=owner===0?'#d3e8a1':'#edb891';ctx.lineWidth=2;ctx.stroke();}}
  if($('callPocket').value&&Number($('callPocket').value)-1===i&&!shotRunning&&!replay){ctx.beginPath();ctx.arc(px,py,.069*s,0,Math.PI*2);ctx.strokeStyle='#e5eeaf';ctx.lineWidth=2;ctx.stroke();}
 });
}
function qrot(q,v){const [w,x,y,z]=q,t=P.mul(P.cross([x,y,z],v),2);return P.add(v,P.add(P.mul(t,w),P.cross([x,y,z],t)));}
function drawBall(b,alpha=1,shrink=1){
 const s=view.scale,[bx,by]=toScreen(b.p[0],b.p[1]),height=Math.max(0,b.p[2]-R),r=R*s*shrink;
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
 if(shotRunning||replay||arranging||placing||rules.winner!==null||rules.choice)return;
 const cue=world.get(0);if(!cue||!cue.active)return;
 const d=[Math.cos(angle),Math.sin(angle)],info=P.strikeInfo(angle,side,up,elevation,power,world.cfg);
 if(guide){
  let distance=3.3,target=null;
  for(const b of world.balls)if(b.active&&b.id!==0){const rx=b.p[0]-cue.p[0],ry=b.p[1]-cue.p[1],t=rx*d[0]+ry*d[1],h=rx*rx+ry*ry-t*t;
   if(t>0&&h<4*R*R){const hit=t-Math.sqrt(4*R*R-h);if(hit>=0&&hit<distance){distance=hit;target=b;}}}
  const bounds=[];if(Math.abs(d[0])>1e-8)bounds.push(((d[0]>0?L-R:R)-cue.p[0])/d[0]);if(Math.abs(d[1])>1e-8)bounds.push(((d[1]>0?W-R:R)-cue.p[1])/d[1]);
  const edge=Math.min(...bounds.filter(t=>t>0));if(edge<distance){distance=edge;target=null;}
  const end=[cue.p[0]+d[0]*distance,cue.p[1]+d[1]*distance];
  line([[cue.p[0]+d[0]*R*1.3,cue.p[1]+d[1]*R*1.3],end],'#f0edc578',1.05,[5,7]);
  const [gx,gy]=toScreen(...end);ctx.beginPath();ctx.arc(gx,gy,R*view.scale,0,Math.PI*2);ctx.strokeStyle='#f1efc68c';ctx.lineWidth=1;ctx.stroke();
  if(target){const n=P.unit([target.p[0]-end[0],target.p[1]-end[1],0]);line([target.p,[target.p[0]+n[0]*.24,target.p[1]+n[1]*.24]],'#f1efc64f',1,[3,5]);}
 }
 const contact=[cue.p[0]+info.r[0],cue.p[1]+info.r[1]],len=.83*Math.cos(elevation*Math.PI/180);
 const tip=[contact[0]-d[0]*.055,contact[1]-d[1]*.055],butt=[tip[0]-d[0]*len,tip[1]-d[1]*len];
 const [tx,ty]=toScreen(...tip),[bx,by]=toScreen(...butt);
 ctx.save();ctx.lineCap='round';ctx.shadowColor='#07151a80';ctx.shadowBlur=3;ctx.shadowOffsetY=4;
 const cg=ctx.createLinearGradient(bx,by,tx,ty);cg.addColorStop(0,'#27363a');cg.addColorStop(.33,'#b7a074');cg.addColorStop(.40,'#c5b48a');cg.addColorStop(1,'#eddfaf');
 ctx.strokeStyle=cg;ctx.lineWidth=Math.max(3,.014*view.scale);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(tx,ty);ctx.stroke();ctx.shadowColor='transparent';
 const a=toScreen(tip[0]-d[0]*.014,tip[1]-d[1]*.014);ctx.strokeStyle='#7ab4ae';ctx.lineWidth=Math.max(2,.009*view.scale);ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(tx,ty);ctx.stroke();ctx.restore();
}
function drawTrace(){if(!trails||trace.length<2)return;line(trace,'#d9eeb26e',Math.max(1,view.scale*.003));}
function draw(){
 if(editorState){drawPrecision();return;}
 drawTable();if(!replay)drawTrace();
 let bs=world.balls;
 if(replay){const f=replay.frames;while(replay.index<f.length-1&&f[replay.index+1].t<=replay.clock)replay.index++;bs=f[replay.index].balls;}
 drawAim();
 bs.filter(b=>b.active).sort((a,b)=>a.p[2]-b.p[2]).forEach(b=>drawBall(b));
 if(!replay){const now=performance.now();sinks=sinks.filter(e=>now-e.start<330);for(const e of sinks){const f=(now-e.start)/330;drawBall({id:e.id,p:e.p,q:[1,0,0,0]},1-f,1-f*.8);}}
 if(placing||arranging){const b=world.get(arranging?editId:0);if(b&&b.active){const [x,y]=toScreen(...b.p);ctx.beginPath();ctx.arc(x,y,R*view.scale+5,0,Math.PI*2);ctx.strokeStyle='#d3e8a1';ctx.lineWidth=1.6;ctx.stroke();}}
 const cue=world.get(0);
 $('motionReadout').textContent=replay?'REPLAY · '+replay.clock.toFixed(1)+' s':shotRunning&&cue.active?P.stateName(cue).toUpperCase()+'  '+P.norm(cue.v).toFixed(2)+' m/s  ·  '+(cue.p[2]>R+.005?((cue.p[2]-R)*100).toFixed(1)+' cm high':Math.round(P.norm(cue.w)*60/(2*Math.PI))+' rpm'):'';
}
function drawTip(){
 const c=$('tip').getContext('2d'),s=340,x=s/2,y=s/2,r=s*.38;
 c.clearRect(0,0,s,s);c.beginPath();c.arc(x,y,r,0,Math.PI*2);
 const g=c.createRadialGradient(x-r*.35,y-r*.42,1,x,y,r*1.1);g.addColorStop(0,'#fffef4');g.addColorStop(.64,'#e8e9da');g.addColorStop(1,'#a4b6ac');c.fillStyle=g;c.fill();
 c.strokeStyle='#1d343321';c.lineWidth=2;c.beginPath();c.moveTo(x-r,y);c.lineTo(x+r,y);c.moveTo(x,y-r);c.lineTo(x,y+r);c.stroke();
 c.setLineDash([7,7]);c.strokeStyle='#33514466';c.lineWidth=2;
 const lim=world.cfg.tipFriction/Math.sqrt(1+world.cfg.tipFriction**2);c.beginPath();c.arc(x,y,r*lim,0,Math.PI*2);c.stroke();c.setLineDash([]);
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
 const info=P.strikeInfo(0,side,up,elevation,power,world.cfg);const tx=cx+info.r[0]/R*r,ty=cy-info.r[2]/R*r;
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
  if(replay){replay.clock+=dt*timeScale;if(replay.clock>replay.frames[replay.frames.length-1].t+1){replay=null;refreshShot();}}
  draw();
 }
 requestAnimationFrame(frame);
}
// Pointer capture avoids stray shots and lost drags. Aiming never shoots.
canvas.addEventListener('pointerdown',e=>{
 if(shotRunning||replay||rules.choice||rules.winner!==null||editorState)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);aimPointer=e.pointerId;
 const [x,y]=fromScreen(e.clientX,e.clientY);
 if(arranging){
  const id=editId,kitchen=false;
  if(id===0){openPrecision(0,true);editorState.set(x,y,true);updatePrecision();return;}
  if(place(world,id,x,y,kitchen)){refresh();persist();}
  else toast('Choose a clear spot'+(kitchen?' inside the kitchen':' on the cloth')+'.');aimPointer=null;return;
 }
 const cue=world.get(0);if(Math.hypot(x-cue.p[0],y-cue.p[1])>.015){angle=Math.atan2(y-cue.p[1],x-cue.p[0]);changed();}
});
canvas.addEventListener('pointermove',e=>{if(e.pointerId!==aimPointer||shotRunning||replay||arranging||placing)return;
 const [x,y]=fromScreen(e.clientX,e.clientY),cue=world.get(0);if(Math.hypot(x-cue.p[0],y-cue.p[1])>.03){angle=Math.atan2(y-cue.p[1],x-cue.p[0]);refreshShot();}});
function endAim(e){if(e.pointerId===aimPointer){aimPointer=null;persist();}}
canvas.addEventListener('pointerup',endAim);canvas.addEventListener('pointercancel',endAim);
function tipAt(e){const b=$('tip').getBoundingClientRect(),size=Math.min(b.width,b.height);side=(e.clientX-b.left-b.width/2)/(size*.38);up=-(e.clientY-b.top-b.height/2)/(size*.38);const s=Math.hypot(side,up);if(s>.97){side*=.97/s;up*=.97/s;}changed();}
$('tip').addEventListener('pointerdown',e=>{if(shotRunning||replay)return;e.preventDefault();tipPointer=e.pointerId;$('tip').setPointerCapture(e.pointerId);tipAt(e);});
$('tip').addEventListener('pointermove',e=>{if(e.pointerId===tipPointer)tipAt(e);});
for(const n of ['pointerup','pointercancel'])$('tip').addEventListener(n,()=>tipPointer=null);
$('tip').addEventListener('keydown',e=>{if(shotRunning||replay)return;const d={ArrowLeft:[-.025,0],ArrowRight:[.025,0],ArrowUp:[0,.025],ArrowDown:[0,-.025]}[e.key];if(d){e.preventDefault();side+=d[0];up+=d[1];const r=Math.hypot(side,up);if(r>.97){side*=.97/r;up*=.97/r;}changed();}});
$('centerTip').onclick=()=>{if(shotRunning||replay)return;side=up=0;changed();};
$('power').oninput=()=>{power=Number($('power').value);changed();};$('elevation').oninput=()=>{elevation=Number($('elevation').value);changed();};
$('fineAim').onpointerdown=()=>fineBase=angle;$('fineAim').onfocus=()=>fineBase=angle;
$('fineAim').oninput=()=>{if(!shotRunning&&!replay){angle=fineBase+Number($('fineAim').value)*Math.PI/180;refreshShot();}};
$('fineAim').onchange=()=>{fineBase=angle;$('fineAim').value=0;persist();};
function aimBy(d){if(!shotRunning&&!replay&&!arranging&&!placing){angle+=d*Math.PI/180;changed();}}
$('aimLeft').onclick=()=>aimBy(.1);$('aimRight').onclick=()=>aimBy(-.1);
for(const id of ['callBall','callPocket','safety','push','bankCount'])$(id).onchange=changed;
$('shoot').onclick=beginShot;$('undo').onclick=undo;$('finish').onclick=finishNow;$('replay').onclick=startReplay;
$('newGame').onclick=()=>newGame(rules.mode);$('mode').onchange=()=>newGame($('mode').value);
$('guide').onclick=()=>{guide=!guide;refresh();persist();};
$('placeCue').onclick=()=>openPrecision(0,false);
$('speed').onclick=()=>{const speeds=[1,.5,.25,2];timeScale=speeds[(speeds.indexOf(timeScale)+1)%speeds.length];$('speed').innerHTML=(timeScale===.25?'¼':timeScale===.5?'½':timeScale)+'× <span>Speed</span>';};
$('take').onclick=()=>{rules.choose(world,true);refresh();persist();};$('returnShot').onclick=()=>{rules.choose(world,false);refresh();persist();};
$('arrange').onclick=()=>{
 if(shotRunning||replay){toast('Finish this shot first.');return;}
 if(rules.mode!=='practice'){
  if(!confirm('Switch to free practice and edit this position? The competitive score will be reset.'))return;
  rules=new Q.Rules('practice',{players:rules.players});undoStack=[];lastReplay=null;
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
$('cloth').onchange=()=>{if(shotRunning||replay){toast('Change cloth between shots.');return;}const cfg={normal:[.20,.011,8],fast:[.17,.0075,7],slow:[.23,.017,10]}[$('cloth').value];[world.cfg.slide,world.cfg.roll,world.cfg.spin]=cfg;persist();};
$('trails').onchange=()=>{trails=$('trails').checked;persist();};$('sound').onchange=()=>{sound=$('sound').checked;initSound();persist();};
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
 if(['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)||document.activeElement===$('tip')||$('helpDialog').open)return;
 if(e.code==='Space'){e.preventDefault();beginShot();}if(e.key.toLowerCase()==='a')aimBy(.1);if(e.key.toLowerCase()==='d')aimBy(-.1);if(e.key.toLowerCase()==='u')undo();});
document.addEventListener('visibilitychange',()=>{lastFrame=0;accumulator=0;});
/* Included inside app.js's closure by build.py. This layer owns UI only. */
function selectPage(group,name){
 if(!['shot','table','match'].includes(group))return;
 if(!document.querySelector('[data-pane="'+group+':'+name+'"]'))return;
 pages[group]=name;
 for(const b of document.querySelectorAll('[data-group="'+group+'"]')){
  const on=b.dataset.page===name;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));
 }
 for(const el of document.querySelectorAll('[data-pane^="'+group+':"]'))el.hidden=el.dataset.pane!==group+':'+name;
 scheduleReaders();
}
for(const b of document.querySelectorAll('[data-page]'))b.onclick=()=>selectPage(b.dataset.group,b.dataset.page);
for(const b of document.querySelectorAll('[data-spin]'))b.onclick=()=>{
 if(shotRunning||replay||rules.winner!==null)return;[side,up]=b.dataset.spin.split(',').map(Number);changed();
};
for(const b of document.querySelectorAll('[data-elevation]'))b.onclick=()=>{
 if(shotRunning||replay||rules.winner!==null)return;elevation=Number(b.dataset.elevation);$('elevation').value=elevation;changed();
};
const HELP_TEXT=`PLAY A SHOT
Drag on the table to aim. The Aim tab has small left/right corrections. Choose Spin to touch the exact tip contact point, or Cue angle to raise the cue. Set power, then press Shoot. Aiming never fires. A/D fine-tune aim, Space shoots, and U undoes when the table has keyboard focus.

PLACE THE CUE BALL
Press Place cue for a close-up. Drag anywhere in the zoomed view to move the preview, without covering it with your finger. Tap the small overview to move to another part of the table. Use the arrows for 1, 5 or 10 mm nudges. Green is valid. Place here confirms; Cancel and Escape leave the live position unchanged.

SPIN AND ELEVATION
Follow is above center, draw below, English to either side. Combine them by dragging on the ball. The diagram is viewed along the cue, so its vertical axis tilts with cue elevation. The dashed circle is the modeled chalk-grip limit: outside it, a miscue is possible. Tip contact with the cloth is blocked. Cue-shaft collisions with rails or other balls are not modeled yet.

CALL YOUR SHOT
When the game requires it, choose a ball and pocket on Aim, or select Safety. Pocket letters run A through F around the table. A push-out control appears when available. The Match tab explains each game's Club rules. These are local two-player games; Free practice is solo. There is no computer opponent or online multiplayer yet.

PRACTICE AND SAVES
Practice has preset drills, ball arrangement, saves and table settings in separate tabs. Undo restores the entire preceding shot, including controls and score. Replay is view-only. Finish shot skips the animation, not the physics. Arranging explicitly switches to free practice. Save position uses this browser; Export makes a portable JSON backup. Old version 0.1 saves remain compatible. Saves from a downloaded file do not automatically transfer to the hosted site: export, then import.

PHYSICS
The engine tracks three-dimensional position, velocity, spin and orientation. Cloth friction acts at the ball's base. Ball and rail contacts transfer momentum and spin. Draw and follow depend on spin remaining at impact, not a scripted reverse or forward motion. Raising the cue can drive the ball into the slate before rebounding. The dashed aim guide is geometric, not spin-aware; the solid trail is the actual simulated path.

LIMITATIONS
This is a playable physics prototype, not a calibrated digital twin. Cushion elasticity, pocket capture, tip slip, shaft deflection, massé and jumps still need measured-shot calibration. Club rules v0.1 omit some official break choices, frozen-rail exceptions, double-hit detection, stalemate rulings, referee decisions and compound-foul exceptions. The kitchen escape rule and special rerack clearance use approximations. The source repository's physics and rules documents record the details and references.`;
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
 if(shotRunning||replay||rules.choice||rules.winner!==null)return false;
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
  drawBall({id:e.id,p:[e.x,e.y,R],q:old?.q||[1,0,0,0]});
  const [x,y]=e.screen(),r=R*e.scale;
  ctx.save();ctx.beginPath();ctx.arc(x,y,r+5,0,Math.PI*2);ctx.strokeStyle=e.valid()?'#d3e8a1':'#ff9578';ctx.lineWidth=2;ctx.stroke();
  ctx.strokeStyle='#203932';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.moveTo(x,y-5);ctx.lineTo(x,y+5);ctx.stroke();ctx.restore();
 }finally{ctx=oldCtx;view=oldView;}
 drawPlacementMap();
}
function drawPlacementMap(){
 const e=editorState;if(!e)return;
 const c=$('placementMap').getContext('2d'),w=360,h=204,s=120,ox=(w-L*s)/2,oy=(h+W*s)/2;
 c.clearRect(0,0,w,h);c.fillStyle='#255e51';c.fillRect(ox,oy-W*s,L*s,W*s);
 if(e.kitchen){c.fillStyle='#d3e8a12b';c.fillRect(ox,oy-W*s,L*s/4,W*s);c.strokeStyle='#c3d1a9';c.setLineDash([4,4]);c.beginPath();c.moveTo(ox+L*s/4,oy);c.lineTo(ox+L*s/4,oy-W*s);c.stroke();c.setLineDash([]);}
 for(const p of P.pockets){c.beginPath();c.arc(ox+p.x*s,oy-p.y*s,7,0,Math.PI*2);c.fillStyle='#071315';c.fill();}
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
 editorState.set((x-(360-L*120)/2)/120,((204+W*120)/2-y)/120,true);placementDrag=null;updatePrecision();
});

window.addEventListener('resize',resize);new ResizeObserver(resize).observe($('tableWrap'));
new ResizeObserver(scheduleReaders).observe(document.querySelector('.controls'));
new ResizeObserver(scheduleReaders).observe($('helpBody'));
new ResizeObserver(()=>{if(editorState)resizePrecision();}).observe($('precisionWrap'));
for(const [key,v] of Object.entries(Q.modes))$('mode').add(new Option(v.name,key));
P.pockets.forEach((p,i)=>$('callPocket').add(new Option(p.label+' · '+p.name,String(i+1))));
for(let i=0;i<=15;i++)$('editBall').add(new Option(i===0?'Cue ball':'Ball '+i,String(i)));
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&validSave(saved))restore(saved);}catch(e){}
refresh();resize();requestAnimationFrame(frame);
// Small read/test surface, useful for reproducible regression fixtures.
window.CueLab={version:'0.2.0',placement:()=>editorState?{id:editorState.id,x:editorState.x,y:editorState.y,zoom:editorState.zoom,step:editorState.step,valid:editorState.valid(),view:{...editorState.view}}:null,snapshot:data,validateSave:validSave,getWorld:()=>world,getRules:()=>rules,
 setDrill,shoot:beginShot,finish:finishNow,undo,restore,setShot:s=>{if(shotRunning)return;({angle=angle,side=side,up=up,elevation=elevation,power=power}=s);refresh();},
 status:()=>({shotRunning,replay:!!replay,arranging,placing,undoCount:undoStack.length,replayFrames:lastReplay?.length||0})};
})();
