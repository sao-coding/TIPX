'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Cookies from 'js-cookie'
import toast, { useToasterStore } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { site } from '@/config/site'
import getCurrentYearSem from '@/utils/current-year-sem'
import { IconBrandGoogle, IconLoader2 } from '@tabler/icons-react'

const LoginForm = () => {
  const [loading, setLoading] = React.useState(false)
  const searchParams = useSearchParams()
  const pathname = searchParams.get('redirect') || '/'

  const { toasts } = useToasterStore()
  const TOAST_LIMIT = 2
  // Enforce Limit
  React.useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
      .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) removal without animation
  }, [toasts])

  // 判斷學年度
  React.useEffect(() => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName)
    })
    const setCurrentYearSem = async () => {
      const { currentYear, currentSem } = getCurrentYearSem()
      Cookies.set('cookie_year', currentYear, { expires: site.cookie.expires })
      Cookies.set('cookie_sem', currentSem, { expires: site.cookie.expires })
    }
    setCurrentYearSem()
  }, [])

  const fetchLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if ((document.querySelector('#studentID') as HTMLInputElement)?.value === '') {
      toast.error('請輸入學號')
      return
    }

    if ((document.getElementById('authcode') as HTMLInputElement)?.value === '') {
      toast.error('請輸入授權碼')
      return
    }

    const toastId = toast.loading('登入中...')
    const status = await signIn('credentials', {
      redirect: false,
      studentID: (document.getElementById('student-id') as HTMLInputElement)?.value,
      password: (document.getElementById('auth-code') as HTMLInputElement)?.value
    })

    if (status?.error) {
      toast.error('授權碼錯誤', { id: toastId })
    } else {
      toast.success('登入成功', { id: toastId })
      // 延遲1秒跳轉
      setTimeout(() => {
        window.location.href = searchParams.get('redirect') ?? '/user'
      }, 1000)
    }
  }

  return (
    <>
      <div className='grid gap-4'>
        <form onSubmit={(e) => fetchLogin(e)} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='student-id'>學號</Label>
            <Input id='student-id' />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='auth-code'>
              授權碼<span className='ml-2 text-xs text-gray-400'>一般人請使用 Google 登入</span>
            </Label>
            <Input id='auth-code' />
          </div>
          <Button type='submit' className='w-full'>
            登入
          </Button>
        </form>
        <Button
          onClick={() => {
            setLoading(true)
            signIn('google', {
              redirect: false,
              callbackUrl: pathname
            })
          }}
        >
          {/* <IconBrandGoogle size={20} className='mx-1' /> */}
          {loading ? (
            <IconLoader2 size={20} className='mx-1 animate-spin' />
          ) : (
            <IconBrandGoogle size={20} className='mx-1' />
          )}
          使用 Google 登入
        </Button>
      </div>
    </>
  )
}

export default LoginForm
