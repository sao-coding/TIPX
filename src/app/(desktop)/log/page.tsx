'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'

import Title from '@/components/Title'
import api from '@/lib/api'
import { Log } from '@/types'
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

const LogPage = () => {
  const { ref, inView } = useInView()
  const { status, data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<Log[]>({
    queryKey: ['log'],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const { data } = await api.get('/log', {
          params: {
            page: pageParam,
            limit: 10
          }
        })

        return data
      } catch (error) {
        console.error('log error', error)
        throw new Error()
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined
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
    title: '日誌中心',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <div className='space-y-2'>
        {isSuccess
          ? data.pages.map((page: Log[], i) =>
              page.map((item, i) => {
                if (page.length === i + 1) {
                  return <Card key={item.userId} ref={ref} student={item} />
                }
                return <Card key={item.userId} student={item} />
              })
            )
          : null}
        {isLoading ? Array.from(Array(10).keys()).map((index) => <Loading key={index} />) : null}
        {isError ? <div>發生錯誤</div> : null}
        {noMore ? <div>沒有更多了</div> : null}
      </div>
    </>
  )
}

export default LogPage
