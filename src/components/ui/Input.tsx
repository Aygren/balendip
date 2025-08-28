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
  onEnterPress?: () => void
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
      onEnterPress,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'w-full rounded-xl border-2 bg-white px-8 py-6 text-secondary-900 placeholder-secondary-500 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-200 focus:scale-[1.02] text-xl font-medium min-h-[80px]'

    const errorClasses = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : 'border-secondary-300'

    const iconClasses = 'absolute top-1/2 -translate-y-1/2 text-secondary-400'
    const leftIconClasses = `${iconClasses} left-8`
    const rightIconClasses = `${iconClasses} right-8`

    const defaultStyle: React.CSSProperties = {
      minHeight: 80,
      fontSize: 20,
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: LeftIcon ? 80 : 32,
      paddingRight: RightIcon ? 80 : 32,
      borderWidth: 3,
      borderRadius: 16,
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnterPress) {
        e.preventDefault()
        onEnterPress()
      }
      // Вызываем оригинальный onKeyDown если он есть
      if (props.onKeyDown) {
        props.onKeyDown(e)
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label className="mb-4 block text-lg font-semibold text-secondary-700">
            {label}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div
              className={`${leftIconClasses} ${onLeftIconClick ? 'cursor-pointer hover:text-secondary-600' : ''}`}
              onClick={onLeftIconClick}
            >
              <LeftIcon size={28} />
            </div>
          )}

          <input
            ref={ref}
            className={`${baseClasses} ${errorClasses} ${LeftIcon ? 'pl-20' : ''} ${RightIcon ? 'pr-20' : ''} ${className}`}
            style={{ ...defaultStyle, ...(props.style as React.CSSProperties) }}
            onKeyDown={handleKeyDown}
            {...props}
          />

          {RightIcon && (
            <div
              className={`${rightIconClasses} ${onRightIconClick ? 'cursor-pointer hover:text-secondary-600' : ''}`}
              onClick={onRightIconClick}
            >
              <RightIcon size={28} />
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={`mt-3 text-lg ${error ? 'text-error-600' : 'text-secondary-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input 