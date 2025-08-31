import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { OnboardingProvider } from '@/contexts/OnboardingContext'
import QueryProvider from '@/components/providers/QueryProvider'
import { PWAProvider } from '@/components/providers/PWAProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Balendip - Отслеживание жизненных сфер',
  description: 'Приложение для отслеживания и анализа жизненных сфер, событий и эмоций',
  keywords: 'жизненные сферы, события, эмоции, аналитика, баланс жизни',
  authors: [{ name: 'Balendip Team' }],
  creator: 'Balendip',
  publisher: 'Balendip',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://balendip.app'),
  openGraph: {
    title: 'Balendip - Отслеживание жизненных сфер',
    description: 'Приложение для отслеживания и анализа жизненных сфер, событий и эмоций',
    url: 'https://balendip.app',
    siteName: 'Balendip',
    images: [
      {
        url: '/icon-192.png',
        width: 192,
        height: 192,
        alt: 'Balendip Logo',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balendip - Отслеживание жизненных сфер',
    description: 'Приложение для отслеживания и анализа жизненных сфер, событий и эмоций',
    images: ['/icon-192.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://balendip.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* ПРИНУДИТЕЛЬНОЕ ЦЕНТРИРОВАНИЕ ДЛЯ ОНБОРДИНГА */
            .onboarding-step-container {
              display: flex !important;
              align-items: flex-start !important;
              justify-content: center !important;
              width: 100% !important;
              text-align: center !important;
            }
            
            .onboarding-step-content {
              max-width: 42rem !important;
              width: 100% !important;
              margin: 0 auto !important;
              text-align: center !important;
            }
            
            .onboarding-step-card {
              text-align: center !important;
              width: 100% !important;
              max-width: 42rem !important;
              margin: 0 auto !important;
            }
            
            .onboarding-step-title {
              text-align: center !important;
              margin: 0 auto !important;
            }
            
            .onboarding-step-description {
              text-align: center !important;
              margin: 0 auto !important;
              max-width: 32rem !important;
            }
            
            .onboarding-step-buttons {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 0.75rem !important;
            }
            
            @media (min-width: 640px) {
              .onboarding-step-buttons {
                flex-direction: row !important;
                gap: 1rem !important;
              }
            }
            
            .sphere-selector-container {
              max-width: 80rem !important;
              margin: 0 auto !important;
              width: 100% !important;
              text-align: center !important;
              padding: 0 1rem !important;
            }
            
            .sphere-selector-grid {
              display: grid !important;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
              gap: 1rem !important;
              max-width: 64rem !important;
              margin: 0 auto !important;
            }
            
            .sphere-selector-title {
              text-align: center !important;
              margin-bottom: 2rem !important;
            }
            
            .sphere-selector-description {
              text-align: center !important;
              margin: 0 auto !important;
              max-width: 48rem !important;
            }
            
            .sphere-selector-stats {
              text-align: center !important;
              margin-top: 2rem !important;
            }
            
            /* ПРИНУДИТЕЛЬНОЕ ЦЕНТРИРОВАНИЕ ДЛЯ СТРАНИЦЫ ПРИВЕТСТВИЯ */
            .welcome-onboarding-container {
              display: flex !important;
              align-items: flex-start !important;
              justify-content: center !important;
              width: 100% !important;
              text-align: center !important;
              padding: 1rem !important;
            }
            
            .welcome-onboarding-card {
              width: 100% !important;
              max-width: 42rem !important;
              margin: 0 auto !important;
              text-align: center !important;
            }
            
            .welcome-onboarding-content {
              text-align: center !important;
              margin: 0 auto !important;
            }
            
            .welcome-onboarding-icon {
              display: flex !important;
              justify-content: center !important;
              margin: 0 auto !important;
            }
            
            .welcome-onboarding-title {
              text-align: center !important;
              margin: 0 auto !important;
            }
            
            .welcome-onboarding-description {
              text-align: center !important;
              margin: 0 auto !important;
            }
            
            .welcome-onboarding-step-content {
              min-height: 160px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
            }
            
            .welcome-onboarding-progress {
              display: flex !important;
              justify-content: center !important;
              margin: 0 auto !important;
            }
            
            .welcome-onboarding-buttons {
              display: flex !important;
              justify-content: center !important;
              margin: 0 auto !important;
              gap: 1rem !important;
            }
            
            .welcome-onboarding-input {
              text-align: center !important;
              margin: 0 auto !important;
              width: 100% !important;
              max-width: 24rem !important;
            }
            
            /* Адаптивность для мобильных устройств */
            @media (max-width: 768px) {
              .onboarding-step-content {
                max-width: 100% !important;
                padding: 0 1rem !important;
              }
              
              .onboarding-step-card {
                max-width: 100% !important;
                padding: 0 1rem !important;
              }
              
              .sphere-selector-container {
                max-width: 100% !important;
                padding: 0 1rem !important;
              }
              
              .sphere-selector-grid {
                max-width: 100% !important;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
              }
              
              .welcome-onboarding-card {
                max-width: 100% !important;
                padding: 0 1rem !important;
              }
              
              .welcome-onboarding-buttons {
                flex-direction: column !important;
                gap: 0.75rem !important;
              }
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        {/* Скрытый div для принудительной компиляции новых Tailwind классов */}
        <div className="hidden">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600"></div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600"></div>
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600"></div>
          <div className="bg-gradient-to-r from-red-500 to-red-600"></div>
          {/* Дополнительные градиентные классы для Button компонента */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="bg-gradient-to-r from-pink-500 to-orange-500"></div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <div className="bg-gradient-to-r from-orange-500 to-red-500"></div>
          <div className="bg-gradient-to-r from-green-500 to-blue-500"></div>
          {/* Новые спокойные градиентные классы */}
          <div className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600"></div>
          <div className="bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700"></div>
          <div className="bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
          <div className="bg-gradient-to-r from-amber-400 to-amber-500"></div>
        </div>

        <QueryProvider>
          <AuthProvider>
            <OnboardingProvider>
              <PWAProvider>
                {children}
              </PWAProvider>
            </OnboardingProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
