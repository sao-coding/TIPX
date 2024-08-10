'use client'
// import { useCallback, useRef } from 'react'
// import Cookie from 'js-cookie'

import { useMediaQuery } from '@/hooks/use-media-query'

// import toast from 'react-hot-toast'
// import { OutTimeTable, TimeTable } from '@/types'
// import { useQuery } from '@tanstack/react-query'
import DesktopTimeTable from './desktop-timebale'
import MobileTimeTable from './mobile-timetable'

const TimeTablePage = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {isDesktop && <DesktopTimeTable />}
      {isDesktop === false && <MobileTimeTable />}
    </>
  )
}

export default TimeTablePage
