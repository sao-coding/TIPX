'use client'

import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

import Title from '@/components/Title'
import { Badge } from '@/components/ui/badge'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { CourseFormList } from '@/types'
import { useQuery } from '@tanstack/react-query'

const CourseFormListPage = () => {
  const { status, data } = useQuery<CourseFormList[]>({
    queryKey: ['course-form-list'],
    queryFn: async () => {
      const { data } = await api.get('course-form')
      return data.data
    }
  })

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'

  const titleData = {
    title: '課程意見調查表',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className='grid w-full grid-cols-1 gap-2 md:grid-cols-2'>
          {isSuccess &&
            data?.map((item) => (
              <div
                key={item.courseId}
                // href={`./course-form/${item.id}`}
                className='relative rounded-xl border bg-background1 p-2 hover:bg-background2'
              >
                {/* <Badge className='absolute right-2'>{item.status ? '已填寫' : '未填寫'}</Badge> */}
                <Badge
                  className={cn(
                    'absolute right-2',
                    item.status
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  )}
                >
                  {item.status ? '已填寫' : '未填寫'}
                </Badge>
                <div className='text-lg font-bold'>{item.courseName}</div>

                <div className='flex items-center justify-between'>
                  <div className='text-sm text-neutral-500'>{item.className}</div>
                  <Link
                    className='group flex items-center gap-0.5 text-sm text-blue-500'
                    href={`/user/course-form/${item.id}`}
                  >
                    {!item.status && (
                      <>
                        去填寫{' '}
                        <ArrowRightIcon className='size-4 transition-transform group-hover:translate-x-1' />
                      </>
                    )}
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  )
}

export default CourseFormListPage
