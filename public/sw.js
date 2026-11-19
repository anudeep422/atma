// Minimal service worker: makes Atma installable and shows a friendly page when offline.
const OFFLINE_HTML = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<body style="font-family:sans-serif;background:#fbf6ee;color:#2b2118;text-align:center;padding:60px 20px">
<div style="font-size:48px;color:#d9771f">ॐ</div><h2>You're offline / మీరు ఆఫ్‌లైన్‌లో ఉన్నారు</h2>
<p>Please check your internet connection and try again.<br>దయచేసి ఇంటర్నెట్ కనెక్షన్ చూసి మళ్ళీ ప్రయత్నించండి.</p></body>`;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return; // let the browser handle everything else normally
  e.respondWith(fetch(e.request).catch(() => new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } })));
});
