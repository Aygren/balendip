import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LifeSphere } from '@/types'

export const useSpheres = () => {
    const [spheres, setSpheres] = useState<LifeSphere[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Загрузка всех сфер жизни пользователя
    const loadSpheres = async () => {
        try {
            setLoading(true)
            setError(null)

            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setError('Пользователь не авторизован')
                setLoading(false)
                return
            }

            const { data, error: fetchError } = await supabase
                .from('life_spheres')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true })

            if (fetchError) {
                throw fetchError
            }

            // Преобразуем данные в формат LifeSphere
            const formattedSpheres: LifeSphere[] = (data || []).map(sphere => ({
                id: sphere.id,
                name: sphere.name,
                score: sphere.score,
                color: sphere.color,
                icon: sphere.icon,
                isDefault: sphere.is_default,
                createdAt: sphere.created_at,
                updatedAt: sphere.updated_at,
            }))

            setSpheres(formattedSpheres)
        } catch (err) {
            console.error('Ошибка загрузки сфер жизни:', err)
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
        } finally {
            setLoading(false)
        }
    }

    // Добавление новой сферы
    const addSphere = async (sphereData: Omit<LifeSphere, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('Пользователь не авторизован')
            }

            const { data, error: insertError } = await supabase
                .from('life_spheres')
                .insert({
                    user_id: user.id,
                    name: sphereData.name,
                    color: sphereData.color,
                    icon: sphereData.icon,
                    score: sphereData.score,
                    is_default: sphereData.isDefault,
                })
                .select()
                .single()

            if (insertError) {
                throw insertError
            }

            // Добавляем новую сферу в список
            const newSphere: LifeSphere = {
                id: data.id,
                name: data.name,
                score: data.score,
                color: data.color,
                icon: data.icon,
                isDefault: data.is_default,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            }

            setSpheres(prev => [...prev, newSphere])
            return newSphere
        } catch (err) {
            console.error('Ошибка добавления сферы:', err)
            throw err
        }
    }

    // Обновление сферы
    const updateSphere = async (sphereId: string, updates: Partial<LifeSphere>) => {
        try {
            const { data, error: updateError } = await supabase
                .from('life_spheres')
                .update({
                    name: updates.name,
                    color: updates.color,
                    icon: updates.icon,
                    score: updates.score,
                    is_default: updates.isDefault,
                })
                .eq('id', sphereId)
                .select()
                .single()

            if (updateError) {
                throw updateError
            }

            // Обновляем сферу в списке
            const updatedSphere: LifeSphere = {
                id: data.id,
                name: data.name,
                score: data.score,
                color: data.color,
                icon: data.icon,
                isDefault: data.is_default,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            }

            setSpheres(prev => prev.map(sphere =>
                sphere.id === sphereId ? updatedSphere : sphere
            ))

            return updatedSphere
        } catch (err) {
            console.error('Ошибка обновления сферы:', err)
            throw err
        }
    }

    // Удаление сферы
    const deleteSphere = async (sphereId: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('life_spheres')
                .delete()
                .eq('id', sphereId)

            if (deleteError) {
                throw deleteError
            }

            // Удаляем сферу из списка
            setSpheres(prev => prev.filter(sphere => sphere.id !== sphereId))
        } catch (err) {
            console.error('Ошибка удаления сферы:', err)
            throw err
        }
    }

    // Загрузка сфер при монтировании компонента
    useEffect(() => {
        loadSpheres()
    }, [])

    return {
        spheres,
        loading,
        error,
        loadSpheres,
        addSphere,
        updateSphere,
        deleteSphere,
    }
}
