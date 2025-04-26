'use client'

import React from 'react'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import { parseAsString, useQueryState } from 'nuqs'

import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { CourseAttendanceRecord } from '@/types'
import { useQuery } from '@tanstack/react-query'

import Ads from '../Ads'

import Card from './card'

// 參數 params: { id: string } 可以不用有 沒有就是全部
const AttendanceRecordPage = ({ id }: { id?: string }) => {
  const { isLoading, data } = useQuery<CourseAttendanceRecord>({
    queryKey: ['course-attendance-record', Cookies.get('year'), Cookies.get('sem'), id],
    queryFn: async () => {
      const { data } = await api.get(`course-attendance-record?${id ? `course=${id}` : ''}`)
      return data
    }
  })

  const [selectedLeaveType, setSelectedLeaveType] = useQueryState(
    'type',
    parseAsString.withDefault('全部')
  )

  // 只顯示曠課，事假，病假，生理假，公假，喪假
  const leaveType = ['曠課', '事假', '病假', '生理假', '公假', '喪假']

  const leaveTypeColor: { [key: string]: { bg: string; border: string } } = {
    曠課: {
      bg: 'bg-red-500',
      border: 'border-red-500'
    },
    病假: {
      bg: 'bg-blue-500',
      border: 'border-blue-500'
    },
    事假: {
      bg: 'bg-orange-500',
      border: 'border-orange-500'
    },
    生理假: {
      bg: 'bg-rose-400',
      border: 'border-rose-400'
    },
    公假: {
      bg: 'bg-slate-500',
      border: 'border-slate-500'
    },
    喪假: {
      bg: 'bg-stone-500/80',
      border: 'border-stone-500'
    }
  }

  const handleLeaveType = (type: string) => {
    setSelectedLeaveType((prevType) => (prevType === type ? '全部' : type))
  }

  return (
    <div className='flex min-h-[calc(100vh-120px)] flex-col'>
      <div className='mb-2 grid grid-cols-2 gap-2 md:grid-cols-3'>
        {leaveType.map((type, index) => {
          const item = data?.total.find((item) => item.type === type)
          return (
            // <div key={index} className='rounded-sm border bg-background1 p-2'>
            <div
              key={index}
              className={clsx(
                'cursor-pointer rounded-sm border bg-background1 p-2',
                leaveTypeColor[type].border,
                selectedLeaveType === type && leaveTypeColor[type].bg
              )}
              onClick={() => handleLeaveType(type)}
            >
              <div>{type}</div>
              <div className='w-full text-right text-lg font-bold'>
                {isLoading ? '--' : item?.count || 0}
              </div>
            </div>
          )
        })}
      </div>
      <div
        className='sticky left-0 top-0 z-10 mb-2 cursor-pointer rounded-sm border bg-background1 p-2'
        onClick={() => handleLeaveType('全部')}
      >
        <div>總計</div>
        <div className='w-full text-right text-lg font-bold'>
          {/* {data?.total.reduce((a, b) => a + b.count, 0)} */}
          {/* 預設顯示0 */}
          {/* {data?.total.reduce((a, b) => a + b.count, 0) || 0} */}
          {isLoading ? '--' : data?.total.reduce((a, b) => a + b.count, 0) || 0}
        </div>
      </div>
      {isLoading ? (
        <div className='relative flex-1'>
          <Loading className='h-full' />
        </div>
      ) : (
        <div className='space-y-2'>
          {data?.list
            .filter((item) => selectedLeaveType === '全部' || item.type === selectedLeaveType)
            .map((item, index) => <Card key={index} data={item} />)}
        </div>
      )}
      <Ads
        dataAdFormat='autorelaxed'
        dataAdClient='ca-pub-2271001084588765'
        dataAdSlot='6194124244'
      />
    </div>
  )
}

export default AttendanceRecordPage
