'use client'
import toast from 'react-hot-toast'

import { useToPng } from '@hugocxl/react-to-image'
import { IconUserHexagon } from '@tabler/icons-react'

const Test: React.FC = () => {
  // const ref = useRef<HTMLDivElement>(null)
  // const [state, convertToPng, ref] = useToPng<HTMLDivElement>({
  //   onStart: () => {
  //     // 跑0.5秒的loading
  //     toast.loading('圖片生成中...')
  //   },
  //   onSuccess: (data) => {
  //     // 下載圖片(data)
  //     const file = dataUrlToFile(data, '課表.png')
  //     toast.remove()
  //     toast.success('圖片生成成功')
  //     Share('課表', '課表', file as File)
  //   }
  // })
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
      <div className='absolute left-0 top-20 h-[630px] w-[1200px]'>
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
      </div>
      <button className='bg-main-color-2 fixed bottom-0 z-10 px-2 py-1' onClick={convertToPng}>
        生成OG圖
      </button>
    </>
  )
}

export default Test
