'use strict';
const P=require('../src/physics.js'),S=require('../src/settings.js'),E=require('../src/execution.js'),fs=require('node:fs');
const random=E.rng(843219),report={seed:843219,attempts:0,accepted:0,rejected:0,failures:[],cases:[]};
for(const size of ['7','8','9','custom'])for(const cueBall of ['standard','oversize','heavy','custom'])for(let j=0;j<16;j++){
 const s=S.normalize({tableSize:size,tableLength:2.1,cueBall,diameter:50+(j%3)*7,mass:120+(j%3)*55}),cfg={...P.defaults,...S.geometry(s),...S.cloth(s)},table=P.table(cfg.tableLength,cfg.tableWidth),w=new P.World(P.rack(j%2?'9ball':'8ball',table),cfg),eq=S.equipment(s);P.equip(w,eq.diameter,eq.mass);
 const power=25+75*random(),side=(random()-.5)*1.3,up=(random()-.5)*1.1,elevation=j%2?random()*78:0,angle=(random()-.5)*.3;
 const record={size,cueBall,diameter:eq.diameter,mass:eq.mass,power,side,up,elevation,angle};report.attempts++;
 const strike=w.strike(angle,side,up,elevation,power);if(!strike.ok){report.rejected++;record.rejected=strike.reason;report.cases.push(record);continue;}
 report.accepted++;const total=()=>w.balls.reduce((s,b)=>s+(b.active?P.energy(b):0),0);const initial=total();let max=initial,n=0;
 while(!w.atRest()&&w.time<90){w.step();if(++n%12===0)max=Math.max(max,total());}
 Object.assign(record,{settled:w.atRest(),seconds:w.time,iterations:w.diagnostics.eventLimit,contactSettles:w.diagnostics.contactSettles||0,initialEnergy:initial,maximumEnergy:max,finite:w.balls.every(b=>[...b.p,...b.v,...b.w,...b.q].every(Number.isFinite))});
 if(!record.settled||record.iterations||!record.finite||max>initial+.001)report.failures.push(record);
 report.cases.push(record);
}
fs.writeFileSync(require('node:path').join(__dirname,'stress-v0.3-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({attempts:report.attempts,accepted:report.accepted,rejected:report.rejected,failures:report.failures},null,2));if(report.failures.length)process.exitCode=1;
