"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

import Title from "@/components/Title"
import { student } from "@prisma/client"
import { useInfiniteQuery } from "@tanstack/react-query"

import Card from "./card"
import Loading from "./loading"

const SearchPage = () => {
  const [search, setSearch] = useState("")
  const { ref, inView } = useInView()
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery<student[]>({
      queryKey: ["search", search],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await fetch(`/api/search?search=${search}&id=${pageParam}&limit=10`)
        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }
        return data
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 10 ? allPages.length * 10 : undefined
      }
    })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const title = {
    title: "查詢用戶",
    position: "text-center",
    close: true
  }

  return (
    <div className='mb-2 w-full px-2'>
      <Title title={title} />
      <div className='px-2 md:px-0'>
        <input
          type='search'
          name=''
          id=''
          className='mb-4 w-full rounded-xl border px-2 py-1 text-lg focus:outline-none focus:ring-2 focus:ring-main-color-2'
          placeholder='輸入學號或姓名'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* <div>{isLoading ? "載入中" : ""}</div> */}
        <div className='flex flex-col gap-2'>
          {isSuccess &&
            !isError &&
            data.pages.map((page: student[]) =>
              page.map((item, i) => {
                if (page.length === i + 1) {
                  return <Card key={item.userid} ref={ref} student={item} />
                }
                return <Card key={item.userid} student={item} />
              })
            )}
          {(isFetchingNextPage || !data) && !isError ? (
            Array.from(Array(10).keys()).map((index) => <Loading key={index} />)
          ) : !hasNextPage && !isError ? (
            <div className='text-center text-gray-500'>沒有更多用戶了</div>
          ) : (
            <div className='text-center text-red-500'>無此權限或發生錯誤，請聯絡管理員</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
