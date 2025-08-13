'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/types'

// ===== КОНТЕКСТ АУТЕНТИФИКАЦИИ =====

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null

  // Действия
  login: (credentials: { email: string; password: string }) => void
  register: (credentials: { email: string; password: string; name?: string }) => void
  logout: () => void
  passwordReset: (email: string) => void
  passwordUpdate: (password: string) => void
  profileUpdate: (updates: Partial<User>) => void

  // Состояния загрузки
  isLoggingIn: boolean
  isRegistering: boolean
  isLoggingOut: boolean
  isResettingPassword: boolean
  isUpdatingPassword: boolean
  isUpdatingProfile: boolean

  // Ошибки
  loginError: Error | null
  registerError: Error | null
  logoutError: Error | null
  passwordResetError: Error | null
  passwordUpdateError: Error | null
  profileUpdateError: Error | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Провайдер контекста аутентификации
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth()

  const contextValue: AuthContextType = {
    // Состояние
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,

    // Действия
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    passwordReset: auth.passwordReset,
    passwordUpdate: auth.passwordUpdate,
    profileUpdate: auth.profileUpdate,

    // Состояния загрузки
    isLoggingIn: auth.isLoggingIn,
    isRegistering: auth.isRegistering,
    isLoggingOut: auth.isLoggingOut,
    isResettingPassword: auth.isResettingPassword,
    isUpdatingPassword: auth.isUpdatingPassword,
    isUpdatingProfile: auth.isUpdatingProfile,

    // Ошибки
    loginError: auth.loginError,
    registerError: auth.registerError,
    logoutError: auth.logoutError,
    passwordResetError: auth.passwordResetError,
    passwordUpdateError: auth.passwordUpdateError,
    profileUpdateError: auth.profileUpdateError,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Хук для использования контекста аутентификации
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext должен использоваться внутри AuthProvider')
  }

  return context
}

// Утилиты для проверки аутентификации
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated
}

export const useCurrentUser = (): User | null => {
  const { user } = useAuthContext()
  return user
}

export const useAuthLoading = (): boolean => {
  const { isLoading } = useAuthContext()
  return isLoading
} 