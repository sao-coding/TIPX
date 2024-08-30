'use client'
// import { cookies } from 'next/headers'

import React from 'react'

import Title from '@/components/Title'
import api from '@/lib/api'
// import { site } from '@/config/site'
import { CourseAttendanceRecord } from '@/types'
import { useQuery } from '@tanstack/react-query'

import Card from './card'

// const getData = async () => {
//   const res = await fetch(`${site.url}/api/course-attendance-record`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Cookie: cookies().toString()
//     }
//   })

//   if (!res.ok) {
//     throw new Error('獲取資料失敗')
//   }

//   return await res.json()
// }

const CourseAttendanceRecordPage = () => {
  const { data } = useQuery<CourseAttendanceRecord>({
    queryKey: ['course-attendance-record'],
    queryFn: async () => {
      const { data } = await api.get('/course-attendance-record')
      return data
    }
  })

  // 只顯示曠課，事假，病假，生理假，公假，喪假
  const leaveType = ['曠課', '事假', '病假', '生理假', '公假', '喪假']

  const titleData = {
    title: '請假缺曠記錄',
    children: ''
  }

  return (
    <>
      <div className='mb-2 w-full'>
        <Title {...titleData} />

        <div className='mb-2 grid grid-cols-2 gap-2 md:grid-cols-3'>
          {/* {data?.total.map((item, index) => {
            if (leaveType.includes(item.type)) {
              return (
                <div key={index} className='rounded-xl border bg-background p-2'>
                  <div>{item.type}</div>
                  <div className='w-full text-right text-lg font-bold'>{item.count}</div>
                </div>
              )
            }
          })} */}
          {leaveType.map((type, index) => {
            const item = data?.total.find((item) => item.type === type)
            return (
              <div key={index} className='rounded-xl border bg-background1 p-2'>
                <div>{type}</div>
                <div className='w-full text-right text-lg font-bold'>{item?.count || 0}</div>
              </div>
            )
          })}
        </div>
        <div className='sticky left-0 top-0 mb-2 rounded-xl border bg-background1 p-2'>
          <div>總計</div>
          <div className='w-full text-right text-lg font-bold'>
            {data?.total.reduce((a, b) => a + b.count, 0)}
          </div>
        </div>
        <div className='space-y-2'>
          {data?.list?.map((item, index) => <Card key={index} data={item} />)}
        </div>
      </div>
    </>
  )
}

export default CourseAttendanceRecordPage
