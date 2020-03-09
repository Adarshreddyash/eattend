self.addEventListener('fetch', function(event) {
    event.respondWith(caches.open('cache').then(function(cache) {
        return cache.match(event.request).then(function(response) {
            console.log("cache request: " + event.request.url);
            var fetchPromise = fetch(event.request).then(function(networkResponse) {
                console.log("fetch completed: " + event.request.url, networkResponse);
                if (networkResponse) {
                    console.debug("updated cached page: " + event.request.url, networkResponse);
                    if (event.request.method === 'GET' && networkResponse.type === 'basic') {
                        cache.put(event.request, networkResponse.clone());
                    }
                }
                return networkResponse;
            }, function(event) {
                console.log("Error in fetch()", event);
                event.waitUntil(
                    caches.open('cache').then(function(cache) {
                        return cache.addAll([
                            '/',
                            '/index.html',
                            '/style.css',
                            '/service-worker.js',
                            '/sounds/beep-01a.mp3',
                            '/manifest.json',
                        ]);
                    })
                );
            });
            return response || fetchPromise;
        });
    }));
});
self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log("Latest version installed!");
});