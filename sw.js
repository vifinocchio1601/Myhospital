// Garde une copie du jeu pour qu'il s'ouvre sans connexion. En ligne, la version la plus récente est toujours chargée.
const CACHE="myhospital-202610100730";
const FICHIERS=["./","index.html","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FICHIERS)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin) return;
  e.respondWith(fetch(r).then(rep=>{ if(rep.ok){ const copie=rep.clone(); caches.open(CACHE).then(c=>c.put(r,copie)); } return rep; })
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match("index.html"))));
});
