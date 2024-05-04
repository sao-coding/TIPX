"use client"

import React, { useEffect } from "react"
import { useInView } from "react-intersection-observer"

import Card from "@/app/components/card"
import Loading from "@/app/components/loading"
import { Announcement } from "@/types"
import { useInfiniteQuery } from "@tanstack/react-query"

const AnnouncementCP = () => {
  const { ref, inView } = useInView()
  const limit = 10
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    Announcement[]
  >({
    queryKey: ["announcement"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/post?type=all&page=${pageParam}&limit=${limit}`)
      return res.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      //   console.log({
      //     lastPage,
      //     allPages
      //   })
      return lastPage.length === limit ? allPages.length + 1 : undefined
    }
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <div className='flex flex-col gap-2 md:gap-5'>
      {isSuccess &&
        data.pages.map((page: Announcement[]) =>
          page.map((data, i) => {
            return (
              <React.Fragment key={data.id}>
                <hr className='block md:hidden' />
                {page.length === i + 1 ? <Card ref={ref} data={data} /> : <Card data={data} />}
              </React.Fragment>
            )
          })
        )}
      {isFetchingNextPage || !data
        ? Array.from(Array(10).keys()).map((index) => <Loading key={index} />)
        : !hasNextPage && (
            <div className='mb-4 border-t text-center text-gray-500 md:border-0'>
              沒有更多公告了
            </div>
          )}
    </div>
  )
}

export default AnnouncementCP
