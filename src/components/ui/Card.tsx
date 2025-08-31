'use client'

import React from 'react'
import { BaseComponentProps } from '@/types'

interface CardProps extends BaseComponentProps {
    variant?: 'default' | 'elevated' | 'outlined'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
    clickable?: boolean
    onClick?: () => void
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    clickable = false,
    onClick,
    className = '',
}) => {
    const baseClasses = 'rounded-xl border transition-all duration-200'

    const variantClasses = {
        default: 'bg-white border-secondary-200 shadow-lg hover:shadow-xl',
        elevated: 'bg-white border-secondary-200 shadow-xl hover:shadow-2xl',
        outlined: 'bg-white/80 backdrop-blur-sm border-secondary-300 shadow-md hover:shadow-lg',
    }

    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8',
    }

    const hoverClasses = hover ? 'hover:shadow-medium hover:scale-[1.02] active:scale-[0.98]' : ''
    const clickableClasses = clickable ? 'cursor-pointer' : ''

    const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}`

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    )
}

export default Card 