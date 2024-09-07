'use server'

import { cookies } from 'next/headers'

export const logout = async () => {
  // 移除所有Cookies
  for (const cookie of cookies().getAll()) {
    cookies().delete(cookie.name)
  }
}
