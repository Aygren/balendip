'use client'

import React, { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onLeftIconClick?: () => void
  onRightIconClick?: () => void
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onLeftIconClick,
      onRightIconClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'w-full rounded-lg border bg-white px-3 py-2 text-secondary-900 placeholder-secondary-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 focus:scale-[1.01]'
    
    const errorClasses = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : 'border-secondary-300'
    
    const iconClasses = 'absolute top-1/2 -translate-y-1/2 text-secondary-400'
    const leftIconClasses = `${iconClasses} left-3`
    const rightIconClasses = `${iconClasses} right-3`

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-secondary-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <div
              className={`${leftIconClasses} ${onLeftIconClick ? 'cursor-pointer hover:text-secondary-600' : ''}`}
              onClick={onLeftIconClick}
            >
              <LeftIcon size={18} />
            </div>
          )}
          
          <input
            ref={ref}
            className={`${baseClasses} ${errorClasses} ${LeftIcon ? 'pl-10' : ''} ${RightIcon ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          
          {RightIcon && (
            <div
              className={`${rightIconClasses} ${onRightIconClick ? 'cursor-pointer hover:text-secondary-600' : ''}`}
              onClick={onRightIconClick}
            >
              <RightIcon size={18} />
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={`mt-1 text-sm ${error ? 'text-error-600' : 'text-secondary-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input 