'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const logout = async () => {
  // 移除所有Cookies

  for (const cookie of cookies().getAll()) {
    cookies().delete(cookie.name)
  }
  redirect('/login')
}
