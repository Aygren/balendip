'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info'
    isVisible: boolean
    onClose: () => void
    duration?: number
}

const Toast: React.FC<ToastProps> = ({
    message,
    type,
    isVisible,
    onClose,
    duration = 3000,
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    if (!isVisible) return null

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={22} className="text-green-600" />
            case 'error':
                return <AlertCircle size={22} className="text-red-600" />
            case 'info':
                return <Info size={22} className="text-blue-600" />
            default:
                return <Info size={22} className="text-blue-600" />
        }
    }

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200'
            case 'error':
                return 'bg-red-50 border-red-200'
            case 'info':
                return 'bg-blue-50 border-blue-200'
            default:
                return 'bg-blue-50 border-blue-200'
        }
    }

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full`}>
            <div className={`${getBgColor()} border rounded-lg p-4 shadow-lg`}>
                <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toast
