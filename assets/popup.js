(()=>{'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 if(sessionStorage.getItem('rvWelcomeSeen'))return;
 const base=location.pathname.includes('/rashifal/')?'../':'';
 const p=document.createElement('aside');p.className='rv-popup';p.setAttribute('role','dialog');p.setAttribute('aria-label','RashiVibe');
 p.innerHTML=`<button class="rv-popup-close" aria-label="Close">×</button><h3 data-hi="अपनी RashiVibe प्रोफाइल बनाएं" data-en="Create your RashiVibe profile">अपनी RashiVibe प्रोफाइल बनाएं</h3><p data-hi="जन्म विवरण एक बार सेव करें। फिर कुंडली, मिलान, साढ़े साती और दूसरे व्यक्तिगत टूल में वही जानकारी दोबारा भरने की जरूरत नहीं पड़ेगी।" data-en="Save your birth details once and reuse them across Kundli, Matching, Sade Sati and other personal tools.">जन्म विवरण एक बार सेव करें। फिर कुंडली, मिलान, साढ़े साती और दूसरे व्यक्तिगत टूल में वही जानकारी दोबारा भरने की जरूरत नहीं पड़ेगी।</p><div class="rv-popup-actions"><a class="btn primary" href="${base}login.html" data-hi="लॉगिन" data-en="Login">लॉगिन</a><a class="btn ghost" href="${base}profile.html?guest=1" data-hi="अतिथि मोड" data-en="Guest Mode">अतिथि मोड</a></div>`;
 document.body.appendChild(p);setTimeout(()=>p.classList.add('show'),650);
 const close=()=>{p.classList.remove('show');sessionStorage.setItem('rvWelcomeSeen','1');setTimeout(()=>p.remove(),250)};p.querySelector('.rv-popup-close').onclick=close;
 if(window.RVApplyLang)window.RVApplyLang(false);
});})();
