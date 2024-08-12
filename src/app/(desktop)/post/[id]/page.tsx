'use client'

import api from '@/lib/api'
import { Post } from '@/types'
import { useQuery } from '@tanstack/react-query'

const PostPage = ({ params }: { params: { id: string } }) => {
  const { isLoading, isError, data } = useQuery<Post>({
    queryKey: ['post', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/post?type=one&id=${params.id}`)
      return data
    }
  })
  return (
    <>
      <div className=''>
        {data && (
          <div>
            <h1>{data.title}</h1>
            <p>{data.content}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default PostPage
