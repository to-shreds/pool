/* Original dependency-free WebGL renderer. Reads the world, never writes it. */
(function(root){'use strict';
const P=root.CuePhysics,S=root.CueSettings;
const ident=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function multiply(a,b){const out=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];return out;}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov*Math.PI/360),nf=1/(near-far);return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0];}
function look(eye,target){const f=P.unit(P.sub(target,eye)),right=P.unit(P.cross(f,[0,0,1])),up=P.cross(right,f);return {f,right,up,m:[right[0],up[0],-f[0],0,right[1],up[1],-f[1],0,right[2],up[2],-f[2],0,-P.dot(right,eye),-P.dot(up,eye),P.dot(f,eye),1]};}
function model(p,scale,q=[1,0,0,0]){const [w,x,y,z]=q,[a,b,c]=scale;return [(1-2*y*y-2*z*z)*a,(2*x*y+2*w*z)*a,(2*x*z-2*w*y)*a,0,(2*x*y-2*w*z)*b,(1-2*x*x-2*z*z)*b,(2*y*z+2*w*x)*b,0,(2*x*z+2*w*y)*c,(2*y*z-2*w*x)*c,(1-2*x*x-2*y*y)*c,0,...p,1];}
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const ballColors=['#f1f1e0','#e8b52c','#2c68ba','#c83c34','#7442a0','#e27725','#278956','#92343d','#121a20','#e8b52c','#2c68ba','#c83c34','#7442a0','#e27725','#278956','#92343d'];
const VERT=`attribute vec3 aPos;attribute vec3 aNormal;uniform mat4 uPV;uniform mat4 uModel;varying vec3 vLocal;varying vec3 vWorld;varying vec3 vNormal;void main(){vec4 p=uModel*vec4(aPos,1.);vWorld=p.xyz;vLocal=aPos;vNormal=normalize(mat3(uModel)*aNormal);gl_Position=uPV*p;}`;
const FRAG=`precision mediump float;uniform vec3 uColor;uniform vec3 uEye;uniform float uKind;uniform float uId;uniform float uAlpha;uniform float uLight;uniform vec3 uTint;uniform sampler2D uLabels;uniform vec2 uPockets[6];varying vec3 vLocal;varying vec3 vWorld;varying vec3 vNormal;
void main(){vec3 base=uColor;float alpha=uAlpha;vec3 n=normalize(vNormal);float spec=0.;
 if(uKind==2.){for(int i=0;i<6;i++){if(distance(vWorld.xy,uPockets[i])<.066)discard;}float grain=fract(sin(dot(vWorld.xy*440.,vec2(12.9898,78.233)))*43758.5453);base*=.96+grain*.08;}
 if(uKind==1.){vec3 l=normalize(vLocal);if(uId>8.&&abs(l.z)>.5)base=vec3(.93,.94,.89);if(uId==0.){if(max(max(abs(l.x),abs(l.y)),abs(l.z))>.987)base=vec3(.7,.12,.11);}else if(abs(l.y)>.87&&length(l.xz)<.43){vec2 uv=l.xz/.86+.5;if(l.y<0.)uv.x=1.-uv.x;base=texture2D(uLabels,vec2((uId+uv.x)/16.,uv.y)).rgb;}spec=pow(max(0.,dot(reflect(-normalize(vec3(-.4,-.35,1.)),n),normalize(uEye-vWorld))),38.)*.65;}
 if(uKind==7.){float d=length(vLocal.xy);if(d>1.)discard;alpha*=pow(max(0.,1.-d*d),1.5);gl_FragColor=vec4(base,alpha);return;}
 float diffuse=max(0.,dot(n,normalize(vec3(-.4,-.35,1.))));float light=(.42+.58*diffuse)*uLight;if(uKind==8.)light=1.;gl_FragColor=vec4(base*light*uTint+spec,alpha);
}`;
function sphere(n){const v=[],nor=[];for(let a=0;a<n;a++)for(let b=0;b<n*2;b++){
 const point=(i,j)=>{const phi=i/n*Math.PI,theta=j/(2*n)*Math.PI*2;return [Math.sin(phi)*Math.cos(theta),Math.sin(phi)*Math.sin(theta),Math.cos(phi)];};
 const q=[point(a,b),point(a+1,b),point(a+1,b+1),point(a,b),point(a+1,b+1),point(a,b+1)];for(const p of q){v.push(...p);nor.push(...p);}}
 return {v,n:nor};}
function cube(){const v=[],n=[];const faces=[[[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]],[[-1,0,0],[[-1,1,-1],[-1,-1,-1],[-1,-1,1],[-1,1,1]]],[[0,1,0],[[1,1,-1],[-1,1,-1],[-1,1,1],[1,1,1]]],[[0,-1,0],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]],[[0,0,1],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[-1,1,-1],[1,1,-1],[1,-1,-1],[-1,-1,-1]]]];for(const [no,p] of faces)for(const i of [0,1,2,0,2,3]){v.push(...p[i]);n.push(...no);}return {v,n};}
function disk(n=40){const v=[],ns=[];for(let i=0;i<n;i++){v.push(0,0,0,Math.cos(i/n*Math.PI*2),Math.sin(i/n*Math.PI*2),0,Math.cos((i+1)/n*Math.PI*2),Math.sin((i+1)/n*Math.PI*2),0);ns.push(0,0,1,0,0,1,0,0,1);}return {v,n:ns};}
function cylinder(n=18){const v=[],ns=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,b=(i+1)/n*Math.PI*2;for(const [t,z] of [[a,0],[b,0],[b,1],[a,0],[b,1],[a,1]]){v.push(Math.cos(t),Math.sin(t),z);ns.push(Math.cos(t),Math.sin(t),0);}}return {v,n:ns};}
class Renderer{
 constructor(canvas){this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:false,antialias:true,preserveDrawingBuffer:true});if(!this.gl)throw new Error('WebGL is unavailable. The 2D game still works.');this.lost=false;canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;});
 const g=this.gl,compile=(type,src)=>{const sh=g.createShader(type);g.shaderSource(sh,src);g.compileShader(sh);if(!g.getShaderParameter(sh,g.COMPILE_STATUS))throw new Error(g.getShaderInfoLog(sh));return sh;};
 const program=g.createProgram();g.attachShader(program,compile(g.VERTEX_SHADER,VERT));g.attachShader(program,compile(g.FRAGMENT_SHADER,FRAG));g.linkProgram(program);if(!g.getProgramParameter(program,g.LINK_STATUS))throw new Error(g.getProgramInfoLog(program));g.useProgram(program);this.program=program;this.u={};for(const name of ['PV','Model','Color','Eye','Kind','Id','Alpha','Light','Tint','Labels','Pockets'])this.u[name]=g.getUniformLocation(program,'u'+name);this.ap=g.getAttribLocation(program,'aPos');this.an=g.getAttribLocation(program,'aNormal');this.meshes={cube:this.mesh(cube()),disk:this.mesh(disk()),cylinder:this.mesh(cylinder())};this.quality=null;
 const atlas=document.createElement('canvas');atlas.width=2048;atlas.height=128;const c=atlas.getContext('2d');c.fillStyle='#f0f1e4';c.fillRect(0,0,2048,128);c.fillStyle='#0c1418';c.font='700 64px system-ui';c.textAlign='center';c.textBaseline='middle';for(let i=1;i<16;i++)c.fillText(i,i*128+64,67);
 const tex=g.createTexture();g.bindTexture(g.TEXTURE_2D,tex);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,atlas);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);g.uniform1i(this.u.Labels,0);g.enable(g.DEPTH_TEST);g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);this.linePos=g.createBuffer();this.lineNorm=g.createBuffer();
 }
 mesh(data){const g=this.gl,v=g.createBuffer(),n=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,v);g.bufferData(g.ARRAY_BUFFER,new Float32Array(data.v),g.STATIC_DRAW);g.bindBuffer(g.ARRAY_BUFFER,n);g.bufferData(g.ARRAY_BUFFER,new Float32Array(data.n),g.STATIC_DRAW);return {v,n,count:data.v.length/3};}
 bind(m){const g=this.gl;g.bindBuffer(g.ARRAY_BUFFER,m.v);g.vertexAttribPointer(this.ap,3,g.FLOAT,false,0,0);g.enableVertexAttribArray(this.ap);g.bindBuffer(g.ARRAY_BUFFER,m.n);g.vertexAttribPointer(this.an,3,g.FLOAT,false,0,0);g.enableVertexAttribArray(this.an);}
 object(name,m,color,kind=0,id=0,alpha=1){const g=this.gl;this.bind(this.meshes[name]);g.uniformMatrix4fv(this.u.Model,false,m);g.uniform3fv(this.u.Color,typeof color==='string'?rgb(color):color);g.uniform1f(this.u.Kind,kind);g.uniform1f(this.u.Id,id);g.uniform1f(this.u.Alpha,alpha);g.drawArrays(g.TRIANGLES,0,this.meshes[name].count);}
 box(p,size,color,q){this.object('cube',model(p,size.map(x=>x/2),q),color);}
 segment(a,b,r,color){const z=P.unit(P.sub(b,a)),helper=Math.abs(z[2])>.9?[1,0,0]:[0,0,1],x=P.unit(P.cross(helper,z)),y=P.cross(z,x),len=P.norm(P.sub(b,a));const m=[...x.map(t=>t*r),0,...y.map(t=>t*r),0,...z.map(t=>t*len),0,...a,1];this.object('cylinder',m,color);}
 lines(points,color,close=false){if(points.length<2)return;const g=this.gl,vs=points.flat(),ns=points.flatMap(()=>[0,0,1]);g.bindBuffer(g.ARRAY_BUFFER,this.linePos);g.bufferData(g.ARRAY_BUFFER,new Float32Array(vs),g.DYNAMIC_DRAW);g.bindBuffer(g.ARRAY_BUFFER,this.lineNorm);g.bufferData(g.ARRAY_BUFFER,new Float32Array(ns),g.DYNAMIC_DRAW);this.bind({v:this.linePos,n:this.lineNorm});g.uniformMatrix4fv(this.u.Model,false,ident());g.uniform3fv(this.u.Color,rgb(color));g.uniform1f(this.u.Kind,8);g.uniform1f(this.u.Alpha,1);g.drawArrays(close?g.LINE_LOOP:g.LINE_STRIP,0,points.length);}
 camera(world,shot,s,state){const {L,W}=world.table,cb=state.anchor||world.get(0)?.p||[L/4,W/2,P.R];let mode=s.camera==='auto'?(state.moving?'broadcast':'shooter'):s.camera;if(state.moving&&s.autoFollow)mode='broadcast';if(state.replay&&s.replayCamera!=='same')mode=s.replayCamera;
 const angle=shot.angle+s.orbit*Math.PI/180;let eye,target;
 if(mode==='shooter'){eye=[cb[0]-Math.cos(angle)*s.cameraDistance,cb[1]-Math.sin(angle)*s.cameraDistance,s.cameraHeight];target=[cb[0]+Math.cos(shot.angle)*1.2,cb[1]+Math.sin(shot.angle)*1.2,.025];}
 else{const a=(mode==='broadcast'?-Math.PI*.33:-Math.PI/2)+s.orbit*Math.PI/180,dist=L*(this.canvas.width/this.canvas.height<1?1.5:1.1);eye=[L/2+Math.cos(a)*dist,W/2+Math.sin(a)*dist,L*(mode==='broadcast'?.70:1.05)];target=[L/2,W/2,0];}
 const basis=look(eye,target);this.eye=eye;this.basis=basis;this.fov=s.fov;this.pv=multiply(perspective(s.fov,this.canvas.width/this.canvas.height,.018,30),basis.m);this.gl.uniform3fv(this.u.Eye,eye);this.gl.uniformMatrix4fv(this.u.PV,false,this.pv);
 }
 project(p){if(!this.pv)return null;const m=this.pv,v=[...p,1],clip=[0,0,0,0];for(let r=0;r<4;r++)for(let c=0;c<4;c++)clip[r]+=m[c*4+r]*v[c];if(clip[3]<=0)return null;const x=clip[0]/clip[3],y=clip[1]/clip[3],z=clip[2]/clip[3];if(z < -1||z>1||Math.abs(x)>1.1||Math.abs(y)>1.1)return null;const rect=this.canvas.getBoundingClientRect();return [(x+1)*rect.width/2,(1-y)*rect.height/2];}
 point(clientX,clientY,z=P.R){if(!this.basis)return null;const r=this.canvas.getBoundingClientRect(),x=(2*(clientX-r.left)/r.width-1)*r.width/r.height*Math.tan(this.fov*Math.PI/360),y=(1-2*(clientY-r.top)/r.height)*Math.tan(this.fov*Math.PI/360);const d=P.add(this.basis.f,P.add(P.mul(this.basis.right,x),P.mul(this.basis.up,y))),t=(z-this.eye[2])/d[2];return t>0?P.add(this.eye,P.mul(d,t)):null;}
 draw(world,shot,s,state={}){
 if(this.lost)throw new Error('The 3D context was lost. Returned to 2D.');const g=this.gl,c=this.canvas,rect=c.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,s.quality==='high'?2:s.quality==='low'?.8:1.25);const w=Math.max(1,Math.round(rect.width*ratio)),h=Math.max(1,Math.round(rect.height*ratio));if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
 if(this.quality!==s.quality){if(this.meshes.ball){g.deleteBuffer(this.meshes.ball.v);g.deleteBuffer(this.meshes.ball.n);}this.meshes.ball=this.mesh(sphere(s.quality==='low'?10:s.quality==='high'?24:16));this.quality=s.quality;}
 g.viewport(0,0,w,h);g.clearColor(.041,.065,.072,1);g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);g.useProgram(this.program);this.camera(world,shot,s,state);g.uniform1f(this.u.Light,s.lighting==='bright'?1.15:s.lighting==='warm'?.88:1);g.uniform3fv(this.u.Tint,s.lighting==='warm'?[1,.94,.84]:[1,1,1]);
 g.uniform2fv(this.u.Pockets,world.table.pockets.flatMap(p=>[p.x,p.y]));const {L,W}=world.table,wood=s.theme==='diamond'?'#222c31':s.theme==='rasson'?'#454e56':s.theme==='brunswick'?'#68432c':'#765537',trim=s.theme==='brunswick'?'#b3a077':'#7b8588';
 this.box([L/2,W/2,-.76],[L*5,W*7,.05],'#172329');
 this.box([L/2,W/2,-.10],[L+.27,W+.27,.16],wood);
 for(const x of [.13,L-.13])for(const y of [.13,W-.13])this.box([x,y,-.44],[.12,.12,.6],wood);
 this.object('cube',model([L/2,W/2,-.018],[L/2,W/2,.018]),S.felt(s),2);
 for(const p of world.table.pockets){this.object('disk',model([p.x,p.y,.006],[.083,.083,1]),trim);this.object('disk',model([p.x,p.y,.007],[.069,.069,1]),'#020608');}
 for(const seg of world.table.rails){const [ax,ay]=seg.a,[bx,by]=seg.b;const len=Math.hypot(bx-ax,by-ay),ang=Math.atan2(by-ay,bx-ax),q=[Math.cos(ang/2),0,0,Math.sin(ang/2)];
  const outward=ay===by?[0,ay===0?-1:1]:ax===bx?[ax===0?-1:1,0]:[0,0];const dx=outward[0]*.022,dy=outward[1]*.022;
  this.box([(ax+bx)/2+dx,(ay+by)/2+dy,.026],[len,.046,.052],S.felt(s),q);
  if(seg.kind==='cushion')this.box([(ax+bx)/2+outward[0]*.083,(ay+by)/2+outward[1]*.083,.036],[len,.078,.073],wood,q);
 }
 for(let i=1;i<8;i++)if(i!==4)for(const y of [-.09,W+.09])this.object('disk',model([L*i/8,y,.076],[.006,.006,1]),'#d9d2b4');
 for(let i=1;i<4;i++)for(const x of [-.09,L+.09])this.object('disk',model([x,W*i/4,.076],[.006,.006,1]),'#d9d2b4');
 const balls=state.balls||world.balls;
 if(s.shadows)for(const b of balls)if(b.active){const r=P.radius(b),height=Math.max(0,b.p[2]-r);this.object('disk',model([b.p[0]+.006,b.p[1]+.008,.001],[r*(1.4+height),r*1.4,1]),'#010a0d',7,0,.65/(1+height*4));}
 if(s.trails&&state.trace?.length>1)this.lines(state.trace.map(p=>[p[0],p[1],Math.max(.003,p[2]-P.R+.002)]),'#c9deaa');
 if(state.guide&&s.guide){this.lines(state.guide.line.map(p=>[p[0],p[1],.031]),'#d4dfb8');if(s.ghost)this.lines(Array.from({length:40},(_,i)=>[state.guide.end[0]+Math.cos(i/40*6.283)*P.radius(world.get(0)),state.guide.end[1]+Math.sin(i/40*6.283)*P.radius(world.get(0)),.01]),'#d4dfb8',true);if(s.objectLine&&state.guide.object)this.lines(state.guide.object.map(p=>[p[0],p[1],.031]),'#d4dfb8');if(s.tangent&&state.guide.tangent)this.lines(state.guide.tangent.map(p=>[p[0],p[1],.031]),'#8aceeb');}
 for(const b of balls)if(b.active)this.object('ball',model(b.p,[P.radius(b),P.radius(b),P.radius(b)],b.q),ballColors[b.id],1,b.id);
 if(!state.moving&&!state.replay&&!state.noCue){const cue=world.get(0);if(cue?.active){const info=P.strikeInfo(shot.angle,shot.side,shot.up,shot.elevation,shot.power,{...world.cfg,cueRadius:P.radius(cue),cueBallMass:P.mass(cue)}),contact=P.add(cue.p,info.r),axis=[Math.cos(shot.angle)*Math.cos(shot.elevation*Math.PI/180),Math.sin(shot.angle)*Math.cos(shot.elevation*Math.PI/180),-Math.sin(shot.elevation*Math.PI/180)],tip=P.sub(contact,P.mul(axis,.025)),butt=P.sub(tip,P.mul(axis,1.35));this.segment(butt,P.sub(tip,P.mul(axis,.005)),.0065,s.cueLook==='carbon'?'#454e52':'#d2bd8c');this.segment(butt,P.add(butt,P.mul(axis,.42)),.010,s.cueLook==='burgundy'?'#762e3c':'#273035');this.segment(P.sub(tip,P.mul(axis,.009)),tip,.0065,'#7faea1');}}
 if(state.markedPocket!==null&&state.markedPocket!==undefined){const p=world.table.pockets[state.markedPocket];if(p)this.object('disk',model([p.x+(p.x<L/2?.10:-.10),p.y,.079],[.031,.031,1]),'#d6e89f');}
 }
}
root.Cue3D=Renderer;
})(globalThis);
