const TM_V35='tm-v35-no-cache';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
async function injectHotfix(request){
  const res = await fetch(request, {cache:'no-store'});
  const type = res.headers.get('content-type') || '';
  if(!type.includes('text/html')) return res;
  let html = await res.text();
  if(!html.includes('v35-client-hotfix.js')){
    html = html.replace('</body>', '<script src="v35-client-hotfix.js?v=35" defer></script></body>');
  }
  return new Response(html, {headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
}
self.addEventListener('fetch', event => {
  const req=event.request;
  const url=new URL(req.url);
  if(req.mode==='navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')){
    event.respondWith(injectHotfix(req).catch(()=>fetch(req)));
    return;
  }
  event.respondWith(fetch(req, {cache:'no-store'}).catch(()=>fetch(req)));
});
