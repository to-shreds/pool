from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
ROOT=Path(__file__).resolve().parents[1]
report={'method':'Injected standalone HTML in Chromium; in-memory localStorage shim. Legacy fixtures were exported by the actual earlier standalone releases.','checks':[], 'errors':[]}
def check(n,v):
 if not v:raise AssertionError(n)
 report['checks'].append(n);print('PASS',n,flush=True)
def pane(pg,g,n):pg.locator('[data-tab="'+g+'"]').click();pg.locator('.subtabs [data-group="'+g+'"][data-page="'+n+'"]').click()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox']);pg=b.new_page(viewport={'width':412,'height':915});pg.on('pageerror',lambda e:report['errors'].append(str(e)));pg.on('dialog',lambda d:d.accept());pg.evaluate("""() => {const d={};Object.defineProperty(window,'localStorage',{value:{getItem:k=>d[k]??null,setItem:(k,v)=>d[k]=String(v),removeItem:k=>delete d[k]},configurable:true})}""");pg.set_content((ROOT/'Cue-Lab.html').read_text())
 for version in ['0.1','0.2']:
  state=json.loads((ROOT/f'tests/fixtures/save-v{version}.json').read_text());pg.evaluate('(s)=>CueLab.restore(s)',state);now=pg.evaluate('CueLab.snapshot()')
  check('Actual '+version+' exported save migrates with all ball positions preserved',[(x['id'],x['p']) for x in now['world']['balls']]==[(x['id'],x['p']) for x in state['world']['balls']])
  check('Actual '+version+' controls and rule state are preserved',now['shot']==state['shot'] and now['rules']==state['rules'])
  check('Migrated '+version+' snapshot validates and can play',pg.evaluate('CueLab.validateSave(CueLab.snapshot())&&CueLab.shoot()'))
  pg.locator('#finish').click();pg.locator('#undo').click();check('Migrated '+version+' state supports exact undo',pg.evaluate('CueLab.snapshot()')==now)
 # Named drill menu is actually persistent and always restores practice, not corrupt match state.
 pane(pg,'table','saves');pg.locator('#namedDrills').click();pg.locator('#drillName').fill('Draw repeatability');pg.locator('#saveNamed').click();check('Named drill save populates the list',pg.locator('#namedList option').count()==1);pg.locator('#drillsClose').click();pg.evaluate('CueLab.setShot({power:17})');pane(pg,'table','saves');pg.locator('#namedDrills').click();pg.locator('#loadNamed').click();check('Named drill reload restores practice and original power',pg.evaluate('CueLab.getRules().mode==="practice"&&CueLab.snapshot().shot.power!==17'))
 # Physical APA9 winning shot through normal Shoot/Finish path.
 pg.select_option('#mode','apa9');pg.evaluate('''() => {const s=CueLab.snapshot(),P=CuePhysics;s.world.balls=[P.ball(0,P.L-.42,P.W-.42),P.ball(9,P.L-.20,P.W-.20)];s.rules.break=false;s.rules.ballInHand=null;s.rules.scores=[28,0];s.shot={angle:Math.PI/4,side:0,up:0,elevation:0,power:25};CueLab.restore(s);}''');pane(pg,'shot','aim');pg.locator('#shoot').click();pg.locator('#finish').click();check('APA9 early 9 carries 30 points but does not end a 31-point match',pg.evaluate('CueLab.getRules().scores[0]===30&&CueLab.session().winner===null&&CueLab.session().rackEnded'))
 pg.locator('#nextRackButton').click();check('APA9 Next rack preserves match points and racks nine object balls',pg.evaluate('CueLab.getRules().scores[0]===30&&CueLab.getWorld().balls.length===10&&!CueLab.session().rackEnded'))
 pg.evaluate('''() => {const s=CueLab.snapshot(),P=CuePhysics;s.world.balls=[P.ball(0,P.L-.42,P.W-.42),P.ball(1,P.L-.20,P.W-.20),P.ball(9,.5,.2)];s.rules.break=false;s.rules.ballInHand=null;s.shot={angle:Math.PI/4,side:0,up:0,elevation:0,power:25};CueLab.restore(s);}''');pg.locator('#shoot').click();pg.locator('#finish').click();check('The next point ends APA9 at 31 even with the 9 still up',pg.evaluate('CueLab.getRules().scores[0]===31&&CueLab.session().winner===0&&CueLab.getWorld().get(9).active'))
 check('Finished APA9 snapshot validates',pg.evaluate('CueLab.validateSave(CueLab.snapshot())'))
 # All preset shots remain playable and undoable.
 for kind in ['draw','follow','stun','english','masse','jump']:
  pg.evaluate('(k)=>CueLab.setDrill(k)',kind);before=pg.evaluate('CueLab.snapshot()');pg.locator('#shoot').click();pg.locator('#finish').click();check(kind+' preset settles with valid save',pg.evaluate('CueLab.validateSave(CueLab.snapshot())&&CueLab.getWorld().atRest()'));pg.locator('#undo').click();check(kind+' preset undo is exact',before==pg.evaluate('CueLab.snapshot()'))
 # Original large physics settings safely reject under-cloth/house-restricted shots.
 pg.evaluate('CueLab.setDrill("jump");CueLab.setSettings({allowJump:false},{confirm:false})');check('House jump restriction blocks the modeled airborne shot',pg.locator('#shoot').is_disabled());pg.evaluate('CueLab.setSettings({allowJump:true},{confirm:false})');check('Enabling jump restores the existing shot',pg.locator('#shoot').is_enabled())
 pg.evaluate('CueLab.setDrill("masse");CueLab.setSettings({allowMasse:false},{confirm:false})');check('House massé restriction blocks elevated off-center shots',pg.locator('#shoot').is_disabled())
 check('No page-script errors in migration, multi-rack and drill workflows',not report['errors']);b.close()
report['passed']=len(report['checks']);report['failed']=0;(ROOT/'verification/extra-v0.3-results.json').write_text(json.dumps(report,indent=2));print('SUMMARY',report['passed'],report['errors'])
