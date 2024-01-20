"use client"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

import Card from "@/app/components/card"
import Loading from "@/app/components/loading"
import { Announcement } from "@/types"
import { useInfiniteQuery } from "@tanstack/react-query"

const AnnouncementCP = () => {
  const { ref, inView } = useInView()
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    Announcement[]
  >({
    queryKey: ["announcement"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/post?type=all&id=${pageParam}&limit=10`)
      return res.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      console.log({
        lastPage,
        allPages
      })

      return lastPage.length === 10 ? allPages.length * 10 : undefined
    }
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <>
      {isSuccess &&
        data.pages.map((page: Announcement[]) =>
          page.map((data, i) => {
            if (page.length === i + 1) {
              return <Card ref={ref} key={data.link} data={data} />
            }
            return <Card key={data.link} data={data} />
          })
        )}
      {isFetchingNextPage || !data
        ? Array.from(Array(5).keys()).map((index) => <Loading key={index} />)
        : !hasNextPage && (
            <div className='mb-4 border-t text-center text-gray-500 md:border-0'>
              沒有更多公告了
            </div>
          )}
    </>
  )
}

export default AnnouncementCP
