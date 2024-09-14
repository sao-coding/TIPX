import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const accessToken = cookies().get('accessToken')?.value.split('.')[1] || ''
  const jwtData = JSON.parse(atob(accessToken))

  // 取得用戶資料
  const user = await prisma.user.findUnique({
    where: {
      id: jwtData.userId
    },
    select: {
      role: true
    }
  })

  const role = user?.role || 'USER'

  if (role === 'USER') {
    redirect('/user')
  }

  return children
}
