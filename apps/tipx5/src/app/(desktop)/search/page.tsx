'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'

import Title from '@/components/Title'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { Student } from '@prisma/client'
import { IconUserCircle } from '@tabler/icons-react'
import { useInfiniteQuery } from '@tanstack/react-query'

import Card from './card'

const Loading = () => {
  return (
    <div className='relative flex h-[118px] items-center rounded-sm border bg-background1 p-2'>
      <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md border'>
        <IconUserCircle size={75} />
      </div>
      <div className='space-y-3 px-2'>
        <div className='h-3 w-20 rounded-full bg-neutral-500'></div>
        <div className='h-3 w-20 rounded-full bg-neutral-500'></div>
        <div className='h-3 w-28 rounded-full bg-neutral-500'></div>
        <div className='h-3 w-44 rounded-full bg-neutral-500'></div>
      </div>
      {/* <div className='absolute top-2 right-2 px-1 bg-neutral-500 rounded-lg font-mono w-20 h-6'></div> */}
    </div>
  )
}

const SearchPage = () => {
  const [search, setSearch] = React.useState('')
  const { ref, inView } = useInView()
  const { status, data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    Student[]
  >({
    queryKey: ['search', search],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const { data } = await api.get('/search', {
          params: {
            type: 'search',
            search,
            id: pageParam,
            limit: 10
          }
        })

        return data
      } catch (error) {
        console.error('search error', error)
        throw new Error()
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined
    }
  })

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const isSuccess = status === 'success'
  const isLoading = status === 'pending' || isFetchingNextPage
  const isError = status === 'error'
  const noMore = !hasNextPage && !isError

  const titleData = {
    title: '查詢用戶',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      {!isError && (
        <Input
          type='search'
          name=''
          id=''
          className='mb-4'
          placeholder='輸入學號或姓名'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <div className='flex flex-col gap-2'>
        {isSuccess
          ? data.pages.map((page: Student[]) =>
              page.map((item, i) => {
                if (page.length === i + 1) {
                  return <Card key={item.userId} ref={ref} student={item} />
                }
                return <Card key={item.userId} student={item} />
              })
            )
          : null}
        {isLoading ? Array.from(Array(10).keys()).map((index) => <Loading key={index} />) : null}
        {noMore ? <div className='text-center text-gray-500'>沒有更多用戶了</div> : null}
        {isError ? (
          <div className='text-center text-red-500'>無此權限或發生錯誤，請聯絡管理員</div>
        ) : null}
      </div>
    </>
  )
}

export default SearchPage
