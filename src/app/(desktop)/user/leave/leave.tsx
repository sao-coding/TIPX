'use client'

import { useState } from 'react'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import { type AxiosError } from 'axios'
import { CalendarIcon } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import Loading from '@/components/ui/Loading'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { Leave as LeaveType } from '@/types'
import formatDatetime from '@/utils/format-datetime'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import ConfirmCard from './confirmCard'

const Leave = () => {
  const searchParams = useSearchParams()
  // 目前台灣時間
  const now = new Date()
  // const nowDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
  //   .getDate()
  //   .toString()
  //   .padStart(2, '0')}`
  // const [date, setDate] = useState(searchParams.get('date') || nowDate)
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(searchParams.get('date') || now)
  )
  const [selected, setSelected] = useState('病假')
  const queryClient = useQueryClient()
  const { isLoading, data, isError } = useQuery<LeaveType>({
    queryKey: ['leave', date],
    queryFn: async () => {
      // const res = await fetch(`/api/leave?date=${date}`)
      // const data = await res.json()
      // // error
      // if (!res.ok) {
      //   toast.error(data.message)
      //   return
      // }
      // console.log({ data })
      // return data

      // const res = await api.get(`/leave?date=${formatDatetime('date', date as Date)}`)
      // console.log({ res })
      // if (res.status === 200) {
      //   return res.data
      // } else {
      //   toast.error(res.data.message)
      //   return
      // }

      try {
        const { data } = await api.get(`/leave?date=${formatDatetime('date', date as Date)}`)
        return data
      } catch (error) {
        const err = error as AxiosError
        console.error(error)
        type Error = {
          message: string
        }
        toast.error((err.response?.data as Error).message)
        return
      }
    }
  })

  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!date) {
      toast.error('請選擇日期')
      return
    }

    if (!selected) {
      toast.error('請選擇假別')
      return
    }
    const ckeck = Array.from(e.currentTarget.querySelectorAll('input[type=checkbox]'))
    // 至少要有一個勾選
    if (ckeck.every((input) => !(input as HTMLInputElement).checked)) {
      toast.error('請選擇至少一節課')
      return
    }
    // const toastId = toast.loading('請假中...')
    // const res = await fetch('/api/leave', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     type: 'leave',
    //     date,
    //     leaveType: selected,
    //     // 只要有勾選就請假
    //     list: Array.from(e.currentTarget.querySelectorAll('input[type=checkbox]'))
    //       .map((input) => ({
    //         id: input.id,
    //         value: (input as HTMLInputElement).checked ? (input as HTMLInputElement).value : ''
    //       }))
    //       .filter((item) => item.value !== '')
    //   })
    // })

    // if (!res.ok) {
    //   toast.error('請假失敗')
    //   return
    // } else {
    //   toast.success('請假成功', { id: toastId })
    //   queryClient.invalidateQueries({ queryKey: ['leave', date] })
    //   return
    // }

    const res = await api.post('/leave', {
      type: 'leave',
      date,
      leaveType: selected,
      list: Array.from(e.currentTarget.querySelectorAll('input[type=checkbox]'))
        .map((input) => ({
          id: input.id,
          value: (input as HTMLInputElement).checked ? (input as HTMLInputElement).value : ''
        }))
        .filter((item) => item.value !== '')
    })

    console.log({ res })

    if (res.status === 200) {
      toast.success('請假成功')
      queryClient.invalidateQueries({ queryKey: ['leave', date] })
      return
    } else {
      toast.error('請假失敗')
      return
    }
  }

  return (
    <form encType='multipart/form-data' onSubmit={(event) => upload(event)}>
      <div className='mb-2 flex items-center gap-1 md:gap-2'>
        {/* <input
          type='date'
          name='date'
          id=''
          className='h-8 rounded-lg p-1 md:w-1/3 md:border'
          min={data?.start}
          max={data?.end}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        /> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal md:w-1/3',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {/* {date ? format(date, 'PPP') : <span>Pick a date</span>} */}
              {date ? formatDatetime('date', date) : <span>選擇日期</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={setDate}
              initialFocus
              classNames={{
                cell: 'rounded-md h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20'
              }}
              // 最小可選日期
              // 最大可選日期
              modifiers={{
                disabled: {
                  before: new Date(data?.start ?? now),
                  after: new Date(data?.end ?? now)
                }
              }}
            />
          </PopoverContent>
        </Popover>
        {/* 病假
            事假
            生理假 */}
        {/* <div className='relative w-28 md:w-1/3'>
          <Listbox value={selected} onChange={(e) => setSelected(e)}>
            <Listbox.Button className='flex h-8 w-full items-center justify-start rounded-lg p-1 md:border'>
              <IconSelector />
              {selected}
            </Listbox.Button>
            <Listbox.Options className='absolute left-0 top-10 z-10 w-full rounded-lg p-2 shadow-md'>
              {data?.type.map((type, i) => (
                <Listbox.Option key={i} value={type}>
                  {type}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div> */}
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className='relative w-28 md:w-1/3' disabled={isError}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {data?.type.map((type, i) => (
              <SelectItem key={i} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* <input
          type='submit'
          value='送出'
          className='bg-card-background flex-1 rounded-lg p-1 hover:bg-gray-200 md:w-1/3 md:border'
        /> */}
        <Button type='submit' variant='outline' className='flex-1 md:w-1/3'>
          送出
        </Button>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        data?.leave.list.map((leave) => (
          <div key={leave.id}>
            {
              leave.status && <ConfirmCard leave={leave} />
              // <span style={{ color: "green" }}>✔</span>
            }
          </div>
        ))
      )}
    </form>
  )
}

export default Leave
