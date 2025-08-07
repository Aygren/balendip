'use client'

import React from 'react'
import { Home, BarChart3, Plus, Calendar, Settings, Download } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

interface NavigationProps {
    className?: string
}

interface NavItem {
    href: string
    icon: React.ComponentType<{ size?: number }>
    label: string
}

const navItems: NavItem[] = [
    { href: '/', icon: Home, label: 'Главная' },
    { href: '/analytics', icon: BarChart3, label: 'Аналитика' },
    { href: '/events', icon: Calendar, label: 'События' },
    { href: '/export', icon: Download, label: 'Экспорт' },
    { href: '/settings', icon: Settings, label: 'Настройки' },
]

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleNavClick = (href: string) => {
        router.push(href)
    }

    return (
        <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 px-4 py-2 safe-area-inset ${className}`}>
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${isActive
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

export default Navigation 