from pathlib import Path
import json
r=Path(__file__).parent
cfg=json.loads((r/'src/config.json').read_text());data=json.loads((r/'src/therapists.json').read_text())
assert len({t['id'] for t in data})==len(data)
for t in data:
 assert t['profileUrl'].startswith('https://www.healthymindspsychotherapy.com/')
 assert t['reviewStatus'] in ['draft','approved']
 assert set(t['services'])<=set(['adult_individual','child_teen','couples','family'])
 assert set(t['topics'])<=set('AGRLM')
 if 'child_teen' in t['services']:assert isinstance(t['childMin'],int) and 0<=t['childMin']<=t['childMax']<=17
s=(r/'src/widget.js').read_text()
s=s.replace("  const anchor = document.currentScript.previousElementSibling;\n  if (!anchor || anchor.dataset.hmMounted) return;\n  anchor.dataset.hmMounted = 'true';\n",'')
s=s.replace("if(!anchor.isConnected||!host.isConnected)","if(!host.isConnected)")
s=s.replace('(() => {','function mount() {',1)
assert s.rstrip().endswith('})();')
s=s.rstrip()[:-5]+'}'
s=s.replace('__CONFIG__',json.dumps(cfg,ensure_ascii=False)).replace('__DATA__',json.dumps(data,ensure_ascii=False)).replace('__MATCHER__',(r/'src/matcher.mjs').read_text().replace('export function','function')).replace('__CSS__',(r/'src/widget.css').read_text())
controller='''(() => {
const script = document.currentScript;
const pages = (script?.dataset.pages || '*').split(',').map(p=>p.trim());
const key = '__healthyMindsFinderController';
window[key]?.stop();
let lastPath = location.pathname;
function sync() {
  const path = location.pathname.replace(/\\/$/, '') || '/';
  if (location.pathname !== lastPath) {
    document.getElementById('hm-finder-host')?.remove();
    lastPath = location.pathname;
  }
  if (!pages.includes('*') && !pages.includes(path)) {
    document.getElementById('hm-finder-host')?.remove(); return;
  }
  if (!document.getElementById('hm-finder-host')) mount();
}
'''+s+'''
const observer = new MutationObserver(sync);
observer.observe(document.body, {childList:true, subtree:true});
window.addEventListener('popstate',sync);
window[key] = {stop(){observer.disconnect();window.removeEventListener('popstate',sync);document.getElementById('hm-finder-host')?.remove();}};
sync();
})();
'''
(r/'public/widget.js').write_text(controller)
print('Built public/widget.js')
