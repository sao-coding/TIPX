import { useState } from 'react'
import toast from 'react-hot-toast'

import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { IconAlertTriangleFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'

const Delete = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(`${new Date().getMonth() + 1}`.padStart(2, '0'))
  const queryClient = useQueryClient()
  const deleteLeave = async (id: string) => {
    const toastId = toast.loading('刪除中...')

    const res = await fetch(`/api/leave`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.message)
      return
    }
    toast.success(data.message, { id: toastId })
    queryClient.invalidateQueries({ queryKey: ['leaveList', month] })
  }

  return (
    <>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger className='rounded-lg bg-red-500 px-2 py-0.5 text-white'>
          取消
        </AlertDialog.Trigger>
        <AlertDialog.Overlay className='data-[state=open]:animate-overlayShow fixed inset-0 z-20 bg-[rgba(0,0,0,.5)] backdrop-blur-sm' />
        <AlertDialog.Content className='bg-card-background data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 z-20 flex max-h-[85vh] w-[85vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col justify-center space-y-2 rounded-sm p-4 shadow-lg focus:outline-none'>
          <AlertDialog.Title className='flex items-center space-x-2 text-xl font-bold'>
            <div className='relative h-6 w-6'>
              <div className='absolute h-full w-full animate-ping rounded-full bg-red-500'></div>
              <IconAlertTriangleFilled className='text-red-500' />
            </div>
            <span>確定要取消請假嗎？</span>
          </AlertDialog.Title>
          <AlertDialog.Description>
            請假時間以8天為限，若超過8天的假取消後無法再請假
          </AlertDialog.Description>
          <div className='flex justify-end space-x-2'>
            <AlertDialog.Cancel className='rounded-lg bg-gray-200 px-2 py-0.5 text-gray-600'>
              取消，讓我想想
            </AlertDialog.Cancel>
            <AlertDialog.Action
              className='rounded-lg bg-red-500 px-2 py-0.5 text-white'
              onClick={() => {
                deleteLeave(id)
              }}
            >
              確定
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

export default Delete
