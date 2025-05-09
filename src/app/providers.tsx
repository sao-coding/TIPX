'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import Cookies from 'js-cookie'
import { UAParser } from 'ua-parser-js'

import api from '@/lib/api'
import getIP from '@/utils/ip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const Providers = ({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}) => {
  const [queryClient] = React.useState(() => new QueryClient())

  const pathname = usePathname()

  React.useEffect(() => {
    const writeLog = async () => {
      const userAgent = navigator.userAgent
      const parser = new UAParser(userAgent)
      const ua = parser.getResult()
      api.post('logs', {
        ip: await getIP(),
        deviceType: ua.device.type ?? '未知',
        deviceVendor: ua.device.vendor ?? '未知',
        deviceModel: ua.device.model ?? '未知',
        browserName: ua.browser.name ?? '未知',
        browserVersion: ua.browser.version ?? '0.0.0',
        osName: ua.os.name ?? '未知',
        osVersion: ua.os.version ?? '0.0.0',
        referer: document.referrer ?? '',
        path: pathname
      })
    }
    if (Cookies.get('accessToken')) {
      writeLog()
    }
  }, [pathname])

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  )
}

export default Providers
