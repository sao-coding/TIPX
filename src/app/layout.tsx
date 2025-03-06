import type { Metadata, Viewport } from 'next'
import { getServerSession } from 'next-auth'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'react-hot-toast'

import { site } from '@/config/site'
import authOptions from '@/lib/auth'

import LogLib from './loglib'
import Providers from './providers'

import './custom.css'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'TIPX',
  description: '學生資訊系統',
  manifest: '/pwa/manifest.json',
  appleWebApp: true,
  twitter: {
    card: 'summary_large_image',
    site: '@tipx',
    title: 'TIPX',
    description: '學生資訊系統',
    images: '/img/og.png'
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: site.url,
    images: [
      {
        url: '/img/og.png',
        width: 1200,
        height: 630,
        alt: 'TIPX'
      }
    ]
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png'
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png'
    },
    {
      rel: 'mask-icon',
      color: '#ff6800',
      url: '/safari-pinned-tab.svg'
    }
  ]
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#040102' },
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' }
  ]
}

export default async function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  const locale = await getLocale()

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()
  return (
    // ThemeProvider 需使用 suppressHydrationWarning
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* 正式環境 才用 */}
        {process.env.NODE_ENV === 'production' && <LogLib />}
      </head>
      <body>
        <ThemeProvider attribute='class' disableTransitionOnChange>
          <NuqsAdapter>
            <NextIntlClientProvider messages={messages}>
              <Providers session={session}>
                {children}
                {modal}
              </Providers>
            </NextIntlClientProvider>
          </NuqsAdapter>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
