(()=>{
'use strict';
const PROFILE_KEY='rvProfilesV1',ACTIVE_KEY='rvActiveProfileId',SESSION_KEY='rvAccountSession';
const $=id=>document.getElementById(id);
const safeJSON=(s,f)=>{try{return JSON.parse(s)}catch(e){return f}};
const now=()=>new Date().toISOString();
function uid(){return 'p_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8)}
function escapeHTML(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function clean(p={}){return {
 id:String(p.id||uid()),name:String(p.name||'').trim(),place:String(p.place||'').trim(),
 d:String(p.d||''),m:String(p.m||''),y:String(p.y||''),h:String(p.h||''),min:String(p.min||''),ap:String(p.ap||'AM'),
 lat:String(p.lat||''),lon:String(p.lon||''),tz:String(p.tz||'Asia/Kolkata'),phone:String(p.phone||''),
 moonSign:(p.moonSign!==null&&p.moonSign!==undefined&&p.moonSign!==''&&Number.isInteger(+p.moonSign))?+p.moonSign:null,
 nakshatra:(p.nakshatra!==null&&p.nakshatra!==undefined&&p.nakshatra!==''&&Number.isInteger(+p.nakshatra))?+p.nakshatra:null,
 ascSign:(p.ascSign!==null&&p.ascSign!==undefined&&p.ascSign!==''&&Number.isInteger(+p.ascSign))?+p.ascSign:null,
 nameRashi:(p.nameRashi!==null&&p.nameRashi!==undefined&&p.nameRashi!==''&&Number.isInteger(+p.nameRashi))?+p.nameRashi:null,
 whatsappDaily:!!p.whatsappDaily,updatedAt:p.updatedAt||now()
}}
function getProfiles(){const a=safeJSON(localStorage.getItem(PROFILE_KEY),[]);return Array.isArray(a)?a.map(clean):[]}
function setProfiles(a){localStorage.setItem(PROFILE_KEY,JSON.stringify(a.map(clean)))}
function getActiveId(){return localStorage.getItem(ACTIVE_KEY)||''}
function getActiveProfile(){const a=getProfiles(),id=getActiveId();return a.find(p=>p.id===id)||a[0]||null}
function legacyFrom(p){if(!p)return;localStorage.setItem('rvKundliProfile',JSON.stringify({name:p.name,place:p.place,d:p.d,m:p.m,y:p.y,h:p.h,min:p.min,ap:p.ap,lat:p.lat,lon:p.lon,tz:p.tz}))}
function setActiveProfile(id){const p=getProfiles().find(x=>x.id===id);if(!p)return null;localStorage.setItem(ACTIVE_KEY,p.id);legacyFrom(p);document.dispatchEvent(new CustomEvent('rv-profile-change',{detail:{profile:p}}));updateHeader();return p}
function saveProfile(p,makeActive=true){p=clean(p);let a=getProfiles();const i=a.findIndex(x=>x.id===p.id);if(i>=0)a[i]={...a[i],...p,updatedAt:now()};else a.push({...p,updatedAt:now()});setProfiles(a);if(makeActive)setActiveProfile(p.id);return p}
function deleteProfile(id){let a=getProfiles().filter(p=>p.id!==id);setProfiles(a);if(getActiveId()===id){if(a[0])setActiveProfile(a[0].id);else{localStorage.removeItem(ACTIVE_KEY);localStorage.removeItem('rvKundliProfile')}}updateHeader()}
function clearLocalAccountData(){localStorage.removeItem(PROFILE_KEY);localStorage.removeItem(ACTIVE_KEY);localStorage.removeItem(SESSION_KEY);localStorage.removeItem('rvKundliProfile');updateHeader()}
function getSession(){return safeJSON(localStorage.getItem(SESSION_KEY),null)}
function setSession(s){s?localStorage.setItem(SESSION_KEY,JSON.stringify(s)):localStorage.removeItem(SESSION_KEY);updateHeader()}
function val(id,v){const e=$(id);if(e&&v!==undefined&&v!==null&&String(v)!=='')e.value=v}
function to24(h,ap){h=+h||0;if(ap==='PM'&&h<12)h+=12;if(ap==='AM'&&h===12)h=0;return String(h).padStart(2,'0')}
function fill(prefix,p){if(!p)return;
 const map={Name:'name',Place:'place',D:'d',M:'m',Y:'y',H:'h',Min:'min',AP:'ap',Lat:'lat',Lon:'lon',Tz:'tz'};
 Object.entries(map).forEach(([s,k])=>val(prefix+s,p[k]));
 const d=$(prefix+'D');if(d)d.dispatchEvent(new Event('input',{bubbles:true}));
}
function read(prefix){const g=s=>$(prefix+s)?.value??'';return clean({name:g('Name'),place:g('Place'),d:g('D'),m:g('M'),y:g('Y'),h:g('H'),min:g('Min'),ap:g('AP'),lat:g('Lat'),lon:g('Lon'),tz:g('Tz')})}
function updateHeader(){const nav=document.querySelector('header .nav');if(!nav)return;let a=document.getElementById('rvProfilePill');if(!a){a=document.createElement('a');a.id='rvProfilePill';a.className='rv-profile-pill';const lang=document.getElementById('langBtn');nav.insertBefore(a,lang||nav.lastChild)}const p=getActiveProfile(),s=getSession(),base=location.pathname.includes('/rashifal/')?'../':'',en=(localStorage.getItem('rvLang')==='en');a.href=(!s?.verified&&!p)?base+'login.html':base+'profile.html';const label=p?.name||(s?.verified?(en?'My Profile':'मेरी प्रोफाइल'):'Login');a.innerHTML=`<span class="rv-profile-dot">●</span><span>${escapeHTML(label)}</span>`;a.title=p?(en?`${p.name} profile`:`${p.name} की प्रोफाइल`):(en?'RashiVibe login / profile':'RashiVibe लॉगिन / प्रोफाइल')}
function fillPageFromActive(){const p=getActiveProfile();if(!p)return;
 if($('kName'))fill('k',p);
 if($('numName')){val('numName',p.name);val('numD',p.d);val('numM',p.m);val('numY',p.y)}
 if($('mbName')){val('mbName',p.name);val('mbD',p.d);val('mbM',p.m);val('mbY',p.y);val('mbPlace',p.place);val('mbLat',p.lat);val('mbLon',p.lon);val('mbTz',p.tz);if($('mbTime'))$('mbTime').value=`${to24(p.h,p.ap)}:${String(p.min||'0').padStart(2,'0')}`}
 if($('pPlace')){val('pPlace',p.place);val('pLat',p.lat);val('pLon',p.lon);val('pTz',p.tz)}
 if($('sadeSign') && p.moonSign!==null)$('sadeSign').value=String(p.moonSign);
 const rashiBtn=document.querySelector('.zodiac-card[data-sign="'+p.moonSign+'"]');if(rashiBtn&&p.moonSign!==null)setTimeout(()=>rashiBtn.click(),0);
}
function populateMatchingSelectors(){const bs=$('bProfileSelect'),gs=$('gProfileSelect');if(!bs||!gs)return;const ps=getProfiles();const opts=['<option value="">— मैनुअल विवरण —</option>',...ps.map(p=>`<option value="${p.id}">${escapeHTML(p.name||'प्रोफाइल')}</option>`)].join('');bs.innerHTML=opts;gs.innerHTML=opts;const active=getActiveProfile();if(active){bs.value=active.id;fill('b',active)}const apply=(sel,prefix)=>sel.addEventListener('change',()=>{const q=getProfiles().find(x=>x.id===sel.value);if(q)fill(prefix,q)});apply(bs,'b');apply(gs,'g')}

/* ---------- Location helpers: suggestions + coordinates -> readable place ---------- */
function featurePlaceLabel(f){const p=f?.properties||{};const parts=[p.name,p.city||p.town||p.village||p.locality,p.county,p.state,p.country].filter(Boolean);return [...new Set(parts.map(x=>String(x).trim()).filter(Boolean))].join(', ')}
async function timezoneFor(lat,lon,countryCode=''){if(String(countryCode).toUpperCase()==='IN'||(lat>=6&&lat<=38&&lon>=68&&lon<=98))return 'Asia/Kolkata';try{const r=await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}`);if(r.ok){const d=await r.json();return d.timeZone||d.timezone||''}}catch(e){}return ''}
async function geocodePlace(q){q=String(q||'').trim();if(q.length<2)return [];try{const r=await fetch('https://photon.komoot.io/api/?limit=7&q='+encodeURIComponent(q));if(r.ok){const d=await r.json();return Array.isArray(d.features)?d.features:[]}}catch(e){}return []}
async function reversePlace(lat,lon){lat=+lat;lon=+lon;if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<-90||lat>90||lon<-180||lon>180)return null;try{const r=await fetch(`https://photon.komoot.io/reverse?limit=1&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);if(r.ok){const d=await r.json(),f=d?.features?.[0];if(f){return {label:featurePlaceLabel(f),feature:f}}}}catch(e){}try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=12&addressdetails=1`);if(r.ok){const d=await r.json(),a=d.address||{},label=[a.suburb||a.neighbourhood||a.village||a.town||a.city||a.county,a.state,a.country].filter(Boolean);return {label:[...new Set(label)].join(', '),feature:{properties:{countrycode:a.country_code||''}}}}}catch(e){}return null}
async function applyFeatureToFields(prefix,f){const place=$(prefix+'Place'),lat=$(prefix+'Lat'),lon=$(prefix+'Lon'),tz=$(prefix+'Tz');if(!place||!lat||!lon||!f)return false;const coords=f.geometry?.coordinates||[];const la=+coords[1],lo=+coords[0];if(!Number.isFinite(la)||!Number.isFinite(lo))return false;const label=featurePlaceLabel(f);if(label)place.value=label;lat.value=la.toFixed(6);lon.value=lo.toFixed(6);if(tz){const zone=await timezoneFor(la,lo,f.properties?.countrycode||f.properties?.countryCode||'');if(zone)tz.value=zone}return true}
function attachLocationFields(prefix,{autocomplete=true,reverse=true}={}){const place=$(prefix+'Place'),lat=$(prefix+'Lat'),lon=$(prefix+'Lon'),tz=$(prefix+'Tz');if(!place||!lat||!lon)return;
 if(place.dataset.rvLocationBound==='1')return;place.dataset.rvLocationBound='1';
 let suggest=$(prefix+'Suggest');if(autocomplete&&!suggest){suggest=document.createElement('div');suggest.id=prefix+'Suggest';suggest.className='suggestions';place.insertAdjacentElement('afterend',suggest)}
 let qTimer=0,revTimer=0,requestId=0;
 if(autocomplete&&suggest){place.setAttribute('autocomplete','off');place.addEventListener('input',()=>{clearTimeout(qTimer);const q=place.value.trim();if(q.length<2){suggest.innerHTML='';return}const id=++requestId;qTimer=setTimeout(async()=>{const items=await geocodePlace(q);if(id!==requestId)return;suggest.innerHTML=items.slice(0,7).map((f,i)=>`<button type="button" data-i="${i}">${escapeHTML(featurePlaceLabel(f)||q)}</button>`).join('');suggest.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',async()=>{const f=items[+btn.dataset.i];suggest.innerHTML='';await applyFeatureToFields(prefix,f);place.dispatchEvent(new Event('change',{bubbles:true}))}))},260)});document.addEventListener('click',e=>{if(e.target!==place&&!suggest.contains(e.target))suggest.innerHTML=''})}
 if(reverse){const run=()=>{clearTimeout(revTimer);revTimer=setTimeout(async()=>{const la=+lat.value,lo=+lon.value;if(!Number.isFinite(la)||!Number.isFinite(lo))return;const r=await reversePlace(la,lo);if(r?.label)place.value=r.label;if(tz){const zone=await timezoneFor(la,lo,r?.feature?.properties?.countrycode||'');if(zone)tz.value=zone}},420)};lat.addEventListener('change',run);lon.addEventListener('change',run);lat.addEventListener('blur',run);lon.addEventListener('blur',run)}
}
async function resolveTypedPlace(prefix){const place=$(prefix+'Place'),lat=$(prefix+'Lat'),lon=$(prefix+'Lon');if(!place||!lat||!lon)return false;if(Number.isFinite(+lat.value)&&Number.isFinite(+lon.value)&&lat.value!==''&&lon.value!=='')return true;const items=await geocodePlace(place.value);if(!items.length)return false;return applyFeatureToFields(prefix,items[0])}

/* ---------- Firebase cloud/account helpers ---------- */
function hasFirebaseUser(){return !!(window.firebase?.apps?.length&&firebase.auth&&firebase.auth().currentUser)}
async function cloudSaveProfile(p){try{if(!hasFirebaseUser()||!firebase.firestore)return false;await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('profiles').doc(p.id).set(p,{merge:true});return true}catch(e){console.warn('RashiVibe cloud save:',e);return false}}
async function cloudDeleteProfile(id){try{if(!hasFirebaseUser()||!firebase.firestore)return false;await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('profiles').doc(String(id)).delete();return true}catch(e){console.warn('RashiVibe cloud profile delete:',e);return false}}
async function cloudLoadProfiles(){try{if(!hasFirebaseUser()||!firebase.firestore)return [];const snap=await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection('profiles').get();const remote=snap.docs.map(d=>clean({id:d.id,...d.data()}));if(remote.length){let a=getProfiles();for(const p of remote){const i=a.findIndex(x=>x.id===p.id);if(i>=0)a[i]=p;else a.push(p)}setProfiles(a);updateHeader()}return remote}catch(e){console.warn('RashiVibe cloud load:',e);return []}}
async function saveAccountMeta(meta={}){try{if(!hasFirebaseUser()||!firebase.firestore)return false;const u=firebase.auth().currentUser;const data={name:String(meta.name??u.displayName??'').trim(),email:String(meta.email??u.email??'').trim(),phone:String(meta.phone??u.phoneNumber??'').trim(),updatedAt:now()};await firebase.firestore().collection('users').doc(u.uid).set(data,{merge:true});return data}catch(e){console.warn('RashiVibe account save:',e);return false}}
async function loadAccountMeta(){try{if(!hasFirebaseUser()||!firebase.firestore)return null;const u=firebase.auth().currentUser;const doc=await firebase.firestore().collection('users').doc(u.uid).get();const d=doc.exists?doc.data():{};return {uid:u.uid,name:d.name||u.displayName||'',email:d.email||u.email||'',phone:d.phone||u.phoneNumber||'',verified:true}}catch(e){console.warn('RashiVibe account load:',e);return null}}
async function syncSessionFromFirebase(){if(!hasFirebaseUser())return null;const u=firebase.auth().currentUser;const meta=await loadAccountMeta();const s={uid:u.uid,name:meta?.name||u.displayName||'',email:meta?.email||u.email||'',phone:meta?.phone||u.phoneNumber||'',verified:true,provider:(u.providerData?.[0]?.providerId||''),loginAt:now()};setSession(s);return s}
async function deleteCurrentAccount(){if(!hasFirebaseUser())throw new Error('ACCOUNT_NOT_SIGNED_IN');const u=firebase.auth().currentUser;try{if(firebase.firestore){const ref=firebase.firestore().collection('users').doc(u.uid);const snap=await ref.collection('profiles').get();if(!snap.empty){const batch=firebase.firestore().batch();snap.docs.forEach(d=>batch.delete(d.ref));await batch.commit()}await ref.delete()}}catch(e){console.warn('Cloud cleanup before account delete:',e)}await u.delete();clearLocalAccountData();return true}

window.RVAccount={getProfiles,getActiveProfile,getActiveId,setActiveProfile,saveProfile,deleteProfile,getSession,setSession,fill,read,cloudSaveProfile,cloudDeleteProfile,cloudLoadProfiles,clean,refreshHeader:updateHeader,clearLocalAccountData,attachLocationFields,resolveTypedPlace,geocodePlace,reversePlace,saveAccountMeta,loadAccountMeta,syncSessionFromFirebase,deleteCurrentAccount,escapeHTML};
document.addEventListener('DOMContentLoaded',()=>{updateHeader();fillPageFromActive();populateMatchingSelectors();
 // Pages that did not already have complete reverse-location handling.
 if($('pfPlace'))attachLocationFields('pf',{autocomplete:true,reverse:true});
 if($('mbPlace'))attachLocationFields('mb',{autocomplete:false,reverse:true});
 if($('muPlace'))attachLocationFields('mu',{autocomplete:false,reverse:true});
});
})();
