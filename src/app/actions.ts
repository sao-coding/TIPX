'use server'

import { cookies as cookieStore } from 'next/headers'
import { redirect } from 'next/navigation'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'

export const login = async (accessToken: string) => {
  const auth = await getAuth(accessToken)
  const userSettings = await prisma.userSettings.findFirst({
    where: {
      userId: auth?.userId
    }
  })
  return userSettings
}

export const loginWithRedirect = async () => {
  const cookies = await cookieStore()
  const refreshToken = await getAuth(cookies.get('refreshToken')?.value ?? '')
  const accessToken = await getAuth(cookies.get('accessToken')?.value ?? '')
  console.log('loginWithRedirect', refreshToken, accessToken, refreshToken || accessToken)
  return refreshToken || accessToken ? true : false
}

export const logout = async () => {
  // 移除所有Cookies
  const cookies = await cookieStore()
  for (const cookie of cookies.getAll()) {
    cookies.delete(cookie.name)
    redirect('/login')
  }
}
