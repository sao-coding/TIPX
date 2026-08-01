'use client'

import clsx from 'clsx'

import Title from '@/components/Title'
import Loading from '@/components/ui/Loading'
// import ScaleTransitionView from '@/components/transition/ScaleTransitionView'
import api from '@/lib/api'
import { Credit } from '@/types'
import { IconStar } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const CreditPage = () => {
  const { data, isLoading } = useQuery<Credit[]>({
    queryKey: ['credit'],
    queryFn: async () => {
      const { data } = await api.get('credit')
      return data
    },
    refetchOnWindowFocus: false
  })

  // 及格率顏色
  // 0~59: text-red-500
  // 60~79: text-yellow-500
  // 80~100: text-green-500
  const passColor: { [key: number]: string } = {
    0: 'text-red-500',
    1: 'text-yellow-500',
    2: 'text-green-500'
  }

  const titleData = {
    title: '學分資訊',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <div className='grid w-full grid-cols-2 gap-2'>
        {isLoading ? (
          <Loading />
        ) : (
          data?.map((item, index) => (
            // <ScaleTransitionView key={index} custom={index}>
            <div className='relative h-24 w-full rounded-xl border bg-background1 p-1' key={index}>
              <div className='absolute left-0 top-0 p-1 text-5xl text-neutral-300'>{item.year}</div>
              <div
                className={clsx(
                  'absolute right-0 top-0 p-1 text-2xl font-bold',
                  passColor[
                    item.get / item.total < 0.8 && item.get / item.total >= 0.6
                      ? 1
                      : item.get / item.total < 0.6
                        ? 0
                        : 2
                  ]
                )}
              >
                {/* get/total % */}
                {item.total === 0 ? 0 : Math.round((item.get / item.total) * 100)}%
              </div>
              <div className='absolute bottom-0 left-0 flex w-full items-center justify-between p-1'>
                <div className='flex w-28 items-center justify-between'>
                  <div className='flex items-center'>
                    <IconStar className='animate-pulse stroke-yellow-500' />
                    {!item.total ? '##' : item.total.toString().padStart(2, '0')}
                  </div>
                  <div className='flex items-center'>
                    <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                    {!item.get ? '##' : item.get.toString().padStart(2, '0')}
                  </div>
                </div>
                <div className='px-2 text-2xl text-neutral-300'>{item.sem}</div>
              </div>
            </div>
            // </ScaleTransitionView>
          ))
        )}
      </div>
    </>
  )
}

export default CreditPage
