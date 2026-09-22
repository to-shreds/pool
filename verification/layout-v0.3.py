from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1]
AUDIT='''() => {
 const active=[...document.querySelectorAll('dialog[open]')].at(-1)||document.querySelector('.app');
 const boxes=[...active.querySelectorAll('.panel,.page-stack,.subpage,.spin-presets,.drills,.shot-dock,.placement-body,.placement-tools,.nudge-area,.zoom-controls,.help-body,.rules-brief,.shot-log,.settings-fields,.setting-card,.settings-nav,.reader-body,.stroke-state,.match-actions')].filter(e=>e.getClientRects().length);
 const over=boxes.filter(e=>e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2).map(e=>`${e.id||e.className}: ${e.clientWidth}x${e.clientHeight} vs ${e.scrollWidth}x${e.scrollHeight}`);
 const clipped=[];
 for(const e of active.querySelectorAll('button,input,select')){
  if(!e.getClientRects().length||e.hidden||e.type==='file')continue;
  const r=e.getBoundingClientRect();if(r.width<1||r.height<1)continue;
  const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
  if(r.left<-.5||r.top<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5||!hit||!(hit===e||e.contains(hit)))clipped.push(e.id||e.textContent.trim());
 }
 return {over,clipped,body:[document.body.scrollWidth,document.body.scrollHeight,innerWidth,innerHeight],table:document.querySelector('#table').getBoundingClientRect().height};
}'''
report={'checks':[],'failures':[],'errors':[]}
def audit(pg,label):
 x=pg.evaluate(AUDIT);bad=x['over'] or x['clipped'] or x['body'][:2]!=x['body'][2:]
 (report['failures'] if bad else report['checks']).append({'name':label,**x})
 if bad:print('FAIL',label,x,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(320,568),(360,640),(412,740),(412,915),(740,360),(915,412),(768,1024),(1440,900)]:
  pg=b.new_page(viewport={'width':w,'height':h});pg.on('dialog',lambda d:d.accept());pg.on('pageerror',lambda e:report['errors'].append(str(e)));pg.set_content((root/'Cue-Lab.html').read_text());pg.wait_for_timeout(50)
  pg.select_option('#mode','banks');pg.evaluate('let s=CueLab.snapshot();s.rules.break=false;CueLab.restore(s)')
  for group,pages in [('shot',['aim','spin','angle']),('table',['drills','arrange','saves','settings']),('match',['setup','rules','history'])]:
   pg.locator('[data-tab="'+group+'"]').click()
   for page in pages:
    pg.locator('.subtabs [data-group="'+group+'"][data-page="'+page+'"]').click();pg.wait_for_timeout(20);audit(pg,f'{w}x{h} {group}/{page}')
  pg.locator('#settingsButton').click()
  for group in pg.evaluate('CueSettings.groups'):
   pg.select_option('#settingsGroup',group);pg.wait_for_timeout(20);i=1
   while True:
    audit(pg,f'{w}x{h} Settings/{group}/{i}')
    if pg.locator('#settingsNext').is_disabled():break
    pg.locator('#settingsNext').click();i+=1
  pg.screenshot(path=str(root/'verification'/f'v0.3-settings-{w}-{h}.png'));pg.locator('#settingsClose').click()
  pg.locator('[data-tab="shot"]').click();pg.locator('.subtabs [data-group="shot"][data-page="spin"]').click();pg.evaluate('CueLab.setSettings({style:"simulation"},{confirm:false});CueLab.setShot({up:-.97,side:0})');pg.wait_for_timeout(30);audit(pg,f'{w}x{h} warning')
  pg.locator('#placeCue').click();pg.wait_for_timeout(30);audit(pg,f'{w}x{h} placement');pg.locator('#cancelPlacement').click()
  pg.screenshot(path=str(root/'verification'/f'v0.3-play-{w}-{h}.png'))
  pg.locator('#riskButton').click();pg.wait_for_timeout(30);audit(pg,f'{w}x{h} risk');pg.locator('#closeHelp').click();pg.close();print('DONE',w,h,flush=True)
 b.close()
(root/'verification/ui-audit-v0.3.json').write_text(json.dumps(report,indent=2));print('SUMMARY',len(report['checks']),len(report['failures']),report['errors'])
