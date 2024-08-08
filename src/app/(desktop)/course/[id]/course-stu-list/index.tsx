'use client'

import api from '@/lib/api'
import { CourseStuList } from '@/types'
import { useQuery } from '@tanstack/react-query'

import Card from './card'

const CourseStuListPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useQuery<CourseStuList[]>({
    queryKey: ['course-stu-list', params.id],
    queryFn: async () => {
      // const res = await fetch(`/api/course-stu-list?course=${params.id}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await res.json()
      // return data

      const { data } = await api.get(`/course-stu-list?course=${params.id}`)
      return data
    }
  })

  return (
    <div className='w-full'>
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
  )
}

export default CourseStuListPage
