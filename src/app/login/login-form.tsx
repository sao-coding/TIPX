'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
// import isUaWebView from 'is-ua-webview'
import Cookies from 'js-cookie'
import toast, { useToasterStore } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { site } from '@/config/site'
import getCurrentYearSem from '@/utils/current-year-sem'
import { IconBrandGoogle, IconLoader2 } from '@tabler/icons-react'

import { login } from '../actions'

const LoginForm = () => {
  const searchParams = useSearchParams()
  const [loading, setLoading] = React.useState(false)
  const [isWebView, setIsWebView] = React.useState<boolean | null>(null)
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

  React.useEffect(() => {
    // setIsWebView(isUaWebView(window.navigator.userAgent))
    setIsWebView(true)
  }, [])

  // 判斷學年度
  React.useEffect(() => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName)
    })
    const setCurrentYearSem = async () => {
      const { currentYear, currentSem } = getCurrentYearSem()
      Cookies.set('year', currentYear, { expires: site.cookies.expires })
      Cookies.set('sem', currentSem, { expires: site.cookies.expires })
    }
    setCurrentYearSem()
  }, [])

  const fetchLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userId = (document.querySelector('#user-id') as HTMLInputElement)?.value
    const authCode = (document.querySelector('#auth-code') as HTMLInputElement)?.value

    if (userId === '') {
      toast.error('請輸入學號')
      return
    }

    if (authCode === '') {
      toast.error('請輸入授權碼')
      return
    }

    const toastId = toast.loading('登入中...')
    const status = await signIn('credentials', {
      redirect: false,
      userId,
      password: authCode
    })

    if (status?.error) {
      toast.error('授權碼錯誤', { id: toastId })
    } else {
      const userSettings = await login(Cookies.get('accessToken') || '')
      console.log('userSettings', userSettings)
      localStorage.setItem('theme', userSettings?.theme || 'system')
      toast.success('登入成功', { id: toastId })
      // 延遲1秒跳轉
      setTimeout(() => {
        window.location.href = pathname
      }, 1000)
    }
  }

  return (
    <>
      <div className='grid gap-4'>
        <form onSubmit={fetchLogin} className='grid gap-4'>
          <div className='grid gap-3'>
            <Label htmlFor='user-id'>學號</Label>
            <Input id='user-id' />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='auth-code' className='flex items-center gap-2'>
              授權碼<span className='text-xs text-gray-400'>一般人請使用 Google 登入</span>
            </Label>
            <Input id='auth-code' />
          </div>
          <div className='flex items-center gap-2'>
            {/* 保持登入 */}
            <Checkbox
              id='keep-login'
              // 勾選就把 cookie_keep_login 設為 true 存到 cookie
              onCheckedChange={(checked) => {
                Cookies.set('cookie_keep_login', checked ? 'true' : 'false')
              }}
            />
            <Label htmlFor='keep-login' className='text-xs text-gray-400'>
              保持登入
            </Label>
          </div>
          <Button type='submit' className='w-full'>
            登入
          </Button>
        </form>
        {isWebView === null ? (
          <div className='mx-auto flex h-10 items-center'>
            <IconLoader2 className='animate-spin' />
          </div>
        ) : (
          <>
            {isWebView ? (
              <p className='text-center text-gray-500'>
                Google 登入無法在 WebView 中使用
                <br />
                <span className='text-red-500'>請開啟 Chrome 或 Safari 進行登入</span>
              </p>
            ) : (
              <Button
                onClick={async () => {
                  setLoading(true)
                  const userSettings = await login(Cookies.get('accessToken') || '')
                  console.log('userSettings', userSettings)
                  localStorage.setItem('theme', userSettings?.theme || 'system')
                  signIn('google', {
                    redirect: false
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
            )}
          </>
        )}
      </div>
    </>
  )
}

export default LoginForm
