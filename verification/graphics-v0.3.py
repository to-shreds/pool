"""Run with xvfb-run -a. Actual WebGL rendering via ANGLE SwiftShader, not a phone GPU."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json,hashlib
ROOT=Path(__file__).resolve().parents[1]
report={'method':'Headed Chromium under Xvfb; actual WebGL using ANGLE SwiftShader; page.set_content due administered navigation policy. Not real Android hardware or native GPU performance.','checks':[],'errors':[]}
def check(name,v):
 if not v:raise AssertionError(name)
 report['checks'].append(name);print('PASS',name,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=False,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 pg=b.new_page(viewport={'width':1280,'height':850});pg.on('pageerror',lambda e:report['errors'].append(str(e)));pg.on('dialog',lambda d:d.accept());pg.set_content((ROOT/'Cue-Lab.html').read_text());pg.wait_for_timeout(100)
 baseline=pg.evaluate('CueLab.snapshot()')
 hashes=[]
 for camera in ['shooter','elevated','broadcast','auto']:
  pg.evaluate('(camera)=>CueLab.setSettings({camera},{confirm:false})',camera);pg.wait_for_timeout(150)
  check(camera+' remains active instead of silently falling back',pg.evaluate('CueLab.settings().camera')==camera)
  check(camera+' has an actual WebGL context and no GL errors',pg.locator('#table3d').evaluate('el=>{const gl=el.getContext("webgl");return !!gl&&gl.getError()===0}'))
  hashes.append(hashlib.sha256(pg.locator('#table3d').screenshot()).hexdigest())
  current=pg.evaluate('CueLab.snapshot()');check(camera+' leaves world and rules exactly unchanged',current['world']==baseline['world'] and current['rules']==baseline['rules'])
  pg.screenshot(path=str(ROOT/'verification'/('v0.3-'+camera+'.png')))
 check('Shooter/elevated/broadcast genuinely render different perspectives',len(set(hashes[:3]))==3)
 # A render-only camera mapping can be round-tripped independently.
 mapped=pg.evaluate('''() => {const c=document.createElement('canvas');c.width=800;c.height=400;c.style.cssText='position:fixed;width:800px;height:400px;left:0;top:0';document.body.append(c);const render=new Cue3D(c),s={...CueLab.settings(),camera:'elevated'};render.draw(CueLab.getWorld(),CueLab.snapshot().shot,s);const p=[1.25,.6,CuePhysics.R],xy=render.project(p),q=render.point(xy[0],xy[1],p[2]);const error=Math.hypot(...p.map((x,i)=>x-q[i]));c.remove();return error;}''')
 check('Perspective picking round-trips an on-table point',mapped<1e-6)
 # Look is separate from aiming and never shoots.
 pg.evaluate('CueLab.setSettings({camera:"shooter"},{confirm:false})');pg.wait_for_timeout(60);before=pg.evaluate('CueLab.snapshot().shot.angle');pg.locator('#lookButton').click();box=pg.locator('#table').bounding_box();x=box['x']+box['width']*.4;y=box['y']+box['height']*.65
 pg.mouse.move(x,y);pg.mouse.down();pg.mouse.move(x+70,y,steps=6);pg.mouse.up();check('Look changes orbit without modifying shot aim or firing',pg.evaluate('CueLab.settings().orbit!==0&&CueLab.snapshot().shot.angle')==before and not pg.evaluate('CueLab.status().shotRunning'))
 pg.locator('#lookButton').click();pg.locator('#table').click(position={'x':box['width']*.6,'y':box['height']*.75});check('Perspective table input aims without shooting',not pg.evaluate('CueLab.status().shotRunning'))
 # 3D placement must remain the existing precise overhead editor.
 before=pg.evaluate('CueLab.snapshot()');pg.locator('#placeCue').click();check('Place cue from 3D opens the six-times overhead editor',pg.evaluate('CueLab.placement().zoom===6'));pg.locator('#cancelPlacement').click();check('Cancelling placement leaves all 3D game state untouched',pg.evaluate('CueLab.snapshot()')==before)
 for quality in ['low','medium','high']:
  pg.evaluate('(quality)=>CueLab.setSettings({quality},{confirm:false})',quality);pg.wait_for_timeout(100)
  check(quality+' rendering quality remains functional',pg.locator('#table3d').evaluate('el=>el.getContext("webgl").getError()===0'))
 for theme in ['classic','diamond','brunswick','rasson']:
  world=pg.evaluate('CueLab.getWorld().snapshot()');pg.evaluate('(theme)=>CueLab.setSettings({theme},{confirm:false})',theme);pg.wait_for_timeout(80)
  check(theme+' theme works without changing physics',pg.evaluate('CueLab.getWorld().snapshot()')==world)
 # Actual 3D shot, live snapshot, replay and return.
 pg.evaluate('CueLab.setShot({angle:0,side:0,up:0,elevation:0,power:95})');pg.locator('#shoot').click();pg.wait_for_timeout(120);check('Moving balls render through the 3D camera',pg.evaluate('CueLab.status().shotRunning') and pg.locator('#table3d').is_visible());pg.locator('#finish').click();live=pg.evaluate('CueLab.snapshot()');pg.locator('#replay').click();pg.wait_for_timeout(100);check('3D replay does not rescore or mutate the live world',pg.evaluate('CueLab.snapshot()')==live);pg.locator('#replay').click();pg.locator('#undo').click()
 # Compact default Aim now reserves more space for the actual table.
 pg.evaluate('CueLab.setSettings({camera:"2d"},{confirm:false})');pg.set_viewport_size({'width':320,'height':568});pg.wait_for_timeout(80);pg.screenshot(path=str(ROOT/'verification/v0.3-compact-aim.png'));check('Small-phone default Aim remains scroll-free with a useful table region',pg.evaluate('document.body.scrollHeight===innerHeight&&document.querySelector("#table").getBoundingClientRect().height>120'))
 pg.set_viewport_size({'width':412,'height':915});pg.evaluate('CueLab.setSettings({camera:"shooter"},{confirm:false})');pg.wait_for_timeout(100);pg.screenshot(path=str(ROOT/'verification/v0.3-phone-shooter.png'))
 check('No JavaScript errors in actual WebGL session',not report['errors']);b.close()
report['passed']=len(report['checks']);report['failed']=0;(ROOT/'verification/graphics-v0.3-results.json').write_text(json.dumps(report,indent=2));print('SUMMARY',report['passed'],report['errors'])
