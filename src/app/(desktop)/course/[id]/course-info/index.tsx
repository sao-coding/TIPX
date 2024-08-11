'use client'

import clsx from 'clsx'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
// import BottomToUpTransitionView from '@/components/transition/BottomToUpTransitionView'
import { CourseInfo } from '@/types'
import {
  IconAlertTriangle,
  IconArrowAutofitContent,
  IconCalendarEvent,
  IconCertificate,
  IconChalkboard,
  IconClock,
  IconLanguageHiragana,
  IconSelect,
  IconSlash,
  IconStar,
  IconUserStar,
  IconWand
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const CourseInfoPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useQuery<CourseInfo>({
    queryKey: ['course-info', params.id],
    queryFn: async () => {
      // const res = await fetch(`/api/course-info?course=${params.id}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await res.json()
      // return data

      const { data } = await api.get(`/course-info?course=${params.id}`)
      return data
    }
  })

  const typeColor: { [key: string]: string } = {
    必修: 'bg-blue-500',
    選修: 'bg-green-500',
    通識: 'bg-yellow-500'
  }

  return (
    // <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
    //     <img src='https://www.lazyweb.com.tw/images/coming_soon.jpg' alt='' />
    // </div>
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* <div className='mb-2 rounded-lg border-l-4 border-orange-500 bg-orange-400/80 p-1 text-center text-white/80'>
            <IconAlertTriangle className='mr-1 inline-block' />
            警告：本課程資訊爬蟲結果僅供參考
            <br />
            請以 TIP 系統為主！
          </div> */}
          <Alert className='mb-2' variant='destructive'>
            <IconAlertTriangle className='' />
            <AlertTitle className='text-base'>警告</AlertTitle>
            <AlertDescription>本課程資訊結果僅供參考，請以 TIP 系統為主！</AlertDescription>
          </Alert>
          {data && (
            <div className='flex flex-col space-y-2'>
              {/* <BottomToUpTransitionView> */}
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex w-full items-center gap-1 rounded-sm border px-2 py-1'>
                  <IconUserStar />
                  <div>{data.teacher}</div>
                </div>
                <div className='flex w-full items-center gap-1 rounded-sm border px-2 py-1'>
                  <IconSelect />
                  <div className={clsx('rounded-md px-2 text-white', typeColor[data.required])}>
                    {data.required}
                  </div>
                </div>
                <div className='flex w-full items-center gap-1 rounded-sm border px-2 py-1'>
                  <IconChalkboard />
                  {data.class}
                </div>
                <div className='flex w-full items-center gap-1 rounded-sm border px-2 py-1'>
                  <div className='flex items-center'>
                    <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                    <IconSlash className='-mx-1 rotate-[160deg]' />
                    <IconClock />
                  </div>
                  <div>{data.credit}</div>
                </div>
                <div className='flex w-full items-center gap-1 rounded-sm border px-2 py-1'>
                  <IconLanguageHiragana />
                  <div>{data.foreign === '是' ? '✅' : '❌'}</div>
                </div>
                <div className='flex w-full items-center gap-1 rounded-sm border px-2 py-1'>
                  <IconArrowAutofitContent />
                  <div>{data.distance === '是' ? '✅' : '❌'}</div>
                </div>
              </div>
              {/* </BottomToUpTransitionView> */}
              {/* // <BottomToUpTransitionView custom={1}> */}
              <div className='whitespace-pre-line rounded-lg border p-2'>
                <div className='flex items-center'>
                  <IconWand className='mr-1' />
                  <div className='text-lg font-bold'>授課方式：</div>
                </div>
                {data.method}
              </div>
              {/* </BottomToUpTransitionView> */}
              {/* // <BottomToUpTransitionView custom={2}> */}
              <div className='whitespace-pre-line rounded-lg border p-2'>
                <div className='flex items-center'>
                  <IconCertificate className='mr-1' />
                  <div className='text-lg font-bold'>評分方式：</div>
                </div>
                {data.assessment}
              </div>
              {/* </BottomToUpTransitionView> */}
              {/* // <BottomToUpTransitionView custom={3}> */}
              <div className='whitespace-pre-line rounded-lg border p-2'>
                <div className='flex items-center'>
                  <IconCalendarEvent className='mr-1' />
                  <div className='text-lg font-bold'>每週課程內容：</div>
                </div>
                {data.content.map((item) => (
                  <div className='mb-2 border-b pb-2 last:border-b-0' key={item.week}>
                    <div>{item.week}</div>
                    <div>{item.content}</div>
                    <div>{item.remark}</div>
                  </div>
                ))}
              </div>
              {/* </BottomToUpTransitionView> */}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default CourseInfoPage
