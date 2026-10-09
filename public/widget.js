(() => {
const script = document.currentScript;
const pages = (script?.dataset.pages || '*').split(',').map(p=>p.trim());
const key = '__healthyMindsFinderController';
window[key]?.stop();
let lastPath = location.pathname;
function sync() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  if (location.pathname !== lastPath) {
    document.getElementById('hm-finder-host')?.remove();
    lastPath = location.pathname;
  }
  if (!pages.includes('*') && !pages.includes(path)) {
    document.getElementById('hm-finder-host')?.remove(); return;
  }
  if (!document.getElementById('hm-finder-host')) mount();
}
function mount() {
  'use strict';
  document.getElementById('hm-finder-host')?.remove();
  const config = {"version": "v2-no-language-demo", "demoMode": true, "intakeUrl": "https://aws-portal.owlpractice.ca/healthymindspsychotherapy/booking", "teamUrl": "https://www.healthymindspsychotherapy.com/our-team"};
  const therapists = [{"id": "T01", "name": "Katharine De Santos", "active": true, "reviewStatus": "draft", "sortOrder": 1, "services": ["couples"], "childMin": null, "childMax": null, "topics": ["A", "G", "R", "L", "M"], "languages": ["English"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-katharine-de-santos"}, {"id": "T02", "name": "Kelsey DuBiel", "active": true, "reviewStatus": "draft", "sortOrder": 2, "services": ["adult_individual"], "childMin": null, "childMax": null, "topics": ["A", "G", "R", "L", "M"], "languages": ["English"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-kelsey-dubiel"}, {"id": "T03", "name": "Sarah Brown", "active": true, "reviewStatus": "draft", "sortOrder": 3, "services": ["adult_individual", "child_teen"], "childMin": 8, "childMax": 17, "topics": ["A", "G", "L", "M"], "languages": ["English"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-sarah-brown"}, {"id": "T04", "name": "Gabrielle McCarthy", "active": true, "reviewStatus": "draft", "sortOrder": 4, "services": ["adult_individual", "couples"], "childMin": null, "childMax": null, "topics": ["A", "R", "L", "M"], "languages": ["English", "French"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-gabrielle-mccarthy"}, {"id": "T05", "name": "Kimberly Cartwright", "active": true, "reviewStatus": "draft", "sortOrder": 5, "services": ["adult_individual"], "childMin": null, "childMax": null, "topics": ["A", "G", "R", "L"], "languages": ["English"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-kimberly-cartwrigh"}, {"id": "T06", "name": "Atessa Hooshvar", "active": true, "reviewStatus": "draft", "sortOrder": 6, "services": ["adult_individual"], "childMin": null, "childMax": null, "topics": ["A", "G", "L"], "languages": ["English", "Farsi"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-atessa-hooshvar"}, {"id": "T07", "name": "Maria Moncaleano", "active": true, "reviewStatus": "draft", "sortOrder": 7, "services": ["adult_individual"], "childMin": null, "childMax": null, "topics": ["A", "G", "L", "M"], "languages": ["English", "Spanish"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-maria-moncaleano"}, {"id": "T08", "name": "Erin Hardy", "active": true, "reviewStatus": "draft", "sortOrder": 8, "services": ["adult_individual", "child_teen"], "childMin": 15, "childMax": 17, "topics": ["A", "R", "L", "M"], "languages": ["English"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-erin-hardy"}, {"id": "T09", "name": "Kasey Silva", "active": true, "reviewStatus": "draft", "sortOrder": 9, "services": ["adult_individual", "child_teen", "family"], "childMin": 6, "childMax": 17, "topics": ["A", "R", "L"], "languages": ["English", "Portuguese"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-kasey-silva"}, {"id": "T10", "name": "Ekta Maloo", "active": true, "reviewStatus": "draft", "sortOrder": 10, "services": ["adult_individual"], "childMin": null, "childMax": null, "topics": ["A", "G", "R", "L", "M"], "languages": ["English", "Hindi"], "profileUrl": "https://www.healthymindspsychotherapy.com/our-team-ekta-maloo"}];
  function matchTherapists(data, answers, demoMode = false) {
  if (!['adult_individual','child_teen','couples','family'].includes(answers.service)) return [];
  if (!['A','G','R','L','M','X'].includes(answers.topic)) return [];
  const bands = {under6:[0,5],age6_7:[6,7],age8_14:[8,14],age15_17:[15,17]};
  if (answers.service === 'child_teen' && !bands[answers.age]) return [];
  return data.filter(t => {
    if (!t.active || (!demoMode && t.reviewStatus !== 'approved')) return false;
    if (!t.services.includes(answers.service)) return false;
    if (answers.service === 'child_teen') {
      const [min,max] = bands[answers.age];
      if (!Number.isInteger(t.childMin) || !Number.isInteger(t.childMax) || min < t.childMin || max > t.childMax) return false;
    }
    return answers.topic === 'X' || t.topics.includes(answers.topic);
  }).sort((a,b) => a.sortOrder-b.sortOrder || a.id.localeCompare(b.id));
}

  const host = document.createElement('div'); host.id = 'hm-finder-host';
  const bodyFont = getComputedStyle(document.body).fontFamily;
  const heading = document.querySelector('h1,h2');
  host.style.setProperty('--hm-body', bodyFont || 'Arial, sans-serif');
  host.style.setProperty('--hm-heading', heading ? getComputedStyle(heading).fontFamily : 'Georgia, serif');
  document.body.append(host);
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `<style>:host{all:initial;font-family:var(--hm-body,Arial,sans-serif);color:#202020;font-size:16px}*{box-sizing:border-box}button,a{font:inherit}button{cursor:pointer;color:#202020}button:focus-visible,a:focus-visible{outline:3px solid #785313;outline-offset:3px}.launcher{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom));z-index:2147480000;border:1px solid #d3bc60;background:#ffea91;padding:15px 21px;border-radius:999px;box-shadow:0 5px 22px #0002;font-size:16px}dialog{position:fixed;inset:auto 20px 90px auto;margin:0;width:400px;max-width:calc(100vw - 32px);max-height:calc(100dvh - 112px);padding:0;border:1px solid #ddd6ca;border-radius:22px;background:#fff;color:#202020;font:16px/1.5 var(--hm-body,Arial,sans-serif);box-shadow:0 16px 60px #0003;overflow:auto}dialog::backdrop{background:#0003}.top{position:sticky;top:0;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid #eee;z-index:1;font-size:12px;letter-spacing:.06em}.close{background:none;border:0;font-size:25px;width:44px;height:44px;border-radius:8px}main{padding:22px}h2{font:400 32px/1.2 var(--hm-heading,Georgia,serif);margin:8px 0 18px}h3{font:400 25px/1.2 var(--hm-heading,Georgia,serif);margin:0 0 12px}p{margin:12px 0}.muted{color:#655f56;font-size:13px}.eyebrow{font-size:12px;letter-spacing:.06em;color:#655f56}.options{display:grid;gap:10px;margin:18px 0}.option,.primary,.secondary{display:block;width:100%;border:1px solid #ddd6ca;border-radius:12px;padding:12px 15px;text-align:left;background:#fff;min-height:46px;margin:0;text-decoration:none;color:#202020;line-height:1.4}.option[aria-pressed=true],.primary{background:#ffea91}.primary{text-align:center;margin:16px 0 10px}.primary:disabled{opacity:.5;cursor:not-allowed}.secondary{margin:10px 0}.text-button{background:none;border:0;padding:10px 0;text-decoration:underline}.card{background:#f4f1eb;padding:18px;border-radius:14px;margin:14px 0}.card a,a.text-link{color:#202020;text-decoration:underline}.review{background:#f4f1eb;padding:16px;border-radius:12px}.demo{border:1px dashed #b58d34;background:#fff9df;padding:8px 12px;font-size:12px;margin:0 0 18px}.actions{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}ul{padding-left:20px;margin:10px 0}li{margin:5px 0}@media(max-width:480px){dialog{inset:0;margin:0;width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;border-radius:0;padding-bottom:env(safe-area-inset-bottom)}.launcher{right:14px;bottom:calc(14px + env(safe-area-inset-bottom))}main{padding:20px}}
</style><button type="button" class="launcher" aria-haspopup="dialog" aria-expanded="false">Find a therapist</button><dialog aria-labelledby="hm-title"><div class="top"><span>HEALTHY MINDS · FINDER</span><button type="button" class="close" aria-label="Close finder">×</button></div><main></main></dialog>`;
  const dialog = root.querySelector('dialog'), main = root.querySelector('main'), launcher = root.querySelector('.launcher');
  const services = {adult_individual:'Adult individual therapy',child_teen:'Child or teen therapy',couples:'Couples therapy',family:'Family therapy'};
  const ages = {under6:'Under 6',age6_7:'6–7',age8_14:'8–14',age15_17:'15–17'};
  const topics = {A:'Stress & anxiety',G:'Grief & loss',R:'Relationships',L:'Life changes',M:'Low mood',X:'I’m not sure / Skip'};
  let step = 'welcome', answers = {service:null,age:null,topic:null};
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const link = (url,text,cls='text-link') => `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)} <span aria-label="opens in new tab">↗</span></a>`;
  const intake = () => link(config.intakeUrl,'Book a complimentary intake','primary');
  const button = (action,label,cls='primary',disabled=false)=>`<button type="button" class="${cls}" data-action="${action}" ${disabled?'disabled':''}>${label}</button>`;
  const reset = ()=>{step='welcome';answers={service:null,age:null,topic:null};};
  const list = (field,choices)=>`<div class="options">${Object.entries(choices).map(([id,label])=>`<button type="button" class="option" data-field="${field}" data-value="${id}" aria-pressed="${answers[field]===id}">${esc(label)}${answers[field]===id?' ✓':''}</button>`).join('')}</div>`;
  const review = ()=>`<div class="review"><strong>${esc(services[answers.service])}</strong>${answers.service==='child_teen'?'<br>Age '+esc(ages[answers.age]):''}<br>${esc(topics[answers.topic])}</div>`;
  function render(focusSelector) {
    let title='',body='',eyebrow='';
    if(step==='welcome'){
      eyebrow='A LITTLE GUIDANCE';title='Find your next step.';
      body='<p>Choose a few options to explore our team.</p>'+button('start','Help me find a therapist →')+link(config.teamUrl,'Browse all therapists','secondary')+intake()+'<p class="muted">An automated guide to our team. Not therapy or emergency support.</p>';
    } else if(step==='service'){
      eyebrow='1 OF 2 · SERVICE';title='Who is therapy for?';body='<p>Choose one option.</p>'+list('service',services)+button('next','Continue →','primary',!answers.service)+button('back','← Back','text-button')+intake();
    } else if(step==='age'){
      eyebrow='CHILD OR TEEN THERAPY';title='What age group?';body='<p>This helps us show age-appropriate profiles.</p>'+list('age',ages)+button('next','Continue →','primary',!answers.age)+button('back','← Back','text-button');
    } else if(step==='topic'){
      eyebrow='2 OF 2 · SUPPORT';title='What would you like support with?';body='<p>Choose one topic to get started.</p>'+list('topic',topics)+button('next','Continue →','primary',!answers.topic)+button('back','← Back','text-button');
    } else if(step==='review'){
      eyebrow='REVIEW YOUR CHOICES';title='Ready to explore?';body=review()+'<p class="muted">Language does not limit your results.</p>'+button('show','Show therapists →')+button('back','← Back','text-button');
    } else {
      const matches=matchTherapists(therapists,answers,config.demoMode);
      eyebrow='YOUR OPTIONS'; title=matches.length?'Therapists to explore.':'Our team can help.';
      body=review();
      if(matches.length){
        body+=`<p class="muted">Showing ${Math.min(3,matches.length)} of ${matches.length} profiles that match these directory tags.</p>`;
        body+=matches.slice(0,3).map(t=>`<article class="card"><h3>${esc(t.name)}</h3><p><strong>Why this profile appears</strong></p><ul><li>Lists ${esc(services[answers.service])}</li>${answers.service==='child_teen'?`<li>Lists an age range covering ${esc(ages[answers.age])}</li>`:''}${answers.topic!=='X'?`<li>Lists support related to ${esc(topics[answers.topic])}</li>`:''}</ul><p class="muted">Languages: ${esc(t.languages.join(', '))}</p>${link(t.profileUrl,'View profile')}</article>`).join('');
      } else body+='<p>We couldn’t find a reviewed profile matching these choices. Our team can help you explore options.</p>';
      body+='<p class="muted">Availability and suitability are confirmed at intake.</p>'+intake()+link(config.teamUrl,'View all therapists','secondary')+'<div class="actions">'+button('edit','Edit my answers','text-button')+button('reset','Start again','text-button')+'</div>';
    }
    main.innerHTML=(config.demoMode?'<div class="demo">TEST DEMO · Draft directory mappings, not approved recommendations.</div>':'')+`<div class="eyebrow">${eyebrow}</div><h2 id="hm-title" tabindex="-1">${title}</h2>`+body;
    (focusSelector?main.querySelector(focusSelector):main.querySelector('h2'))?.focus({preventScroll:true});
    if(!focusSelector)dialog.scrollTop=0;
  }
  launcher.addEventListener('click',()=>{reset();render();dialog.showModal();launcher.setAttribute('aria-expanded','true');main.querySelector('h2').focus();});
  root.querySelector('.close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{reset();launcher.setAttribute('aria-expanded','false');launcher.focus();});
  main.addEventListener('click',e=>{
    const target=e.target.closest('button');if(!target||target.disabled)return;
    if(target.dataset.field){const f=target.dataset.field,v=target.dataset.value;if(f==='service'&&answers.service!==v)answers.age=null;answers[f]=v;render(`[data-field="${f}"][data-value="${v}"]`);return;}
    switch(target.dataset.action){
      case 'start':step='service';break;
      case 'next':
        if(step==='service'&&answers.service)step=answers.service==='child_teen'?'age':'topic';
        else if(step==='age'&&answers.age)step='topic';
        else if(step==='topic'&&answers.topic)step='review';break;
      case 'back':step=step==='service'?'welcome':step==='age'?'service':step==='topic'?(answers.service==='child_teen'?'age':'service'):'topic';break;
      case 'show':if(answers.service&&answers.topic&&(answers.service!=='child_teen'||answers.age))step='results';break;
      case 'edit':step='service';break;
      case 'reset':reset();break;
    }
    render();
  });
  // Remove the page-local widget if Squarespace replaces its Code Block during navigation.
  const observer=new MutationObserver(()=>{if(!host.isConnected){if(dialog.open)dialog.close();host.remove();observer.disconnect();}});
  observer.observe(document.body,{childList:true,subtree:true});
}
const observer = new MutationObserver(sync);
observer.observe(document.body, {childList:true, subtree:true});
window.addEventListener('popstate',sync);
window[key] = {stop(){observer.disconnect();window.removeEventListener('popstate',sync);document.getElementById('hm-finder-host')?.remove();}};
sync();
})();
