'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HwList } from '@/types'
import formatDatetime from '@/utils/format-datetime'
import { IconBookDownload, IconCalendarOff, IconInfoCircle, IconLoader2 } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const Hw = () => {
  const {
    isLoading,
    isError,
    data: Hw
  } = useQuery<{ course: string; hw: HwList[] }[]>({
    queryKey: ['tool-hw'],
    queryFn: async () => {
      const res = await fetch(`/api/hw?year=111&sem=2&userid=D11019247&type=tool`)
      const data = await res.json()

      // data.data
      // 用課程分組作業
      // 判斷課程同一個課程的作業放在一起 課程名稱只顯示一次

      const hw: { course: string; hw: HwList[] }[] = []

      data.data.forEach((item: HwList) => {
        const index = hw.findIndex((x) => x.course === item.course)
        if (index === -1) {
          hw.push({ course: `${item.course}` ?? '', hw: [item] })
        } else {
          hw[index].hw.push(item)
        }
      })

      console.log({ hw })
      return hw
    }
  })

  return (
    <>
      <div className='overflow-hidden rounded-xl'>
        <header className='flex items-center justify-between bg-background2'>
          {/* 顯示總共多少未完成作業 */}
          <div className='flex items-center gap-1.5 px-3 py-2'>
            <IconBookDownload />
            未完成作業
            <span className='text-orange-500'>
              {Hw?.reduce((acc, item) => acc + item.hw.length, 0)}
            </span>
          </div>
          <div className='flex items-center'>
            <AlertDialog>
              <AlertDialogTrigger className='px-3 py-2'>
                <IconInfoCircle />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>這些是你尚未完成的作業，請盡快完成。</AlertDialogTitle>
                  <AlertDialogDescription>
                    這個小工具會自動幫你列出尚未完成的作業，
                    <br />
                    但結束時間已過的作業也會列出來，請注意。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                  <AlertDialogAction>確定</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>
        <div className='h-56 bg-background1'>
          {isLoading ? (
            <div className='flex h-full w-full items-center'>
              <IconLoader2 className='mx-auto h-10 w-10 animate-spin' />
            </div>
          ) : (
            <>
              {Hw && Hw.length > 0 ? (
                <ScrollArea className='h-full'>
                  {Hw.map((item, index) => (
                    <div key={index}>
                      <div className='sticky top-0 flex items-center justify-between gap-1 bg-background1 px-3 py-2'>
                        {/* 顯示此課程未完成作業數量 */}
                        <h1 className='line-clamp-1 text-lg font-bold text-orange-500'>
                          課程: {item.course}
                        </h1>
                        <div>
                          {/* <span className='text-sm text-neutral-500'>未完成作業: </span> */}
                          <span className='text-sm text-orange-500'>{item.hw.length}</span>
                        </div>
                      </div>
                      {item.hw.map((hw, index) => (
                        <div key={index} className='px-3 py-2'>
                          <h1 className='line-clamp-1'>作業: {hw.title}</h1>
                          <div className='flex items-center space-x-1 text-sm text-neutral-500'>
                            <IconCalendarOff size={20} />
                            <div>{formatDatetime('hw', hw.end)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className='h-[120px]' />
                </ScrollArea>
              ) : (
                <div className='flex h-full items-center justify-center'>
                  <span className='text-neutral-500'>沒有未完成的作業</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Hw
