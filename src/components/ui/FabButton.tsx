'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FabButtonProps {
    onClick: () => void
    className?: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'secondary' | 'accent'
}

export default function FabButton({
    onClick,
    className = '',
    size = 'md',
    variant = 'primary',
}: FabButtonProps) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-14 h-14',
        lg: 'w-16 h-16',
    }

    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/25',
        secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-secondary-500/25',
        accent: 'bg-accent-600 hover:bg-accent-700 text-white shadow-accent-500/25',
    }

    const iconSizes = {
        sm: 20,
        md: 24,
        lg: 28,
    }

    return (
        <AnimatePresence>
            <motion.button
                onClick={onClick}
                className={`
          fixed bottom-24 right-4 z-50
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${className}
        `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Plus size={iconSizes[size]} />
            </motion.button>
        </AnimatePresence>
    )
} 