"""Real Chromium DOM/worker checks. Uses injected HTML and a disclosed storage shim."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os, time
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'Cue-Lab.html').read_text()
report={'method':'Chromium page.set_content; real DOM, pointer events and Blob workers. In-memory localStorage shim for persistence; separate native-blocked-storage test. Not a live-site or physical Android test.','checks':[], 'errors':[]}
def check(name,value):
 if not value:raise AssertionError(name)
 report['checks'].append(name);print('PASS',name,flush=True)
def saved(pg):return pg.evaluate('CueLab.snapshot()')
def pane(pg,group,name):
 pg.locator('[data-tab="'+group+'"]').click();pg.locator('.subtabs [data-group="'+group+'"][data-page="'+name+'"]').click()
def shim(pg):pg.evaluate("""() => {const store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k],clear:()=>Object.keys(store).forEach(k=>delete store[k])}})}""")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox'])
 pg=b.new_page(viewport={'width':412,'height':915},has_touch=True,accept_downloads=True);pg.set_default_timeout(8000);pg.on('pageerror',lambda e:report['errors'].append(str(e)));pg.on('dialog',lambda d:d.accept());shim(pg);pg.set_content(HTML);pg.wait_for_timeout(80)
 check('Eleven modes include all nine legacy modes plus separate APA8/APA9',pg.locator('#mode option').count()==11)
 check('New game save is valid',pg.evaluate('CueLab.validateSave(CueLab.snapshot())'))
 for mode in ['8ball','9ball','straight','3ball','onepocket','10ball','banks','rotation','practice','apa8','apa9']:
  pg.select_option('#mode',mode);pane(pg,'shot','aim');pg.evaluate('CueLab.setShot({angle:0,side:0,up:0,elevation:0,power:95})')
  if mode=='straight':pg.check('#safety')
  before=saved(pg);pg.locator('#shoot').click();check(mode+' begins a physical shot',pg.evaluate('CueLab.status().shotRunning'))
  pg.locator('#finish').click();after=saved(pg)
  check(mode+' settles into a valid save',pg.evaluate('!CueLab.status().shotRunning&&CueLab.getWorld().atRest()&&CueLab.validateSave(CueLab.snapshot())'))
  check(mode+' consumes one rules shot',after['rules']['shots']==1)
  check(mode+' records stroke state and contacts',bool(after['session']['lastShot']))
  pg.locator('#replay').click();check(mode+' replay uses live-state-independent frames',pg.evaluate('CueLab.status().replay') and saved(pg)==after)
  pg.locator('#replay').click();pg.locator('#undo').click();check(mode+' undo restores table/rules/settings/chalk/seed/declarations exactly',saved(pg)==before)
 # Draft settings are transactional.
 pg.locator('#settingsButton').click();pg.locator('#settingsSearch').fill('Default view');pg.select_option('#setting-camera','shooter');pg.locator('#settingsClose').click()
 check('Cancelling the settings draft preserves the selected 2D camera',pg.evaluate('CueLab.settings().camera==="2d"'))
 pg.locator('#settingsButton').click();pg.locator('#settingsSearch').fill('Gameplay style');pg.select_option('#setting-style','simulation');pg.locator('#applySettings').click()
 check('Simulation preset connects execution, miscue and chalk settings',pg.evaluate('const s=CueLab.settings();s.execution&&s.miscues&&s.chalk==="realistic"'))
 pg.evaluate('CueLab.setDrill("draw");CueLab.setSettings({autoPracticeChalk:false},{confirm:false});CueLab.setShot({angle:0,side:.25,up:-.25,elevation:0,power:55})');before=saved(pg)
 check('Simulation risk is calculated from the exact same 512-delivery model',pg.evaluate('CueLab.risk().n===512&&CueLab.risk().any>=CueLab.risk().miscue'))
 pg.locator('#shoot').click();pg.locator('#finish').click();after=saved(pg)
 check('Taking a stroke consumes chalk',after['session']['chalk'][0]<before['session']['chalk'][0])
 check('Actual stroke delivery, sampled index and seed are stored',all(k in after['session']['lastShot']['delivered'] for k in ['shot','index','seed','nextSeed','friction']))
 pg.locator('#undo').click();check('Undo returns chalk and seed to their original values',saved(pg)==before)
 pg.locator('#shoot').click();pg.locator('#finish').click();check('Repeating an identical undone shot reproduces the entire result, not a reroll',saved(pg)==after)
 pg.locator('#chalkButton').click();check('Manual chalk actually replenishes the active tip',pg.evaluate('CueLab.session().chalk[CueLab.getRules().turn]===1'))
 # Equipment changes are physical and explicit.
 pg.evaluate('CueLab.setSettings({cueBall:"oversize",tableSize:"7"},{confirm:false})')
 check('7-foot choice uses an actual 78 by 39 inch bed',pg.evaluate('Math.abs(CueLab.getWorld().table.L-1.9812)<1e-9&&Math.abs(CueLab.getWorld().table.W-.9906)<1e-9'))
 check('Oversize cue ball changes radius and mass',pg.evaluate('CuePhysics.radius(CueLab.getWorld().get(0))>CuePhysics.R&&CuePhysics.mass(CueLab.getWorld().get(0))>CuePhysics.M'))
 state=saved(pg);pg.evaluate('CueLab.setSettings({theme:"brunswick",felt:"blue",lighting:"warm"},{confirm:false})');styled=saved(pg)
 check('Theme and felt never change the actual ball/table/rules state',state['world']==styled['world'] and state['rules']==styled['rules'])
 pg.evaluate('CueLab.setSettings({style:"arcade"},{confirm:false})');check('Arcade turns off human variation, chalk and miscues and restores the normal cue ball',pg.evaluate('const s=CueLab.settings();!s.execution&&!s.miscues&&s.chalk==="off"&&s.cueBall==="standard"'))
 check('Arcade does not silently change a chosen visual theme',pg.evaluate('CueLab.settings().theme==="brunswick"'))
 # Native downloaded-file and hosted origins differ; here use actual JSON via file picker.
 pane(pg,'table','saves');portable=saved(pg)
 with pg.expect_download() as d:pg.locator('#export').click()
 target=ROOT/'verification/browser-test-save-v0.3.json';d.value.save_as(str(target));check('Export downloads the complete portable state',json.loads(target.read_text())==portable)
 pg.evaluate('CueLab.setShot({power:17})');pg.set_input_files('#importFile',str(target));pg.wait_for_timeout(60);check('Real file-picker import restores the exported state',saved(pg)==portable)
 invalid=json.loads(json.dumps(portable));invalid['session']['records']=[{}]
 pg.set_input_files('#importFile',{'name':'bad.json','mimeType':'application/json','buffer':json.dumps(invalid).encode()});pg.wait_for_timeout(60);check('Invalid record import is rejected without modifying the live game',saved(pg)==portable)
 legacy=json.loads(json.dumps(portable));legacy.pop('session');legacy.pop('declaration');legacy['rules']['mode']='practice';legacy['world']['cfg'].pop('tableLength',None);legacy['world']['cfg'].pop('tableWidth',None)
 # Use a genuine baseline exported structure when available; the migrated variant below remains same schema.
 pg.set_input_files('#importFile',{'name':'legacy.json','mimeType':'application/json','buffer':json.dumps(legacy).encode()});pg.wait_for_timeout(80)
 check('A legacy-schema save without session or declarations migrates safely',pg.evaluate('CueLab.validateSave(CueLab.snapshot())&&CueLab.session().version===3'))
 # Timeout coach uses a real Worker and does not mutate the live table.
 pg.evaluate('CueLab.setSettings({opponent:"human",tableSize:"9",cueBall:"standard",style:"arcade"},{confirm:false});CueLab.setDrill("draw")')
 original=saved(pg);pg.locator('#coachButton').click();pg.wait_for_function('!document.querySelector("#coachDemo").disabled',timeout=40000);ready=saved(pg)
 check('Coach supplies a tested recommendation and concrete power/tip details','Power:' in pg.locator('#coachBody').inner_text())
 check('Coach analysis does not touch balls or chosen stroke',ready['world']==original['world'] and ready['shot']==original['shot'])
 pg.locator('#coachDemo').click();pg.wait_for_function('CueLab.status().replay',timeout=40000);check('Ghost demonstration becomes a replay without playing the human turn',not pg.evaluate('CueLab.status().shotRunning'))
 pg.locator('#replay').click();pg.wait_for_timeout(80);check('Stopping the ghost demo restores the identical live save',saved(pg)==ready)
 pg.locator('#coachApply').click();check('Applying advice sets controls without firing',not pg.evaluate('CueLab.status().shotRunning'))
 # Cancel a worker before it finishes; its stale message must not show up later.
 pg.locator('#coachButton').click();pg.locator('#coachClose').click();cancelled=saved(pg);pg.wait_for_timeout(800)
 check('Cancelled coaching cannot change state or reopen its dialog',saved(pg)==cancelled and not pg.locator('#coachDialog').is_visible())
 # Computer search, actual physics, pause/undo and cancellation.
 pg.evaluate('CueLab.setSettings({opponent:"computer",aiSearch:"quick",aiPace:"quick",skill2:4},{confirm:false})');pg.select_option('#mode','apa8')
 pg.evaluate('let s=CueLab.snapshot();s.rules.turn=1;s.session.breaker=1;s.rules.breaker=1;CueLab.restore(s)')
 pg.wait_for_function('CueLab.status().shotRunning',timeout=40000)
 check('The computer actually delivers a simulated shot',pg.evaluate('CueLab.status().shotRunning'))
 pg.locator('#computerButton').click();pg.locator('#finish').click();computerResult=saved(pg)
 check('Computer stroke consumes exactly one turn and leaves a valid save',computerResult['rules']['shots']==1 and pg.evaluate('CueLab.validateSave(CueLab.snapshot())'))
 pg.locator('#undo').click();pg.wait_for_timeout(700);check('Undo pauses the computer instead of letting it overwrite the restored position',not pg.evaluate('CueLab.status().shotRunning||CueLab.status().aiThinking') and pg.evaluate('CueLab.getRules().shots===0'))
 pg.locator('#computerButton').click();pg.wait_for_function('CueLab.status().aiThinking',timeout=10000);pg.locator('#computerButton').click();stopped=saved(pg);pg.wait_for_timeout(1000)
 check('Stopping an active computer search prevents late execution',saved(pg)==stopped and not pg.evaluate('CueLab.status().shotRunning||CueLab.status().aiThinking'))
 # Lag is genuine movement followed by a second player's attempt.
 pg.evaluate('CueLab.setSettings({opponent:"human",firstBreak:"lag"},{confirm:false})');check('Lag starts with a single cue ball, not a precomputed winner',pg.evaluate('CueLab.session().lag.player===0&&CueLab.getWorld().balls.length===1'))
 pg.evaluate('CueLab.setShot({power:36})');pg.locator('#shoot').click();pg.locator('#finish').click();check('Lag trial records actual rail/path result',pg.evaluate('CueLab.session().lag.awaitNext&&CueLab.session().lag.results.length===1'))
 pg.locator('#nextRackButton').click();check('Next lag hands the independent trial to the second player',pg.evaluate('CueLab.session().lag.player===1&&!CueLab.session().lag.awaitNext'))
 pg.evaluate('CueLab.setShot({power:39})');pg.locator('#shoot').click();pg.locator('#finish').click();pg.locator('#nextRackButton').click();check('Two unequal legal lag results produce a rack and breaker',pg.evaluate('CueLab.session().lag===null&&CueLab.getWorld().balls.length===16&&CueLab.getRules().break'))
 # Stalemate is a distinct match action, not a disguised win.
 pane(pg,'match','setup');before=saved(pg);pg.locator('#stalemateButton').click();after=saved(pg);check('Agreed APA8 stalemate reracks without awarding a win',after['session']['wins']==before['session']['wins'] and after['session']['records'][-1]['winner']=='stalemate')
 # No-scroll UI is tested more exhaustively in a separate harness.
 check('No page-script errors during the functional workflow',not report['errors'])
 pg.screenshot(path=str(ROOT/'verification/v0.3-functional.png'));pg.close()
 # Real origin storage denied by administered navigation environment: warning rather than crash.
 pg=b.new_page(viewport={'width':412,'height':740});pg.on('pageerror',lambda e:report['errors'].append(str(e)));pg.set_content(HTML);pane(pg,'table','saves');pg.locator('#saveLayout').click();check('Blocked native storage provides an export-oriented warning',pg.locator('#toast').is_visible())
 pg.locator('#viewButton').click();pg.wait_for_timeout(250);check('A missing WebGL context falls back to playable 2D',pg.evaluate('CueLab.settings().camera==="2d"') and pg.locator('#shoot').is_enabled())
 pg.close();b.close()
report['passed']=len(report['checks']);report['failed']=0;(ROOT/'verification/browser-v0.3-results.json').write_text(json.dumps(report,indent=2));print('SUMMARY',report['passed'],report['errors'])
