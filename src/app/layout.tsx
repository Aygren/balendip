import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { PWAProvider } from '@/components/providers/PWAProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Balendip - Трекер баланса жизни',
  description: 'Приложение для отслеживания баланса жизни и случайных событий',
  manifest: '/manifest.json',
  keywords: ['жизнь', 'баланс', 'трекер', 'события', 'аналитика', 'продуктивность'],
  authors: [{ name: 'Balendip Team' }],
  creator: 'Balendip',
  publisher: 'Balendip',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Balendip - Трекер баланса жизни',
    description: 'Приложение для отслеживания баланса жизни и случайных событий',
    url: 'https://balendip.vercel.app',
    siteName: 'Balendip',
    images: [
      {
        url: '/next.svg',
        width: 1200,
        height: 630,
        alt: 'Balendip - Трекер баланса жизни',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balendip - Трекер баланса жизни',
    description: 'Приложение для отслеживания баланса жизни и случайных событий',
    images: ['/next.svg'],
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
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <PWAProvider>
              {children}
            </PWAProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
