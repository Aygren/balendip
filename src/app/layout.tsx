import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
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
