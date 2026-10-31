const C='tam-v20';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','icon-1024.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const url=new URL(r.url);const same=url.origin===self.location.origin;
 // 화면(HTML)은 항상 최신을 먼저 받고, 인터넷이 없을 때만 저장본 사용
 if(r.mode==='navigate'||(same&&/\.html$|\/$/.test(url.pathname))){
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return;}
 // 그림·글꼴 등은 저장본 우선
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&(same||url.hostname.includes('fonts.g'))){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})));
});
