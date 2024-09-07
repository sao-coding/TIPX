'use client'

import clsx from 'clsx'

import Title from '@/components/Title'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
// import ScaleTransitionView from '@/components/transition/ScaleTransitionView'
import { FinalGradeRank } from '@/types'
import getCurrentYearSem from '@/utils/current-year-sem'
import { IconCrown, IconStar, IconUserStar } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const FinalGradePage = () => {
  const { data, isLoading } = useQuery<FinalGradeRank[]>({
    queryKey: ['final-grade'],
    queryFn: async () => {
      const { currentYear, currentSem } = getCurrentYearSem()
      const { data } = await api.get(`final-grade?year=${currentYear}&sem=${currentSem}`)
      return data
    },
    refetchOnWindowFocus: false
  })

  // 班排前三名顏色
  const rankColor: { [key: number]: string } = {
    1: 'text-amber-500',
    2: 'text-red-500',
    3: 'text-blue-500'
  }

  const titleData = {
    title: '學期-操行 成績',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <div className='grid w-full grid-cols-2 gap-2'>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {data?.map((item, index) => (
              // <ScaleTransitionView key={index} custom={index}>
              <div
                className='relative h-24 w-full rounded-xl border bg-background1 p-1'
                key={index}
              >
                <div className='absolute left-0 top-0 p-1 text-5xl text-neutral-300'>
                  {item.year}
                </div>
                {/* <div className='absolute bottom-0 right-0 pr-2 text-2xl text-neutral-300'>
                                {item.sem}
                            </div> */}
                <div
                  className={clsx(
                    'absolute right-0 top-0 p-1 text-4xl font-bold',
                    rankColor[item.rank]
                  )}
                >
                  {item.rank === 0 ? '?' : <>{item.rank}</>}
                </div>
                <div className='absolute right-0 top-0'>
                  {item.rank <= 3 && item.rank !== 0 && (
                    <IconCrown className='origin-top-right translate-x-3 translate-y-2 rotate-45 animate-pulse fill-amber-500 stroke-amber-500' />
                  )}
                </div>
                <div className='absolute bottom-0 left-0 flex w-full items-center justify-between p-1'>
                  <div className='flex items-center pr-1'>
                    <IconUserStar className='animate-pulse stroke-yellow-500' />
                    {item.conduct.score === 0 ? '?' : item.conduct.score.toFixed(2)}
                  </div>
                  <div className='flex items-center pl-1'>
                    <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                    {item.avg === 0 ? '?' : item.avg}
                  </div>
                  <div className='max-xs:absolute max-xs:bottom-6 max-xs:right-0 px-2 text-2xl text-neutral-300'>
                    {item.sem}
                  </div>
                </div>
              </div>
              // </ScaleTransitionView>
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default FinalGradePage
