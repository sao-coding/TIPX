"use client"

import Cookie from "js-cookie"

import Card from "@/components/hw/card"
import BottomToUpTransitionView from "@/components/transition/BottomToUpTransitionView"
import { HwList } from "@/types"
import { useQuery } from "@tanstack/react-query"

const HwPage = ({ params }: { params: { id: string } }) => {
  const { data: course } = useQuery({
    queryKey: ["course", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/course?course=${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      return data
    },
    refetchOnWindowFocus: false
  })

  const { data, isLoading } = useQuery({
    queryKey: ["hw", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/hw?course=${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      return data
    },
    refetchOnWindowFocus: false
  })

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
        <div className='w-full'>
          {data.status && (
            <>
              <div className='whitespace-pre-line rounded-xl border-2 border-dashed border-main-color-2 p-2 text-center text-2xl'>
                {data.message}
              </div>
              <div className='flex w-full justify-center border-b'>
                <img src='/img/QQ.png' alt='' />
              </div>
            </>
          )}
          {data.data && data.data.length > 0 && course && (
            <>
              {console.log(data.data)}
              {data.data.map((item: HwList, index: number) => (
                <BottomToUpTransitionView key={index} custom={index}>
                  <Card
                    course={course.name}
                    data={item}
                    studentID={Cookie.get("cookie_userid") ?? ""}
                  />
                </BottomToUpTransitionView>
              ))}
            </>
          )}
          {data && data.length === 0 && <div className='text-center text-2xl'>沒有作業</div>}
        </div>
      )}
    </>
  )
}

export default HwPage
