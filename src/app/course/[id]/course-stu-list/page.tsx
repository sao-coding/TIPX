"use client"

import Card from "@/components/course-stu-list/card"
import BottomToUpTransitionView from "@/components/transition/BottomToUpTransitionView"
import { CourseStuList } from "@/types"
import { useQuery } from "@tanstack/react-query"

import "@/app/loaderCat.css"

const CourseStuListPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useQuery<CourseStuList[]>({
    queryKey: ["course-stu-list", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/course-stu-list?course=${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      return data
    }
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
          {data && data.length > 0 ? (
            <>
              {data.map((item, index) => (
                <BottomToUpTransitionView key={item.id} custom={index}>
                  <Card key={item.id} data={item} />
                </BottomToUpTransitionView>
              ))}
            </>
          ) : (
            <div className='text-center text-2xl'>沒有學生</div>
          )}
        </div>
      )}
    </>
  )
}

export default CourseStuListPage
