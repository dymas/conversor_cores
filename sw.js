const routes = new Map();

routes.set('index', './');
routes.set('manifest', './app.webmanifest');
routes.set('style', './assets/css/style.css');
routes.set('bundle', './assets/js/bundle.js');
routes.set('script', './assets/js/script.js');
routes.set('favicon', './assets/imgs/favicon.ico');
routes.set('logo', './assets/imgs/logo.png');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('v1')
      .then((cache) => cache.addAll(routes.values()))
      .catch((error) => console.log(error))
  );
  self.skipWaiting();
});

async function handleRequest(request) {
  const store = await caches.open('v1');

  try {
    const response = await fetch(request);

    if (response.type !== 'opaque' && request.method === 'GET') {
      store.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log(error);

    return (
      (await store.match(request)) || (await store.match(routes.get('offline')))
    );
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
