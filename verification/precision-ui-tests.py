"""Real DOM, pointer and touch checks; does not claim physical-device coverage."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json, math
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'Cue-Lab.html').read_text()
report={'checks':[], 'errors':[], 'method':'Chromium page.set_content. Mouse/touch input, responsive viewport emulation. No real Android hardware or native file navigation claimed.'}
def check(name, value):
 if not value: raise AssertionError(name)
 report['checks'].append(name); print('PASS',name,flush=True)
def near(a,b):return abs(a-b)<1e-9
def section(page,group,name):
 page.locator('[data-tab="'+group+'"]').click()
 page.locator('.subtabs [data-group="'+group+'"][data-page="'+name+'"]').click()
 page.wait_for_timeout(30)
def snapshot(page):return page.evaluate('CueLab.snapshot()')
def candidate(page):return page.evaluate('CueLab.placement()')
# Containers must fit, and every visible form/button center must survive ancestor clipping.
AUDIT=r'''() => {
 const active=document.querySelector('dialog[open]')||document.querySelector('.app');
 const ignore=new Set(['status','tableLabel','toast','tipDescription','gameTitle']);
 const containers=[...active.querySelectorAll('.panel,.page-stack,.subpage,.spin-presets,.drills,.shot-dock,.placement-body,.placement-tools,.nudge-area,.zoom-controls,.help-body,.rules-brief,.shot-log')].filter(e=>e.getClientRects().length);
 const over=containers.filter(e=>e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2).map(e=>`${e.id||e.className}: ${e.clientWidth}x${e.clientHeight} vs ${e.scrollWidth}x${e.scrollHeight}`);
 const clipped=[];
 for(const e of active.querySelectorAll('button,input,select')){
  if(!e.getClientRects().length||e.hidden||e.type==='file')continue;
  const r=e.getBoundingClientRect();if(r.width<1||r.height<1)continue;
  const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
  if(r.left<-.5||r.top<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5||!hit||!(hit===e||e.contains(hit)))clipped.push(e.id||e.textContent.trim());
 }
 return {over,clipped,body:[document.body.scrollWidth,document.body.scrollHeight,innerWidth,innerHeight]};
}'''
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':412,'height':915},has_touch=True)
 page.set_default_timeout(5000);page.on('pageerror',lambda e:report['errors'].append(str(e)));page.on('dialog',lambda d:d.accept())
 page.set_content(HTML);page.wait_for_timeout(100)
 before=snapshot(page);page.locator('#placeCue').tap();e=candidate(page)
 check('Placement opens at six times zoom',e['zoom']==6)
 check('Opening precision leaves the entire save untouched',snapshot(page)==before)
 check('Shooting is blocked while candidate editor is open',not page.evaluate('CueLab.shoot()'))
 page.locator('[data-nudge="-1,0"]').tap();n=candidate(page)
 check('Touch nudge moves exactly one millimeter',near(n['x'],e['x']-.001) and near(n['y'],e['y']))
 check('A nudge changes the preview, not live state',snapshot(page)==before)
 page.select_option('#nudgeStep','.005');page.locator('[data-nudge="0,1"]').tap();n=candidate(page)
 check('Five millimeter nudge is exact',near(n['y'],e['y']+.005))
 page.locator('#zoomIn').tap();z=candidate(page)
 check('Zoom does not move the selected spot',z['zoom']==7 and z['x']==n['x'] and z['y']==n['y'])
 page.set_viewport_size({'width':915,'height':412});page.wait_for_timeout(80)
 check('Rotation preserves candidate position',near(candidate(page)['x'],z['x']) and near(candidate(page)['y'],z['y']))
 page.locator('#cancelPlacement').click()
 check('Cancel restores normal mode without changing any saved state',snapshot(page)==before and candidate(page) is None and not page.evaluate('CueLab.status().placing'))
 page.set_viewport_size({'width':412,'height':915});page.wait_for_timeout(80)
 page.locator('#placeCue').click();page.locator('[data-nudge="1,0"]').click()
 check('Kitchen violation is shown and cannot be confirmed',not candidate(page)['valid'] and page.locator('#confirmPlacement').is_disabled() and 'kitchen' in page.locator('#placementValidity').inner_text())
 page.keyboard.press('Escape');check('Escape cancels an invalid preview without a side effect',snapshot(page)==before)
 page.evaluate('CueLab.setDrill("draw")');before=snapshot(page)
 page.locator('#placeCue').click();e=candidate(page);box=page.locator('#precisionTable').bounding_box();s=e['view']['scale']
 # Drag empty cloth, away from the ball: displacement is relative rather than a jump to the finger.
 x=box['x']+box['width']*.28;y=box['y']+box['height']*.5
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+24,y-16,steps=6);page.mouse.up();n=candidate(page)
 check('Dragging away from the ball moves it by the scaled delta',near(n['x'],e['x']+24/s) and near(n['y'],e['y']+16/s))
 check('Drag still leaves the live save unchanged',snapshot(page)==before)
 page.locator('#precisionTable').focus();page.keyboard.press('ArrowLeft');n=candidate(page)
 check('Keyboard nudge uses millimeter precision',near(n['x'],e['x']+24/s-.001))
 page.locator('#confirmPlacement').click();after=snapshot(page)
 check('Confirm commits the exact chosen coordinates',near(after['world']['balls'][0]['p'][0],n['x']) and near(after['world']['balls'][0]['p'][1],n['y']))
 check('Confirm preserves every object ball, rules and stroke',after['world']['balls'][1:]==before['world']['balls'][1:] and after['rules']==before['rules'] and after['shot']==before['shot'])
 check('Confirmed placement restores shooting controls',page.locator('#shoot').is_enabled())
 page.locator('#placeCue').click();before=snapshot(page)
 # Put candidate on the object ball using the actual minimap event.
 ob=page.evaluate('CueLab.getWorld().get(1).p');m=page.locator('#placementMap').bounding_box()
 mx=((360-2.54*120)/2+ob[0]*120)/360*m['width']
 my=((204+1.27*120)/2-ob[1]*120)/204*m['height']
 page.locator('#placementMap').click(position={'x':mx,'y':my})
 check('Overview moves to a different part of the table',abs(candidate(page)['x']-ob[0])<.002)
 check('Overlapping another ball disables confirmation',not candidate(page)['valid'] and page.locator('#confirmPlacement').is_disabled())
 page.locator('#resetPlacement').click();check('Original spot restores the preview only',snapshot(page)==before and candidate(page)['valid'])
 # Real touch cancellation must put back the point where that drag started.
 start=candidate(page)
 cdp=page.context.new_cdp_session(page);c=page.locator('#precisionTable').bounding_box();tx=c['x']+c['width']*.3;ty=c['y']+c['height']*.55
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':tx,'y':ty}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':tx+30,'y':ty+10}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]})
 check('Cancelled touch drag restores its starting preview',near(candidate(page)['x'],start['x']) and near(candidate(page)['y'],start['y']))
 b=page.locator('[data-nudge="-1,0"]').bounding_box();page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2);page.mouse.down();page.wait_for_timeout(590);page.mouse.up();held=candidate(page)
 check('Holding a nudge repeats it',held['x']<start['x']-.002)
 page.wait_for_timeout(250);check('Releasing a nudge stops it immediately',candidate(page)['x']==held['x'])
 page.locator('#cancelPlacement').click()
 section(page,'table','arrange');page.locator('#arrange').click();page.select_option('#editBall','15');page.locator('#precisionBall').click()
 check('Practice can precisely add a missing object ball',candidate(page)['id']==15)
 page.locator('#confirmPlacement').click();check('Practice confirmation creates only the selected ball',page.evaluate('CueLab.getWorld().get(15).active'))
 page.close()
 # Every control page, at compact phone, phone, tablet, desktop and short landscape sizes.
 for name,w,h in [('tiny',320,568),('small-phone',360,640),('phone',412,915),('phone-browser-bars',412,740),('landscape',915,412),('short-landscape',740,360),('tablet',768,1024),('desktop',1440,900)]:
  page=browser.new_page(viewport={'width':w,'height':h});page.set_default_timeout(5000)
  page.on('pageerror',lambda e:report['errors'].append(str(e)));page.on('dialog',lambda d:d.accept());page.set_content(HTML);page.wait_for_timeout(80)
  # Bank controls expose the densest called-shot row.
  page.select_option('#mode','banks')
  page.evaluate('const s=CueLab.snapshot();s.rules.break=false;CueLab.restore(s)')
  for group,names in [('shot',['aim','spin','angle']),('table',['drills','arrange','saves','settings']),('match',['setup','rules','history'])]:
   for tab in names:
    section(page,group,tab);a=page.evaluate(AUDIT)
    check(f'{name} {group}/{tab}: no scrolling, clipped or covered controls',not a['over'] and not a['clipped'] and a['body']==[w,h,w,h])
    if group=='shot':check(f'{name} {tab}: Shoot remains visible',page.locator('#shoot').is_visible())
  # Warnings use a fixed reserved dock slot; all spin controls stay accessible.
  section(page,'shot','spin');page.evaluate('CueLab.setShot({up:-.97,side:0,elevation:0})');page.wait_for_timeout(30);a=page.evaluate(AUDIT)
  check(name+' spin warning does not hide or overflow controls',not a['over'] and not a['clipped'])
  page.evaluate('CueLab.setShot({up:0})');page.locator('#placeCue').click();page.wait_for_timeout(30);a=page.evaluate(AUDIT)
  check(name+' precision dialog fits with reachable controls',not a['over'] and not a['clipped'])
  page.locator('#cancelPlacement').click()
  page.locator('#help').click();page.wait_for_timeout(30);a=page.evaluate(AUDIT)
  check(name+' help is paged rather than scrollable',not a['over'] and not a['clipped'])
  chunks=[]
  for _ in range(60):
   chunks.append(page.locator('#helpBody').inner_text())
   check(name+' help page '+str(len(chunks))+' fits',page.locator('#helpBody').evaluate('e=>e.scrollHeight<=e.clientHeight+1'))
   if page.locator('#helpNext').is_disabled():break
   page.locator('#helpNext').click()
  text=' '.join(chunks)
  check(name+' help reader reaches the final limitations paragraph','compound-foul exceptions' in text and 'PLAY A SHOT' in text)
  page.locator('#closeHelp').click()
  page.screenshot(path=str(ROOT/'verification'/('v0.2-'+name+'.png')))
  page.close()
 browser.close()
print('PAGE ERRORS',report['errors'])
check('No page script errors in precision and layout coverage',not report['errors'])
report['passed']=len(report['checks']);report['failed']=0
(ROOT/'verification'/'precision-ui-results.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
