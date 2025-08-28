import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'

// ===== ХУК ДЛЯ АУТЕНТИФИКАЦИИ =====

export interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials {
    email: string
    password: string
    name?: string
}

export interface PasswordResetRequest {
    email: string
}

export interface PasswordUpdate {
    password: string
}

// Получение текущего пользователя
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['auth', 'user'],
        queryFn: async (): Promise<User | null> => {
            const { data: { user }, error } = await supabase.auth.getUser()

            if (error) {
                throw error
            }

            if (!user) {
                return null
            }

            // Получаем дополнительную информацию о пользователе
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            return {
                id: user.id,
                email: user.email!,
                name: profile?.name || user.user_metadata?.name || '',
                avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || '',
                created_at: user.created_at,
                updated_at: user.last_sign_in_at || user.created_at,
            } as User
        },
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000, // 10 минут
        retry: false, // Не повторяем запросы аутентификации
        refetchOnWindowFocus: false, // Не рефетчим при фокусе окна
        refetchOnMount: true, // Рефетчим при монтировании
    })
}

// Вход в систему
export const useLogin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (credentials: LoginCredentials): Promise<User> => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            })

            if (error) {
                throw error
            }

            if (!data.user) {
                throw new Error('Не удалось получить данные пользователя')
            }

            return data.user as User
        },
        onSuccess: () => {
            // Инвалидируем кеш пользователя
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })

            // Инвалидируем все связанные данные
            queryClient.invalidateQueries({ queryKey: ['events'] })
            queryClient.invalidateQueries({ queryKey: ['spheres'] })
        },
        onError: (error) => {
            console.error('Ошибка входа:', error)
        },
    })
}

// Регистрация
export const useRegister = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (credentials: RegisterCredentials): Promise<User> => {
            const { data, error } = await supabase.auth.signUp({
                email: credentials.email,
                password: credentials.password,
                options: {
                    data: {
                        name: credentials.name,
                    },
                },
            })

            if (error) {
                throw error
            }

            if (!data.user) {
                throw new Error('Не удалось создать пользователя')
            }

            // Создаем профиль пользователя
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: data.user.id,
                    name: credentials.name || '',
                    email: credentials.email,
                })

            if (profileError) {
                console.warn('Ошибка создания профиля:', profileError)
            }

            return data.user as User
        },
        onSuccess: () => {
            // Инвалидируем кеш пользователя
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
        },
        onError: (error) => {
            console.error('Ошибка регистрации:', error)
        },
    })
}

// Выход из системы
export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (): Promise<void> => {
            const { error } = await supabase.auth.signOut()

            if (error) {
                throw error
            }
        },
        onSuccess: () => {
            // Очищаем весь кеш при выходе
            queryClient.clear()

            // Сбрасываем кеш пользователя
            queryClient.setQueryData(['auth', 'user'], null)
        },
        onError: (error) => {
            console.error('Ошибка выхода:', error)
        },
    })
}

// Сброс пароля
export const usePasswordReset = () => {
    return useMutation({
        mutationFn: async (request: PasswordResetRequest): Promise<void> => {
            const { error } = await supabase.auth.resetPasswordForEmail(request.email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (error) {
                throw error
            }
        },
        onError: (error) => {
            console.error('Ошибка сброса пароля:', error)
        },
    })
}

// Обновление пароля
export const usePasswordUpdate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (update: PasswordUpdate): Promise<void> => {
            const { error } = await supabase.auth.updateUser({
                password: update.password,
            })

            if (error) {
                throw error
            }
        },
        onSuccess: () => {
            // Инвалидируем кеш пользователя
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
        },
        onError: (error) => {
            console.error('Ошибка обновления пароля:', error)
        },
    })
}

// Обновление профиля
export const useProfileUpdate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updates: Partial<User>): Promise<User> => {
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                throw new Error('Пользователь не авторизован')
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    name: updates.name,
                    avatar_url: updates.avatar_url,
                })
                .eq('id', user.id)

            if (error) {
                throw error
            }

            return { ...user, ...updates } as User
        },
        onSuccess: () => {
            // Инвалидируем кеш пользователя
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
        },
        onError: (error) => {
            console.error('Ошибка обновления профиля:', error)
        },
    })
}

// Основной хук аутентификации
export const useAuth = () => {
    const { data: user, isLoading, error } = useCurrentUser()
    const login = useLogin()
    const register = useRegister()
    const logout = useLogout()
    const passwordReset = usePasswordReset()
    const passwordUpdate = usePasswordUpdate()
    const profileUpdate = useProfileUpdate()

    return {
        // Состояние
        user,
        isLoading,
        isAuthenticated: !!user,
        error,

        // Действия
        login: (credentials: LoginCredentials) => login.mutate(credentials),
        register: (credentials: RegisterCredentials) => register.mutate(credentials),
        logout: () => logout.mutate(),
        passwordReset: (request: PasswordResetRequest) => passwordReset.mutate(request),
        passwordUpdate: (update: PasswordUpdate) => passwordUpdate.mutate(update),
        profileUpdate: (updates: Partial<User>) => profileUpdate.mutate(updates),

        // Состояния загрузки
        isLoggingIn: login.isPending,
        isRegistering: register.isPending,
        isLoggingOut: logout.isPending,
        isResettingPassword: passwordReset.isPending,
        isUpdatingPassword: passwordUpdate.isPending,
        isUpdatingProfile: profileUpdate.isPending,

        // Ошибки
        loginError: login.error,
        registerError: register.error,
        logoutError: logout.error,
        passwordResetError: passwordReset.error,
        passwordUpdateError: passwordUpdate.error,
        profileUpdateError: profileUpdate.error,
    }
}
