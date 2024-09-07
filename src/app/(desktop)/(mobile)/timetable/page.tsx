'use client'

import Cookies from 'js-cookie'

import Loading from '@/components/ui/Loading'
import { useMediaQuery } from '@/hooks/use-media-query'
import api from '@/lib/api'
import { TimeTable } from '@/types'
import { useQuery } from '@tanstack/react-query'

import DesktopTimeTable from './desktop-timebale'
import MobileTimeTable from './mobile-timetable'

const TimeTablePage = () => {
  const { isLoading, data } = useQuery<TimeTable[]>({
    queryKey: ['mobile-timetable', Cookies.get('year'), Cookies.get('sem')],
    queryFn: async () => {
      const { data } = await api.get(`timetable?type=all`)
      return data
    }
  })

  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {isLoading && (
        <>
          <div className='relative mb-3 flex items-center py-1'>
            <h1 className='w-full text-center text-2xl font-bold md:text-left'>課表</h1>
          </div>
          <Loading />
        </>
      )}
      {data && (
        <>
          {isDesktop && <DesktopTimeTable timetable={data} />}
          {isDesktop === false && <MobileTimeTable timetable={data} />}
        </>
      )}
    </>
  )
}

export default TimeTablePage
