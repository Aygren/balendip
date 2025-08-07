'use client'

import React, { useState } from 'react'
import Layout from '@/components/layout/Layout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { User, Bell, Download, Upload, Trash2, Edit, Plus, Moon, Sun } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { LifeSphere } from '@/types'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSpheresModal, setShowSpheresModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || 'Пользователь',
    email: user?.email || '',
    avatar: user?.user_metadata?.avatar_url || '',
  })

  const [spheres, setSpheres] = useState<LifeSphere[]>([
    { id: '1', name: 'Здоровье', score: 7, color: '#10B981', icon: '🏥', isDefault: true, createdAt: '', updatedAt: '' },
    { id: '2', name: 'Карьера', score: 8, color: '#3B82F6', icon: '💼', isDefault: true, createdAt: '', updatedAt: '' },
    { id: '3', name: 'Отношения', score: 6, color: '#F59E0B', icon: '❤️', isDefault: true, createdAt: '', updatedAt: '' },
    { id: '4', name: 'Финансы', score: 5, color: '#8B5CF6', icon: '💰', isDefault: true, createdAt: '', updatedAt: '' },
    { id: '5', name: 'Саморазвитие', score: 9, color: '#06B6D4', icon: '📚', isDefault: true, createdAt: '', updatedAt: '' },
    { id: '6', name: 'Духовность', score: 4, color: '#EC4899', icon: '🧘', isDefault: true, createdAt: '', updatedAt: '' },
    { id: '7', name: 'Отдых', score: 6, color: '#F97316', icon: '🏖️', isDefault: true, createdAt: '', updatedAt: '' },
    { id: '8', name: 'Окружение', score: 7, color: '#84CC16', icon: '👥', isDefault: true, createdAt: '', updatedAt: '' },
  ])

  const handleProfileSave = () => {
    console.log('Saving profile:', profileData)
    setShowProfileModal(false)
  }

  const handleExportData = () => {
    console.log('Exporting data...')
    // Здесь будет логика экспорта данных
  }

  const handleImportData = () => {
    console.log('Importing data...')
    // Здесь будет логика импорта данных
  }

  const handleDeleteAccount = () => {
    if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      console.log('Deleting account...')
      signOut()
    }
  }

  const handleSignOut = () => {
    signOut()
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Здесь будет логика переключения темы
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)
    // Здесь будет логика настройки уведомлений
  }

  return (
    <Layout title="Настройки" showNavigation={true}>
      <div className="p-4 space-y-6">
        {/* Профиль */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <User size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">
                  {profileData.name}
                </h3>
                <p className="text-sm text-secondary-600">
                  {profileData.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfileModal(true)}
            >
              <Edit size={16} />
              Редактировать
            </Button>
          </div>
        </Card>

        {/* Основные настройки */}
        <Card>
          <h3 className="font-semibold text-secondary-900 mb-4">
            Основные настройки
          </h3>
          <div className="space-y-4">
            {/* Темная тема */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                <div>
                  <div className="font-medium text-secondary-900">
                    Темная тема
                  </div>
                  <div className="text-sm text-secondary-600">
                    Переключить на темный режим
                  </div>
                </div>
              </div>
              <Button
                variant={isDarkMode ? 'primary' : 'outline'}
                size="sm"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? 'Включена' : 'Выключена'}
              </Button>
            </div>

            {/* Уведомления */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} />
                <div>
                  <div className="font-medium text-secondary-900">
                    Уведомления
                  </div>
                  <div className="text-sm text-secondary-600">
                    Напоминания о событиях и балансе
                  </div>
                </div>
              </div>
              <Button
                variant={notifications ? 'primary' : 'outline'}
                size="sm"
                onClick={toggleNotifications}
              >
                {notifications ? 'Включены' : 'Выключены'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Сферы жизни */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary-900">
              Сферы жизни
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSpheresModal(true)}
            >
              <Plus size={16} />
              Добавить
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {spheres.map(sphere => (
              <div
                key={sphere.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-secondary-200"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${sphere.color}20` }}
                >
                  {sphere.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-secondary-900">
                    {sphere.name}
                  </div>
                  <div className="text-sm text-secondary-600">
                    Оценка: {sphere.score}/10
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <Edit size={14} />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Экспорт и импорт */}
        <Card>
          <h3 className="font-semibold text-secondary-900 mb-4">
            Данные
          </h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download size={16} className="mr-2" />
              Экспорт данных
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleImportData}
            >
              <Upload size={16} className="mr-2" />
              Импорт данных
            </Button>
          </div>
        </Card>

        {/* Аккаунт */}
        <Card>
          <h3 className="font-semibold text-secondary-900 mb-4">
            Аккаунт
          </h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              Выйти из аккаунта
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-error-600 hover:text-error-700"
              onClick={handleDeleteAccount}
            >
              <Trash2 size={16} className="mr-2" />
              Удалить аккаунт
            </Button>
          </div>
        </Card>

        {/* Информация о приложении */}
        <Card>
          <h3 className="font-semibold text-secondary-900 mb-4">
            О приложении
          </h3>
          <div className="space-y-2 text-sm text-secondary-600">
            <div className="flex justify-between">
              <span>Версия</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Разработчик</span>
              <span>Balendip Team</span>
            </div>
            <div className="flex justify-between">
              <span>Лицензия</span>
              <span>MIT</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Модальное окно редактирования профиля */}
      <Modal
        is_open={showProfileModal}
        on_close={() => setShowProfileModal(false)}
        title="Редактировать профиль"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Имя"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            placeholder="Введите ваше имя"
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder="Введите ваш email"
            disabled
          />
          <Input
            label="URL аватара"
            value={profileData.avatar}
            onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
            placeholder="Введите URL аватара"
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowProfileModal(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleProfileSave}
              className="flex-1"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно управления сферами */}
      <Modal
        is_open={showSpheresModal}
        on_close={() => setShowSpheresModal(false)}
        title="Управление сферами жизни"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary-600">
            Здесь вы можете добавлять, редактировать и удалять сферы жизни.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {spheres.map(sphere => (
              <div
                key={sphere.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-secondary-200"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${sphere.color}20` }}
                >
                  {sphere.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-secondary-900">
                    {sphere.name}
                  </div>
                  <div className="text-sm text-secondary-600">
                    Оценка: {sphere.score}/10
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                  >
                    <Edit size={14} />
                  </Button>
                  {!sphere.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 text-error-600 hover:text-error-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSpheresModal(false)}
              className="flex-1"
            >
              Закрыть
            </Button>
            <Button
              onClick={() => setShowSpheresModal(false)}
              className="flex-1"
            >
              Добавить сферу
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
} 