'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Close from '@/components/Close'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { Course } from '@/types'
import { useQuery } from '@tanstack/react-query'

import CourseAttendanceRecordPage from './course-attendance-record'
import CourseInfoPage from './course-info'
import CourseStuListPage from './course-stu-list'
import HwPage from './hw'

const CoursePage = ({ params }: { params: { id: string } }) => {
  const { isLoading, data } = useQuery<Course>({
    queryKey: ['course', params.id],
    queryFn: async () => {
      // const res = await fetch(`/api/course?course=${params.id}&year=111&sem=2&userid=D11019139`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //     //   Authorization: `Bearer ${Cookies.get('token')}`
      //   }
      // })

      // const data = await res.json()

      // return data

      const { data } = await api.get(`/course?course=${params.id}`)
      return data
    }
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || '作業'
  const [activeTab, setActiveTab] = React.useState(tab)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.replace(`/course/${params.id}?tab=${value}`)
  }

  const TabsListData = [
    { label: '作業', value: '作業', component: <HwPage params={{ id: params.id }} /> },
    { label: '學生', value: '學生', component: <CourseStuListPage params={{ id: params.id }} /> },
    {
      label: '出缺勤',
      value: '出缺勤',
      component: <CourseAttendanceRecordPage params={{ id: params.id }} />
    },
    { label: '規範', value: '規範', component: <CourseInfoPage params={{ id: params.id }} /> }
  ]

  // TODO: 標題重構

  return (
    <>
      <Tabs defaultValue='作業' value={activeTab} onValueChange={handleTabChange}>
        <div className='mb-3 flex flex-col items-center gap-3 md:flex-row'>
          {isLoading ? (
            <div className='w-full'>
              <Skeleton className='mx-auto my-1 h-6 w-60 md:mx-0' />
            </div>
          ) : (
            <div className='relative w-full'>
              <Close />
              <h1 className='w-full text-center text-2xl font-bold md:text-left'>{data?.course}</h1>
            </div>
          )}

          <TabsList className='w-full'>
            {TabsListData.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className='w-full'>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {TabsListData.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {item.component}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

export default CoursePage
