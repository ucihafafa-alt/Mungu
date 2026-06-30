let selected={name:'Өр зээлийн блокоос гарах',price:9900};
const $=id=>document.getElementById(id);
function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');scrollTo({top:0,behavior:'smooth'});if(id==='admin')renderOrders();}
function val(id){return ($(id)?.value||'').trim()}
function startScan(){
  if(!val('name')||!val('year')||!val('month')||!val('day')||!val('gender')||!val('phone')){alert('Мэдээллээ бүрэн оруулна уу');return}
  $('clientName').textContent=val('name')+' таны';
  go('scan');
  let p=0; const texts=['Мөнгөний урсгалын сувгийг шалгаж байна','Өрийн блок хайж байна','Хишгийн савыг хэмжиж байна','Баялгийн сувгийг шалгаж байна','Гол шалтгааныг илрүүлж байна'];
  const ids=['s1','s2','s3','s4','s5'];
  const t=setInterval(()=>{p+=Math.floor(Math.random()*8)+4;if(p>100)p=100;$('barFill').style.width=p+'%';$('percent').textContent=p+'%';const idx=Math.min(Math.floor(p/22),4);$('scanText').textContent=texts[idx];ids.forEach((x,i)=>$(x).classList.toggle('on',i<=idx));if(p>=100){clearInterval(t);setTimeout(makeResult,600)}},520);
}
function makeResult(){
  const y=Number(val('year'))||1990, m=Number(val('month'))||1, d=Number(val('day'))||1;
  const base=(y+m*7+d*11)%9;
  $('flowScore').textContent=(88+base)+'%';
  $('debtScore').textContent=(84+((base+3)%10))+'%';
  $('luckScore').textContent=(80+((base+5)%12))+'%';
  go('result');
}
function selectPackage(n,p){selected={name:n,price:p};$('pkgName').textContent=n;$('pkgPrice').textContent=p.toLocaleString('mn-MN')+'₮';$('payNote').textContent=(val('name')||'Нэр')+' '+(val('phone')||'утас');go('pay')}
function saveOrder(){
  const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]');
  orders.unshift({date:new Date().toLocaleString('mn-MN'),name:val('name'),phone:val('phone'),birth:`${val('year')}.${val('month')}.${val('day')}`,gender:val('gender'),pkg:selected.name,price:selected.price});
  localStorage.setItem('tm_orders',JSON.stringify(orders));go('done');
}
function renderOrders(){
  const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]');
  $('orders').innerHTML=orders.length?orders.map(o=>`<div class="order"><b>${o.pkg} — ${Number(o.price).toLocaleString('mn-MN')}₮</b><br>${o.name} / ${o.phone}<br>${o.birth} / ${o.gender}<br><small>${o.date}</small></div>`).join(''):'Захиалга алга байна.';
}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
