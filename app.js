let client={}, selected={}, receiptData='';
const $=id=>document.getElementById(id);
function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');scrollTo(0,0); if(id==='admin') renderOrders();}
function startScan(){
 const name=$('name').value.trim(), phone=$('phone').value.trim(), year=+$('year').value, month=+$('month').value, day=+$('day').value, gender=$('gender').value;
 if(!name||!phone||!year||!month||!day||!gender){alert('Бүх мэдээллээ бөглөнө үү');return}
 client={name,phone,year,month,day,gender}; go('loading');
 let p=0, step=0; const items=[...document.querySelectorAll('#scanText li')];
 const timer=setInterval(()=>{p+=Math.floor(Math.random()*7)+4; if(p>100)p=100; $('bar').style.width=p+'%'; $('percent').textContent=p+'%'; items.forEach(x=>x.classList.remove('on')); items[Math.min(step,items.length-1)].classList.add('on'); if(p>18)step=1;if(p>38)step=2;if(p>58)step=3;if(p>78)step=4; if(p>=100){clearInterval(timer); setTimeout(showResult,900)}},420)
}
function seed(){return (client.year*7+client.month*31+client.day*13+client.name.length*9)%100}
function showResult(){
 const n=seed(); const money=88+(n%10), luck=80+(n%13); $('resultName').textContent=client.name+' таны шинжилгээ'; $('s1').textContent=money+'%'; $('s3').textContent=luck+'%'; $('payNote').textContent=client.name+' '+client.phone; go('result');
}
function selectPackage(name,price){selected={name,price}; $('payTitle').textContent=name; $('payAmount').textContent=price.toLocaleString('mn-MN')+'₮'; $('payNote').textContent=(client.name||'Нэр')+' '+(client.phone||'утас'); go('payment')}
function previewReceipt(input){const f=input.files[0]; if(!f)return; const r=new FileReader(); r.onload=e=>{receiptData=e.target.result; $('receiptPrev').src=receiptData; $('receiptPrev').style.display='block'}; r.readAsDataURL(f)}
function submitOrder(){if(!client.name){alert('Эхлээд шинжилгээ бөглөнө үү');return} if(!selected.name){alert('Багц сонгоно уу');return} if(!receiptData){alert('Баримтын зураг оруулна уу');return} const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); const order={id:Date.now(),date:new Date().toLocaleString('mn-MN'),status:'Шинэ',client,package:selected,receipt:receiptData,result:{money:$('s1').textContent,debt:'Илэрсэн',luck:$('s3').textContent}}; orders.unshift(order); localStorage.setItem('tm_orders',JSON.stringify(orders)); go('thanks')}
function openAdmin(){const pass=prompt('Админ нууц үг'); if(pass==='9999')go('admin'); else if(pass) alert('Нууц үг буруу')}
function renderOrders(){const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); $('orders').innerHTML=orders.length?orders.map(o=>`<div class="order"><div><h3>${o.client.name} — ${o.package.name}</h3><p>Утас: <b>${o.client.phone}</b><br>Төрсөн: ${o.client.year}.${o.client.month}.${o.client.day} / ${o.client.gender}<br>Үнэ: ${Number(o.package.price).toLocaleString('mn-MN')}₮<br>Огноо: ${o.date}<br>Үр дүн: Мөнгө ${o.result.money}, Өрийн блок ${o.result.debt}, Хишиг ${o.result.luck}</p><span class="status">${o.status}</span><div class="actions"><button class="mini" onclick="setStatus(${o.id},'Баталгаажсан')">Баталгаажсан</button><button class="mini" onclick="setStatus(${o.id},'Тайлан илгээсэн')">Илгээсэн</button><button class="mini" onclick="makeReport(${o.id})">Тайлан текст</button><button class="mini" onclick="deleteOrder(${o.id})">Устгах</button></div></div><img src="${o.receipt}" alt="barimt"></div>`).join(''):'<div class="card"><p>Одоогоор захиалга алга.</p></div>'}
function setStatus(id,status){const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); const o=orders.find(x=>x.id===id); if(o)o.status=status; localStorage.setItem('tm_orders',JSON.stringify(orders)); renderOrders()}
function deleteOrder(id){if(!confirm('Устгах уу?'))return; let orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); orders=orders.filter(x=>x.id!==id); localStorage.setItem('tm_orders',JSON.stringify(orders)); renderOrders()}
function makeReport(id){const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); const o=orders.find(x=>x.id===id); if(!o)return; const text=`Амар амгаланг айлтгая.\n\n${o.client.name} таны санхүүгийн ерөнхий шинжилгээнд мөнгөний урсгал ${o.result.money}, хишгийн сав ${o.result.luck} гэж гарч, өр зээлийн блок илэрсэн төлөв харагдлаа. Энэ нь мөнгө олох боломж байхгүй гэсэн үг биш. Харин орлого орсон ч хуримтлал болохоос өмнө гэнэтийн зардал, хуучин өр, бусдын хэрэгцээ, буруу цагийн шийдвэр рүү урсах хандлагыг илтгэнэ.\n\nОйрын үед өндөр дүнтэй зээл, батлан даалт, эрсдэлтэй хөрөнгө оруулалтад яарахгүй байх нь зөв. Орлого орсон өдөртөө 3 хэсэгт хувааж, өр дарах, хадгалах, хэрэглээ гэж тусгаарлах хэрэгтэй. 21 хоногийн турш орлого зарлагаа бичиж, өглөө бүр мөнгө тогтох сав нээгдэж байна гэж сэтгэлээ тогтоон залбирах нь өлзийтэй.\n\nТайлангийн багц: ${o.package.name}`; navigator.clipboard?.writeText(text); alert('Тайлангийн текст clipboard-д хууллаа. Messenger/SMS рүү paste хийгээд явуулна.')}
function exportOrders(){const data=localStorage.getItem('tm_orders')||'[]'; const blob=new Blob([data],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='tenger-melmii-orders.json'; a.click()}

function burstCoin(e){
  const coin=e.currentTarget;
  const r=coin.getBoundingClientRect();
  const cx=r.left+r.width/2, cy=r.top+r.height/2;
  coin.classList.add('explode');

  const flash=document.createElement('i');
  flash.className='flash-burst';
  flash.style.left=(cx-9)+'px';
  flash.style.top=(cy-9)+'px';
  document.body.appendChild(flash);
  setTimeout(()=>flash.remove(),600);

  for(let i=0;i<36;i++){
    const s=document.createElement('i');
    s.className='spark';
    const a=(Math.PI*2*i/36)+(Math.random()*.45);
    const d=70+Math.random()*140;
    s.style.left=cx+'px'; s.style.top=cy+'px';
    s.style.setProperty('--x',Math.cos(a)*d+'px');
    s.style.setProperty('--y',Math.sin(a)*d+'px');
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),900);
  }

  for(let i=0;i<14;i++){
    const piece=document.createElement('i');
    piece.className='coin-piece';
    piece.textContent='₮';
    const a=(Math.PI*2*i/14)+(Math.random()*.7);
    const d=80+Math.random()*170;
    piece.style.left=(cx-11)+'px'; piece.style.top=(cy-11)+'px';
    piece.style.setProperty('--x',Math.cos(a)*d+'px');
    piece.style.setProperty('--y',Math.sin(a)*d+'px');
    piece.style.setProperty('--rot',(Math.random()*720-360)+'deg');
    document.body.appendChild(piece);
    setTimeout(()=>piece.remove(),1050);
  }

  if(navigator.vibrate) navigator.vibrate(45);
  setTimeout(()=>coin.classList.remove('explode'),760);
}

if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
