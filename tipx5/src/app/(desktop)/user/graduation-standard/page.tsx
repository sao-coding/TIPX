'use client'

import React from 'react'

import Title from '@/components/Title'
import Loading from '@/components/ui/Loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { GraduationStandard } from '@/types'
import { useQuery } from '@tanstack/react-query'

import CourseList from './course-list'
import GraduationProgress from './graduation-progress'

const GraduationStandardPage = () => {
  const { status, data: graduationData } = useQuery<GraduationStandard>({
    queryKey: ['graduation-standard'],
    queryFn: async () => {
      const { data } = await api.get('graduation-standard')
      return data.data
    },
    refetchOnWindowFocus: false
  })

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'
  const isError = status === 'error'

  const titleData = {
    title: '畢業標準',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <div className='flex min-h-[calc(100vh-120px)] flex-col'>
        <div className='mb-6 grid gap-2 md:grid-cols-3'>
          <GraduationProgress status={status} data={graduationData} />
        </div>
        <Tabs defaultValue='courses' className='flex w-full flex-1 flex-col'>
          <TabsList className='mb-4 w-full justify-start'>
            {/* <TabsTrigger value='semesters'>學期概覽</TabsTrigger> */}
            <TabsTrigger value='courses'>課程詳情</TabsTrigger>
          </TabsList>
          <TabsContent value='semesters'>
            {/* <SemesterBreakdown data={graduationData} /> */}
          </TabsContent>
          <TabsContent value='courses' className='flex flex-1 flex-col'>
            {isSuccess && <CourseList data={graduationData} />}
            {isLoading && (
              <div className='relative flex-1'>
                <Loading className='h-full' />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default GraduationStandardPage
