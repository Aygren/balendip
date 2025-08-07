'use client'

import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { ModalProps } from '@/types'

const Modal: React.FC<ModalProps> = ({
    is_open,
    on_close,
    title,
    children,
    size = 'md',
    className = '',
}) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        full: 'max-w-full mx-4',
    }

    return (
        <Transition appear show={is_open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={on_close}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-large transition-all ${className}`}
                            >
                                {title && (
                                    <Dialog.Title
                                        as="h3"
                                        className="mb-4 flex items-center justify-between text-lg font-semibold leading-6 text-secondary-900"
                                    >
                                        {title}
                                        <button
                                            onClick={on_close}
                                            className="rounded-lg p-1 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </Dialog.Title>
                                )}

                                {!title && (
                                    <button
                                        onClick={on_close}
                                        className="absolute right-4 top-4 rounded-lg p-1 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                )}

                                <div className="mt-2">{children}</div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal 