/* Camera and candidate state only. Opening or cancelling never changes the world. */
(function(root){
'use strict';
const P=typeof module!=='undefined'&&module.exports?require('./physics.js'):root.CuePhysics;
class Placement {
 constructor(world,id=0,kitchen=false){
  this.world=world;this.id=id;this.kitchen=kitchen;
  const b=world.get(id);this.original=b?[...b.p]:[P.L/4,P.W/2,P.R];
  this.x=this.original[0];this.y=this.original[1];this.cx=this.x;this.cy=this.y;
  this.zoom=6;this.step=.001;this.width=1;this.height=1;this.layout(1,1);
 }
 layout(width,height){
  this.width=Math.max(1,width);this.height=Math.max(1,height);
  this.scale=Math.min(this.width/(P.L+.3),this.height/(P.W+.3))*this.zoom;
  this.view={w:this.width,h:this.height,scale:this.scale,ox:this.width/2-this.cx*this.scale,oy:this.height/2+this.cy*this.scale};
  return this.view;
 }
 point(px,py){return [(px-this.view.ox)/this.scale,(this.view.oy-py)/this.scale];}
 screen(x=this.x,y=this.y){return [this.view.ox+x*this.scale,this.view.oy-y*this.scale];}
 set(x,y,recenter=false){
  if(!Number.isFinite(x)||!Number.isFinite(y))return false;
  this.x=P.clamp(x,-P.R,P.L+P.R);this.y=P.clamp(y,-P.R,P.W+P.R);
  if(recenter)this.center();return this.valid();
 }
 nudge(dx,dy){return this.set(this.x+dx*this.step,this.y+dy*this.step);}
 center(){this.cx=this.x;this.cy=this.y;this.layout(this.width,this.height);}
 setZoom(z){this.zoom=P.clamp(z,2,10);this.center();}
 reset(){this.set(this.original[0],this.original[1],true);}
 valid(){return P.validPosition(this.world,this.id,this.x,this.y,this.kitchen);}
 reason(){
  if(this.x<P.R||this.x>P.L-P.R||this.y<P.R||this.y>P.W-P.R)return 'Keep the whole ball on the cloth.';
  if(this.kitchen&&this.x>P.L/4)return 'This shot requires placement inside the kitchen.';
  if(!this.valid())return 'Too close to another ball. Move until the ring is green.';
  return this.kitchen?'Valid position inside the kitchen.':'Valid position.';
 }
 commit(){return P.place(this.world,this.id,this.x,this.y,this.kitchen);}
}
if(typeof module!=='undefined'&&module.exports)module.exports=Placement;root.CuePlacement=Placement;
})(typeof globalThis!=='undefined'?globalThis:this);
