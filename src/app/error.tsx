'use client'

import toast from 'react-hot-toast'

import { logout } from '@/app/actions'
import { Button } from '@/components/ui/button'

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  // 清除快取
  const clearCache = async () => {
    // 清除全部 localStorage 和 cookies
    localStorage.clear()
    await logout()
    toast.success('快取已清除')
    // window.location.reload()
  }

  const errorMessages = (message: string) => {
    if (message.includes('refresh token is invalid')) {
      return '請重新登入'
    } else if (message.includes('Failed to fetch')) {
      return '網路連線異常，請檢查網路連線'
    } else if (message.includes('2160756782')) {
      return '資料庫伺服器異常，請稍後再試'
    } else {
      return message
    }
  }

  return (
    <>
      <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-background'>
        <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
          <div className='text-2xl font-bold'>發生錯誤</div>
          <div className='text-xl font-bold'>{errorMessages(error.digest ?? '')}</div>
          <a
            href='https://status.sao-x.com/status/tipx'
            className='border-b border-blue-500 text-blue-500'
          >
            查看系統狀態
          </a>
          <a
            href='https://www.instagram.com/_xox._.xox._.xox._.xox._.xox_'
            className='border-b border-blue-500 text-blue-500'
          >
            聯絡開發者
          </a>
          <Button variant='outline' onClick={() => reset()}>
            重新整理
          </Button>
          <Button variant='outline' onClick={() => clearCache()}>
            清除快取
          </Button>
        </div>
      </div>
    </>
  )
}

export default Error
