(() => {
  'use strict';
  const anchor = document.currentScript.previousElementSibling;
  if (!anchor || anchor.dataset.hmMounted) return;
  anchor.dataset.hmMounted = 'true';
  document.getElementById('hm-finder-host')?.remove();
  const config = __CONFIG__;
  const therapists = __DATA__;
  __MATCHER__
  const host = document.createElement('div'); host.id = 'hm-finder-host';
  const bodyFont = getComputedStyle(document.body).fontFamily;
  const heading = document.querySelector('h1,h2');
  host.style.setProperty('--hm-body', bodyFont || 'Arial, sans-serif');
  host.style.setProperty('--hm-heading', heading ? getComputedStyle(heading).fontFamily : 'Georgia, serif');
  document.body.append(host);
  const root = host.attachShadow({mode:'open'});
  root.innerHTML = `<style>__CSS__</style><button type="button" class="launcher" aria-haspopup="dialog" aria-expanded="false">Find a therapist</button><dialog aria-labelledby="hm-title"><div class="top"><span>HEALTHY MINDS · FINDER</span><button type="button" class="close" aria-label="Close finder">×</button></div><main></main></dialog>`;
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
  const observer=new MutationObserver(()=>{if(!anchor.isConnected||!host.isConnected){if(dialog.open)dialog.close();host.remove();observer.disconnect();}});
  observer.observe(document.body,{childList:true,subtree:true});
})();
