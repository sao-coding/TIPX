'use client'

import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

import { logout } from '@/app/actions'
import { IconLogout } from '@tabler/icons-react'

const Logout = () => {
  const t = useTranslations('Menu')
  return (
    <div
      className='flex w-full rounded-sm border bg-background1 p-2 hover:bg-accent hover:text-accent-foreground md:justify-center md:border-none md:bg-transparent xl:justify-start'
      onClick={async () => {
        console.log('logout')

        const status = await signOut({
          redirect: false
        })
        if (status) {
          toast.success('登出成功')
          logout()
        }
      }}
    >
      <div className='flex cursor-pointer items-center gap-2'>
        <IconLogout className='stroke-red-500' />
        <span className='block md:hidden xl:block'>{t('logout')}</span>
      </div>
    </div>
  )
}

export default Logout
