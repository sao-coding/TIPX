'use client'

import React from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

import api from '@/lib/api'
import { TimeTable } from '@/types'
import { useToPng } from '@hugocxl/react-to-image'
import { IconLoader2, IconShare2 } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const MobileTimeTable = () => {
  const { isLoading, data } = useQuery<TimeTable[]>({
    queryKey: ['mobile-timetable', Cookies.get('year'), Cookies.get('sem')],
    queryFn: async () => {
      // const res = await fetch(`/api/timetable?type=all&year=111&sem=2&userid=D11019247`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })

      // const data = await res.json()

      const { data } = await api.get(`/timetable?type=all`)
      return data
    }
  })

  const lesson = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '十一',
    '十二',
    '十三',
    '十四'
  ]

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
      <div className='relative mb-3 flex items-center'>
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
      <div className='relative w-full'>
        <div className='overflow-x-auto rounded-md'>
          {isLoading && (
            <div className='fixed left-0 top-0 flex h-full w-full items-center justify-center'>
              <IconLoader2 className='h-12 w-12 animate-spin' />
            </div>
          )}
          <div ref={ref} className='table w-[1500px]'>
            <div className='table-header-group'>
              <div className='table-row bg-background2 text-center'>
                <div className='sticky left-0 table-cell w-14 bg-background2 p-2'>星期</div>
                {lesson.map((item, index) => (
                  <div key={index} className='table-cell w-20 p-2'>
                    第{item}節
                  </div>
                ))}
              </div>
            </div>

            <div className='table-row-group'>
              {data?.map((item, index) => (
                <div key={index} className='table-row'>
                  <div
                    key={index}
                    className='sticky left-0 table-cell bg-background2 p-2 text-center'
                  >
                    {item.week}
                  </div>
                  {item.timetable.map((course, index) => (
                    <div
                      key={index}
                      className='table-cell border-r border-t bg-[hsl(0deg,_0%,_96.47%)] p-2 first:border-l-0 last:border-r-0 dark:bg-[hsl(0deg,_0%,_12.55%)]'
                    >
                      <div className='rounded text-center hover:bg-background3'>
                        <Link
                          href={`/course/${course.id}?tab=規範`}
                          className='border-b-2 border-background3 text-blue-500'
                        >
                          {course.course}
                        </Link>
                      </div>
                      <div className='text-center'>{course.classroom}</div>
                      <div className='text-center'>{course.teacher}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='h-16'></div>
      </div>
    </>
  )
}

export default MobileTimeTable
