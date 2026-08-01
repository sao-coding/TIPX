'use client'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

import { useToPng } from '@hugocxl/react-to-image'
import { IconUser, IconUserHexagon } from '@tabler/icons-react'

const Test: React.FC = () => {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const title = searchParams.get('title')

  const [state, convertToPng, ref] = useToPng<HTMLDivElement>({
    onStart: () => {
      // 跑0.5秒的loading
      toast.loading('圖片生成中...')
    },
    onSuccess: (data) => {
      // 下載圖片(data)
      const link = document.createElement('a')
      link.href = data
      link.download = 'OG.png'
      link.click()
      toast.remove()
    }
  })
  return (
    <>
      <div className='flex h-screen items-center justify-center'>
        <div className='relative h-[630px] w-[1200px]'>
          {type === 'site' ? (
            <div
              ref={ref}
              className='flex h-full w-full flex-col items-center justify-center px-14 py-12 text-white'
              style={{
                background: 'linear-gradient(to bottom right, #1a2a6c, #b21f1f, #fdbb2d)'
              }}
            >
              <IconUserHexagon className='flex h-40 w-40' />
              <div className='text-5xl' style={{ fontFamily: 'ShortStack' }}>
                TIPX
              </div>
            </div>
          ) : (
            <div
              ref={ref}
              className='flex h-full w-full flex-col items-center justify-center gap-1 px-14 py-12 text-white'
              style={{
                background: 'linear-gradient(to bottom right, #1a2a6c, #b21f1f, #fdbb2d)'
              }}
            >
              <IconUser className='flex h-40 w-40' />
              <div className='text-5xl' style={{ fontFamily: 'sao' }}>
                {title}
              </div>
              <div className='absolute bottom-12 flex w-full items-center justify-between px-14'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='60'
                  height='60'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                >
                  <path d='M12 13a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z'></path>
                  <path d='M6.201 18.744a4 4 0 0 1 3.799 -2.744h4a4 4 0 0 1 3.798 2.741'></path>
                  <path d='M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z'></path>
                </svg>
                <div className='text-5xl' style={{ fontFamily: 'ShortStack' }}>
                  TIPX
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button className='fixed bottom-0 z-10 bg-primary px-2 py-1' onClick={convertToPng}>
        生成OG圖
      </button>
    </>
  )
}

export default Test
