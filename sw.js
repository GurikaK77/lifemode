const CACHE_NAME = 'lifemode-v7-ai';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './data.js',
    './ui.js',
    './logic.js',
    './ai.js',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
    'https://cdn.jsdelivr.net/npm/toastify-js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((res) => {
                const resClone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
                return res;
            })
            .catch(() => caches.match(event.request))
    );
});
