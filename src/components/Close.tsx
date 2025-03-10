'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { IconArrowLeft } from '@tabler/icons-react'

const Close = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const router = useRouter()

  const handleBack = () => {
    console.log(
      'window.判斷是否用google的返回',
      window.history.state.__PRIVATE_NEXTJS_INTERNALS_TREE[1].children[1].children[1].children[1]
        .children[3]
    )
    if (
      window.history.length < 2 ||
      window.history.state.__PRIVATE_NEXTJS_INTERNALS_TREE[1].children[1].children[1].children[1]
        .children[3] === 'refresh'
    ) {
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
