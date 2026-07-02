import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCptq_EpedA2ok205SoFMBjci5IcID7nWc',
  authDomain: 'mongo-block.firebaseapp.com',
  projectId: 'mongo-block',
  storageBucket: 'mongo-block.firebasestorage.app',
  messagingSenderId: '161463190344',
  appId: '1:161463190344:web:cc5e2672ded4900937e97d',
  measurementId: 'G-6074VCDK9W'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let client = {}, selected = {}, receiptData = '', ordersCache = [], adminStarted = false;
const $ = id => document.getElementById(id);
const moneyFmt = n => Number(n||0).toLocaleString('mn-MN') + '₮';
const safe = s => String(s ?? '').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));

const DB = {
 debt: [
  'Орлого олох боломж тань сул биш боловч орж ирсэн мөнгө олон жижиг зарлагаар сарних хандлага ажиглагдана.',
  'Өр төлбөрөө дарах бүрд шинэ санхүүгийн дарамт үүсэх мөчлөг давтагдах шинжтэй байна.',
  'Бусдад туслах нэрээр өөрийн санхүүгийн тогтвортой байдлыг алдагдуулах эрсдэл харагдана.',
  'Төлөвлөгөөгүй худалдан авалт болон яаравчилсан шийдвэр өрийн дарамтыг нэмэгдүүлэх боломжтой.',
  'Орлого нэмэгдэх ч хадгалж үлдэх тогтолцоо сул байвал үр дүн нь богино хугацаанд сарниж болзошгүй.',
  'Батлан даалт, хамтын өр, бусдын нэр дээрх санхүүгийн үүрэгт болгоомжтой хандах хэрэгтэй.',
  'Гэнэтийн зарлага ойр ойрхон гарах төлөвтэй тул нөөц сан үүсгэх шаардлага өндөр байна.',
  'Санхүүгийн шийдвэрийг сэтгэл хөдлөлөөр гаргах үед алдагдал дагуулах магадлал нэмэгдэнэ.',
  'Өрийн блок бүрэн хаалт биш, харин мөнгө тогтоох дадал сул байгааг илтгэнэ.',
  'Зарлагаа хянахгүй үед бага дүнтэй олон төлбөр нийлж том дарамт үүсгэх хандлагатай.',
  'Гэр бүлийн болон ойрын хүмүүсийн санхүүгийн асуудал танд давхар ачаалал болох шинжтэй.',
  'Шинэ зээл авахын өмнө хуучин өрийн бүтцээ цэгцлэх нь илүү зөв алхам байна.',
  'Өр дарах төлөвлөгөө тасалдвал мөнгөний урсгал дахин гацах магадлалтай.',
  'Ажил, орлогын боломж байгаа ч зарлагын сахилгагүй байдал үр дүнг багасгана.',
  'Таны санхүүгийн зураглалд мөнгө алдах эрсдэлээс илүү мөнгө барьж үлдэх асуудал давамгай байна.',
  'Богино хугацааны хэрэгцээ урт хугацааны төлөвлөгөөг давж гарах үед өр нэмэгдэх шинжтэй.',
  'Хэт олон жижиг үүрэг, төлбөрүүд санхүүгийн төвлөрлийг сулруулж байна.',
  'Өр зээлийн дарамт буурах боломж байгаа ч тогтмол хяналт шаардлагатай.',
  'Мөнгөний урсгал хаалттай бус, харин замбараагүй урсаж байгаа төлөв ажиглагдана.',
  'Санхүүгийн нэг шийдвэрийг олон удаа хойшлуулах нь дарамтыг томруулах магадлалтай.'
 ],
 money: [
  'Нэмэлт орлогын жижиг эх үүсвэрүүдийг тогтвортой болгож чадвал мөнгөний урсгал сайжрах боломжтой.',
  'Орлого өсөх боломж ойрын хугацаанд нээгдэх ч эхний ээлжинд хуримтлалын сахилга хэрэгтэй.',
  'Ур чадвар, туршлагаа мөнгө болгох тал дээр илүү идэвхтэй байх үе ирж байна.',
  'Тогтвортой орлогоо хамгаалж, эрсдэлтэй шинэ зүйлд яарахгүй байх нь ашигтай.',
  'Бизнес, худалдаа, үйлчилгээний чиглэлд жижиг боловч үргэлжлэх орлого нэмэгдэх боломжтой.',
  'Ойрын саруудад мөнгө орж ирэх суваг нэмэгдэх боловч зарлагын хяналт давхар шаардлагатай.',
  'Хадгаламж, хуримтлалын жижиг дүрэм тогтоовол мөнгө тогтох чадвар сайжирна.',
  'Хамтын ажил, түншлэлээс орлого гарах боломжтой ч гэрээ, тохиролцоог тодорхой болгох хэрэгтэй.',
  'Орлогоо нэг эх үүсвэрээс хэт хамааралтай байлгахгүй байх нь танд эерэг.',
  'Мөнгөний урсгал сайжрах гол түлхүүр нь шинэ орлогоос илүү одоо байгаа орлогыг зөв хуваарилах явдал.',
  'Сурсан чадвар, гарын ур, мэдлэгээ жижиг үйлчилгээ болгон хувиргах боломжтой.',
  'Цалин, орлого орсон өдөр шууд төлөвлөгөө гаргах нь мөнгө тогтоход тустай.',
  'Худалдаа, захиалга, онлайн орлого зэрэг богино эргэлттэй чиглэл танд илүү тохиромжтой байж болно.',
  'Орлогын шинэ суваг нээгдсэн ч үр ашгийг нь хадгалж үлдэх бүтэц хэрэгтэй.',
  'Санхүүгийн боломж хаагдаагүй, харин илүү тодорхой төлөвлөгөө шаардлагатай байна.'
 ],
 practical: [
  'Энэ долоо хоногт бүх өр, зээл, авлагаа нэг жагсаалтад бич.',
  'Хамгийн өндөр хүүтэй өрийг эхэлж бууруулах төлөвлөгөө гарга.',
  'Орлого орсон өдөр 10 хувийг тусдаа хуримтлалд шилжүүл.',
  'Сүүлийн 30 хоногийн зарлагаа хоол, унаа, зээл, илүү хэрэглээ гэж ангил.',
  'Том худалдан авалт хийхээс өмнө дор хаяж 24 цаг хүлээ.',
  'Сар бүрийн тогтмол төлбөрүүдээ нэг өдөрт багтаан шалгаж хэвш.',
  'Нэг хэрэггүй subscription, давтагддаг зардлаа цуцал.',
  'Өөрийн боломжоо давсан мөнгө зээлүүлэхээс татгалзах дүрэм тогтоо.',
  'Нэмэлт орлогын нэг жижиг боломжийг энэ сард турш.',
  'Өдөр бүрийн зарлагаа 7 хоног тасралтгүй тэмдэглэ.',
  'Өрөө дарахад зориулах хамгийн бага тогтмол дүнгээ тодорхойл.',
  'Цалин буухаас өмнө мөнгө хуваарилах төлөвлөгөөгөө бич.',
  'Гэнэтийн зардлын жижиг нөөц сан үүсгэж эхэл.',
  'Хэн нэгэнд батлан даалт хийхээс өмнө бичгээр эрсдэлээ тооц.',
  'Өдрийн төгсгөлд өнөөдөр зайлшгүй бус юунд мөнгө гаргаснаа тэмдэглэ.'
 ],
 ritual: [
  'Түрийвчиндээ цэвэрхэн, бүтэн мөнгөн дэвсгэртийг эмхтэй авч явахыг элбэг дэлбэгийн бэлгэдэл гэж үздэг.',
  'Шөнө орой бэлэн мөнгө зээлүүлэхээс аль болох зайлсхийхийг уламжлалд мөнгөний урсгалаа хамгаалах зан үйл гэж үздэг.',
  'Шөнө шинэ өр үүсгэхгүй байхыг санхүүгийн замаа тогтвортой байлгах бэлгэдэл хэмээн тайлбарладаг.',
  'Түрийвчээ хэрэггүй баримт, хуучин тасалбар, хог цаасаар дүүргэхгүй байхыг эрхэмлэ.',
  'Орлого орсон өдөр багахан мөнгийг тусад нь хадгалж, мөнгө тогтох савыг бэлгэдэн эхлүүл.',
  'Бүтэн сар гарах орой ирэх сарын санхүүгийн зорилгоо цаасан дээр бичиж хадгал.',
  'Лаврын навч эсвэл цэвэр цаасан дээр санхүүгийн 10 зорилгоо бичиж, түрийвчнийхээ тусдаа хэсэгт хадгалж болно.',
  'Эвдэрсэн, урагдсан, бохир түрийвчийг удаан хэрэглэхгүй байхыг мөнгөний сав цэвэр байхын бэлгэдэл гэж үздэг.',
  'Гэрийнхээ мөнгө, баримт хадгалдаг хэсгийг эмхэлж, хэрэггүй цаасыг гарга.',
  'Их мөнгө тоолох, санхүүгийн шийдвэр гаргахдаа бухимдсан эсвэл ядарсан үедээ хийхгүй байхыг хичээ.',
  'Шинэ сарын эхэнд түрийвчээ хоосон үлдээхгүй, бага ч гэсэн бэлэн мөнгөтэй байлга.',
  'Бусдын мөнгийг өөрийн түрийвчинд удаан хадгалахгүй байхыг санхүүгийн хил хязгаарын бэлгэдэл гэж үздэг.',
  'Харанхуй шөнө яаран мөнгө зээлэх, зээлүүлэхээс болгоомжилж, өглөө тодорхой шийдвэр гаргахыг эрхэмлэ.',
  'Орлого орсон өдөр мөнгөн дэвсгэртээ нэг чиглэлд эмхэлж байрлуул.',
  '7 хоногийн нэг өдөр мөнгөний зорилгоо уншиж, зарлагаа хянах жижиг зан үйл тогтоо.'
 ],
 conclusion: [
  'Таны санхүүгийн боломж хаагдсан бус, харин мөнгө тогтоох болон өрөө удирдах дадалд анхаарах үе байна. Төлөвлөгөө, сахилга бат, жижиг тогтмол алхмууд хамгийн их нөлөө үзүүлнэ.',
  'Өрийн дарамт буурах боломж бий. Гол нь шинэ өр үүсгэхээс өмнө одоо байгаа мөнгөний урсгалаа цэгцлэх хэрэгтэй.',
  'Мөнгөний урсгал сайжрах төлөв ажиглагдаж байгаа ч зарлагаа хяналтгүй орхивол үр дүн сулрах магадлалтай.',
  'Санхүүгийн хаалт нь байнгын зүйл биш. Та бодит алхам болон бэлгэдлийн зөвлөмжийг тогтмол хэрэгжүүлбэл дотоод сахилга, итгэл нэмэгдэнэ.',
  'Энэ тайлангийн гол санаа нь айдас төрүүлэх бус, санхүүгээ илүү цэгцтэй харахад туслах явдал юм.'
 ]
};

function go(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');scrollTo(0,0); if(id==='admin') startAdmin();}
window.go = go;

function startScan(){
 const name=$('name').value.trim(), phone=$('phone').value.trim(), year=+$('year').value, month=+$('month').value, day=+$('day').value, gender=$('gender').value;
 if(!name||!phone||!year||!month||!day||!gender){alert('Бүх мэдээллээ бөглөнө үү');return}
 client={name,phone,year,month,day,gender}; go('loading');
 let p=0, step=0; const items=[...document.querySelectorAll('#scanText li')];
 const timer=setInterval(()=>{p+=Math.floor(Math.random()*7)+4; if(p>100)p=100; $('bar').style.width=p+'%'; $('percent').textContent=p+'%'; items.forEach(x=>x.classList.remove('on')); items[Math.min(step,items.length-1)].classList.add('on'); if(p>18)step=1;if(p>38)step=2;if(p>58)step=3;if(p>78)step=4; if(p>=100){clearInterval(timer); setTimeout(showResult,900)}},420);
}
window.startScan=startScan;

function seedFor(o){const c=o?.client||client;return (Number(c.year||1990)*7+Number(c.month||1)*31+Number(c.day||1)*13+String(c.name||'').length*9)%997}
function showResult(){const n=seedFor({client})%100; const money=88+(n%10), luck=80+(n%13), code=moneyCode(client); $('resultName').textContent=client.name+' таны шинжилгээ'; $('s1').textContent=money+'%'; $('s3').textContent=luck+'%'; $('payNote').textContent=client.name+' '+client.phone; window.__TM_MONEY_CODE=code; renderOpenCode(code); go('result'); setTimeout(()=>renderOpenCode(code),80)}
function selectPackage(name,price){selected={name,price,bank:selected.bank||'khan'}; $('payTitle').textContent=name; $('payAmount').textContent=moneyFmt(price); $('payNote').textContent=(client.name||'Нэр')+' '+(client.phone||'утас'); renderBankOptions(); go('payment'); setTimeout(renderBankOptions,80)}
window.selectPackage=selectPackage;

function previewReceipt(input){const f=input.files[0]; if(!f)return; const r=new FileReader(); r.onload=e=>{receiptData=e.target.result; $('receiptPrev').src=receiptData; $('receiptPrev').style.display='block'}; r.readAsDataURL(f)}
window.previewReceipt=previewReceipt;

async function submitOrder(){
 if(!client.name){alert('Эхлээд шинжилгээ бөглөнө үү');return} if(!selected.name){alert('Багц сонгоно уу');return} if(!receiptData){alert('Баримтын зураг оруулна уу');return}
 const n=seedFor({client})%100;
 const order={
   date:new Date().toLocaleString('mn-MN'), createdAt: serverTimestamp(), updatedAt: Date.now(),
   status:'Шинэ захиалга', client, package:selected,
   result:{money:(88+(n%10))+'%', debt:'Илэрсэн', luck:(80+(n%13))+'%'},
   receipt: receiptData.slice(0,900000), reportId:''
 };
 try{await addDoc(collection(db,'orders'), order); go('thanks')}
 catch(e){alert('Firebase-д хадгалах үед алдаа гарлаа: '+e.message)}
}
window.submitOrder=submitOrder;

function openAdmin(){const pass=prompt('Админ нууц үг'); if(pass==='9999') go('admin'); else if(pass) alert('Нууц үг буруу')}
window.openAdmin=openAdmin;

function startAdmin(){
 if(adminStarted) return; adminStarted=true;
 const q=query(collection(db,'orders'), orderBy('updatedAt','desc'));
 onSnapshot(q, snap=>{ordersCache=snap.docs.map(d=>({docId:d.id,...d.data()})); renderOrders()}, err=>{ $('orders').innerHTML='<div class="order"><b>Firestore уншихад алдаа гарлаа</b><p>'+safe(err.message)+'</p></div>'});
}

function renderOrders(){
 const box=$('orders'); if(!ordersCache.length){box.innerHTML='<div class="order"><b>Захиалга алга</b><p>Хэрэглэгч төлбөрийн захиалга илгээхэд энд гарна.</p></div>'; return}
 box.innerHTML=ordersCache.map(o=>`<div class="order">
   <h3>${safe(o.client?.name)} — ${safe(o.package?.name)}</h3>
   <p><b>Утас:</b> ${safe(o.client?.phone)}</p>
   <p><b>Төрсөн:</b> ${safe(o.client?.year)}.${safe(o.client?.month)}.${safe(o.client?.day)} / ${safe(o.client?.gender)}</p>
   <p><b>Үнэ:</b> ${moneyFmt(o.package?.price)}</p>
   <p><b>Огноо:</b> ${safe(o.date||'')}</p>
   <p><b>Үр дүн:</b> Мөнгө ${safe(o.result?.money)}, Өрийн блок ${safe(o.result?.debt)}, Хишиг ${safe(o.result?.luck)}</p>
   <span class="badge">${safe(o.status||'Шинэ')}</span>
   <div class="actions">
    <button onclick="setStatus('${o.docId}','Баталгаажсан')">Баталгаажсан</button>
    <button onclick="openReportBuilder('${o.docId}')">Тайлан үүсгэх</button>
    <button onclick="deleteOrder('${o.docId}')">Устгах</button>
   </div>
   ${o.reportId?`<div class="linkbox"><b>Линк үүссэн</b><textarea readonly onclick="this.select()">${safe(makePublicLink(o.reportId))}</textarea><button class="mini" onclick="sendSmsLink('${o.docId}')">SMS линк илгээх</button></div>`:''}
   ${o.receipt?`<img class="thumb" src="${o.receipt}" alt="barimt"/>`:''}
  </div>`).join('');
}
async function setStatus(id,status){await updateDoc(doc(db,'orders',id),{status,updatedAt:Date.now()})}
window.setStatus=setStatus;
async function deleteOrder(id){if(confirm('Устгах уу?')) await deleteDoc(doc(db,'orders',id))}
window.deleteOrder=deleteOrder;

function pick(arr,base,count=5){let out=[]; for(let i=0;i<count;i++) out.push(arr[(base+i*7)%arr.length]); return out}
function buildReport(o){const n=seedFor(o); const pack=o.package?.name||'Тайлан'; return {title:pack, debts:pick(DB.debt,n, pack.includes('Өр')?6:4), money:pick(DB.money,n+3, pack.includes('Мөнгө')?6:4), practical:pick(DB.practical,n+5,6), ritual:pick(DB.ritual,n+11,5), conclusion:DB.conclusion[n%DB.conclusion.length]}}
function li(arr){return arr.map(x=>`<li>${safe(x)}</li>`).join('')}
function reportHTML(o,r){return `<div class="tm-report"><section class="rpage cover"><div class="rbrand">◉ ТЭНГЭРИЙН МЭЛМИЙ</div><h1>${safe(r.title)}</h1><p class="rsub">Өр зээл ба мөнгөний урсгалын 3 нүүр тайлан</p><div class="rgrid"><div><span>Үйлчлүүлэгч</span><b>${safe(o.client?.name)}</b></div><div><span>Төрсөн огноо</span><b>${safe(o.client?.year)}.${safe(o.client?.month)}.${safe(o.client?.day)}</b></div><div><span>Мөнгөний урсгал</span><b>${safe(o.result?.money)}</b></div><div><span>Өрийн блок</span><b>${safe(o.result?.debt)}</b></div></div><p class="note">Энэхүү тайлан нь уламжлалт бэлгэдлийн шинжилгээ, хэрэгжүүлэх санхүүгийн дадлын зөвлөмжөөс бүрдэнэ.</p></section><section class="rpage"><h2>Гол шинжилгээ</h2><h3>Санхүүгийн урсгалд нөлөөлж буй хүчин зүйлс</h3><ul>${li(r.debts)}</ul><h3>Мөнгөний урсгалын боломж</h3><ul>${li(r.money)}</ul></section><section class="rpage"><h2>Хэрэгжүүлэх зөвлөмж</h2><h3>Бодит алхам</h3><ul>${li(r.practical)}</ul><h3>Уламжлалт бэлгэдлийн зөвлөмж</h3><ul>${li(r.ritual)}</ul><div class="rcon"><b>Дүгнэлт</b><p>${safe(r.conclusion)}</p></div><small>Бэлгэдлийн зөвлөмжүүд нь санхүүгийн үр дүнг баталгаатай амлахгүй, харин сэтгэл төвлөрүүлж дадал тогтооход туслах зорилготой.</small></section></div>`}
function textReport(o,r){return `ТЭНГЭРИЙН МЭЛМИЙ\n${r.title}\n\nҮйлчлүүлэгч: ${o.client.name}\nТөрсөн огноо: ${o.client.year}.${o.client.month}.${o.client.day}\nМөнгөний урсгал: ${o.result.money}\nӨрийн блок: ${o.result.debt}\n\nГОЛ ШИНЖИЛГЭЭ\n- ${r.debts.join('\n- ')}\n\nМӨНГӨНИЙ УРСГАЛЫН БОЛОМЖ\n- ${r.money.join('\n- ')}\n\nБОДИТ АЛХАМ\n- ${r.practical.join('\n- ')}\n\nУЛАМЖЛАЛТ БЭЛГЭДЛИЙН ЗӨВЛӨМЖ\n- ${r.ritual.join('\n- ')}\n\nДҮГНЭЛТ\n${r.conclusion}`}

function openReportBuilder(id){
 const o=ordersCache.find(x=>x.docId===id); if(!o)return; const r=buildReport(o);
 $('reportModal').innerHTML=`<div class="modal-card"><button class="close" onclick="closeReport()">×</button><h2>Тайлан үүсгэх</h2><p><b>${safe(o.client.name)}</b> — ${safe(o.package.name)}</p><div class="builder-actions"><button class="gold" onclick="createReportLink('${id}')">Линк үүсгэх</button><button class="gold" onclick="sendSmsLink('${id}')">SMS линк илгээх</button><button class="gold" onclick="copyReport('${id}')">Текст хуулах</button><button class="gold" onclick="downloadReportPDF('${id}')">PDF татах</button><button class="gold" onclick="printReport('${id}')">Хэвлэх</button></div><div id="linkBox" class="linkbox" style="display:none"></div><div id="printArea">${reportHTML(o,r)}</div></div>`;
 $('reportModal').style.display='grid';
}
window.openReportBuilder=openReportBuilder;
function closeReport(){ $('reportModal').style.display='none'}
window.closeReport=closeReport;

function token(){return Math.random().toString(36).slice(2,8).toUpperCase()+Date.now().toString(36).slice(-4).toUpperCase()}
function makePublicLink(reportId){return location.origin+location.pathname+'#report='+reportId}
async function createReportLink(id){
 const o=ordersCache.find(x=>x.docId===id); if(!o)return; const r=buildReport(o); const reportId=o.reportId||token();
 const payload={reportId, orderId:id, createdAt:serverTimestamp(), updatedAt:Date.now(), client:o.client, package:o.package, result:o.result, report:r, status:'Бэлэн'};
 await setDoc(doc(db,'reports',reportId), payload); await updateDoc(doc(db,'orders',id),{reportId,status:'Тайлан бэлэн',updatedAt:Date.now()});
 const link=makePublicLink(reportId); const box=$('linkBox'); if(box){box.style.display='block'; box.innerHTML=`<b>Тайлангийн линк</b><textarea readonly onclick="this.select()">${link}</textarea><button class="mini" onclick="copyLink('${link}')">Линк хуулах</button>`}
 navigator.clipboard?.writeText(link); alert('Линк үүсээд хууллаа');
}
window.createReportLink=createReportLink;
function copyLink(link){navigator.clipboard?.writeText(link); alert('Линк хууллаа')}
window.copyLink=copyLink;
async function sendSmsLink(id){
 let o=ordersCache.find(x=>x.docId===id); if(!o)return; if(!o.reportId){await createReportLink(id); o=ordersCache.find(x=>x.docId===id) || o}
 const reportId=o.reportId || (await getDoc(doc(db,'orders',id))).data()?.reportId; if(!reportId){alert('Эхлээд линк үүсгэнэ үү');return}
 const phone=String(o.client?.phone||'').replace(/[^0-9+]/g,''); const link=makePublicLink(reportId);
 const msg=`Тэнгэрийн Мэлмий: Таны ${o.package.name} тайлан бэлэн боллоо. Дараах холбоосоор нээнэ үү: ${link}`;
 await setStatus(id,'SMS илгээхэд бэлэн'); window.location.href=`sms:${phone}?&body=${encodeURIComponent(msg)}`;
}
window.sendSmsLink=sendSmsLink;
function copyReport(id){const o=ordersCache.find(x=>x.docId===id); const r=buildReport(o); navigator.clipboard?.writeText(textReport(o,r)); alert('Тайлангийн текст хууллаа')}
window.copyReport=copyReport;

async function downloadReportPDF(id){
 const o=ordersCache.find(x=>x.docId===id); if(!o)return; const r=buildReport(o); const holder=document.createElement('div'); holder.style.position='fixed'; holder.style.left='-9999px'; holder.innerHTML=reportHTML(o,r); document.body.appendChild(holder);
 try{const {jsPDF}=window.jspdf; const pdf=new jsPDF('p','mm','a4'); const pages=[...holder.querySelectorAll('.rpage')]; for(let i=0;i<pages.length;i++){const canvas=await html2canvas(pages[i],{scale:2,backgroundColor:'#08111f'}); const img=canvas.toDataURL('image/jpeg',0.95); if(i>0)pdf.addPage(); pdf.addImage(img,'JPEG',0,0,210,297)} pdf.save(`tenger-melmii-${o.client.name}-${Date.now()}.pdf`); await setStatus(id,'PDF татсан')}catch(e){alert('PDF алдаа: '+e.message)} finally{holder.remove()}
}
window.downloadReportPDF=downloadReportPDF;
function printReport(id){const o=ordersCache.find(x=>x.docId===id); const r=buildReport(o); const w=window.open('','_blank'); w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Тайлан</title><style>${reportCSS()}</style></head><body>${reportHTML(o,r)}</body></html>`); w.document.close(); setTimeout(()=>w.print(),300)}
window.printReport=printReport;
function reportCSS(){return `.tm-report{font-family:Arial,sans-serif;color:#1b2635}.rpage{width:210mm;min-height:297mm;padding:18mm;box-sizing:border-box;background:linear-gradient(135deg,#08111f,#10213a 55%,#07111f);color:#fff;page-break-after:always;overflow:hidden}.rbrand{color:#f7d37a;letter-spacing:2px;font-weight:800}.rpage h1{font-size:34px;color:#f7d37a}.rpage h2{color:#f7d37a;font-size:28px}.rpage h3{color:#d7e7ff}.rsub,.note{color:#d7e7ff;line-height:1.7}.rgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:28px 0}.rgrid div,.rcon{border:1px solid rgba(247,211,122,.35);border-radius:16px;padding:14px;background:rgba(255,255,255,.06)}.rgrid span{display:block;color:#9bb4d4;font-size:12px}.rgrid b{font-size:22px;color:#fff}li{margin:0 0 12px;line-height:1.65}ul{padding-left:20px}small{color:#aabbd5}`}

async function showReportById(reportId){
 try{const snap=await getDoc(doc(db,'reports',reportId)); if(!snap.exists()){alert('Тайлан олдсонгүй');return} const p=snap.data(); document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.querySelector('.top')?.remove(); document.querySelector('.floating-admin')?.remove(); let section=document.getElementById('publicReport'); if(!section){section=document.createElement('section'); section.id='publicReport'; section.className='screen active public-report'; document.querySelector('main').appendChild(section)} section.innerHTML=`<div class="public-head"><p class="kicker">Тэнгэрийн Мэлмий</p><h2>${safe(p.client?.name)} таны тайлан</h2><p>Багц: <b>${safe(p.package?.name)}</b></p></div>${reportHTML({client:p.client,package:p.package,result:p.result},p.report)}<div class="result-actions"><button class="gold" onclick="window.print()">Хэвлэх / PDF хадгалах</button></div>`; window.scrollTo(0,0)}catch(e){alert('Тайлан нээхэд алдаа: '+e.message)}
}
function checkReportHash(){
  if(location.hash.startsWith('#report=')) return showReportById(location.hash.slice(8));
  if(location.hash==='#admin') return openAdmin();
}
window.addEventListener('load',checkReportHash);
window.addEventListener('hashchange',checkReportHash);

async function exportOrders(){const data=JSON.stringify(ordersCache,null,2); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([data],{type:'application/json'})); a.download='tenger-melmii-orders.json'; a.click()}
window.exportOrders=exportOrders;

function burstCoin(e){const coin=e.currentTarget; const r=coin.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2; coin.classList.add('explode'); const flash=document.createElement('i'); flash.className='flash-burst'; flash.style.left=(cx-9)+'px'; flash.style.top=(cy-9)+'px'; document.body.appendChild(flash); setTimeout(()=>flash.remove(),600); for(let i=0;i<36;i++){const s=document.createElement('i'); s.className='spark'; const a=(Math.PI*2*i/36)+(Math.random()*.45); const d=70+Math.random()*140; s.style.left=cx+'px'; s.style.top=cy+'px'; s.style.setProperty('--x',Math.cos(a)*d+'px'); s.style.setProperty('--y',Math.sin(a)*d+'px'); document.body.appendChild(s); setTimeout(()=>s.remove(),900)} for(let i=0;i<14;i++){const piece=document.createElement('i'); piece.className='coin-piece'; piece.textContent='₮'; const a=(Math.PI*2*i/14)+(Math.random()*.7); const d=80+Math.random()*170; piece.style.left=(cx-11)+'px'; piece.style.top=(cy-11)+'px'; piece.style.setProperty('--x',Math.cos(a)*d+'px'); piece.style.setProperty('--y',Math.sin(a)*d+'px'); piece.style.setProperty('--rot',(Math.random()*720-360)+'deg'); document.body.appendChild(piece); setTimeout(()=>piece.remove(),1050)} if(navigator.vibrate) navigator.vibrate(45); setTimeout(()=>coin.classList.remove('explode'),760)}
window.burstCoin=burstCoin;


/* === v34 HOTFIX: code preview, ancient scroll card, bank logos, cache refresh === */
const TM_V34 = 'v34';

function moneyCode(c=client){
 const base = seedFor({client:c});
 return String((base*73 + Number(c?.day||1)*19 + Number(c?.month||1)*41 + 8600) % 10000).padStart(4,'0');
}
window.moneyCode = moneyCode;

function renderOpenCode(code){
 code = String(code || moneyCode(client)).padStart(4,'0').slice(0,4);
 const targets = [...document.querySelectorAll('.codePreview,.openCodeDigits,#codePreview,#openCodeDigits,.moneyCodePreview,.unlockDigits')];
 targets.forEach(box=>{
   box.classList.add('tm-v34-code');
   box.innerHTML = code.split('').map((d,i)=>`<span class="${i<2?'is-open':'is-locked'}" aria-label="${i<2?'нээлттэй тоо':'нууц тоо'}">${d}</span>`).join('');
 });
 const resultName = $('resultName');
 if(!targets.length && resultName && !document.getElementById('tmV34AutoCode')){
   const auto=document.createElement('div');
   auto.id='tmV34AutoCode';
   auto.className='openCodeCard';
   auto.innerHTML=`<h2>Таны анхан нээлт</h2><p>Эхний хоёр нүд тод ил гарна. Дараагийн хоёр нүд нууцлаг хэвээр үлдэнэ.</p><div class="openCodeDigits tm-v34-code">${code.split('').map((d,i)=>`<span class="${i<2?'is-open':'is-locked'}">${d}</span>`).join('')}</div>`;
   resultName.insertAdjacentElement('afterend',auto);
 }
}
window.renderOpenCode = renderOpenCode;

const BANKS_V34 = [
 {key:'khan', name:'Хаан банк', icon:'bank-khan-icon.png?v=35', logo:'bank-khan.png?v=35'},
 {key:'golomt', name:'Голомт банк', icon:'bank-golomt-icon.png?v=35', logo:'bank-golomt.png?v=35'},
 {key:'tdb', name:'Худалдаа хөгжлийн банк', icon:'bank-tdb-icon.png?v=35', logo:'bank-tdb.png?v=35'},
 {key:'capitron', name:'Капитрон банк', icon:'bank-capitron-icon.png?v=35', logo:'bank-capitron.png?v=35'},
 {key:'credit', name:'Кредит банк', icon:'bank-credit.png?v=35', logo:'bank-credit.png?v=35'}
];

function selectBankV34(key){
 selected.bank = key;
 document.querySelectorAll('.bank-card-v34').forEach(el=>el.classList.toggle('active',el.dataset.bank===key));
 const b=BANKS_V34.find(x=>x.key===key);
 const note=$('payNote');
 if(note && b && client.name) note.textContent = `${client.name} ${client.phone||''} — ${b.name}`;
}
window.selectBankV34 = selectBankV34;

function renderBankOptions(){
 const payAmount=$('payAmount');
 let box=$('bankOptions') || document.querySelector('.bank-options,.banks,.payment-banks,#bankList');
 if(!box && payAmount){
   box=document.createElement('div');
   box.id='bankOptions';
   payAmount.insertAdjacentElement('afterend',box);
 }
 if(!box) return;
 box.classList.add('bank-options-v34');
 const current=selected.bank || 'khan';
 box.innerHTML=`<div class="bank-title-v34">Банк сонгох</div>` + BANKS_V34.map(b=>`<button type="button" class="bank-card-v34 ${current===b.key?'active':''}" data-bank="${b.key}" onclick="selectBankV34('${b.key}')"><img src="${b.icon}" alt="${b.name}" loading="lazy"><span>${b.name}</span></button>`).join('');
}
window.renderBankOptions = renderBankOptions;

function installV34Styles(){
 if(document.getElementById('tm-v34-style')) return;
 const style=document.createElement('style');
 style.id='tm-v34-style';
 style.textContent=`
  :root{--tm-gold:#ffe67d;--tm-red:#5a0708;--tm-dark:#210205;}
  .openCodeCard,.code-open-card,.first-open-card,#firstOpen{
    margin:22px auto 24px!important;padding:28px 18px 30px!important;border-radius:34px!important;
    background:linear-gradient(rgba(70,8,8,.10),rgba(25,3,4,.30)),url("ancient-scroll-code.jpg?v=35") center/cover no-repeat!important;
    border:1px solid rgba(255,224,116,.48)!important;box-shadow:0 24px 70px rgba(0,0,0,.45),inset 0 0 38px rgba(255,214,96,.16)!important;
  }
  .openCodeCard h2,.code-open-card h2,.first-open-card h2,#firstOpen h2{color:var(--tm-gold)!important;font-size:34px!important;line-height:1.16!important;text-shadow:0 3px 16px rgba(0,0,0,.72)!important;}
  .openCodeCard p,.code-open-card p,.first-open-card p,#firstOpen p{color:#fff4d0!important;text-shadow:0 2px 10px #000!important;}
  .tm-v34-code,.codePreview,.openCodeDigits,#codePreview,#openCodeDigits,.moneyCodePreview,.unlockDigits{display:flex!important;justify-content:center!important;align-items:center!important;gap:12px!important;margin:22px auto!important;}
  .tm-v34-code span,.codePreview span,.openCodeDigits span,#codePreview span,#openCodeDigits span,.moneyCodePreview span,.unlockDigits span{
    width:64px!important;height:74px!important;border-radius:16px!important;display:grid!important;place-items:center!important;
    font-family:Georgia,'Times New Roman',serif!important;font-size:44px!important;font-weight:950!important;color:var(--tm-gold)!important;
    background:linear-gradient(180deg,rgba(255,238,160,.28),rgba(80,11,5,.56)),radial-gradient(circle at 50% 35%,rgba(255,231,125,.35),rgba(88,12,8,.70))!important;
    border:1px solid rgba(255,224,116,.50)!important;box-shadow:inset 0 0 20px rgba(255,224,116,.20),0 10px 26px rgba(0,0,0,.38)!important;
    text-shadow:0 0 8px rgba(255,231,125,.70),0 4px 11px rgba(0,0,0,.85)!important;
  }
  .tm-v34-code span:nth-child(n+3),.tm-v34-code .is-locked,.codePreview span:nth-child(n+3),.openCodeDigits span:nth-child(n+3),#codePreview span:nth-child(n+3),#openCodeDigits span:nth-child(n+3),.moneyCodePreview span:nth-child(n+3),.unlockDigits span:nth-child(n+3){
    filter:blur(8px) brightness(.48)!important;opacity:.33!important;transform:scale(.92)!important;color:transparent!important;text-shadow:0 0 22px rgba(255,231,125,.78)!important;user-select:none!important;
  }
  .zodiacFigure,.zodiacCoin{width:210px!important;height:210px!important;margin-left:auto!important;margin-right:auto!important;}
  #zodiacSymbol,.zodiacFigure .symbol{font-size:0!important;width:180px!important;height:180px!important;background-size:contain!important;background-position:center!important;background-repeat:no-repeat!important;}
  .bank-options-v34{margin:18px auto!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;max-width:520px!important;}
  .bank-title-v34{grid-column:1/-1;color:var(--tm-gold);font-size:18px;font-weight:900;letter-spacing:.06em;text-align:center;text-shadow:0 2px 10px #000;margin:4px 0 6px;}
  .bank-card-v34{min-height:74px;border-radius:18px;border:1px solid rgba(255,224,116,.34);background:rgba(46,4,5,.66);box-shadow:inset 0 0 18px rgba(255,224,116,.10),0 12px 28px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;gap:9px;padding:10px;color:#fff3c1;font-weight:800;font-size:13px;}
  .bank-card-v34.active{border-color:rgba(255,230,125,.95);box-shadow:0 0 0 2px rgba(255,230,125,.18),0 0 28px rgba(255,209,77,.22);background:linear-gradient(135deg,rgba(77,7,7,.88),rgba(113,44,6,.70));}
  .bank-card-v34 img{width:38px;height:38px;object-fit:contain;border-radius:10px;background:rgba(255,255,255,.08);}
  @media(max-width:520px){.tm-v34-code span,.codePreview span,.openCodeDigits span,#codePreview span,#openCodeDigits span{width:56px!important;height:66px!important;font-size:38px!important}.openCodeCard h2{font-size:30px!important}.bank-options-v34{grid-template-columns:1fr!important}.zodiacFigure,.zodiacCoin{width:190px!important;height:190px!important}}
 `;
 document.head.appendChild(style);
}
window.installV34Styles = installV34Styles;

installV34Styles();
window.addEventListener('load',()=>{installV34Styles(); renderOpenCode(window.__TM_MONEY_CODE||moneyCode(client)); renderBankOptions();});

if('serviceWorker' in navigator){
 navigator.serviceWorker.register('sw.js?v=35').catch(()=>{});
 caches?.keys?.().then(keys=>keys.filter(k=>!/v34/i.test(k)).forEach(k=>caches.delete(k))).catch(()=>{});
}


/* === v35 loader: visual hotfix file === */
(function(){
  try{
    if(!document.querySelector('script[data-tm-v35-hotfix]')){
      var s=document.createElement('script');
      s.src='v35-client-hotfix.js?v=35';
      s.defer=true;
      s.dataset.tmV35Hotfix='1';
      document.head.appendChild(s);
    }
  }catch(e){}
})();
