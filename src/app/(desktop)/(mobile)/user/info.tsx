'use client'

import Cookies from 'js-cookie'

import Counter from '@/components/transition/counter'
import UserBanner from '@/components/UserBanner'
import api from '@/lib/api'
import { Conduct, CourseAttendanceRecordTotal } from '@/types'
import { User } from '@/types'
import { UserSettings } from '@prisma/client'
import {
  IconClock,
  IconListDetails,
  IconLoader2,
  IconSchool,
  IconUserStar
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const Info = ({
  user,
  color,
  userClassName,
  settings
}: {
  user: User
  color: string
  userClassName: string
  settings: UserSettings
}) => {
  const { data: courseAttendanceRecordData, isLoading: LeaveLoading } =
    useQuery<CourseAttendanceRecordTotal>({
      queryKey: ['course-attendance-record-total', Cookies.get('year'), Cookies.get('sem')],
      queryFn: async () => {
        const { data } = await api.get('course-attendance-record?type=total')
        return data
      }
    })

  const { data: conductData, isLoading: conductLoading } = useQuery<Conduct>({
    queryKey: ['conduct-total', Cookies.get('year'), Cookies.get('sem')],
    queryFn: async () => {
      const { data } = await api.get(
        `conduct?year=${Cookies.get('year')}&sem=${Cookies.get('sem')}`
      )
      return data
    }
  })
  console.log('settings', settings)

  return (
    <UserBanner user={user} color={color} settings={settings}>
      <div className='flex items-center justify-center gap-2 border-y p-4 md:mt-14 md:justify-start'>
        <span className='flex items-center gap-1 font-bold'>
          <IconSchool />
          班級
        </span>
        {userClassName}
      </div>
      <div className='md:px-1'>
        <ul className='grid grid-cols-3'>
          <li className='p-2'>
            <div className='flex items-center justify-between'>
              <div className=''>缺曠次數</div>
              <IconListDetails size={20} className='stroke-blue-500' />
            </div>
            <div className='flex items-center gap-1 text-2xl'>
              {LeaveLoading ? (
                <IconLoader2 className='mx-1 animate-spin' />
              ) : (
                <Counter count={courseAttendanceRecordData?.count || 0} />
              )}
              <span>次</span>
            </div>
          </li>
          <li className='border-x p-2'>
            <div className='flex items-center justify-between'>
              <div className=''>缺曠時數</div>
              <IconClock size={20} className='stroke-green-500' />
            </div>
            <div className='flex items-center gap-1 text-2xl'>
              {LeaveLoading ? (
                <IconLoader2 className='mx-1 animate-spin' />
              ) : (
                <>
                  {courseAttendanceRecordData?.time &&
                    ((Math.round((courseAttendanceRecordData.time / 60) * 10) / 10).toFixed(1)
                      .length >= 4 ? (
                      <Counter count={Math.round(courseAttendanceRecordData.time / 60)} />
                    ) : (
                      <Counter
                        count={Math.round((courseAttendanceRecordData.time / 60) * 100) / 100}
                        decimals={1}
                      />
                    ))}
                </>
              )}
              <span>小時</span>
            </div>
          </li>
          <li className='p-2'>
            <div className='flex items-center justify-between'>
              <div className=''>目前操行</div>
              <IconUserStar size={20} className='stroke-yellow-500' />
            </div>
            <div className='flex items-center gap-1 text-2xl'>
              {conductLoading ? (
                <IconLoader2 className='mx-1 animate-spin' />
              ) : (
                <Counter count={conductData?.score || 0} decimals={1} />
              )}
              <span>分</span>
            </div>
          </li>
        </ul>
      </div>
    </UserBanner>
  )
}

export default Info
