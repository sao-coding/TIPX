'use client'

import React from 'react'
import { useInView } from 'react-intersection-observer'

import Title from '@/components/Title'
import { Input } from '@/components/ui/input'
import { Student } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'

import Card from './card'

const SearchPage = () => {
  const [search, setSearch] = React.useState('')
  const { ref, inView } = useInView()
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery<Student[]>({
      queryKey: ['search', search],
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

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const titleData = {
    title: '留言區',
    children: ''
  }
  return (
    <>
      <Title {...titleData} />
      <Input />
      <div className='space-y-2'>{data?.pages[0] && <Card student={data.pages[0][0]} />}</div>
    </>
  )
}

export default SearchPage
