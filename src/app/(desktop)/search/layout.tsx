import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // 解析 JWT
  const accessToken = cookies().get('accessToken')?.value.split('.')[1] || ''
  const jwtData = JSON.parse(atob(accessToken))
  console.log('#user', jwtData)
  // 取得用戶資料
  const user = await prisma.user.findUnique({
    where: {
      id: jwtData.userId
    },
    select: {
      role: true
    }
  })

  console.log('#user', user)

  const role = user?.role || 'USER'

  if (role === 'USER') {
    redirect('/user')
  }

  return {
    title: 'TIPX | 查詢用戶'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
