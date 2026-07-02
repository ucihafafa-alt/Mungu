/* TM v35 client hotfix — non-destructive visual upgrade */
(function(){
  const VERSION='v35';
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  function injectStyle(){
    if($('#tm-v35-style')) return;
    const st=document.createElement('style'); st.id='tm-v35-style';
    st.textContent=`
:root{--tm35-gold:#ffe67d;--tm35-red:#5a0708;--tm35-dark:#190104}
.versionMark{font-size:0!important}.versionMark:after{content:'v35';font-size:10px;color:rgba(255,230,150,.60)}
/* эхний хоёр тоо тод, сүүлийн хоёр тоо blur */
.codePreview,.openCodeDigits,.tm-v35-digits,.coins{display:flex!important;justify-content:center!important;align-items:center!important;gap:12px!important;flex-wrap:nowrap!important;margin:20px auto!important}
.codePreview span,.openCodeDigits span,.tm-v35-digits span,.coins .coin{width:66px!important;height:76px!important;border-radius:18px!important;display:grid!important;place-items:center!important;font-family:Georgia,'Times New Roman',serif!important;font-size:44px!important;font-weight:950!important;color:var(--tm35-gold)!important;background:linear-gradient(180deg,rgba(255,244,181,.26),rgba(89,13,6,.60)),radial-gradient(circle at 50% 34%,rgba(255,231,125,.34),rgba(72,7,7,.76))!important;border:1px solid rgba(255,224,116,.52)!important;box-shadow:inset 0 0 22px rgba(255,224,116,.20),0 12px 28px rgba(0,0,0,.36)!important;text-shadow:0 0 10px rgba(255,231,125,.76),0 4px 11px rgba(0,0,0,.86)!important;filter:none!important;opacity:1!important}
.codePreview span:nth-child(n+3),.openCodeDigits span:nth-child(n+3),.tm-v35-digits span:nth-child(n+3),.coins .coin:nth-child(n+3),.coins .coin.locked{filter:blur(8px) brightness(.52)!important;opacity:.34!important;transform:scale(.92)!important;color:transparent!important;text-shadow:0 0 24px rgba(255,231,125,.82)!important;user-select:none!important;overflow:hidden!important}
.codePreview span:nth-child(n+3)::after,.openCodeDigits span:nth-child(n+3)::after,.tm-v35-digits span:nth-child(n+3)::after,.coins .coin:nth-child(n+3)::after,.coins .coin.locked::after{content:'✦'!important;font-size:38px!important;color:rgba(255,231,125,.30)!important;filter:blur(5px)!important}
.v35-scroll-code-card{position:relative!important;overflow:hidden!important;background:linear-gradient(rgba(70,8,8,.06),rgba(25,3,4,.28)),url('ancient-scroll-code.jpg?v=35') center/cover no-repeat!important;border:1px solid rgba(255,224,116,.48)!important;border-radius:34px!important;box-shadow:0 24px 72px rgba(0,0,0,.42),inset 0 0 40px rgba(255,214,96,.15)!important}
.v35-scroll-code-card h2,.v35-scroll-code-card .gold{color:var(--tm35-gold)!important;text-shadow:0 3px 16px rgba(0,0,0,.75)!important}.v35-scroll-code-card .sub,.v35-scroll-code-card p{color:#fff5d5!important;text-shadow:0 2px 10px #000!important}
/* орд жижиг харагдахыг засах */
.zodiacFigure{width:240px!important;height:240px!important;min-height:240px!important;margin:22px auto 18px!important;border-radius:50%!important;background:radial-gradient(circle at 35% 25%,rgba(255,244,181,.30),rgba(188,22,32,.46) 55%,rgba(45,3,7,.92))!important;border:1px solid rgba(255,224,116,.34)!important;box-shadow:inset 0 0 34px rgba(255,224,116,.14),0 0 44px rgba(255,224,116,.20)!important}
.zodiacFigure:before{opacity:.08!important}.zodiacFigure .symbol,#zodiacSymbol{width:190px!important;height:190px!important;font-size:92px!important;border-radius:50%!important;display:grid!important;place-items:center!important;color:#fff7b6!important;background:radial-gradient(circle at 35% 25%,#fff6b5 0 10%,#ffcc3e 30%,#c51625 67%,#3d0509 100%)!important;box-shadow:inset 0 12px 24px rgba(255,255,255,.22),inset 0 -18px 26px rgba(0,0,0,.34),0 0 44px rgba(255,231,125,.42)!important;text-shadow:0 5px 14px rgba(0,0,0,.55)!important}
.zodiacCoin{width:188px!important;height:188px!important}.coinMiniSign{font-size:62px!important}.coinMiniText{font-size:16px!important;color:#fff2b0!important;text-shadow:0 2px 9px #000!important}
/* луу давхар/цагаан захтай харагдахыг багасгах */
.heroCard .videoBox{background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important}.videoBox img.heroDragon{object-fit:contain!important;transform-origin:center bottom!important;filter:saturate(1.12) brightness(1.04) drop-shadow(0 0 18px rgba(255,224,112,.32))!important;animation:tm35DragonBreath 4.6s ease-in-out infinite!important}.videoBox:after{background:linear-gradient(180deg,rgba(0,0,0,.02),rgba(29,2,7,.12) 48%,rgba(29,2,7,.62))!important}@keyframes tm35DragonBreath{0%,100%{transform:scale(1) translateY(0)}45%{transform:scale(1.045) translateY(-6px)}70%{transform:scale(1.018) translateY(3px)}}
/* банкны зурагтай төлбөрийн хэсэг */
.safeBanks,.bank-options-v35{display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:10px!important;margin:14px auto 18px!important}.bankApp.safe,.bank-card-v35{min-height:78px!important;border-radius:18px!important;border:1px solid rgba(255,224,116,.34)!important;background:rgba(46,4,5,.68)!important;box-shadow:inset 0 0 18px rgba(255,224,116,.10),0 12px 26px rgba(0,0,0,.26)!important;color:#fff3c1!important;font-weight:850!important}.bankApp.safe img,.bank-card-v35 img{width:44px!important;height:44px!important;object-fit:contain!important;border-radius:10px!important;background:rgba(255,255,255,.08)!important}
@media(max-width:520px){.codePreview span,.openCodeDigits span,.tm-v35-digits span,.coins .coin{width:56px!important;height:66px!important;font-size:38px!important}.zodiacFigure{width:218px!important;height:218px!important;min-height:218px!important}.zodiacFigure .symbol,#zodiacSymbol{width:176px!important;height:176px!important;font-size:84px!important}.safeBanks,.bank-options-v35{grid-template-columns:1fr 1fr!important;gap:8px!important}.bankApp.safe small{font-size:10.5px!important}}
`;
    document.head.appendChild(st);
  }
  function codeFromPage(){
    const c=window.client && (window.client.code||window.client.moneyCode); if(c) return String(c).padStart(4,'0').slice(0,4);
    const c1=$('#code1')?.textContent?.trim()||''; const c2=$('#code2')?.textContent?.trim()||'';
    if(/[0-9]/.test(c1+c2)) return (c1+c2+'••').slice(0,4);
    return '';
  }
  function renderCode(){
    const code=codeFromPage();
    $$('.codePreview,.openCodeDigits,.tm-v35-digits').forEach(box=>{
      const old=[...box.children].map(x=>x.textContent.trim()).join('');
      if(code && /[0-9]/.test(code)){
        const a=code.split('');
        box.innerHTML=a.map((d,i)=>`<span class="${i<2?'open':'locked'}">${i<2?d:'✦'}</span>`).join('');
      }else if(box.children.length===4){
        [...box.children].forEach((x,i)=>x.classList.toggle('locked',i>1));
      }
    });
    const coins=$('.coins');
    if(coins){
      coins.closest('.card,.lockCard,section,div')?.classList.add('v35-scroll-code-card');
      if(code && /[0-9]/.test(code)) coins.innerHTML=code.split('').map((d,i)=>`<div class="coin ${i>1?'locked':''}" ${i>1?'aria-hidden="true"':''}>${i<2?d:'✦'}</div>`).join('');
    }
  }
  const bankAssets=[
    ['khan','Хаан банк','bank-khan-icon.png?v=35'],['golomt','Голомт банк','bank-golomt-icon.png?v=35'],['tdb','ХХБ','bank-tdb-icon.png?v=35'],['capitron','Капитрон банк','bank-capitron-icon.png?v=35'],['credit','Кредит банк','bank-credit.png?v=35']
  ];
  function fixBanks(){
    const safe=$('.safeBanks');
    if(safe && !safe.dataset.v35){
      safe.dataset.v35='1';
      safe.innerHTML=bankAssets.map(b=>`<div class="bankApp safe"><span class="iconBox"><img src="${b[2]}" alt="${b[1]}"></span><small>${b[1]}</small></div>`).join('');
    }
    let pay=$('#pay,.pay,#payment,.payment');
    if(pay && !$('.bank-options-v35',pay)){
      const box=document.createElement('div');box.className='bank-options-v35';
      box.innerHTML=bankAssets.slice(0,4).map(b=>`<button type="button" class="bank-card-v35"><img src="${b[2]}" alt="${b[1]}"><span>${b[1]}</span></button>`).join('');
      const anchor=$('#payDesc,#payAmount,.copyLine',pay)||pay.firstElementChild||pay;
      anchor.insertAdjacentElement('afterend',box);
    }
  }
  function fixZodiac(){
    const z=$('#zodiacSymbol');
    if(z && !z.textContent.trim()) z.textContent='✦';
  }
  function apply(){injectStyle();renderCode();fixBanks();fixZodiac();}
  function wrap(name){
    const fn=window[name]; if(typeof fn==='function' && !fn.__tm35){
      const w=function(){const r=fn.apply(this,arguments);setTimeout(apply,30);setTimeout(apply,260);setTimeout(apply,900);return r}; w.__tm35=true; window[name]=w;
    }
  }
  function boot(){apply();['showResult','beginScan','choosePackage','selectPackage','go'].forEach(wrap);setTimeout(apply,300);setTimeout(apply,1200);}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
