'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'

import Title from '@/components/Title'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { Student } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'

import Card from './card'
import Loading from './loading'

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
        {isError && (
          <div className='text-center text-red-500'>無此權限或發生錯誤，請聯絡管理員</div>
        )}
      </div>
    </>
  )
}

export default SearchPage
