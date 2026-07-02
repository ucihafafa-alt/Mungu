
const TM_CACHE='tm-v36-nocache';
self.addEventListener('install', event=>{ self.skipWaiting(); event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))); });
self.addEventListener('activate', event=>{ event.waitUntil((async()=>{ const keys=await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); await self.clients.claim(); const clients=await self.clients.matchAll({type:'window'}); clients.forEach(c=>c.postMessage({type:'TM_UPDATED',version:'v36'})); })()); });
self.addEventListener('fetch', event=>{ if(event.request.method!=='GET') return; event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request))); });
