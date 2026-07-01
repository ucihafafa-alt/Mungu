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
function seedFor(o){const c=o?.client||client;return (Number(c.year||1990)*7+Number(c.month||1)*31+Number(c.day||1)*13+String(c.name||'').length*9)%997}
function seed(){return seedFor({client})%100}
function pick(arr,n,offset=0){const out=[]; const base=(n+offset)%arr.length; for(let i=0;i<Math.min(6,arr.length);i++){out.push(arr[(base+i*7)%arr.length])} return out}
function showResult(){
 const n=seed(); const money=88+(n%10), luck=80+(n%13); $('resultName').textContent=client.name+' таны шинжилгээ'; $('s1').textContent=money+'%'; $('s3').textContent=luck+'%'; $('payNote').textContent=client.name+' '+client.phone; go('result');
}
function selectPackage(name,price){selected={name,price}; $('payTitle').textContent=name; $('payAmount').textContent=price.toLocaleString('mn-MN')+'₮'; $('payNote').textContent=(client.name||'Нэр')+' '+(client.phone||'утас'); go('payment')}
function previewReceipt(input){const f=input.files[0]; if(!f)return; const r=new FileReader(); r.onload=e=>{receiptData=e.target.result; $('receiptPrev').src=receiptData; $('receiptPrev').style.display='block'}; r.readAsDataURL(f)}
function submitOrder(){if(!client.name){alert('Эхлээд шинжилгээ бөглөнө үү');return} if(!selected.name){alert('Багц сонгоно уу');return} if(!receiptData){alert('Баримтын зураг оруулна уу');return} const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); const order={id:Date.now(),date:new Date().toLocaleString('mn-MN'),status:'Шинэ',client,package:selected,receipt:receiptData,result:{money:$('s1').textContent,debt:'Илэрсэн',luck:$('s3').textContent}}; orders.unshift(order); localStorage.setItem('tm_orders',JSON.stringify(orders)); go('thanks')}
function openAdmin(){const pass=prompt('Админ нууц үг'); if(pass==='9999')go('admin'); else if(pass) alert('Нууц үг буруу')}
function renderOrders(){const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); $('orders').innerHTML=orders.length?orders.map(o=>`<div class="order"><div><h3>${o.client.name} — ${o.package.name}</h3><p>Утас: <b>${o.client.phone}</b><br>Төрсөн: ${o.client.year}.${o.client.month}.${o.client.day} / ${o.client.gender}<br>Үнэ: ${Number(o.package.price).toLocaleString('mn-MN')}₮<br>Огноо: ${o.date}<br>Үр дүн: Мөнгө ${o.result.money}, Өрийн блок ${o.result.debt}, Хишиг ${o.result.luck}</p><span class="status">${o.status}</span><div class="actions"><button class="mini" onclick="setStatus(${o.id},'Баталгаажсан')">Баталгаажсан</button><button class="mini" onclick="openReportBuilder(${o.id})">Тайлан үүсгэх</button><button class="mini" onclick="setStatus(${o.id},'Тайлан илгээсэн')">Илгээсэн</button><button class="mini" onclick="deleteOrder(${o.id})">Устгах</button></div></div><img src="${o.receipt}" alt="barimt"></div>`).join(''):'<div class="card"><p>Одоогоор захиалга алга.</p></div>'}
function setStatus(id,status){const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); const o=orders.find(x=>x.id===id); if(o)o.status=status; localStorage.setItem('tm_orders',JSON.stringify(orders)); renderOrders()}
function deleteOrder(id){if(!confirm('Устгах уу?'))return; let orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); orders=orders.filter(x=>x.id!==id); localStorage.setItem('tm_orders',JSON.stringify(orders)); renderOrders()}
function exportOrders(){const data=localStorage.getItem('tm_orders')||'[]'; const blob=new Blob([data],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='tenger-melmii-orders.json'; a.click()}

const DB={
 debt:[
'Орлого олох боломж сул биш боловч орж ирсэн мөнгө олон чиглэлд хурдан хуваагдах хандлага ажиглагдана. Энэ үед шинэ өр үүсгэхээс илүү одоо байгаа урсгалаа тогтворжуулах нь чухал.',
'Жижиг боловч давтагддаг зарлагууд нийт санхүүгийн дарамтыг нэмэгдүүлэх төлөвтэй. Өр дарах төлөвлөгөөг сар бүрийн орлоготойгоо уялдуулах хэрэгтэй.',
'Бусдын хэрэгцээ, гэр бүлийн шаардлага, гэнэтийн тусламж таны мөнгөний саванд нөлөөлөх магадлалтай. Санхүүгийн хил хязгаараа тодорхой тогтоох нь өлзийтэй.',
'Санхүүгийн шийдвэрийг яаравчлан гаргах үед алдагдал нэмэгдэх эрсдэлтэй. Том худалдан авалт, батлан даалт, зээлд илүү нягт хандах шаардлагатай.',
'Өр төлөх бүрт шинэ зардал гардаг мэт мөчлөг ажиглагдаж байна. Энэ нь мөнгөний урсгалыг нэг дор төвлөрүүлэх дадал сул байгаатай холбоотой.',
'Орлого нэмэгдэх боломж байгаа ч хуримтлалын сав сул байвал үр дүн мэдрэгдэхгүй өнгөрнө. Орлого бүрээс бага ч гэсэн хадгалах үйлдлийг тогтмолжуулах хэрэгтэй.',
'Бусдад мөнгө зээлүүлэх, батлан даах, нэр дээрээ үүрэг авах асуудалд болгоомжтой байх үе харагдаж байна. Өөрийн өрөө нэн түрүүнд цэгцлэх нь зөв.',
'Хуучин өр, хоцорсон төлбөр, мартсан жижиг үүргүүд санхүүгийн сэтгэлзүйд дарамт өгч болзошгүй. Бүгдийг нэг жагсаалтад оруулах нь эхний алхам.',
'Гэнэтийн зарлага давамгайлах үе тул нөөц мөнгө үүсгэх хэрэгцээ өндөр байна. Хэдий бага дүнтэй ч тусдаа хадгалсан мөнгө хамгаалалт болно.',
'Орлогоосоо давсан хэрэглээ үүсэх магадлалтай. Хэрэгцээ, хүсэл хоёрыг салгаж үзэх нь өрийн дарамтыг бууруулна.',
'Санхүүгийн урсгалд бусдын үг, шахалт, сэтгэл хөдлөл нөлөөлөх хандлагатай. Мөнгөний шийдвэрийг тайван үед гаргах хэрэгтэй.',
'Өрийн дарамт тоон дүнгээс илүү эмх замбараагүй төлөвлөлтөөс үүсэх шинжтэй. Төлбөрүүдээ огноо, дүнгээр нь эрэмбэл.',
'Ойрын үед нэг том шийдвэр санхүүгийн урсгалыг өөрчилж болзошгүй. Яарахгүй, баримттай, тооцоотой ханд.',
'Мөнгө ордог ч тогтдоггүй мэдрэмж нь олон жижиг автомат зарлагаас үүсэж болно. Давтагддаг төлбөрүүдээ дахин шалга.',
'Таны мөнгөний блок бүрэн хаалт биш, харин сахилга, цагийн тохироо шаардсан саад байна. Тогтмол алхам хийвэл суларна.'
 ],
 money:[
'Орлого нэмэгдэх суваг ажил, үйлчилгээ, ур чадвараа мөнгөжүүлэх чиглэлээр илүү нээгдэх төлөвтэй.',
'Мөнгөний урсгалаа тогтворжуулахын тулд нэг том орлого хүлээхээс илүү жижиг тогтмол орлогын эх үүсвэр нэмэх нь тохиромжтой.',
'Худалдаа, харилцаа, зуучлал, үйлчилгээний шинжтэй ажил санхүүгийн боломжийг нэмэгдүүлэх хандлагатай.',
'Орлого орж ирэх үед шууд задардаг тул 3 савны арга хэрэглэ: өр, хэрэглээ, хадгаламж.',
'Хишгийн сав нээгдэх гол түлхүүр нь мөнгөө ил тод тооцоолох, бичих, үлдээх дадал байна.',
'Ойрын саруудад орлого нэмэх санаа гарч ирэх боловч эхний үр дүнг дахин хөрөнгөжүүлэх нь чухал.',
'Бусадтай хамтрах боломж байгаа ч мөнгөний нөхцөлөө эхнээс нь бичгээр тохирох хэрэгтэй.',
'Хадгаламж багаас эхлэхэд тохиромжтой. Бага дүн тогтмол байх нь их дүн тасалдахаас дээр.',
'Зарлагаа багасгах нь орлого нэмсэнтэй адил үр дүн авчрах үе байна.',
'Мөнгөний урсгал тань ажил хөдөлмөрөөр илүү нээгдэнэ. Аз хүлээхээс илүү хөдөлгөөн хийх нь үр дүнтэй.'
 ],
 practical:[
'Энэ долоо хоногт бүх өрөө нэр, дүн, хугацаа, хүүгээр нь нэг хүснэгтэд бич.',
'Орлого орсон өдөр 10 хувийг шууд хадгаламж эсвэл тусдаа дансанд шилжүүл.',
'Хамгийн өндөр хүүтэй өрөө эхэлж бууруулах төлөвлөгөө гарга.',
'Сүүлийн 30 хоногийн зарлагаа хоол, унаа, зээл, хүсэл, шаардлага гэж ангил.',
'Шинэ зээл авах шийдвэрийг 24 цаг хойшлуулж байж батал.',
'Нэг хэрэггүй сарын төлбөр, subscription эсвэл давтагддаг зарлагаа цуцал.',
'7 хоног бүрийн нэг өдөр санхүүгээ 20 минут шалгадаг тогтмол цагтай бол.',
'Өр дарах жижиг зорилго тавьж, эхний 7 хоногт хамгийн бага нэг төлбөрөө дуусга.',
'Бусдад мөнгө зээлүүлэхээс өмнө өөрийн сарын төсвөө эхэлж хар.',
'Орлого, зарлагаа утасны note дээр өдөр бүр хоёр мөрөөр тэмдэглэ.',
'Гэнэтийн зардлын жижиг сан нээж өдөр бүр бага дүн нэм.',
'Том худалдан авалтыг хүсэл үү, хэрэгцээ юу гэж өөрөөсөө асуу.',
'Нэмэлт орлогын нэг боломжийг энэ сард туршиж үз.',
'Бэлэн мөнгө, карт, зээлийн хэрэглээг тус тусад нь хяна.',
'Өрийн хугацаагаа календарь дээр сануулгатай тэмдэглэ.'
 ],
 ritual:[
'Түрийвчиндээ цэвэрхэн, бүтэн мөнгөн дэвсгэрт авч яв. Энэ нь мөнгөний сав хоосон биш байхыг бэлгэднэ.',
'Шөнө орой бэлэн мөнгө зээлүүлэх, шинэ өр үүсгэхээс аль болох зайлсхий. Уламжлалд энэ нь урсгалаа гадагшлуулахыг бэлгэддэг.',
'Түрийвчээ хэрэггүй баримт, хуучин тасалбар, урагдсан цаасаар дүүргэхгүй бай.',
'Орлого орсон өдөр мөнгөө эмхэлж, нэг чиглэлд байрлуулан хадгал.',
'Шинэ сар эхлэхэд санхүүгийн 3 зорилгоо цаасан дээр бичиж хадгал.',
'Бүтэн сар гарах орой ирэх сарын өр дарах зорилгоо тайван бодож тэмдэглэ.',
'Эвдэрсэн, урагдсан түрийвчийг удаан хэрэглэхгүй байхыг эрхэмлэ.',
'Бусдын мөнгийг өөрийн түрийвчинд удаан хадгалахгүй байхыг хичээ.',
'Өглөө гэрээс гарахдаа мөнгөний сав минь эмхтэй, орлого минь зөв урсана гэж дотроо төвлөр.',
'Лаврын навч эсвэл цэвэр цаасан дээр санхүүгийн нэг зорилгоо бичиж, түрийвчиндээ 7 хоног хадгал.',
'Даваа гарагийн өглөө түрийвчээ цэгцэлж, хэрэггүй цаасыг авч хая.',
'Мөнгө тоолохдоо бухимдалтай үед бус, тайван үед тоолдог дадал баримтал.',
'Өр дарах өдөр жижигхэн ч гэсэн талархлын үг хэлж, дараагийн алхмаа бич.',
'Харанхуй шөнө яаралтай биш бол бэлэн мөнгө зээлэх, зээлүүлэхийг хойшлуул.',
'Гэрийнхээ мөнгө, бичиг баримт хадгалдаг хэсгийг цэвэр, эмхтэй байлга.'
 ],
 conclusion:[
'Таны санхүүгийн урсгал бүрэн хаагдсан бус, харин тогтвортой байдал шаардсан үе дээр байна. Өр зээлээс гарах гол түлхүүр нь орлого нэмэхээс гадна мөнгө тогтоох дадлаа өөрчлөхөд оршино.',
'Ойрын хугацаанд том өөрчлөлтөөс илүү жижиг тогтмол алхам үр дүнтэй. Өрөө эрэмбэлж, зарлагаа хянаж, бэлгэдлийн зөвлөмжөө сэтгэл төвлөрүүлэх дадал болгон хэрэгжүүл.',
'Мөнгөний сав тань дахин нээгдэх боломжтой. Гол нь бусдын дарамт, яаравчилсан шийдвэр, төлөвлөгөөгүй зарлагыг багасгах хэрэгтэй.',
'Энэ тайлан таныг айлгах бус санхүүгийн замаа эмхлэхэд чиглэнэ. 21 хоногийн турш зөвлөмжөө давтан хийвэл сэтгэл, дадал хоёр зэрэг тогтворжино.',
'Орлого нэмэгдэх суваг байна. Харин тэр урсгалыг хадгалж үлдэх савыг та өөрөө өдөр тутмын үйлдлээрээ бэхжүүлэх шаардлагатай.'
 ]
};
function buildReport(o){const n=seedFor(o); const debts=pick(DB.debt,n,1).slice(0,5); const money=pick(DB.money,n,2).slice(0,3); const practical=pick(DB.practical,n,3).slice(0,6); const ritual=pick(DB.ritual,n,4).slice(0,5); const conclusion=DB.conclusion[n%DB.conclusion.length]; const title=o.package.name; return {debts,money,practical,ritual,conclusion,title};}
function openReportBuilder(id){const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); const o=orders.find(x=>x.id===id); if(!o)return; const r=buildReport(o); const html=`<div class="modal-card"><button class="close" onclick="closeReport()">×</button><h2>Тайлан үүсгэх</h2><p><b>${o.client.name}</b> — ${o.package.name}</p><div class="builder-actions"><button class="gold" onclick="copyReport(${id})">Текст хуулах</button><button class="gold" onclick="downloadReportPDF(${id})">PDF татах</button><button class="gold" onclick="printReport(${id})">Хэвлэх</button><button class="ghost" onclick="setStatus(${id},'Тайлан бэлэн')">Тайлан бэлэн</button></div><div id="printArea">${reportHTML(o,r)}</div></div>`; $('reportModal').innerHTML=html; $('reportModal').style.display='grid';}
function closeReport(){ $('reportModal').style.display='none'; }
function li(arr){return arr.map(x=>`<li>${x}</li>`).join('')}
function reportHTML(o,r){return `<div class="tm-report"><section class="rpage cover"><div class="rbrand">◉ ТЭНГЭРИЙН МЭЛМИЙ</div><h1>${r.title}</h1><p class="rsub">Өр зээл ба мөнгөний урсгалын 3 нүүр тайлан</p><div class="rgrid"><div><span>Үйлчлүүлэгч</span><b>${o.client.name}</b></div><div><span>Төрсөн огноо</span><b>${o.client.year}.${o.client.month}.${o.client.day}</b></div><div><span>Мөнгөний урсгал</span><b>${o.result.money}</b></div><div><span>Өрийн блок</span><b>${o.result.debt}</b></div></div><p class="note">Энэхүү тайлан нь уламжлалт бэлгэдлийн шинжилгээ, хэрэгжүүлэх санхүүгийн дадлын зөвлөмжөөс бүрдэнэ.</p></section><section class="rpage"><h2>Гол шинжилгээ</h2><h3>Санхүүгийн урсгалд нөлөөлж буй хүчин зүйлс</h3><ul>${li(r.debts)}</ul><h3>Мөнгөний урсгалын боломж</h3><ul>${li(r.money)}</ul></section><section class="rpage"><h2>Хэрэгжүүлэх зөвлөмж</h2><h3>Бодит алхам</h3><ul>${li(r.practical)}</ul><h3>Уламжлалт бэлгэдлийн зөвлөмж</h3><ul>${li(r.ritual)}</ul><div class="rcon"><b>Дүгнэлт</b><p>${r.conclusion}</p></div><small>Бэлгэдлийн зөвлөмжүүд нь санхүүгийн үр дүнг баталгаатай амлахгүй, харин сэтгэл төвлөрүүлж дадал тогтооход туслах зорилготой.</small></section></div>`}
function textReport(o,r){return `ТЭНГЭРИЙН МЭЛМИЙ\n${r.title}\n\nҮйлчлүүлэгч: ${o.client.name}\nТөрсөн огноо: ${o.client.year}.${o.client.month}.${o.client.day}\nМөнгөний урсгал: ${o.result.money}\nӨрийн блок: ${o.result.debt}\n\nГОЛ ШИНЖИЛГЭЭ\n- ${r.debts.join('\n- ')}\n\nМӨНГӨНИЙ УРСГАЛЫН БОЛОМЖ\n- ${r.money.join('\n- ')}\n\nБОДИТ АЛХАМ\n- ${r.practical.join('\n- ')}\n\nУЛАМЖЛАЛТ БЭЛГЭДЛИЙН ЗӨВЛӨМЖ\n- ${r.ritual.join('\n- ')}\n\nДҮГНЭЛТ\n${r.conclusion}\n\nТайлбар: Бэлгэдлийн зөвлөмж нь санхүүгийн үр дүнг баталгаатай амлахгүй.`}
function copyReport(id){const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); const o=orders.find(x=>x.id===id); const r=buildReport(o); navigator.clipboard?.writeText(textReport(o,r)); alert('3 нүүрийн тайлангийн текст хууллаа. Messenger/SMS рүү paste хийгээрэй.');}
function printReport(id){const orders=JSON.parse(localStorage.getItem('tm_orders')||'[]'); const o=orders.find(x=>x.id===id); const r=buildReport(o); const w=window.open('','_blank'); w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Тайлан</title><style>${reportCSS()}</style></head><body>${reportHTML(o,r)}</body></html>`); w.document.close(); setTimeout(()=>w.print(),300)}
function reportCSS(){return `.tm-report{font-family:Arial,sans-serif;color:#1b2635}.rpage{width:210mm;min-height:297mm;padding:18mm;box-sizing:border-box;background:linear-gradient(135deg,#08111f,#10213a 55%,#07111f);color:#fff;page-break-after:always;overflow:hidden}.rbrand{color:#f7d37a;letter-spacing:2px;font-weight:800}.rpage h1{font-size:34px;color:#f7d37a}.rpage h2{color:#f7d37a;font-size:28px}.rpage h3{color:#d7e7ff}.rsub,.note{color:#d7e7ff;line-height:1.7}.rgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:28px 0}.rgrid div,.rcon{border:1px solid rgba(247,211,122,.35);border-radius:16px;padding:14px;background:rgba(255,255,255,.06)}.rgrid span{display:block;color:#9bb4d4;font-size:12px}.rgrid b{font-size:22px;color:#fff}li{margin:0 0 12px;line-height:1.65}ul{padding-left:20px}small{color:#aabbd5}`}

function burstCoin(e){
  const coin=e.currentTarget; const r=coin.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2; coin.classList.add('explode');
  const flash=document.createElement('i'); flash.className='flash-burst'; flash.style.left=(cx-9)+'px'; flash.style.top=(cy-9)+'px'; document.body.appendChild(flash); setTimeout(()=>flash.remove(),600);
  for(let i=0;i<36;i++){const s=document.createElement('i'); s.className='spark'; const a=(Math.PI*2*i/36)+(Math.random()*.45); const d=70+Math.random()*140; s.style.left=cx+'px'; s.style.top=cy+'px'; s.style.setProperty('--x',Math.cos(a)*d+'px'); s.style.setProperty('--y',Math.sin(a)*d+'px'); document.body.appendChild(s); setTimeout(()=>s.remove(),900)}
  for(let i=0;i<14;i++){const piece=document.createElement('i'); piece.className='coin-piece'; piece.textContent='₮'; const a=(Math.PI*2*i/14)+(Math.random()*.7); const d=80+Math.random()*170; piece.style.left=(cx-11)+'px'; piece.style.top=(cy-11)+'px'; piece.style.setProperty('--x',Math.cos(a)*d+'px'); piece.style.setProperty('--y',Math.sin(a)*d+'px'); piece.style.setProperty('--rot',(Math.random()*720-360)+'deg'); document.body.appendChild(piece); setTimeout(()=>piece.remove(),1050)}
  if(navigator.vibrate) navigator.vibrate(45); setTimeout(()=>coin.classList.remove('explode'),760);
}
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
