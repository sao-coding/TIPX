'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { IconArrowLeft } from '@tabler/icons-react'

const Close = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    // console.log('handleBack', { pathname, historyLength: window.history.length })
    if (pathname.startsWith('/post/')) {
      router.push('/')
    } else {
      router.back()
    }
  }

  return (
    <button
      // className='absolute left-0 top-0 flex h-full items-center pl-2 md:hidden'
      className={cn('absolute left-0 top-0 flex h-full items-center pl-2 md:hidden', className)}
      onClick={handleBack}
    >
      {children ? children : <IconArrowLeft size={26} />}
    </button>
  )
}

export default Close
