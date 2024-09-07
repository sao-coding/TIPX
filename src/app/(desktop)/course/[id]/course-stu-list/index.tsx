'use client'

import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { CourseStuList } from '@/types'
import { useQuery } from '@tanstack/react-query'

import Card from './card'

const CourseStuListPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useQuery<CourseStuList[]>({
    queryKey: ['course-stu-list', params.id],
    queryFn: async () => {
      const { data } = await api.get(`course-stu-list?course=${params.id}`)
      return data
    }
  })

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden md:rounded-lg md:bg-background1'>
          {data && data.length > 0 ? (
            <>
              {data.map((item, index) => (
                <Card key={item.id} data={item} />
              ))}
            </>
          ) : (
            <div className='text-center text-2xl'>沒有學生</div>
          )}
        </div>
      )}
    </>
  )
}

export default CourseStuListPage
