'use client'
// import RollCallVerify from './roll-call-verify'
// import Title from '@/components/Title'
// import ScaleTransitionView from '@/components/transition/ScaleTransitionView'
import Link from 'next/link'
import Cookies from 'js-cookie'

import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { Course } from '@/types'
import { useQuery } from '@tanstack/react-query'

const CourseListPage = () => {
  const { isLoading, data } = useQuery<Course[]>({
    queryKey: ['course', Cookies.get('year'), Cookies.get('sem')],
    queryFn: async () => {
      const { data } = await api.get('/course')
      return data
    }
  })

  return (
    <>
      <h1 className='mb-3 w-full text-center text-2xl font-bold md:py-1 md:text-left'>課程</h1>
      <div className='mb-16 w-full md:p-0'>
        <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
          {isLoading
            ? Array.from(Array(12).keys()).map((index) => (
                <div key={index}>
                  <div className='flex h-20 w-full flex-col justify-between space-y-2 rounded-lg border bg-background1 p-2'>
                    <Skeleton className='h-5 w-1/2' />
                    <div className='flex h-4 justify-between'>
                      <Skeleton className='w-1/2' />
                      <Skeleton className='w-1/4' />
                    </div>
                  </div>
                  <div className='ripple mt-1 flex h-7 w-full items-center justify-center rounded-lg border'>
                    <Skeleton className='h-3 w-10' />
                  </div>
                </div>
              ))
            : data?.map((course, index) => (
                <Link
                  key={course.id}
                  className='flex h-20 flex-col justify-center space-y-2 rounded-lg border bg-background1 p-2'
                  href={`/course/${course.id}`}
                >
                  <div className='line-clamp-1 text-ellipsis'>{course.course}</div>
                  <div className='flex items-center justify-between'>
                    <div>{course.id}</div>
                    <div className='bg-main-color-1 dark:bg-main-color-2 rounded-lg px-1'>
                      {course.teacher}
                    </div>
                  </div>
                </Link>

                // {session?.user.studentID === process.env.ADMINSTUDENTID && (
                //   <RollCallVerify courseID={course.id} />
                // )}
                //   </ScaleTransitionView>
              ))}
        </div>
      </div>
    </>
  )
}

export default CourseListPage
