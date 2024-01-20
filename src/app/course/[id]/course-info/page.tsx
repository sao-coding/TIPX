"use client"

import clsx from "clsx"

import BottomToUpTransitionView from "@/components/transition/BottomToUpTransitionView"
import { CourseInfo } from "@/types"
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
} from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

const CourseInfoPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useQuery<CourseInfo>({
    queryKey: ["course-info", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/course-info?course=${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      return data
    }
  })

  const typeColor: { [key: string]: string } = {
    必修: "bg-blue-500",
    選修: "bg-green-500",
    通識: "bg-yellow-500"
  }

  return (
    // <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
    //     <img src='https://www.lazyweb.com.tw/images/coming_soon.jpg' alt='' />
    // </div>
    <div className=''>
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
        <div className='w-full'>
          <div className='mb-2 rounded-lg border-l-4 border-orange-500 bg-orange-400/80 p-1 text-center text-white/80'>
            <IconAlertTriangle className='mr-1 inline-block' />
            警告：本課程資訊爬蟲結果僅供參考
            <br />
            請以 TIP 系統為主！
          </div>
          {data && (
            <div className='flex flex-col space-y-2'>
              <BottomToUpTransitionView>
                <div className='grid grid-cols-2 gap-1'>
                  <div className='flex w-full items-center rounded-lg border p-1'>
                    <IconUserStar className='mr-1' />
                    <div>{data.teacher}</div>
                  </div>
                  <div className='flex w-full items-center rounded-lg border p-1'>
                    <IconSelect className='mr-1' />
                    <div className={clsx("rounded-lg px-1 text-white", typeColor[data.required])}>
                      {data.required}
                    </div>
                  </div>
                  <div className='flex w-full items-center rounded-lg border p-1'>
                    <IconChalkboard className='mr-1' />
                    {data.class}
                  </div>
                  <div className='flex w-full items-center rounded-lg border p-1'>
                    <div className='flex items-center'>
                      <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                      <IconSlash className='-mx-1 rotate-[160deg]' />
                      <IconClock className='mr-1' />
                    </div>
                    <div>{data.credit}</div>
                  </div>
                  <div className='flex w-full items-center rounded-lg border p-1'>
                    <IconLanguageHiragana className='mr-1' />
                    <div>{data.foreign === "是" ? "✅" : "❌"}</div>
                  </div>
                  <div className='flex w-full items-center rounded-lg border p-1'>
                    <IconArrowAutofitContent className='mr-1' />
                    <div>{data.distance === "是" ? "✅" : "❌"}</div>
                  </div>
                </div>
              </BottomToUpTransitionView>
              <BottomToUpTransitionView custom={1}>
                <div className='whitespace-pre-line rounded-lg border p-1'>
                  <div className='flex items-center'>
                    <IconWand className='mr-1' />
                    <div className='text-lg font-bold'>授課方式：</div>
                  </div>
                  {data.method}
                </div>
              </BottomToUpTransitionView>
              <BottomToUpTransitionView custom={2}>
                <div className='whitespace-pre-line rounded-lg border p-1'>
                  <div className='flex items-center'>
                    <IconCertificate className='mr-1' />
                    <div className='text-lg font-bold'>評分方式：</div>
                  </div>
                  {data.assessment}
                </div>
              </BottomToUpTransitionView>
              <BottomToUpTransitionView custom={3}>
                <div className='whitespace-pre-line rounded-lg border p-1'>
                  <div className='flex items-center'>
                    <IconCalendarEvent className='mr-1' />
                    <div className='text-lg font-bold'>每週課程內容：</div>
                  </div>
                  {data.content.map((item) => (
                    <div className='mb-2 border-b pb-2 last:border-b-0' key={item.week}>
                      <div className=''>{item.week}</div>
                      <div className=''>{item.content}</div>
                      <div className=''>{item.remark}</div>
                    </div>
                  ))}
                </div>
              </BottomToUpTransitionView>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CourseInfoPage
