(()=>{
'use strict';
const KEY='rvLang';
const norm=v=>v==='en'?'en':'hi';
const get=()=>norm(localStorage.getItem(KEY)||'hi');
function setText(el,val){
  if(val==null)return;
  if(el.matches('input,textarea') && el.hasAttribute('placeholder')){el.placeholder=val;return;}
  if(el.tagName==='OPTION'){el.textContent=val;return;}
  if(el.hasAttribute('data-lang-html') || /<[^>]+>/.test(val)) el.innerHTML=val;
  else el.textContent=val;
}
function apply({emit=true}={}){
  const lang=get();
  document.documentElement.lang=lang==='hi'?'hi':'en';
  document.querySelectorAll('[data-hi][data-en]').forEach(el=>setText(el,el.getAttribute(lang==='hi'?'data-hi':'data-en')));
  document.querySelectorAll('[data-title-hi][data-title-en]').forEach(el=>el.title=el.getAttribute(lang==='hi'?'data-title-hi':'data-title-en'));
  document.querySelectorAll('[data-aria-hi][data-aria-en]').forEach(el=>el.setAttribute('aria-label',el.getAttribute(lang==='hi'?'data-aria-hi':'data-aria-en')));
  const b=document.getElementById('langBtn');
  if(b){b.textContent=lang==='hi'?'ENG':'हिंदी';b.setAttribute('aria-label',lang==='hi'?'Switch to English':'हिंदी में बदलें');b.onclick=toggle;}
  if(window.RVAccount&&typeof window.RVAccount.refreshHeader==='function')window.RVAccount.refreshHeader();
  if(emit)document.dispatchEvent(new CustomEvent('rv-language',{detail:{lang}}));
  return lang;
}
function toggle(){localStorage.setItem(KEY,get()==='hi'?'en':'hi');apply({emit:true});}
window.RVLang=get;
window.RVT=(hi,en)=>get()==='hi'?hi:en;
window.RVSetLang=toggle;
window.RVApplyLang=apply;
function init(){apply({emit:true});
  // Dynamic labels added later are translated too.
  const mo=new MutationObserver(muts=>{
    const lang=get();
    for(const m of muts){for(const n of m.addedNodes){if(n.nodeType!==1)continue;
      if(n.matches?.('[data-hi][data-en]'))setText(n,n.getAttribute(lang==='hi'?'data-hi':'data-en'));
      n.querySelectorAll?.('[data-hi][data-en]').forEach(el=>setText(el,el.getAttribute(lang==='hi'?'data-hi':'data-en')));
    }}
  });
  mo.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('pageshow',()=>apply({emit:false}));
})();
