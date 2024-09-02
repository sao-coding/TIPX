'use client'
import { type AxiosError } from 'axios'
import Cookie from 'js-cookie'
import toast from 'react-hot-toast'

import Title from '@/components/Title'
import Avatar from '@/components/ui/avatar'
import Fancybox from '@/components/ui/fancybox'
import api from '@/lib/api'
import { FinalGradeRankClass } from '@/types'
// import { useState, useEffect } from "react"
import { IconCrown, IconStar, IconUserCircle, IconUserStar } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const DeptRankPage = () => {
  const { data, isLoading, isError } = useQuery<FinalGradeRankClass[]>({
    queryKey: ['dept-rank', Cookie.get('cookie_year'), Cookie.get('cookie_sem')],
    queryFn: async () => {
      toast.dismiss()
      const toastId = toast.loading('資料量大，請稍等')

      try {
        const datas = []
        for (let i = 1; i <= 3; i++) {
          const { data } = await api.get(`/dept-rank?classid=${i}`)
          datas.push(data)
        }
        toast.success('資料載入成功', { id: toastId })
        return datas.flat()
      } catch (error) {
        const err = error as AxiosError
        toast.error(`資料載入失敗: ${err.status}`, { id: toastId })
        throw new Error('伺服器過載，請稍後再試')
      }
    },
    refetchOnWindowFocus: false
  })

  const titleData = {
    title: '系排名',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      {isError && (
        <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
          <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
            <div className='text-2xl'>伺服器過載，請稍後再試</div>
            <button
              className='bg-main-color-1 rounded-md p-2 text-xl'
              onClick={
                // 重新整理
                () => location.reload()
              }
            >
              重新整理
            </button>
          </div>
        </div>
      )}
      {isLoading && (
        <>
          {Array.from(Array(7).keys()).map((index) => (
            <div
              className='bg-card-background mb-2 flex h-[116px] w-full animate-pulse items-center justify-between rounded-xl border p-2'
              key={index}
            >
              <div className='flex items-center'>
                <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                  <IconUserCircle size={75} />
                </div>
                <div>
                  <div className='m-2 mb-5 h-3 w-20 rounded-full bg-slate-200'></div>
                  <div className='m-2 h-3 w-20 rounded-full bg-slate-200'></div>
                </div>
              </div>
              <div className='h-full flex-1 md:mr-8 md:flex-none'>
                <div className='mt-4 flex h-full items-center justify-center'>
                  <div className='m-1 h-3 w-11 rounded bg-slate-200 md:m-4'></div>
                  <div className='m-1 h-3 w-11 rounded bg-slate-200 md:m-4'></div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      {/* 依分數排序 如果是 0 就排在最後 */}
      <div className='space-y-2'>
        {!isError &&
          data &&
          data.length > 0 &&
          data
            .sort((a, b) => {
              if (a.data.avg === 0) {
                return 1
              } else if (b.data.avg === 0) {
                return -1
              } else {
                return b.data.avg - a.data.avg
              }
            })
            .map((item, index) => (
              <div
                className='relative flex w-full items-center justify-between rounded-xl border bg-background1 p-2'
                key={item.userid}
              >
                {/* 如果是前三名，就顯示皇冠 */}
                {index < 3 && (
                  <div className='absolute right-0 top-0 p-2'>
                    <IconCrown size={25} className='fill-amber-500' />
                  </div>
                )}
                <div className='flex items-center'>
                  <Fancybox
                    options={{
                      Carousel: {
                        infinite: false
                      }
                    }}
                  >
                    <a href={item.img} data-fancybox='images' data-caption={item.name}>
                      <Avatar
                        src={item.img}
                        width={75}
                        height={100}
                        alt='大頭貼'
                        fallback={
                          <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                            <IconUserCircle size={75} />
                          </div>
                        }
                      />
                    </a>
                  </Fancybox>
                  <div className='p-2'>
                    <div className='p-1'>{item.userid}</div>
                    <div className='p-1'>{item.name}</div>
                  </div>
                </div>
                <div className='flex items-center font-mono'>
                  {/* <div className='p-1'>{item.data.year}</div>
                                <div className='p-1'>{item.data.sem}</div> */}
                  <div className='mr-1 flex flex-col items-center px-1 md:flex-row'>
                    <IconUserStar className='animate-pulse stroke-yellow-500' />
                    {/* 我想要格式長這樣 00.00 */}
                    <div>{item.data.conduct.score.toFixed(2).toString().padStart(5, '0')}</div>
                  </div>
                  <div className='mr-1 flex flex-col items-center px-1 md:flex-row'>
                    <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                    <div>{item.data.avg.toFixed(2).toString().padStart(5, '0')}</div>
                  </div>
                  <div className='px-1 text-lg font-bold'>
                    {(index + 1).toString().padStart(3, '0')}
                  </div>
                  <div className='absolute bottom-0 right-0 px-3 text-lg font-bold'>
                    {item.data.rank.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  )
}

export default DeptRankPage
