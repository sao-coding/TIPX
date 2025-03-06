'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { defaultLocale } from '@/i18n/config'
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
  const refreshToken = await getAuth(cookies().get('refreshToken')?.value ?? '')
  const accessToken = await getAuth(cookies().get('accessToken')?.value ?? '')
  console.log('loginWithRedirect', refreshToken, accessToken, refreshToken || accessToken)
  return refreshToken || accessToken ? true : false
}

export const logout = async () => {
  // 移除所有Cookies

  for (const cookie of cookies().getAll()) {
    cookies().delete(cookie.name)
  }
  redirect('/login')
}

// export async function getUserLocale() {
export const getUserLocale = async () => {
  return (await cookies()).get('language')?.value || defaultLocale
}
