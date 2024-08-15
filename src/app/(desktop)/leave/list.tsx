'use client'

import { useState } from 'react'
import clsx from 'clsx'
import Cookie from 'js-cookie'

import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { LeaveItemCheck } from '@/types'
import formatDatetime from '@/utils/format-datetime'
import { Listbox } from '@headlessui/react'
import { IconArrowsMoveVertical } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import Delete from './delete'

const List = () => {
  // 目前台灣月份 new Date().getMonth() + 1補0
  const [month, setMonth] = useState(`${new Date().getMonth() + 1}`.padStart(2, '0'))
  const { isLoading, isError, data } = useQuery<LeaveItemCheck[]>({
    queryKey: ['leaveList', month],
    queryFn: async () => {
      // const res = await fetch(`/api/leave?month=${month}`)
      // const data = await res.json()
      // return data

      const { data } = await api.get(`/leave?month=all`)
      return data
    }
    // refetchOnWindowFocus: false,
  })

  const typeColor: { [key: string]: string } = {
    病假: 'bg-blue-500',
    事假: 'bg-orange-500',
    生理假: 'bg-purple-500'
  }

  const statusColor: { [key: string]: string } = {
    已核可: 'bg-green-500',
    審核中: 'bg-yellow-500',
    請來談: 'bg-yellow-500',
    退件: 'bg-red-500'
  }

  // const formatDate = (date: string) => {
  //     // 1120915(五) -> 2023/09/15(五)

  //     const year = date.slice(0, 3)
  //     const month = date.slice(3, 5)
  //     const day = date.slice(5, 7)
  //     const week = date.slice(8, 9)

  //     return `${year}/${month}/${day} (${week})`
  // }

  return (
    <>
      <div className='relative mb-2'>
        <Listbox value={month} onChange={(e) => setMonth(e)}>
          <Listbox.Button className='flex w-full items-center justify-start rounded-lg p-1'>
            <IconArrowsMoveVertical />
            {month !== 'all' ? `${month} 月` : '全部'}
          </Listbox.Button>
          <Listbox.Options className='bg-card-background absolute left-0 top-10 z-10 w-full cursor-pointer rounded-lg p-2 font-mono shadow-md'>
            {/* {data?.type.map((type, i) => (
                                            <Listbox.Option key={i} value={type}>
                                                {type}
                                            </Listbox.Option>
                                        ))} */}
            {/* 上學期 09~01 */}
            {/* 下學期 02~06 */}
            {Cookie.get('sem') === '1' ? (
              <>
                <Listbox.Option value='all'>全部</Listbox.Option>
                <Listbox.Option value='09'>09 月</Listbox.Option>
                <Listbox.Option value='10'>10 月</Listbox.Option>
                <Listbox.Option value='11'>11 月</Listbox.Option>
                <Listbox.Option value='12'>12 月</Listbox.Option>
                <Listbox.Option value='01'>01 月</Listbox.Option>
              </>
            ) : (
              <>
                <Listbox.Option value='all'>全部</Listbox.Option>
                <Listbox.Option value='02'>02 月</Listbox.Option>
                <Listbox.Option value='03'>03 月</Listbox.Option>
                <Listbox.Option value='04'>04 月</Listbox.Option>
                <Listbox.Option value='05'>05 月</Listbox.Option>
                <Listbox.Option value='06'>06 月</Listbox.Option>
              </>
            )}
          </Listbox.Options>
        </Listbox>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data?.length === 0 && <div className='text-center text-2xl'>沒有請假紀錄</div>}
          {data?.map((item, index) => (
            <div className='relative mb-2 rounded-xl border p-2' key={index}>
              <div className='flex'>
                <div className={clsx('rounded-lg px-1 text-white', typeColor[item.type])}>
                  {item.type}
                </div>
              </div>
              <div>{formatDatetime('leave', item.date)}</div>
              <div>{item.course}</div>
              <div>{item.teacher}</div>

              <div className='absolute right-2 top-2 flex flex-col items-end space-y-1'>
                <div className='bg-main-color-3 rounded-lg px-1 text-white'>{`第${item.section}節`}</div>
                <div className={clsx('rounded-lg px-1 text-white', statusColor[item.status])}>
                  {item.status}
                </div>
              </div>
              <div className='absolute bottom-2 right-2'>
                {item.id !== '' && <Delete id={item.id} />}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default List
