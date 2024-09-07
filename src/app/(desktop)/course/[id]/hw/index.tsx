'use client'

import Cookies from 'js-cookie'

import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { Hw } from '@/types'
// import BottomToUpTransitionView from '@/components/transition/BottomToUpTransitionView'
import { useQuery } from '@tanstack/react-query'

import Card from './card'

const HwPage = ({ params }: { params: { id: string } }) => {
  console.log(params.id)

  const { data, isLoading } = useQuery({
    queryKey: ['hw', params.id],
    queryFn: async () => {
      const { data } = await api.get(`hw?course=${params.id}`)
      return data
    },
    refetchOnWindowFocus: false
  })

  return (
    <>
      {/* {data.status && (
          <>
            <div className='border-main-color-2 whitespace-pre-line rounded-sm border-2 border-dashed p-2 text-center text-2xl'>
              {data.message}
            </div>
            <div className='flex w-full justify-center border-b'>
              <img src='/img/QQ.png' alt='' />
            </div>
          </>
        )} */}

      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden md:rounded-lg md:bg-background1'>
          {data.data.length > 0 && (
            <>
              {data.data.map((item: Hw, index: number) => (
                <Card key={index} data={item} studentID={Cookies.get('cookie_userid') ?? ''} />
              ))}
              <div className='my-4 text-center text-gray-500'>沒有更多作業了</div>
            </>
          )}
        </div>
      )}
      {data && data.length === 0 && <div className='text-center text-2xl'>沒有作業</div>}
    </>
  )
}

export default HwPage
