import { useState, useEffect } from 'react'
import { LifeSphere } from '@/types'
import { supabase } from '@/lib/supabase'

interface OnboardingData {
  isCompleted: boolean
  spheres: LifeSphere[]
  completedAt?: string
}

const ONBOARDING_STORAGE_KEY = 'balendip-onboarding'

export const useOnboarding = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [loading, setLoading] = useState(true)

  // Загрузка данных из localStorage
  const loadFromStorage = (): OnboardingData | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error loading onboarding data from localStorage:', error)
      return null
    }
  }

  // Сохранение в localStorage
  const saveToStorage = (data: OnboardingData) => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving onboarding data to localStorage:', error)
    }
  }

  // Сохранение сфер в Supabase
  const saveSpheresToSupabase = async (spheres: LifeSphere[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.warn('User not authenticated, skipping Supabase save')
        return
      }

      // Удаляем старые сферы пользователя
      await supabase
        .from('life_spheres')
        .delete()
        .eq('user_id', user.id)

      // Добавляем новые сферы
      const spheresToInsert = spheres.map(sphere => ({
        user_id: user.id,
        name: sphere.name,
        color: sphere.color,
        icon: sphere.icon,
        score: sphere.score,
        is_default: sphere.is_default
      }))

      const { error } = await supabase
        .from('life_spheres')
        .insert(spheresToInsert)

      if (error) {
        console.error('Error saving spheres to Supabase:', error)
        throw error
      }

      console.log('Spheres saved to Supabase successfully')
    } catch (error) {
      console.error('Error in saveSpheresToSupabase:', error)
      throw error
    }
  }

  // Загрузка сфер из Supabase
  const loadSpheresFromSupabase = async (): Promise<LifeSphere[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.warn('User not authenticated, cannot load spheres from Supabase')
        return []
      }

      const { data, error } = await supabase
        .from('life_spheres')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading spheres from Supabase:', error)
        return []
      }

      return (data || []).map(sphere => ({
        id: sphere.id,
        user_id: sphere.user_id,
        name: sphere.name,
        color: sphere.color,
        icon: sphere.icon,
        score: sphere.score,
        is_default: sphere.is_default,
        created_at: sphere.created_at,
        updated_at: sphere.updated_at
      }))
    } catch (error) {
      console.error('Error in loadSpheresFromSupabase:', error)
      return []
    }
  }

  // Инициализация
  useEffect(() => {
    const initializeOnboarding = async () => {
      setLoading(true)
      
      try {
        // Сначала пробуем загрузить из localStorage
        const storedData = loadFromStorage()
        
        if (storedData && storedData.isCompleted) {
          // Если онбординг завершен, пробуем загрузить актуальные данные из Supabase
          const supabaseSpheres = await loadSpheresFromSupabase()
          
          if (supabaseSpheres.length > 0) {
            setOnboardingData({
              ...storedData,
              spheres: supabaseSpheres
            })
          } else {
            setOnboardingData(storedData)
          }
        } else {
          setOnboardingData({
            isCompleted: false,
            spheres: []
          })
        }
      } catch (error) {
        console.error('Error initializing onboarding:', error)
        setOnboardingData({
          isCompleted: false,
          spheres: []
        })
      } finally {
        setLoading(false)
      }
    }

    initializeOnboarding()
  }, [])

  // Завершение онбординга
  const completeOnboarding = async (spheres: LifeSphere[]) => {
    try {
      setLoading(true)

      // Сохраняем в Supabase
      await saveSpheresToSupabase(spheres)

      // Сохраняем в localStorage
      const data: OnboardingData = {
        isCompleted: true,
        spheres,
        completedAt: new Date().toISOString()
      }

      saveToStorage(data)
      setOnboardingData(data)

      console.log('Onboarding completed successfully')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Сброс онбординга
  const resetOnboarding = () => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY)
      setOnboardingData({
        isCompleted: false,
        spheres: []
      })
    } catch (error) {
      console.error('Error resetting onboarding:', error)
    }
  }

  // Обновление сфер
  const updateSpheres = async (spheres: LifeSphere[]) => {
    try {
      await saveSpheresToSupabase(spheres)
      
      if (onboardingData) {
        const updatedData = {
          ...onboardingData,
          spheres
        }
        saveToStorage(updatedData)
        setOnboardingData(updatedData)
      }
    } catch (error) {
      console.error('Error updating spheres:', error)
      throw error
    }
  }

  return {
    onboardingData,
    loading,
    completeOnboarding,
    resetOnboarding,
    updateSpheres,
    isCompleted: onboardingData?.isCompleted ?? false,
    spheres: onboardingData?.spheres ?? []
  }
}
