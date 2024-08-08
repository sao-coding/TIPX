'use client'

import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
// import BottomToUpTransitionView from '@/components/transition/BottomToUpTransitionView'
import { useQuery } from '@tanstack/react-query'

const Loading = () => {
  return (
    <div className='flex h-36 flex-col gap-1 border-b border-background1 p-2 md:justify-between md:p-7'>
      <Skeleton className='my-1 h-4 w-20 bg-background2' />
      <div className='flex h-12 flex-col justify-around md:h-auto'>
        <Skeleton className='h-4 w-full bg-background2' />
        <Skeleton className='block h-4 w-full bg-background2 md:hidden' />
      </div>
      <Skeleton className='my-1 h-4 w-1/2 bg-background2' />
    </div>
  )
}

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
      <div className='relative overflow-hidden md:rounded-lg md:bg-background1'>
        {/* {data.status && (
          <>
            <div className='border-main-color-2 whitespace-pre-line rounded-xl border-2 border-dashed p-2 text-center text-2xl'>
              {data.message}
            </div>
            <div className='flex w-full justify-center border-b'>
              <img src='/img/QQ.png' alt='' />
            </div>
          </>
        )} */}
        <Loading />
        {/* {isLoading ? (
          <Loading />
        ) : (
          <>
            {data.data.length > 0 && (
              <>
                {data.data.map((item: Hw, index: number) => (
                  <Card key={index} data={item} studentID={Cookies.get('cookie_userid') ?? ''} />
                ))}
                <div className='my-4 text-center text-gray-500'>沒有更多作業了</div>
              </>
            )}
          </>
        )} */}
        {data && data.length === 0 && <div className='text-center text-2xl'>沒有作業</div>}
      </div>
    </>
  )
}

export default HwPage
