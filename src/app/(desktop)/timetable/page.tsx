'use client'
// import { useCallback, useRef } from 'react'
// import Cookie from 'js-cookie'
import toast from 'react-hot-toast'

import { useMediaQuery } from '@/hooks/use-media-query'
// import toast from 'react-hot-toast'
// import { OutTimeTable, TimeTable } from '@/types'
import { useToPng } from '@hugocxl/react-to-image'
import { IconShare2 } from '@tabler/icons-react'

// import { useQuery } from '@tanstack/react-query'
import DesktopTimeTable from './desktop-timebale'
import MobileTimeTable from './mobile-timetable'

const TimeTablePage = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // const week = ['一', '二', '三', '四', '五', '六', '日']

  // const trackShareTimeTable = () => {
  //   const studentId = Cookie.get('cookie_userid') ?? ''
  //   const data = studentId
  //   return data
  // }

  // const { isLoading, data } = useQuery<OutTimeTable>({
  //   queryKey: ['timetable'],
  //   queryFn: async () => {
  //     const res = await fetch(`/api/timetable?type=all&year=111&sem=2&userid=D11019247`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     })

  //     const data: TimeTable[] = await res.json()

  //     let timeTable: OutTimeTable = {
  //       week: [],
  //       timetable: []
  //     }

  //     for (let i = 0; i < 7; i++) {
  //       timeTable.week.push(data[i].week)
  //     }

  //     for (let i = 0; i < 14; i++) {
  //       timeTable.timetable.push([])
  //       for (let j = 0; j < 7; j++) {
  //         timeTable.timetable[i].push(data[j].timetable[i])
  //       }
  //     }

  //     console.log('timetable', timeTable)

  //     return timeTable
  //   }
  // })

  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',')
    if (arr) {
      const mime = arr[0].match(/:(.*?);/)![1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }
  }

  const Share = (title: string, text: string, file: File) => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: text,
          files: [file]
        })
        .then(() => {
          console.log('已分享')
        })
        .catch(console.error)
    } else {
      console.log('Web Share API 不支援')
    }
  }
  const [state, convertToPng, ref] = useToPng<HTMLDivElement>({
    onStart: () => {
      // 跑0.5秒的loading
      toast.loading('圖片生成中...')
    },
    onSuccess: (data) => {
      // 下載圖片(data)
      const file = dataUrlToFile(data, '課表.png')
      toast.remove()
      toast.success('圖片生成成功')
      Share('課表', '課表', file as File)
    }
  })

  return (
    <>
      <div className='relative mb-3 flex flex-col items-center'>
        <h1 className='w-full text-center text-2xl font-bold md:text-left'>課表</h1>

        <IconShare2
          size={30}
          className='absolute right-0 top-0 cursor-pointer'
          onClick={() => {
            convertToPng()
            //   saveImage()
            //   umami.track('課表分享', {
            //     data: trackShareTimeTable()
            //   })
          }}
        />
      </div>

      {isDesktop ? <DesktopTimeTable ref={ref} /> : <MobileTimeTable ref={ref} />}
    </>
  )
}

export default TimeTablePage
