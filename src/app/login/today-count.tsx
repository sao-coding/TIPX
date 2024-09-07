'use client'

import React from 'react'

import { IconLoader2 } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const TodayCount = () => {
  const {
    isLoading,
    isError,
    data: count
  } = useQuery<number>({
    queryKey: ['login-today-count'],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?type=today`)
      const data = await res.json()
      // error
      if (!res.ok) throw new Error('沒有這篇公告')
      return data.count
    }
  })

  return <>{isLoading ? <IconLoader2 className='animate-spin' /> : <>{count}</>}</>
}

export default TodayCount
