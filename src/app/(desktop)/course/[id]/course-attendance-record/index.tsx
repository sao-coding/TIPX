'use client'

// import BottomToUpTransitionView from '@/components/transition/BottomToUpTransitionView'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { CourseAttendanceRecord } from '@/types'
import { useQuery } from '@tanstack/react-query'

import Card from './card'

const CourseAttendanceRecordPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useQuery<CourseAttendanceRecord>({
    queryKey: ['course-attendance-record', params.id],
    queryFn: async () => {
      // const res = await fetch(`/api/course-attendance-record?course=${params.id}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await res.json()
      // return data

      const { data } = await api.get(`course-attendance-record?course=${params.id}`)

      return data
    }
  })
  // 只顯示曠課，事假，病假，生理假，公假，喪假
  const leaveType = ['曠課', '事假', '病假', '生理假', '公假', '喪假']

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data && (
            // <BottomToUpTransitionView>
            <>
              <div className='mb-2 grid grid-cols-2 gap-2'>
                {data?.total.map((item, index) => {
                  if (leaveType.includes(item.type)) {
                    return (
                      <div key={index} className='rounded-sm border bg-background1 p-2'>
                        <div>{item.type}</div>
                        <div className='w-full text-right text-lg font-bold'>{item.count}</div>
                      </div>
                    )
                  }
                })}
              </div>
              <div className='sticky left-0 top-0 mb-2 rounded-sm border bg-background1 p-2'>
                <div>總計</div>
                <div className='w-full text-right text-lg font-bold'>
                  {data?.total.reduce((a, b) => a + b.count, 0)}
                </div>
              </div>
              <div className='space-y-2'>
                {data?.list?.map((item, index) => <Card key={index} data={item} />)}
              </div>
            </>
            // </BottomToUpTransitionView>
          )}
        </>
      )}
    </>
  )
}

export default CourseAttendanceRecordPage
