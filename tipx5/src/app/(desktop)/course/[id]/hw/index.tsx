'use client'

import React from 'react'
import Cookies from 'js-cookie'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { Hw } from '@/types'
// import BottomToUpTransitionView from '@/components/transition/BottomToUpTransitionView'
import { useQuery } from '@tanstack/react-query'

import Card from './card'

const HwPage = ({ params }: { params: { id: string } }) => {
  const [status, setStatus] = React.useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['hw', params.id],
    queryFn: async () => {
      const { data } = await api.get(`hw?course=${params.id}`)
      setStatus(data.status === '段考期間')
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
        <div className='relative overflow-hidden rounded-lg md:bg-background1'>
          {status && (
            <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/20 backdrop-blur-sm dark:bg-black/50'>
              <Badge className='text-base' variant='secondary'>
                {data.msg}
              </Badge>
              <Button
                variant='outline'
                className='h-auto px-3 py-1'
                onClick={() => {
                  setStatus(false)
                }}
              >
                關閉
              </Button>
            </div>
          )}
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
