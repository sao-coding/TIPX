'use client'

import Cookies from 'js-cookie'

import api from '@/lib/api'
// import BottomToUpTransitionView from '@/components/transition/BottomToUpTransitionView'
import { HwList } from '@/types'
import { useQuery } from '@tanstack/react-query'

import Card from './card'

const HwPage = ({ params }: { params: { id: string } }) => {
  console.log(params.id)

  const { data, isLoading } = useQuery({
    queryKey: ['hw', params.id],
    queryFn: async () => {
      // const res = await fetch(`/api/hw?course=${params.id}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await res.json()
      // return data

      const { data } = await api.get(`/hw?course=${params.id}`)
      return data
    },
    refetchOnWindowFocus: false
  })

  return (
    <>
      <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='cat'>
            <div className='cat__body'></div>
            <div className='cat__body'></div>
            <div className='cat__tail'></div>
            <div className='cat__head'></div>
          </div>
        </div>
      </div>

      <div className='w-full'>
        {data.status && (
          <>
            <div className='border-main-color-2 whitespace-pre-line rounded-xl border-2 border-dashed p-2 text-center text-2xl'>
              {data.message}
            </div>
            <div className='flex w-full justify-center border-b'>
              <img src='/img/QQ.png' alt='' />
            </div>
          </>
        )}
        {data.data && data.data.length > 0 && (
          <>
            {console.log(data.data)}
            {data.data.map((item: HwList, index: number) => (
              <Card key={index} data={item} studentID={Cookies.get('cookie_userid') ?? ''} />
            ))}
          </>
        )}
        {data && data.length === 0 && <div className='text-center text-2xl'>沒有作業</div>}
      </div>
    </>
  )
}

export default HwPage
