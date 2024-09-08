'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'

export const login = async (accessToken: string) => {
  const auth = await getAuth(cookies().get('accessToken')?.value ?? '')
  const userSettings = await prisma.userSettings.findFirst({
    where: {
      userId: auth?.userId
    }
  })
  return userSettings
}

export const logout = async () => {
  // 移除所有Cookies

  for (const cookie of cookies().getAll()) {
    cookies().delete(cookie.name)
  }
  redirect('/login')
}
