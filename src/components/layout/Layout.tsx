'use client'

import React from 'react'
import Header from './Header'
import Navigation from './Navigation'

interface LayoutProps {
    children: React.ReactNode
    title?: string
    user?: {
        name?: string
        avatar?: string
    }
    showHeader?: boolean
    showNavigation?: boolean
    className?: string
}

const Layout: React.FC<LayoutProps> = ({
    children,
    title,
    user,
    showHeader = true,
    showNavigation = true,
    className = '',
}) => {
    return (
        <div className={`min-h-screen bg-secondary-50 ${className}`}>
            {showHeader && (
                <Header
                    title={title}
                    user={user}
                    onNotificationClick={() => console.log('Notifications clicked')}
                    onSettingsClick={() => console.log('Settings clicked')}
                />
            )}

            <main className={`${showNavigation ? 'pb-20' : ''} ${showHeader ? 'pt-0' : 'pt-0'}`}>
                {children}
            </main>

            {showNavigation && <Navigation />}
        </div>
    )
}

export default Layout 