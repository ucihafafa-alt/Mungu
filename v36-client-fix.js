
/* TM v36 REAL FIX — one bank grid, 2 visible digits + 2 hidden, bigger zodiac */
(function(){
  const VERSION='v36';
  const ACCOUNT='5680034540';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  let applying=false;

  function addStyle(){
    if($('#tm-v36-style')) return;
    const st=document.createElement('style');
    st.id='tm-v36-style';
    st.textContent=`
:root{--tm36-gold:#ffe67d;--tm36-gold2:#fff4b5;--tm36-dark:#1a0204;--tm36-red:#5b0708}
.tm36-version{font-size:0!important}.tm36-version:after{content:'v36';font-size:10px!important;color:rgba(255,230,150,.70)!important}
/* Давхар гарсан доод банкны хэсгийг бүрэн нуух */
.tm36-hide-duplicate-bank,.bank-options-v34,.bank-options-v35{display:none!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:0!important}
/* Үндсэн банкны grid: дээр байгаа логоуудыг ажиллуулж, нэг л хэсэг үлдээнэ */
.tm36-bank-main{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;margin:16px auto 22px!important;max-width:620px!important;padding:0!important}
.tm36-bank-main>*{min-height:86px!important;border-radius:18px!important;background:rgba(255,255,255,.98)!important;border:1px solid rgba(255,224,116,.50)!important;box-shadow:0 10px 24px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.55)!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;overflow:hidden!important;position:relative!important;padding:8px!important}
.tm36-bank-main>*:after{content:'товшоод данс хуулна';position:absolute;left:0;right:0;bottom:2px;text-align:center;font-size:9px;font-weight:800;color:rgba(90,7,8,.55);opacity:0;transition:.18s}
.tm36-bank-main>*:active,.tm36-bank-main>*.tm36-bank-selected{transform:scale(.985)!important;box-shadow:0 0 0 3px rgba(255,230,125,.35),0 0 28px rgba(255,213,80,.36)!important}
.tm36-bank-main>*.tm36-bank-selected:after{opacity:1!important}
.tm36-bank-main img{display:block!important;width:auto!important;height:auto!important;max-width:88%!important;max-height:60px!important;object-fit:contain!important;object-position:center!important;margin:auto!important;border-radius:0!important;background:transparent!important;transform:none!important;filter:none!important}
.tm36-copy-flash{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:999999;background:linear-gradient(90deg,#ffdf6d,#fff0a8,#ffdf6d);color:#2a0704;font-weight:950;border-radius:999px;padding:14px 24px;box-shadow:0 12px 34px rgba(0,0,0,.35);font-size:16px;animation:tm36fade 1.4s ease forwards}@keyframes tm36fade{0%{opacity:0;transform:translate(-50%,16px)}15%,75%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-8px)}}
/* Эхний 2 тоо тод, сүүлийн 2 нь бүр нуугдана */
.tm36-code-row{display:flex!important;justify-content:center!important;align-items:center!important;gap:12px!important;margin:22px auto!important;flex-wrap:nowrap!important}
.tm36-code-row>*{width:66px!important;height:76px!important;min-width:66px!important;border-radius:18px!important;display:grid!important;place-items:center!important;font-family:Georgia,'Times New Roman',serif!important;font-size:44px!important;line-height:1!important;font-weight:950!important;color:var(--tm36-gold)!important;background:linear-gradient(180deg,rgba(255,246,184,.30),rgba(82,12,5,.60)),radial-gradient(circle at 50% 34%,rgba(255,231,125,.42),rgba(80,9,7,.76))!important;border:1px solid rgba(255,224,116,.58)!important;box-shadow:inset 0 0 24px rgba(255,224,116,.22),0 12px 28px rgba(0,0,0,.40)!important;text-shadow:0 0 11px rgba(255,231,125,.78),0 4px 12px rgba(0,0,0,.88)!important;opacity:1!important;filter:none!important;overflow:hidden!important}
.tm36-code-row>.tm36-locked{color:transparent!important;filter:blur(10px) brightness(.34)!important;opacity:.22!important;transform:scale(.90)!important;text-shadow:0 0 28px rgba(255,231,125,.80)!important;user-select:none!important;pointer-events:none!important;background:radial-gradient(circle,rgba(255,226,96,.26),rgba(72,7,7,.68))!important}
.tm36-code-row>.tm36-locked:before{content:'✦';color:rgba(255,231,125,.20)!important;font-size:40px!important;filter:blur(5px)!important}
.tm36-scroll-card{position:relative!important;overflow:hidden!important;background:linear-gradient(rgba(75,8,7,.04),rgba(25,3,4,.30)),url('ancient-scroll-code.jpg?v=36') center/cover no-repeat!important;border:1px solid rgba(255,224,116,.50)!important;border-radius:34px!important;box-shadow:0 24px 76px rgba(0,0,0,.45),inset 0 0 44px rgba(255,214,96,.17)!important}
.tm36-scroll-card h1,.tm36-scroll-card h2,.tm36-scroll-card .gold{color:var(--tm36-gold)!important;text-shadow:0 4px 18px rgba(0,0,0,.78)!important}.tm36-scroll-card p,.tm36-scroll-card .sub{color:#fff5d7!important;text-shadow:0 2px 10px #000!important}
/* Ордын зураг томруулах, цагаан захтай жижиг icon-ыг crop хийж том харагдуулах */
.tm36-zodiac-wrap{width:230px!important;height:230px!important;margin:20px auto 16px!important;border-radius:50%!important;display:grid!important;place-items:center!important;overflow:hidden!important;background:radial-gradient(circle at 38% 24%,#fff6b4 0 8%,#ffc840 28%,#bd1625 64%,#310408 100%)!important;border:1px solid rgba(255,224,116,.50)!important;box-shadow:inset 0 12px 26px rgba(255,255,255,.24),inset 0 -18px 28px rgba(0,0,0,.38),0 0 48px rgba(255,231,125,.43)!important}
.tm36-zodiac-img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:center!important;transform:scale(1.78)!important;border-radius:50%!important;background:transparent!important;box-shadow:none!important;filter:saturate(1.18) contrast(1.05)!important}
.zodiacFigure,.zodiacCoin{width:232px!important;height:232px!important;min-height:232px!important;margin:22px auto 16px!important;border-radius:50%!important;background:radial-gradient(circle at 38% 24%,#fff6b4 0 8%,#ffc840 28%,#bd1625 64%,#310408 100%)!important;border:1px solid rgba(255,224,116,.50)!important;box-shadow:inset 0 12px 26px rgba(255,255,255,.24),inset 0 -18px 28px rgba(0,0,0,.38),0 0 48px rgba(255,231,125,.43)!important;overflow:hidden!important}
#zodiacSymbol,.zodiacFigure .symbol{width:210px!important;height:210px!important;display:grid!important;place-items:center!important;font-size:112px!important;line-height:1!important;color:#fff4b5!important;background:transparent!important;text-shadow:0 5px 16px rgba(0,0,0,.58)!important;transform:none!important}
.coinMiniSign{font-size:86px!important}.coinMiniText{font-size:17px!important;color:#fff2b0!important;text-shadow:0 2px 10px #000!important}
/* лууны дүрс давхардах, хэт жижигдэхийг зөөлрүүлэх */
.videoBox img.heroDragon,.heroDragon{object-fit:contain!important;object-position:center!important;transform-origin:center bottom!important;filter:saturate(1.12) brightness(1.05) drop-shadow(0 0 20px rgba(255,224,112,.35))!important;animation:tm36DragonBreath 4.7s ease-in-out infinite!important}@keyframes tm36DragonBreath{0%,100%{transform:scale(1) translateY(0)}45%{transform:scale(1.045) translateY(-6px)}70%{transform:scale(1.018) translateY(3px)}}
@media(max-width:520px){.tm36-bank-main{gap:10px!important}.tm36-bank-main>*{min-height:82px!important}.tm36-bank-main img{max-height:56px!important}.tm36-code-row>*{width:56px!important;height:66px!important;min-width:56px!important;font-size:38px!important}.tm36-zodiac-wrap,.zodiacFigure,.zodiacCoin{width:220px!important;height:220px!important;min-height:220px!important}#zodiacSymbol,.zodiacFigure .symbol{width:202px!important;height:202px!important;font-size:104px!important}.tm36-zodiac-img{transform:scale(1.86)!important}}
`;
    document.head.appendChild(st);
  }

  function toast(msg){
    try{navigator.clipboard?.writeText(ACCOUNT);}catch(e){}
    const old=$('.tm36-copy-flash'); if(old) old.remove();
    const t=document.createElement('div'); t.className='tm36-copy-flash'; t.textContent=msg||('Данс хууллаа — '+ACCOUNT); document.body.appendChild(t);
    setTimeout(()=>t.remove(),1500);
    if(navigator.vibrate) navigator.vibrate(35);
  }

  function updateVersion(){
    $$('body *').forEach(el=>{
      if(el.children.length===0 && /^\s*v\d+\s*$/i.test(el.textContent||'')) { el.textContent=VERSION; el.classList.add('tm36-version'); }
    });
  }

  function bankLikeGrid(el){
    if(!el || el.classList?.contains('tm36-hide-duplicate-bank')) return false;
    const imgs=$$('img',el).filter(img=>!img.className.includes('hero') && !img.className.includes('zodiac'));
    const text=(el.textContent||'').toLowerCase();
    return imgs.length>=4 && /(банк|bank|tdb|хас|хаан|голомт|данс)/i.test(text + ' ' + imgs.map(i=>i.alt||i.src).join(' '));
  }
  function findBankGrid(){
    const named=$('.safeBanks,.bankApps,.bank-list,.banks-safe,.payment-banks,.bank-grid');
    if(named && bankLikeGrid(named)) return named;
    const grids=$$('div,section').filter(bankLikeGrid);
    if(!grids.length) return null;
    // choose the grid closest to the account/copy area and with most images
    grids.sort((a,b)=>$$('img',b).length-$$('img',a).length);
    return grids[0];
  }
  function fixBanks(){
    const main=findBankGrid();
    if(main){
      main.classList.add('tm36-bank-main');
      main.classList.remove('tm36-hide-duplicate-bank');
      const cards=Array.from(main.children).filter(ch=>ch.querySelector?.('img') || /банк|bank|tdb/i.test(ch.textContent||''));
      cards.forEach(card=>{
        card.onclick=function(ev){ev.preventDefault();ev.stopPropagation();cards.forEach(c=>c.classList.remove('tm36-bank-selected'));card.classList.add('tm36-bank-selected');toast();return false;};
        card.setAttribute('role','button');
        card.setAttribute('tabindex','0');
      });
    }
    // hide generated duplicate grids below; keep only the first/main bank logo grid
    $$('.bank-options-v34,.bank-options-v35,#bankOptions,.bank-options-v36').forEach(el=>{
      if(el!==main) el.classList.add('tm36-hide-duplicate-bank');
    });
    $$('button,div,a').forEach(el=>{
      const tx=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(/Данс\s*хуулах/i.test(tx) || tx.includes(ACCOUNT)){
        if(!el.dataset.tm36Copy){
          el.dataset.tm36Copy='1';
          el.addEventListener('click',()=>toast(),true);
        }
      }
    });
  }

  function codeOfContainer(box){
    const kids=Array.from(box.children).filter(ch=>ch.offsetParent!==null || (ch.textContent||'').trim());
    if(kids.length<4 || kids.length>6) return null;
    const vals=kids.slice(0,4).map(ch=>(ch.dataset.real || ch.textContent || '').trim().replace(/[^0-9]/g,''));
    if(vals.filter(Boolean).length>=2 && vals.every(v=>v==='' || /^\d$/.test(v))) return vals.map((v,i)=>v || (i>1?'9':'0')).join('').slice(0,4);
    return null;
  }
  function findDigitRows(){
    const rows=new Set();
    $$('.codePreview,.openCodeDigits,.moneyCodePreview,.unlockDigits,.coins,.digits,#codePreview,#openCodeDigits').forEach(x=>rows.add(x));
    $$('div,ul,section').forEach(el=>{ if(codeOfContainer(el)) rows.add(el); });
    return Array.from(rows).filter(el=>codeOfContainer(el));
  }
  function fixDigits(){
    findDigitRows().forEach(row=>{
      const code=codeOfContainer(row);
      if(!code) return;
      row.classList.add('tm36-code-row');
      Array.from(row.children).slice(0,4).forEach((ch,i)=>{
        ch.dataset.real=code[i];
        ch.classList.toggle('tm36-locked',i>1);
        if(i<2) ch.textContent=code[i];
        else ch.textContent='';
      });
      const parent=row.closest('.card,.openCodeCard,.lockCard,.revealCard,.result-card,section') || row.parentElement;
      if(parent) parent.classList.add('tm36-scroll-card');
    });
  }

  function isBankImg(img){
    const s=((img.src||'')+' '+(img.alt||'')+' '+(img.className||'')).toLowerCase();
    return /(bank|банк|tdb|khan|golomt|capitron|credit|хас|төрийн|m.?bank|богд|payon|sono|ari)/i.test(s);
  }
  function fixZodiac(){
    // native classes
    $$('.zodiacFigure,.zodiacCoin,#zodiacSymbol').forEach(el=>{
      if(el.tagName==='IMG') el.classList.add('tm36-zodiac-img');
    });
    // Find the small zodiac image around орд text, wrap it and crop/enlarge
    $$('img').forEach(img=>{
      if(isBankImg(img) || img.classList.contains('thumb') || img.classList.contains('heroDragon')) return;
      const zone=img.closest('section,article,.screen,.card,div');
      const text=(zone?.textContent||'');
      const src=(img.src||'')+' '+(img.alt||'');
      if(/орд|Заяагдмал|Хумх|Хонь|Үхэр|Ихэр|Мэлхий|Арслан|Охин|Жинлүүр|Хилэнц|Нум|Матар|Загас/i.test(text+src)){
        if(!img.closest('.tm36-zodiac-wrap')){
          const w=document.createElement('div'); w.className='tm36-zodiac-wrap';
          img.parentNode.insertBefore(w,img); w.appendChild(img);
        }
        img.classList.add('tm36-zodiac-img');
      }
    });
  }

  function unregisterOldCaches(){
    try{caches?.keys?.().then(keys=>keys.forEach(k=>caches.delete(k)));}catch(e){}
  }
  function apply(){
    if(applying) return; applying=true;
    try{addStyle(); updateVersion(); fixBanks(); fixDigits(); fixZodiac(); unregisterOldCaches();}
    finally{applying=false;}
  }
  function wrap(name){
    const fn=window[name]; if(typeof fn==='function' && !fn.__tm36){
      const w=function(){const r=fn.apply(this,arguments);setTimeout(apply,20);setTimeout(apply,250);setTimeout(apply,900);return r}; w.__tm36=true; window[name]=w;
    }
  }
  function boot(){
    apply(); ['go','showResult','startScan','beginScan','selectPackage','choosePackage','renderBankOptions'].forEach(wrap);
    let n=0; const t=setInterval(()=>{apply(); if(++n>12) clearInterval(t);},700);
    try{new MutationObserver(()=>apply()).observe(document.body,{childList:true,subtree:true});}catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  window.addEventListener('load',()=>setTimeout(apply,100));
})();
