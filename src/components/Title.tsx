import { cn } from '@/lib/utils'

import Close from './Close'

const Title = ({
  title,
  close,
  children
}: {
  title: string
  close?: boolean
  children: React.ReactNode
}) => {
  return (
    <>
      {/* 有 children 顯示以下 */}
      {/* mb-3 flex flex-col items-center gap-3 md:flex-row */}
      <div
        className={cn('relative', children && 'mb-2 flex flex-col items-center gap-3 md:flex-row')}
      >
        {/* <h1 className='mb-3 w-full text-center text-2xl font-bold md:py-1 md:text-left'>課程</h1> */}
        {/* 如果沒有 children 就只顯示 title */}
        {/* mb-3 w-full text-center text-2xl font-bold md:py-1 md:text-left */}
        {/* 有 children 顯示以下 */}
        {/* w-full text-center text-2xl font-bold md:text-left */}
        <>{close && <Close />}</>
        <h1
          className={cn(
            'w-full text-center text-2xl font-bold md:text-left',
            children ? '' : 'mb-3 md:py-1'
          )}
        >
          {title}
        </h1>
        {children}
      </div>
    </>
  )
}

export default Title
