/* Cue Lab physics. SI units; x along the table, y toward the top rail, z up.
 * Original implementation. See docs/PHYSICS.md for assumptions and references.
 * Fixed outer steps + swept ball/cushion collisions + split cloth/gravity.
 */
(function(root){
'use strict';
const R=0.028575, M=0.17, I=0.4*M*R*R, L=2.54, W=1.27, G=9.81, DT=1/480;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,k)=>a.map(x=>x*k);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>Math.hypot(...a);
const unit=a=>mul(a,1/(norm(a)||1));
const clone=x=>JSON.parse(JSON.stringify(x));
const defaults={slide:0.20,roll:0.011,spin:8.0,ballRestitution:0.95,ballFriction:0.045,
  railRestitution:0.78,railFriction:0.18,slateRestitution:0.32,cueMass:0.54,
  cueRestitution:0.75,tipFriction:0.70,deflection:1.6};
function makePockets(L=2.54,W=1.27){return [{x:-.027,y:W+.027,label:'A',name:'Upper left'},
 {x:L/2,y:W+.046,label:'B',name:'Upper side'},
 {x:L+.027,y:W+.027,label:'C',name:'Upper right'},
 {x:L+.027,y:-.027,label:'D',name:'Lower right'},
 {x:L/2,y:-.046,label:'E',name:'Lower side'},
 {x:-.027,y:-.027,label:'F',name:'Lower left'}];}
const pockets=makePockets();
function makeRails(L=2.54,W=1.27){
 const s=.074,c=.092,t=.047,rails=[];
 const seg=(a,b,kind='cushion')=>rails.push({a,b,kind,id:rails.length});
 // Main rails and their flat pocket facings. The end caps are also collidable.
 for(const y of [0,W]){
  const out=y===0?-1:1;
  seg([c,y],[L/2-s,y]); seg([L/2+s,y],[L-c,y]);
  seg([L/2-s,y],[L/2-t,y+out*.053],'jaw');
  seg([L/2+s,y],[L/2+t,y+out*.053],'jaw');
  seg([c,y],[.036,y+out*.039],'jaw');
  seg([L-c,y],[L-.036,y+out*.039],'jaw');
 }
 for(const x of [0,L]){
  const out=x===0?-1:1;
  seg([x,c],[x,W-c]);
  seg([x,c],[x+out*.039,.036],'jaw');
  seg([x,W-c],[x+out*.039,W-.036],'jaw');
 }
 return rails;
}
const rails=makeRails();
function table(length=L,width=W){
 if(!Number.isFinite(length)||!Number.isFinite(width)||length<1.8||length>3.0||width<.9||width>1.5)throw new RangeError('Invalid table dimensions.');
 return {L:length,W:width,pockets:makePockets(length,width),rails:makeRails(length,width)};
}
const radius=b=>b.radius??R,mass=b=>b.mass??M,inertia=b=>.4*mass(b)*radius(b)**2;
function ball(id,x,y){return {id,p:[x,y,R],v:[0,0,0],w:[0,0,0],q:[1,0,0,0],active:true,pocket:null};}
function stop(b){b.v=[0,0,0];b.w=[0,0,0];b.p[2]=radius(b);}
function apply(b,J,r){for(let k=0;k<3;k++)b.v[k]+=J[k]/mass(b);
 const t=cross(r,J);for(let k=0;k<3;k++)b.w[k]+=t[k]/inertia(b);}
function energy(b){return .5*mass(b)*dot(b.v,b.v)+.5*inertia(b)*dot(b.w,b.w)+mass(b)*G*Math.max(0,b.p[2]-radius(b));}
function moving(b){const R=radius(b);return b.active&&(norm(b.v)>.0002||Math.hypot(b.w[0],b.w[1])*R>.0002||Math.abs(b.w[2])>.025||b.p[2]>R+.00001);}
function slip(b){const R=radius(b);return [b.v[0]-R*b.w[1],b.v[1]+R*b.w[0],0];}
function stateName(b){const R=radius(b);if(!b.active)return 'Pocketed';if(b.p[2]>R+.0001||Math.abs(b.v[2])>.03)return 'Airborne';
 if(norm(slip(b))>.01)return 'Sliding';if(Math.hypot(b.v[0],b.v[1])>.003)return 'Rolling';
 return Math.abs(b.w[2])>.025?'Spinning':'At rest';}
// Apply friction only at actual cloth contact. Stop at the exact slide-to-roll transition.
function cloth(b,h,cfg){
 const R=radius(b);
 if(!b.active||b.p[2]>R+.000005||b.v[2]>.0001)return;
 let rem=h;const u=slip(b),s=norm(u);
 if(s>1e-9&&cfg.slide>0){
  const t=Math.min(rem,s/(3.5*cfg.slide*G));
  const ax=-cfg.slide*G*u[0]/s,ay=-cfg.slide*G*u[1]/s;
  b.v[0]+=ax*t;b.v[1]+=ay*t;b.w[0]+=2.5*ay*t/R;b.w[1]-=2.5*ax*t/R;
  rem-=t;
  if(t>=s/(3.5*cfg.slide*G)-1e-12){b.w[0]=-b.v[1]/R;b.w[1]=b.v[0]/R;}
 }else if(s>1e-9)rem=0;
 if(rem>0){const speed=Math.hypot(b.v[0],b.v[1]);
  const scale=speed>0?Math.max(0,1-cfg.roll*G*rem/speed):0;
  b.v[0]*=scale;b.v[1]*=scale;b.w[0]=-b.v[1]/R;b.w[1]=b.v[0]/R;
 }
 b.w[2]=Math.sign(b.w[2])*Math.max(0,Math.abs(b.w[2])-cfg.spin*h);
}
function floorImpact(b,cfg){
 const R=radius(b),M=mass(b);
 b.p[2]=R;
 if(b.v[2]>=0)return;
 const e=Math.abs(b.v[2])<.20?0:cfg.slateRestitution;
 const jn=-(1+e)*M*b.v[2],u=slip(b),s=norm(u);
 const jt=s?Math.min(M*s/3.5,cfg.slide*jn):0;
 apply(b,[-jt*u[0]/(s||1),-jt*u[1]/(s||1),jn],[0,0,-R]);
 if(b.v[2]<.03)b.v[2]=0;
}
function orientation(b,t){
 const s=norm(b.w),a=s*t/2;if(s<1e-9)return;
 const d=[Math.cos(a),...mul(b.w,Math.sin(a)/s)],q=b.q;
 b.q=[d[0]*q[0]-d[1]*q[1]-d[2]*q[2]-d[3]*q[3],
 d[0]*q[1]+d[1]*q[0]+d[2]*q[3]-d[3]*q[2],
 d[0]*q[2]-d[1]*q[3]+d[2]*q[0]+d[3]*q[1],
 d[0]*q[3]+d[1]*q[2]-d[2]*q[1]+d[3]*q[0]];
 const z=Math.hypot(...b.q);b.q=b.q.map(x=>x/z);
}
function contact(a,b,cfg){
 const ra=radius(a),rb=radius(b),imA=1/mass(a),imB=1/mass(b),inv=imA+imB;
 let d=sub(b.p,a.p),dist=norm(d),n=dist>1e-10?mul(d,1/dist):[1,0,0];
 const vn=dot(sub(b.v,a.v),n);
 if(dist<ra+rb){const fix=ra+rb-dist+1e-8;for(let i=0;i<3;i++){a.p[i]-=n[i]*fix*imA/inv;b.p[i]+=n[i]*fix*imB/inv;}}
 if(vn>=-1e-7)return 0;
 const jn=-(1+cfg.ballRestitution)*vn/inv,rA=mul(n,ra),rB=mul(n,-rb);
 const rel=sub(add(b.v,cross(b.w,rB)),add(a.v,cross(a.w,rA)));
 const ut=sub(rel,mul(n,dot(rel,n))),speed=norm(ut);
 const denom=inv+ra*ra/inertia(a)+rb*rb/inertia(b);
 const jt=speed?mul(ut,-Math.min(speed/denom,cfg.ballFriction*jn)/speed):[0,0,0];
 const J=add(mul(n,jn),jt);apply(a,mul(J,-1),rA);apply(b,J,rB);return jn;
}
// Co-timed rack contacts retain the tested simultaneous solver, with unequal masses.
function simultaneousContacts(balls,cfg){
 const cons=[];
 for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){
  const a=balls[i],b=balls[j],d=sub(b.p,a.p),len=norm(d),ra=radius(a),rb=radius(b);
  if(len>ra+rb+2e-7||len<1e-12)continue;
  const n=mul(d,1/len),vn=dot(sub(b.v,a.v),n);
  if(vn>1e-6)continue;
  cons.push({a,b,n,ra,rb,imA:1/mass(a),imB:1/mass(b),target:-cfg.ballRestitution*Math.min(vn,0),J:0});
 }
 for(let iter=0;iter<24;iter++)for(const c of cons){
  const vn=dot(sub(c.b.v,c.a.v),c.n),next=Math.max(0,c.J+(c.target-vn)/(c.imA+c.imB)),dj=next-c.J;
  c.J=next;for(let k=0;k<3;k++){c.a.v[k]-=dj*c.n[k]*c.imA;c.b.v[k]+=dj*c.n[k]*c.imB;}
 }
 for(const c of cons){
  if(c.J<1e-9)continue;
  const rA=mul(c.n,c.ra),rB=mul(c.n,-c.rb),rel=sub(add(c.b.v,cross(c.b.w,rB)),add(c.a.v,cross(c.a.w,rA)));
  const u=sub(rel,mul(c.n,dot(rel,c.n))),us=norm(u),denom=c.imA+c.imB+c.ra*c.ra/inertia(c.a)+c.rb*c.rb/inertia(c.b);
  if(us>1e-10){const jt=mul(u,-Math.min(us/denom,cfg.ballFriction*c.J)/us);apply(c.a,mul(jt,-1),rA);apply(c.b,jt,rB);}
  const len=norm(sub(c.b.p,c.a.p));if(len<c.ra+c.rb){const f=(c.ra+c.rb-len+1e-8)/(c.imA+c.imB);for(let k=0;k<3;k++){c.a.p[k]-=c.n[k]*f*c.imA;c.b.p[k]+=c.n[k]*f*c.imB;}}
 }
 return cons.filter(c=>c.J>1e-9);
}
function circleTOI(px,py,vx,vy,r,limit){
 const a=vx*vx+vy*vy,b=px*vx+py*vy,c=px*px+py*py-r*r;
 if(a<1e-14||b>=0)return null;
 if(c<1e-10)return 0;
 const disc=b*b-a*c;if(disc<0)return null;
 const t=(-b-Math.sqrt(disc))/a;return t>=-1e-9&&t<=limit?Math.max(0,t):null;
}
function pairTOI(a,b,limit){
 const p=sub(b.p,a.p),v=sub(b.v,a.v),aa=dot(v,v),bb=dot(p,v),cc=dot(p,p)-(radius(a)+radius(b))**2;
 if(aa<1e-14||bb>=-1e-10)return null;
 if(cc<1e-10)return 0;
 const d=bb*bb-aa*cc;if(d<0)return null;
 const t=(-bb-Math.sqrt(d))/aa;return t>=-1e-9&&t<=limit?Math.max(0,t):null;
}
function railRadius(b){const dz=b.p[2]-1.28*R;
 const r=radius(b);return Math.abs(dz)<r?Math.sqrt(r*r-dz*dz):0;}
function closest(b,s){
 const dx=s.b[0]-s.a[0],dy=s.b[1]-s.a[1],l2=dx*dx+dy*dy;
 const f=clamp(((b.p[0]-s.a[0])*dx+(b.p[1]-s.a[1])*dy)/l2,0,1);
 return [s.a[0]+f*dx,s.a[1]+f*dy];
}
function railTOI(b,s,limit){
 const r=railRadius(b);if(!r)return null;
 const px=b.p[0],py=b.p[1],vx=b.v[0],vy=b.v[1];
 const dx=s.b[0]-s.a[0],dy=s.b[1]-s.a[1],len=Math.hypot(dx,dy),tx=dx/len,ty=dy/len;
 const along=(px-s.a[0])*tx+(py-s.a[1])*ty;
 const dist=-(px-s.a[0])*ty+(py-s.a[1])*tx,vn=-vx*ty+vy*tx,va=vx*tx+vy*ty;
 let best=null;
 if(Math.abs(vn)>1e-10){
  for(const side of [-1,1]){
   if(vn*side>=0)continue;
   const t=(side*r-dist)/vn;
   const q=along+va*Math.max(0,t);
   if(t>=-1e-8&&t<=limit&&q>=0&&q<=len)best=Math.max(0,t);
   if(Math.abs(dist)<r+1e-7&&dist*side>=0&&along>=0&&along<=len)best=0;
  }
 }
 for(const p of [s.a,s.b]){const t=circleTOI(px-p[0],py-p[1],vx,vy,r,limit);if(t!==null&&(best===null||t<best))best=t;}
 return best;
}
function cushion(b,s,cfg){
 const br=radius(b),M=mass(b);
 const q=closest(b,s),d=[b.p[0]-q[0],b.p[1]-q[1],b.p[2]-1.28*R];
 const n=unit(d),vn=dot(b.v,n);if(vn>=-1e-7)return 0;
 const r=mul(n,-br),u=add(b.v,cross(b.w,r));
 const ut=sub(u,mul(n,dot(u,n))),speed=norm(ut);
 const e=clamp(cfg.railRestitution-.014*Math.max(0,Math.abs(vn)-2),.55,.9);
 const jn=-(1+e)*M*vn;
 const jt=speed?mul(ut,-Math.min(M*speed/3.5,cfg.railFriction*jn)/speed):[0,0,0];
 apply(b,add(mul(n,jn),jt),r);
 // Correct penetration horizontally; do not lift a resting ball onto a nose.
 const hr=railRadius(b),dd=Math.hypot(d[0],d[1]);
 if(dd<hr+1e-8&&dd>1e-10){b.p[0]+=d[0]/dd*(hr-dd+2e-8);b.p[1]+=d[1]/dd*(hr-dd+2e-8);}
 return jn;
}
// A slow ball cluster caught between jaws can undergo inelastic collapse:
// infinitely many idealized bounces in finite time. Resolve its resting normal
// constraints together instead of exhausting the swept-event loop. This passive
// projection is limited to already touching contacts below 0.12 m/s normal speed.
function settleSlowContacts(balls,rails){
 const cons=[];
 for(let i=0;i<balls.length;i++){
  const a=balls[i];
  for(let j=i+1;j<balls.length;j++){const b=balls[j],d=sub(b.p,a.p),len=norm(d);if(len>radius(a)+radius(b)+2e-6||len<1e-10)continue;const n=mul(d,1/len);if(Math.abs(dot(sub(b.v,a.v),n))<.12)cons.push({type:'ball',a,b,n,J:0});}
  for(const rail of rails){const q=closest(a,rail),d=[a.p[0]-q[0],a.p[1]-q[1],a.p[2]-1.28*R],len=norm(d);if(len>radius(a)+2e-6||len<1e-10)continue;const n=mul(d,1/len);if(Math.abs(dot(a.v,n))<.12)cons.push({type:'rail',a,rail,n,J:0});}
  if(a.p[2]<=radius(a)+2e-6&&Math.abs(a.v[2])<.12)cons.push({type:'floor',a,n:[0,0,1],J:0});
 }
 for(let pass=0;pass<96;pass++){let worst=0;
  for(const c of cons){const vn=c.type==='ball'?dot(sub(c.b.v,c.a.v),c.n):dot(c.a.v,c.n);worst=Math.max(worst,-vn);if(vn>=-1e-10)continue;
   const inv=1/mass(c.a)+(c.b?1/mass(c.b):0),J=-vn/inv;c.J+=J;
   if(c.b){for(let k=0;k<3;k++){c.a.v[k]-=J*c.n[k]/mass(c.a);c.b.v[k]+=J*c.n[k]/mass(c.b);}}
   else for(let k=0;k<3;k++)c.a.v[k]+=J*c.n[k]/mass(c.a);
  }
  if(worst<1e-9)break;
 }
 return cons.filter(c=>c.J>1e-10);
}
function strikeInfo(angle,side,up,elev,power,cfg=defaults){
 const R=cfg.cueRadius??0.028575,M=cfg.cueBallMass??.17,I=.4*M*R*R;
 let rho=Math.hypot(side,up);if(rho>.97){side*=.97/rho;up*=.97/rho;rho=.97;}
 const th=clamp(elev,0,80)*Math.PI/180,co=Math.cos(angle),si=Math.sin(angle);
 const d=[co*Math.cos(th),si*Math.cos(th),-Math.sin(th)];
 const right=[si,-co,0],vertical=[co*Math.sin(th),si*Math.sin(th),Math.cos(th)];
 const r=mul(add(add(mul(right,side),mul(vertical,up)),mul(d,-Math.sqrt(1-rho*rho))),R);
 const shaftSpeed=.10+5.4*Math.pow(clamp(power,1,100)/100,1.45);
 const miscue=!cfg.noMiscue&&rho/Math.sqrt(1-rho*rho)>cfg.tipFriction;
 let direction=d;
 if(miscue){
  // Slip the tip at the friction cone, instead of granting impossible edge spin.
  const n=mul(r,-1/R),dn=dot(d,n),t=sub(d,mul(n,dn));
  direction=unit(add(n,mul(unit(t),cfg.tipFriction)));
 }
 // Empirical low-deflection shaft angle; separate from rigid-body impulse model.
 const squirt=-cfg.deflection*Math.PI/180*side;
 if(Math.abs(squirt)>0){const cs=Math.cos(squirt),ss=Math.sin(squirt);
  direction=[direction[0]*cs-direction[1]*ss,direction[0]*ss+direction[1]*cs,direction[2]];}
 const rx=cross(r,direction),eff=1/M+1/cfg.cueMass+dot(rx,rx)/I;
 const J=(1+cfg.cueRestitution)*shaftSpeed/eff*(miscue?.68:1);
 return {r,d:direction,J,miscue,rho,side,up,shaftSpeed,contactHeight:R+r[2],speed:J/M};
}
class World{
 constructor(balls=[],cfg={}){this.balls=clone(balls);this.cfg={...defaults,...cfg};this.table=table(cfg.tableLength??L,cfg.tableWidth??W);this.events=[];this.time=0;this.diagnostics={eventLimit:0};}
 snapshot(){return {balls:clone(this.balls),cfg:{...this.cfg},time:this.time};}
 static from(s){const w=new World(s.balls,s.cfg);w.time=s.time||0;return w;}
 get(id){return this.balls.find(b=>b.id===id);}
 atRest(){return !this.balls.some(moving);}
 strike(angle,side,up,elev,power,options={}){
  const b=this.get(0);if(!b||!b.active||!this.atRest())return {ok:false,reason:'Wait for the balls to stop.'};
  const info=strikeInfo(angle,side,up,elev,power,{...this.cfg,cueRadius:radius(b),cueBallMass:mass(b),...options});
  if(info.contactHeight<.006)return {ok:false,reason:'The tip would hit the cloth. Raise the contact point.'};
  this.events=[];this.time=0;this.diagnostics={eventLimit:0};
  apply(b,mul(info.d,info.J),info.r);
  if(b.v[2]<0)floorImpact(b,this.cfg);
  this.emit('strike',{miscue:info.miscue});return {ok:true,...info};
 }
 emit(type,data){this.events.push({type,t:this.time,...data});}
 advance(t){
  for(const b of this.balls)if(b.active){for(let k=0;k<3;k++)b.p[k]+=b.v[k]*t;orientation(b,t);}
  this.time+=t;
 }
 capture(){
  const {L,W,pockets}=this.table;
  for(const b of this.balls)if(b.active){
   let p=-1;
   if(b.p[2]<radius(b)+.012)for(let i=0;i<pockets.length;i++){
    const k=pockets[i];if(Math.hypot(b.p[0]-k.x,b.p[1]-k.y)<.052+R-radius(b)){p=i;break;}}
   const off=b.p[0]<-.13||b.p[0]>L+.13||b.p[1]<-.13||b.p[1]>W+.13;
   if(p>=0||off){b.active=false;b.pocket=p>=0?p:-1;this.emit(p>=0?'pocket':'off',{id:b.id,pocket:b.pocket,p:[...b.p]});stop(b);}
  }
 }
 step(dt=DT){
  if(!(dt>0&&dt<=.05))throw new RangeError('Physics step must be between 0 and 0.05 seconds.');
  // Splitting at <= DT keeps friction/impact coupling stable across display rates.
  const steps=Math.ceil(dt/DT),h=dt/steps;
  for(let k=0;k<steps;k++)this.tick(h);
 }
 tick(h){
  const rails=this.table.rails;
  for(const b of this.balls)if(b.active){
   const R=radius(b);
   if(b.p[2]<=R+1e-6&&b.v[2]<0)floorImpact(b,this.cfg);
   cloth(b,h/2,this.cfg);
   if(b.p[2]>R+1e-6||b.v[2]>0)b.v[2]-=G*h/2;
  }
  let rem=h,iterations=0,resting=false;
  while(rem>1e-10&&iterations++<64){
   let t=rem,hit=null;const bs=this.balls.filter(b=>b.active);
   if(iterations>=40&&iterations%4===0){const contacts=settleSlowContacts(bs,rails);if(contacts.length){resting=true;this.diagnostics.contactSettles=(this.diagnostics.contactSettles||0)+1;for(const c of contacts){if(c.type==='ball')this.emit('ball',{a:c.a.id,b:c.b.id,impulse:c.J,pa:[...c.a.p],pb:[...c.b.p]});if(c.type==='rail')this.emit('rail',{id:c.a.id,rail:c.rail.id,kind:c.rail.kind,impulse:c.J,p:[...c.a.p]});}}}

   for(let i=0;i<bs.length;i++){
    const b=bs[i],R=radius(b);
    if(b.v[2]<-1e-8){const f=(R-b.p[2])/b.v[2];if(f>=-1e-8&&f<=t){t=Math.max(0,f);hit={type:'floor',b};}}
    for(let j=i+1;j<bs.length;j++){
     if(resting){const d=sub(bs[j].p,b.p),len=norm(d);if(len<radius(b)+radius(bs[j])+2e-6&&Math.abs(dot(sub(bs[j].v,b.v),unit(d)))<1e-6)continue;}
     const z=pairTOI(b,bs[j],t);if(z!==null&&z<=t){t=z;hit={type:'ball',a:b,b:bs[j]};}}
    if(norm(b.v)>.0001)for(const s of rails){if(resting){const q=closest(b,s),d=[b.p[0]-q[0],b.p[1]-q[1],b.p[2]-1.28*R];if(norm(d)<radius(b)+2e-6&&Math.abs(dot(b.v,unit(d)))<1e-6)continue;}const z=railTOI(b,s,t);if(z!==null&&z<=t){t=z;hit={type:'rail',b,s};}}
   }
   if(t>0){this.advance(t);rem-=t;this.capture();}
   if(!hit)break;
   if(hit.type==='floor'){if(hit.b.active)floorImpact(hit.b,this.cfg);}
   else if(hit.type==='ball'){
    if(hit.a.active&&hit.b.active){for(const c of simultaneousContacts(this.balls.filter(b=>b.active),this.cfg))this.emit('ball',{a:c.a.id,b:c.b.id,impulse:c.J,pa:[...c.a.p],pb:[...c.b.p]});}
   }else if(hit.b.active){const j=cushion(hit.b,hit.s,this.cfg);if(j)this.emit('rail',{id:hit.b.id,rail:hit.s.id,kind:hit.s.kind,impulse:j,p:[...hit.b.p]});}
   if(t<1e-10){const eps=Math.min(rem,1e-8);this.advance(eps);rem-=eps;}
  }
  if(rem>1e-10){this.diagnostics.eventLimit++;this.advance(rem);}
  for(const b of this.balls)if(b.active){
   const R=radius(b);
   if(b.p[2]>R+1e-6||b.v[2]>0)b.v[2]-=G*h/2;
   if(b.p[2]<R||b.p[2]<=R+1e-6&&b.v[2]<0)floorImpact(b,this.cfg);
   cloth(b,h/2,this.cfg);
   if(norm(b.v)<.0001&&Math.hypot(b.w[0],b.w[1])*R<.0001){b.v=[0,0,0];b.w[0]=b.w[1]=0;}
  }
  this.capture();
 }
 simulate(maxSeconds=45){let n=0;while(!this.atRest()&&n<maxSeconds/DT){this.step();n++;}return {steps:n,settled:this.atRest(),seconds:n*DT,events:this.events};}
}
function rackPositions(count=15,t={L,W}){
 const {L,W}=t;
 const out=[];const sep=2*R+1e-8;
 if(count===9){for(let row=0;row<5;row++){const n=3-Math.abs(2-row);for(let col=0;col<n;col++)out.push([L*.75+row*sep*Math.sqrt(3)/2,W/2+(col-(n-1)/2)*sep]);}}
 else {let i=0;for(let row=0;i<count;row++)for(let col=0;col<=row&&i<count;col++,i++)out.push([L*.75+row*sep*Math.sqrt(3)/2,W/2+(col-row/2)*sep]);}
 return out;
}
function rack(mode='8ball',t={L,W}){
 const {L,W}=t;
 if(mode==='apa8')mode='8ball';if(mode==='apa9')mode='9ball';
 const count=mode==='9ball'||mode==='banks'?9:mode==='10ball'?10:mode==='3ball'?3:15;
 let ids=Array.from({length:count},(_,i)=>i+1);
 // Stable well-spread rack; a legal group in each back corner in 8-ball.
 if(mode==='8ball')ids=[1,10,2,11,8,3,4,12,5,13,6,14,7,15,9];
 if(mode==='9ball')ids=[1,2,3,4,9,5,6,7,8];
 if(mode==='10ball')ids=[1,2,3,4,10,5,6,7,8,9];
 return [ball(0,L*.25,W/2),...rackPositions(count,t).map((p,i)=>ball(ids[i],...p))];
}
function validPosition(world,id,x,y,kitchen=false){
 const {L,W}=world.table??{L:2.54,W:1.27},r=world.get(id)?radius(world.get(id)):R;
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<r||x>L-r||y<r||y>W-r||kitchen&&x>L/4)return false;
 return !world.balls.some(b=>b.active&&b.id!==id&&Math.hypot(b.p[0]-x,b.p[1]-y)<r+radius(b)+.00005);
}
function place(world,id,x,y,kitchen=false){
 if(!validPosition(world,id,x,y,kitchen))return false;
 let b=world.get(id);if(!b){b=ball(id,x,y);world.balls.push(b);}b.p=[x,y,radius(b)];b.active=true;b.pocket=null;stop(b);return true;
}
function spot(world,id,x=(world.table?.L??L)*.75,y=(world.table?.W??W)/2){
 const {L,W}=world.table??{L:2.54,W:1.27},r=world.get(id)?radius(world.get(id)):R;
 for(let pass=0;pass<3;pass++)for(let k=0;k<1200;k++){
  const xx=pass===0?x+k*.003:pass===1?x-k*.003:r+(k%70)*.035;
  const yy=pass<2?y:r+Math.floor(k/70)*.07;
  if(place(world,id,xx,yy))return true;
 }return false;
}
function equip(world,diameter=2*R,m=.17){
 if(!Number.isFinite(diameter)||diameter<.05||diameter>.064||!Number.isFinite(m)||m<.12||m>.23)throw new RangeError('Invalid cue-ball size or mass.');
 const b=world.get(0);if(!b)return false;
 b.radius=diameter/2;b.mass=m;b.p[2]=b.radius;
 if(!validPosition(world,0,b.p[0],b.p[1])){b.active=false;return spot(world,0,world.table.L/4,world.table.W/2);}return true;
}
function frozen(world,tol=.00015){
 const out=[];
 for(const b of world.balls)if(b.active){
  for(const rail of world.table.rails)if(rail.kind==='cushion'){
   const q=closest(b,rail),d=Math.hypot(q[0]-b.p[0],q[1]-b.p[1]);
   if(Math.abs(d-railRadius(b))<=tol)out.push({id:b.id,rail:rail.id});
  }
 }
 return out;
}
const api={R,M,I,L,W,G,DT,table,radius,mass,inertia,apply,stop,equip,frozen,defaults,pockets,rails,ball,rack,rackPositions,World,clamp,clone,add,sub,mul,dot,cross,norm,unit,energy,moving,slip,stateName,cloth,contact,simultaneousContacts,settleSlowContacts,floorImpact,strikeInfo,place,spot,validPosition};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CuePhysics=api;
})(typeof globalThis!=='undefined'?globalThis:this);
