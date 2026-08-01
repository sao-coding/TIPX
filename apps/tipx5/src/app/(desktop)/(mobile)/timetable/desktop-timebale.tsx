'use client'
// import { useCallback, useRef } from 'react'
import React from 'react'
import Link from 'next/link'
import Cookie from 'js-cookie'
import toast from 'react-hot-toast'

// import toast from 'react-hot-toast'
import { OutTimeTable, TimeTable } from '@/types'
import { useToPng } from '@hugocxl/react-to-image'
import { IconShare2 } from '@tabler/icons-react'

const DesktopTimeTable = ({ timetable }: { timetable: TimeTable[] }) => {
  const week = ['一', '二', '三', '四', '五', '六', '日']
  const timeTable: OutTimeTable = {
    week: [],
    timetable: []
  }

  for (let i = 0; i < 7; i++) {
    timeTable.week.push(timetable[i].week)
  }

  for (let i = 0; i < 14; i++) {
    timeTable.timetable.push([])
    for (let j = 0; j < 7; j++) {
      timeTable.timetable[i].push(timetable[j].timetable[i])
    }
  }

  const trackShareTimeTable = () => {
    const studentId = Cookie.get('cookie_userid') ?? ''
    const data = studentId
    return data
  }

  // const { isLoading, data } = useQuery<OutTimeTable>({
  //   queryKey: ['desktop-timebale', Cookies.get('year'), Cookies.get('sem')],
  //   queryFn: async () => {
  //     const { data } = await api.get<TimeTable[]>(`timetable?type=all`)

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
      // 開啟新視窗下載
      // window.open(URL.createObjectURL(new File([u8arr], filename, { type: mime })))
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
      <div className='relative mb-3 flex items-center py-1'>
        <h1 className='w-full text-center text-2xl font-bold md:text-left'>課表</h1>

        <IconShare2
          size={30}
          className='absolute right-0 top-0 cursor-pointer md:static'
          onClick={() => {
            convertToPng()
            //   saveImage()
            //   umami.track('課表分享', {
            //     data: trackShareTimeTable()
            //   })
          }}
        />
      </div>
      <div className='mb-16 w-full rounded-3xl px-2 pb-2 md:top-[68px] md:mb-0 md:p-0'>
        <div className='overflow-x-auto rounded-md md:flex md:items-center md:justify-center'>
          <div ref={ref} className='table w-[960px] table-fixed overflow-hidden rounded-md'>
            <div className='table-header-group'>
              {Array.from(Array(7).keys()).map((index) => (
                <div
                  className='table-cell whitespace-nowrap bg-background2 p-2 text-center'
                  key={index}
                >
                  星期{week[index]}
                </div>
              ))}
            </div>
            <div className='table-row-group'>
              {Array.from(Array(14).keys()).map((i) => (
                <div className='table-row' key={i}>
                  {/* {isLoading &&
                    Array.from(Array(7).keys()).map((item, index) => (
                      <div
                        // hsl(0deg 0% 12.55%)
                        className='relative table-cell border-r border-t bg-[hsl(0deg,_0%,_96.47%)] p-2 pb-6 first:border-l-0 last:border-r-0 dark:bg-[hsl(0deg,_0%,_12.55%)]'
                        key={index}
                      >
                        <div className='absolute bottom-1 right-1 table-cell whitespace-nowrap rounded-md bg-background3 px-1 text-center'>
                          <div>{i + 1}</div>
                        </div>

                        <div className='h-24 text-center' key={index}>
                          載入中...
                        </div>
                      </div>
                    ))} */}
                  {timeTable &&
                    timeTable.timetable.length > 0 &&
                    timeTable.timetable[i].map((item, index) => (
                      <div
                        className='relative table-cell border-r border-t bg-[hsl(0deg,_0%,_96.47%)] p-2 pb-6 first:border-l-0 last:border-r-0 dark:bg-[hsl(0deg,_0%,_12.55%)]'
                        key={index}
                      >
                        <div className='absolute bottom-1 right-1 table-cell whitespace-nowrap rounded-md bg-background3 px-1 text-center'>
                          <div>{i + 1}</div>
                        </div>
                        <div className='group rounded text-center hover:bg-primary/50'>
                          <Link
                            href={`/course/${item.id}?tab=規範`}
                            className='border-b-2 border-primary/50 text-blue-500 group-hover:border-none group-hover:text-white'
                          >
                            {item.course}
                          </Link>
                        </div>
                        <div className='text-center'>{item.classroom}</div>
                        <div className='text-center'>{item.teacher}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DesktopTimeTable
