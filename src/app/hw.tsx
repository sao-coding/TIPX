'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { HwList } from '@/types'
import formatDatetime from '@/utils/format-datetime'
import { IconCalendarOff, IconLoader2 } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const Hw = () => {
  const {
    isLoading,
    isError,
    data: Hw
  } = useQuery<{ course: string; hw: HwList[] }[]>({
    queryKey: ['tool-hw'],
    queryFn: async () => {
      const res = await fetch(`/api/hw?year=111&sem=1&userid=D11019247&type=tool`)
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
      {isLoading ? (
        <div className='flex h-full w-full items-center'>
          <IconLoader2 className='mx-auto h-10 w-10 animate-spin' />
        </div>
      ) : (
        <ScrollArea className='h-full'>
          {Hw?.map((item, index) => (
            <div key={index}>
              <div className='sticky top-0 bg-background1 px-3 py-2'>
                <h1 className='line-clamp-1 text-lg font-bold text-orange-500'>
                  課程: {item.course}
                </h1>
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
      )}
    </>
  )
}

export default Hw
