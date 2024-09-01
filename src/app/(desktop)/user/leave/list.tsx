'use client'

import React from 'react'
import clsx from 'clsx'
import Cookies from 'js-cookie'

import Loading from '@/components/ui/Loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import api from '@/lib/api'
import { LeaveItemCheck } from '@/types'
import formatDatetime from '@/utils/format-datetime'
import { useQuery } from '@tanstack/react-query'

import Delete from './delete'

const List = () => {
  // 目前台灣月份 new Date().getMonth() + 1補0
  // const [month, setMonth] = useState(`${new Date().getMonth() + 1}`.padStart(2, '0'))
  const [month, setMonth] = React.useState<string>(`${new Date().getMonth() + 1}`.padStart(2, '0'))
  const { isLoading, isError, data } = useQuery<LeaveItemCheck[]>({
    queryKey: ['leaveList', month, Cookies.get('year'), Cookies.get('sem')],
    queryFn: async () => {
      // const res = await fetch(`/api/leave?month=${month}`)
      // const data = await res.json()
      // return data

      const { data } = await api.get(`/leave?month=${month}`)
      return data
    }
    // refetchOnWindowFocus: false,
  })

  const typeColor: { [key: string]: string } = {
    病假: 'bg-blue-500',
    事假: 'bg-orange-500',
    生理假: 'bg-rose-500'
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
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger>
            <SelectValue>{month !== 'all' ? `${month} 月` : '全部'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部</SelectItem>
            {Cookies.get('sem') === '1' ? (
              <>
                <SelectItem value='09'>09 月</SelectItem>
                <SelectItem value='10'>10 月</SelectItem>
                <SelectItem value='11'>11 月</SelectItem>
                <SelectItem value='12'>12 月</SelectItem>
                <SelectItem value='01'>01 月</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value='02'>02 月</SelectItem>
                <SelectItem value='03'>03 月</SelectItem>
                <SelectItem value='04'>04 月</SelectItem>
                <SelectItem value='05'>05 月</SelectItem>
                <SelectItem value='06'>06 月</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data?.length === 0 && <div className='text-center text-2xl'>沒有請假紀錄</div>}
          {data?.map((item, index) => (
            <div className='relative mb-2 rounded-sm border bg-background1 p-2' key={index}>
              <div className='flex flex-col gap-2'>
                <div className='flex'>
                  <div className={clsx('rounded-sm px-2 text-white', typeColor[item.type])}>
                    {item.type}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='rounded-sm bg-primary px-2 text-white'>{`第${item.section}節`}</div>
                  {formatDatetime('leave', item.date)}
                </div>
                <div className='flex gap-2'>
                  <div className='border-b border-primary'>{item.course}</div>
                  {item.teacher}
                </div>
              </div>
              <div className='absolute right-2 top-2 flex flex-col items-end space-y-1'>
                <div className={clsx('rounded-sm px-2 text-white', statusColor[item.status])}>
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
