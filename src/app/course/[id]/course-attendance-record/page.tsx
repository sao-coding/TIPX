"use client"

import Card from "@/components/course-attendance-record/card"
import BottomToUpTransitionView from "@/components/transition/BottomToUpTransitionView"
import { CourseAttendanceRecord } from "@/types"
import { useQuery } from "@tanstack/react-query"

const CourseAttendanceRecordPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useQuery<CourseAttendanceRecord>({
    queryKey: ["course-attendance-record", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/course-attendance-record?course=${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      return data
    }
  })
  // 只顯示曠課，事假，病假，生理假，公假，喪假
  const leaveType = ["曠課", "事假", "病假", "生理假", "公假", "喪假"]

  return (
    <>
      {isLoading ? (
        <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
          <div className='flex h-full w-full items-center justify-center'>
            <div className='cat'>
              <div className='cat__body'></div>
              <div className='cat__body'></div>
              <div className='cat__tail'></div>
              <div className='cat__head'></div>
            </div>
          </div>
        </div>
      ) : (
        <div className='h-full w-full'>
          {data && (
            <BottomToUpTransitionView>
              <div className='mb-2 grid grid-cols-2 gap-2'>
                {data?.total.map((item, index) => {
                  if (leaveType.includes(item.type)) {
                    return (
                      <div
                        key={index}
                        className='rounded-xl border bg-background p-2 md:bg-card-background'
                      >
                        <div>{item.type}</div>
                        <div className='w-full text-right text-lg font-bold'>{item.count}</div>
                      </div>
                    )
                  }
                })}
              </div>
              <div className='sticky left-0 top-0 mb-2 rounded-xl border bg-background p-2 md:top-[117px] md:bg-card-background'>
                <div>總計</div>
                <div className='w-full text-right text-lg font-bold'>
                  {data?.total.reduce((a, b) => a + b.count, 0)}
                </div>
              </div>
              {data?.list?.map((item, index) => <Card key={index} data={item} />)}
            </BottomToUpTransitionView>
          )}
        </div>
      )}
    </>
  )
}

export default CourseAttendanceRecordPage
