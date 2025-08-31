'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'glass' | 'modern' | 'success' | 'info' | 'warning'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  className?: string
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  icon,
  iconPosition = 'left',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transform hover:scale-105 hover:-translate-y-0.5'

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/30 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary-200 text-secondary-800 hover:bg-secondary-300 focus:ring-secondary-500/30 shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary-200 bg-white text-primary-700 hover:bg-primary-50 hover:border-primary-300 focus:ring-primary-500/30 shadow-sm hover:shadow-md',
    ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500/30',
    gradient: 'bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 text-white shadow-md hover:shadow-lg border border-slate-400/20',
    glass: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-lg hover:shadow-xl',
    modern: 'bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 text-white shadow-lg hover:shadow-xl border border-slate-500/20',
    success: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-md hover:shadow-lg border border-emerald-400/20',
    info: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-md hover:shadow-lg border border-slate-400/20',
    warning: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md hover:shadow-lg border border-amber-400/20',
  };

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-xl',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  // Убираем отладочные логи
  // console.log('🔍 Button Debug:', {
  //   variant,
  //   size,
  //   baseClasses,
  //   variantClasses: variantClasses[variant],
  //   sizeClasses: sizeClasses[size],
  //   className,
  //   combinedClasses
  // })

  const renderIcon = () => {
    if (!icon) return null
    return (
      <span className={`${iconPosition === 'right' ? 'ml-2' : 'mr-2'} flex-shrink-0`}>
        {icon}
      </span>
    )
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && renderIcon()}
      {children}
      {!loading && icon && iconPosition === 'right' && renderIcon()}
    </button>
  )
}

export default Button 