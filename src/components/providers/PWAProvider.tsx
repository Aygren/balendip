'use client'

import React, { useEffect } from 'react'

interface PWAProviderProps {
    children: React.ReactNode
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
    useEffect(() => {
        // Регистрация service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration)
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError)
                    })
            })
        }

        // Запрос разрешения на уведомления
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission()
            }
        }
    }, [])

    return <>{children}</>
}
