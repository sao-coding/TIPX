'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const Providers = ({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}) => {
  const [queryClient] = React.useState(() => new QueryClient())
  //   model Log {
  //     id        String   @id @default(nanoid())
  //     ip        String
  //     userAgent String
  //     referer   String
  //     path      String
  //     userId    String
  //     user      User     @relation(fields: [userId], references: [id])
  //     createdAt DateTime @default(now())
  // }
  const pathname = usePathname()

  React.useEffect(() => {
    const userAgent = navigator.userAgent
    console.log('userAgent', userAgent)
    // const writeLog = async () => {
    //   // await fetch('/api/log', {
    //   //   method: 'POST',
    //   //   headers: {
    //   //     'Content-Type': 'application/json'
    //   //   },
    //   //   body: JSON.stringify({
    //   //     ip: await getIP(),
    //   //     stuID: session?.user.studentID,
    //   //     name: session?.user.name,
    //   //     path: pathname
    //   //   })
    //   // })
    //   api.post('/log', {
    //     ip: await getIP(),
    //     path: pathname
    //   })
    // }
    // if (session?.user.name) {
    //   writeLog()
    // }
  }, [pathname])

  return (
    <ThemeProvider attribute='class' disableTransitionOnChange>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}

export default Providers
