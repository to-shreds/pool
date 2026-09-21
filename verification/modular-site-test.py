"""Exercise the hosted entry point using intercepted asset requests, not a fake live URL."""
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import json, mimetypes
root=Path(__file__).resolve().parents[1]
result={'method':'Real Chromium loaded index.html with local asset requests fulfilled by Playwright; not a public-deployment check.', 'assets':[], 'errors':[]}
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':412,'height':915})
    page.on('pageerror',lambda e:result['errors'].append(str(e)))
    def serve(route):
        path=urlparse(route.request.url).path.removeprefix('/pool/')
        assert path in ['src/style.css','src/physics.js','src/rules.js','src/placement.js','src/app.js'],path
        result['assets'].append(path)
        route.fulfill(body=(root/path).read_bytes(),content_type=mimetypes.guess_type(path)[0] or 'text/plain')
    page.route('https://cue-lab.invalid/pool/**',serve)
    page.set_content((root/'index.html').read_text().replace('<head>','<head><base href="https://cue-lab.invalid/pool/">'))
    page.wait_for_function('window.CueLab?.version === "0.2.0"')
    assert len(set(result['assets']))==5
    page.locator('#shoot').click();page.locator('#finish').click()
    assert page.evaluate('!CueLab.status().shotRunning && CueLab.getRules().shots === 1')
    page.locator('#undo').click();page.locator('#placeCue').click()
    assert page.evaluate('CueLab.placement().zoom === 6')
    assert page.evaluate('document.body.scrollHeight === innerHeight')
    assert not result['errors'],result
    result['passed']=6;result['failed']=0
    browser.close()
(root/'verification/modular-site-results.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
