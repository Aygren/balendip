const CACHE_NAME = 'balendip-v1.0.0'
const urlsToCache = [
    '/',
    '/analytics',
    '/events',
    '/export',
    '/settings',
    '/auth/login',
    '/auth/register',
    '/manifest.json',
    '/next.svg',
    '/favicon.ico'
]

// Установка service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache')
                return cache.addAll(urlsToCache)
            })
    )
})

// Активация и очистка старых кешей
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

// Перехват запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Возвращаем кешированный ответ, если есть
                if (response) {
                    return response
                }

                // Клонируем запрос
                const fetchRequest = event.request.clone()

                return fetch(fetchRequest).then((response) => {
                    // Проверяем, что ответ валидный
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response
                    }

                    // Клонируем ответ
                    const responseToCache = response.clone()

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache)
                        })

                    return response
                })
            })
            .catch(() => {
                // Офлайн страница
                if (event.request.destination === 'document') {
                    return caches.match('/')
                }
            })
    )
})

// Обработка push уведомлений
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Новое уведомление от Balendip',
        icon: '/next.svg',
        badge: '/next.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Открыть приложение',
                icon: '/next.svg'
            },
            {
                action: 'close',
                title: 'Закрыть',
                icon: '/next.svg'
            }
        ]
    }

    event.waitUntil(
        self.registration.showNotification('Balendip', options)
    )
})

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        )
    }
})
