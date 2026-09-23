from pathlib import Path
from playwright.sync_api import sync_playwright
import os, json
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'Cue-Lab.html').read_text()
checks=[]
def check(name,v):
    if not v: raise AssertionError(name)
    checks.append(name); print('PASS',name,flush=True)

def click_world(pg,x,y):
    p=pg.evaluate('(p)=>CueLab.screenPoint(p.x,p.y)',{'x':x,'y':y})
    pg.locator('#table').click(position={'x':p[0],'y':p[1]})
    pg.wait_for_timeout(40)

with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':412,'height':915},has_touch=True);pg.set_default_timeout(5000);pg.on('dialog',lambda d:d.accept());pg.set_content(HTML);pg.wait_for_timeout(80)
    check('Version is 0.3.1',pg.evaluate('CueLab.version==="0.3.1"'))
    check('Legacy call dropdown area is never visible',not pg.locator('#callControls').is_visible())
    pg.select_option('#mode','8ball');pg.evaluate('let s=CueLab.snapshot();s.rules.break=false;s.rules.ballInHand=null;CueLab.restore(s)');pg.wait_for_timeout(50)
    check('Club call HUD appears before aiming',pg.locator('#callHud').is_visible() and 'Tap an object ball' in pg.locator('#callHudText').inner_text())
    check('Shoot waits for the call',pg.locator('#shoot').is_disabled())
    b1=pg.evaluate('CueLab.getWorld().get(1).p');click_world(pg,b1[0],b1[1])
    st=pg.evaluate('CueLab.callState()');check('First table tap selects the object ball',st['ball']==1 and st['pocket'] is None)
    check('HUD now requests the pocket','Tap the pocket' in pg.locator('#callHudText').inner_text())
    pocket=pg.evaluate('CueLab.getWorld().table.pockets[2]');click_world(pg,pocket['x'],pocket['y'])
    st=pg.evaluate('CueLab.callState()');check('Second table tap selects the pocket',st['ball']==1 and st['pocket']==2)
    check('Completed call enables the shot',pg.locator('#shoot').is_enabled())
    b2=pg.evaluate('CueLab.getWorld().get(2).p');click_world(pg,b2[0],b2[1])
    st=pg.evaluate('CueLab.callState()');check('Tapping a different ball changes the call and asks for a new pocket',st['ball']==2 and st['pocket'] is None)
    pg.select_option('#mode','apa8');pg.evaluate('let s=CueLab.snapshot();s.rules.break=false;s.rules.ballInHand=null;s.rules.groups=["solids","stripes"];CueLab.restore(s)');pg.wait_for_timeout(50)
    check('APA8 routine shots do not ask for a call',not pg.locator('#callHud').is_visible() and pg.evaluate('CueLab.callState().mode===null'))
    check('APA8 routine shot remains shootable without dropdown declaration',pg.locator('#shoot').is_enabled())
    pg.evaluate('let s=CueLab.snapshot();s.rules.groups=["solids","stripes"];s.rules.break=false;s.rules.ballInHand=null;s.world.balls.forEach(b=>{if(b.id>=1&&b.id<=7)b.active=false});CueLab.restore(s)');pg.wait_for_timeout(50)
    check('APA8 on the 8 asks only for a pocket mark',pg.locator('#callHud').is_visible() and pg.locator('#callHudTitle').inner_text()=='Mark the 8')
    check('APA8 on the 8 blocks Shoot until pocket is marked',pg.locator('#shoot').is_disabled())
    p3=pg.evaluate('CueLab.getWorld().table.pockets[3]');click_world(pg,p3['x'],p3['y'])
    st=pg.evaluate('CueLab.callState()');check('APA8 pocket tap marks only the pocket',st['ball'] is None and st['pocket']==3)
    check('APA8 marked pocket enables Shoot',pg.locator('#shoot').is_enabled())
    p4=pg.evaluate('CueLab.getWorld().table.pockets[4]');click_world(pg,p4['x'],p4['y'])
    check('Retapping another pocket changes the APA 8 mark',pg.evaluate('CueLab.callState().pocket===4'))
    dims=pg.evaluate('''()=>{const main=document.querySelector('main').getBoundingClientRect(),play=document.querySelector('.play-area').getBoundingClientRect(),controls=document.querySelector('.controls').getBoundingClientRect(),table=document.querySelector('#tableWrap').getBoundingClientRect();return {mainH:main.height,playH:play.height,controlsH:controls.height,tableH:table.height,bodyH:document.body.scrollHeight,innerH:innerHeight,bodyW:document.body.scrollWidth,innerW:innerWidth}}''')
    check('Portrait layout gives more height to play than controls',dims['playH']>dims['controlsH']*1.35)
    check('The table itself occupies more than half the usable app height',dims['tableH']>dims['mainH']*.5)
    check('No document scrolling introduced',dims['bodyH']==dims['innerH'] and dims['bodyW']==dims['innerW'])
    pg.screenshot(path=str(ROOT/'verification/v0.3.1-call-ui-phone.png'))
    pg.close();b.close()
print('SUMMARY',len(checks))
(ROOT/'verification/call-ui-v0.3.1-results.json').write_text(json.dumps({'passed':len(checks),'checks':checks},indent=2))
