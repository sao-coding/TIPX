'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import isUaWebView from 'is-ua-webview'
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

  const t = useTranslations('LoginPage.login-dialog')

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
    setIsWebView(isUaWebView(window.navigator.userAgent))
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
      toast.error(t('toast.student-id-required'))
      return
    }

    if (authCode === '') {
      toast.error(t('toast.auth-code-required'))
      return
    }

    const toastId = toast.loading(t('toast.login-loading'))
    const status = await signIn('credentials', {
      redirect: false,
      userId,
      password: authCode
    })

    if (status?.error) {
      toast.error(t('toast.auth-code-wrong'), { id: toastId })
    } else {
      const userSettings = await login(Cookies.get('accessToken') || '')
      console.log('userSettings', userSettings)
      localStorage.setItem('theme', userSettings?.theme || 'system')
      toast.success(t('toast.login-success'), { id: toastId })
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
            <Label htmlFor='user-id'>{t('student-id')}</Label>
            <Input id='user-id' />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='auth-code' className='flex items-center gap-2'>
              {t('auth-code')}
              <span className='line-clamp-1 flex-1 text-xs text-muted-foreground'>
                {t('auth-code-description')}
              </span>
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
              {t('keep-login')}
            </Label>
          </div>
          <Button type='submit' className='w-full'>
            {t('login')}
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
                {t('not-support-webview')}
                <br />
                <span className='text-red-500'>{t('not-support-webview-warning')}</span>
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
                {t('login-with-google')}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default LoginForm
