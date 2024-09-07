'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import toast from 'react-hot-toast'

import { logout } from '@/app/actions'
import { IconLogout } from '@tabler/icons-react'

const Logout = () => {
  const router = useRouter()

  return (
    <div
      className='flex w-full rounded-sm border bg-background1 p-2 hover:bg-accent hover:text-accent-foreground md:justify-center md:border-none md:bg-transparent xl:justify-start'
      onClick={async () => {
        console.log('logout')
        logout()
        const status = await signOut({
          redirect: false
        })
        if (status) {
          toast.success('登出成功')
          router.push('/login')
        }
      }}
    >
      <div className='flex items-center gap-2'>
        <IconLogout className='stroke-red-500' />
        <span className='block md:hidden xl:block'>登出</span>
      </div>
    </div>
  )
}

export default Logout
