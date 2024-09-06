'use client'

// import { cookies } from 'next/headers'
import Link from 'next/link'
import clsx from 'clsx'
import Cookies from 'js-cookie'

import Title from '@/components/Title'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
// import ScaleTransitionView from '@/components/transition/ScaleTransitionView'
import { SemGrade } from '@/types'
import { IconCoins, IconStar } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const FinalGradePage = () => {
  // const data: SemGrade[] = await getData()
  const { isLoading, data } = useQuery<SemGrade[]>({
    queryKey: ['sem-grade', Cookies.get('year'), Cookies.get('sem')],
    queryFn: async () => {
      const { data } = await api.get('/sem-grade')
      return data
    }
  })

  // console.log({ data })
  // 選修 or 必修 or 通識
  const typeColor: { [key: string]: string } = {
    必修: 'bg-blue-500',
    選修: 'bg-green-500',
    通識: 'bg-yellow-500'
  }

  const titleData = {
    title: '科目成績',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className='grid w-full grid-cols-2 gap-2 md:grid-cols-3'>
          {data?.map((item, index) => (
            // <ScaleTransitionView key={index} custom={index}>
            <div className='relative rounded-xl border bg-background1 p-2' key={index}>
              <div
                className={clsx(
                  'absolute right-0 top-0 m-2 rounded-sm px-2 font-bold text-white',
                  typeColor[item.type]
                )}
              >
                {item.type}
              </div>
              <div>{item.id}</div>
              <Link href={`/course/${item.id}?tab=規範`} className='line-clamp-1'>
                {item.name}
              </Link>
              <div>{item.category}</div>
              <div className='flex items-center space-x-1'>
                <IconCoins className='animate-pulse stroke-yellow-500' />
                <div>{item.credit}</div>
                <IconStar className='animate-pulse stroke-yellow-500' />
                <div>{item.midtermGrade}</div>
                <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                <div>{item.finalGrade}</div>
              </div>
              <div className='line-clamp-1 text-ellipsis'>{item.class}</div>
            </div>
            // </ScaleTransitionView>
          ))}
        </div>
      )}
    </>
  )
}

export default FinalGradePage
