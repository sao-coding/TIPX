'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { Course } from '@/types'
import { useQuery } from '@tanstack/react-query'

import HwPage from './hw'

const CoursePage = ({ params }: { params: { id: string } }) => {
  const { isLoading, data } = useQuery<Course>({
    queryKey: ['course', params.id],
    queryFn: async () => {
      // const res = await fetch(`/api/course?course=${params.id}&year=111&sem=2&userid=D11019247`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //     //   Authorization: `Bearer ${Cookies.get('token')}`
      //   }
      // })

      // const data = await res.json()

      // return data

      const { data } = await api.get(`/course/${params.id}`)
      return data
    }
  })

  const tabList = [
    { value: '作業' },
    { value: '學生' },
    { value: '出缺勤' },
    { value: '規範' }
    // { value: "評價" },
  ]

  return (
    <>
      <Tabs defaultValue='作業'>
        <div className='mb-2 flex flex-col items-center gap-3 md:flex-row'>
          <h1 className='w-full text-center text-2xl font-bold md:text-left'>{data?.course}</h1>

          <TabsList className='grid w-full grid-cols-4'>
            {tabList.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabList.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <HwPage params={{ id: params.id }} />
          </TabsContent>
        ))}
      </Tabs>
      {/* <h1 className='mb-3 w-full text-center text-2xl font-bold md:py-1 md:text-left'>
        {data?.course}
      </h1>
      <div>
        <Tabs defaultValue='作業'>
          <TabsList className='grid w-full grid-cols-4'>
            {tabList.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabList.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.value}
            </TabsContent>
          ))}
        </Tabs>
      </div> */}
    </>
  )
}

export default CoursePage
