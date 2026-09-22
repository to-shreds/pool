"""Exercise published modular assets with actual DOM/worker execution, not public hosting."""
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import json,mimetypes,os
ROOT=Path(__file__).resolve().parents[1]
report={'method':'Chromium set_content of index.html with local asset bytes intercepted at a reserved .invalid URL. This is not a public deployment check.','assets':[], 'errors':[], 'checks':[]}
def check(n,v):
 if not v:raise AssertionError(n)
 report['checks'].append(n);print('PASS',n,flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox'])
 pg=b.new_page(viewport={'width':412,'height':915});pg.on('pageerror',lambda e:report['errors'].append(str(e)));pg.on('dialog',lambda d:d.accept())
 def serve(route):
  path=urlparse(route.request.url).path.removeprefix('/pool/')
  assert path.startswith('src/') and '..' not in path
  source=ROOT/path;assert source.is_file()
  report['assets'].append(path);route.fulfill(body=source.read_bytes(),content_type=mimetypes.guess_type(path)[0] or 'text/plain')
 pg.route('https://cue-lab.invalid/pool/**',serve)
 pg.set_content((ROOT/'index.html').read_text().replace('<head>','<head><base href="https://cue-lab.invalid/pool/">'))
 pg.wait_for_function('window.CueLab?.version === "0.3.0"')
 check('Modular entry loads all twelve local assets',len(set(report['assets']))==12)
 check('Modular state validates',pg.evaluate('CueLab.validateSave(CueLab.snapshot())'))
 saved=pg.evaluate('CueLab.snapshot()');pg.locator('#shoot').click();pg.locator('#finish').click()
 check('Modular shot and rules complete',pg.evaluate('!CueLab.status().shotRunning && CueLab.getRules().shots===1'))
 pg.locator('#undo').click();check('Modular undo restores exact state',pg.evaluate('CueLab.snapshot()')==saved)
 pg.locator('#placeCue').click();check('Modular precision view opens at six times zoom',pg.evaluate('CueLab.placement().zoom===6'));pg.locator('#cancelPlacement').click()
 pg.locator('#settingsButton').click();check('All twelve categories are available',pg.locator('#settingsGroup option').count()==12);pg.locator('#settingsClose').click()
 pg.evaluate('CueLab.setDrill("draw")');pg.locator('#coachButton').click();pg.wait_for_function('document.getElementById("coachDemo").disabled===false',timeout=25000)
 check('Bundled real Blob worker returns a coach candidate',pg.locator('#coachDemo').is_enabled())
 check('Modular page has no document scrolling',pg.evaluate('document.body.scrollWidth===innerWidth && document.body.scrollHeight===innerHeight'))
 check('No modular page-script errors',not report['errors']);b.close()
report['passed']=len(report['checks']);report['failed']=0;(ROOT/'verification/modular-v0.3-results.json').write_text(json.dumps(report,indent=2));print('SUMMARY',report['passed'])
