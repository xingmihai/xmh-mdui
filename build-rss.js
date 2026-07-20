const CACHE_NAME = 'mdui-blog-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/app.js',
  '/about.md',
  '/friends.json',
  '/search.json'
];

// 安装时缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(() => {})
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 网络优先策略（文章），缓存回退（静态资源）
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理同源请求
  if (url.origin !== self.location.origin) return;
  
  // 文章 Markdown 使用网络优先
  if (url.pathname.startsWith('/posts/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }
  
  // 静态资源使用缓存优先
  event.respondWith(
    caches.match(request).then(response => {
      if (response) return response;
      return fetch(request).then(fetchResponse => {
        if (fetchResponse.ok && request.method === 'GET') {
          const clone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return fetchResponse;
      }).catch(() => {
        // 离线时返回 404 页面
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});