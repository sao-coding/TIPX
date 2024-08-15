'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { Leave as LeaveType } from '@/types'
import { Listbox } from '@headlessui/react'
import { IconSelector } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import ConfirmCard from './confirmCard'

const Leave = () => {
  const searchParams = useSearchParams()
  // 目前台灣時間
  const now = new Date()
  const nowDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
    .getDate()
    .toString()
    .padStart(2, '0')}`
  const [date, setDate] = useState(searchParams.get('date') || nowDate)
  const [selected, setSelected] = useState('病假')
  const queryClient = useQueryClient()
  const { isLoading, data } = useQuery<LeaveType>({
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

      const res = await api.get(`/leave?date=${date}`)
      console.log({ res })
      if (res.status === 200) {
        return res.data
      } else {
        toast.error(res.data.message)
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
      <div className='mb-2 flex items-center space-x-1'>
        <input
          type='date'
          name='date'
          id=''
          className='bg-card-background h-8 rounded-lg p-1 md:w-1/3 md:border'
          min={data?.start}
          max={data?.end}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {/* 病假
                事假
                生理假 */}
        <div className='relative w-28 md:w-1/3'>
          <Listbox value={selected} onChange={(e) => setSelected(e)}>
            <Listbox.Button className='bg-card-background flex h-8 w-full items-center justify-start rounded-lg p-1 md:border'>
              <IconSelector />
              {selected}
            </Listbox.Button>
            <Listbox.Options className='bg-card-background absolute left-0 top-10 z-10 w-full rounded-lg p-2 shadow-md'>
              {data?.type.map((type, i) => (
                <Listbox.Option key={i} value={type}>
                  {type}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
        <input
          type='submit'
          value='送出'
          className='bg-card-background flex-1 rounded-lg p-1 hover:bg-gray-200 md:w-1/3 md:border'
        />
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
