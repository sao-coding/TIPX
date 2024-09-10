import { useState } from 'react'
import toast from 'react-hot-toast'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import api from '@/lib/api'
import { IconAlertTriangleFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'

const Delete = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const deleteLeave = async (id: string) => {
    const toastId = toast.loading('刪除中...')

    try {
      const { data } = await api.delete('leave', {
        data: { id }
      })

      toast.success('刪除成功', { id: toastId })
      const month = `${new Date().getMonth() + 1}`.padStart(2, '0')
      queryClient.invalidateQueries({ queryKey: ['leaveList', month] })
    } catch (error) {
      toast.error('刪除失敗', { id: toastId })
    }
  }

  return isDesktop ? (
    <AlertDialog>
      <AlertDialogTrigger className='rounded-sm bg-red-500 px-2 py-0.5 text-white'>
        取消
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            <div className='relative h-6 w-6'>
              <div className='absolute h-full w-full animate-ping rounded-full bg-red-500'></div>
              <IconAlertTriangleFilled className='text-red-500' />
            </div>
            <span>確定要取消請假嗎？</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            請假時間以8天為限，若超過8天的假取消後無法再請假
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消，讓我想想</AlertDialogCancel>
          <AlertDialogAction
            className='bg-red-500 text-white hover:bg-red-500/90'
            onClick={() => {
              deleteLeave(id)
            }}
          >
            確定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Drawer>
      <DrawerTrigger className='rounded-sm bg-red-500 px-2 py-0.5 text-white'>取消</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='flex w-full items-center justify-center gap-2'>
            <div className='relative h-6 w-6'>
              <div className='absolute h-full w-full animate-ping rounded-full bg-red-500'></div>
              <IconAlertTriangleFilled className='text-red-500' />
            </div>
            <span>確定要取消請假嗎？</span>
          </DrawerTitle>
          <DrawerDescription>請假時間以8天為限，若超過8天的假取消後無法再請假</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              className='bg-red-500 text-white hover:bg-red-500/90'
              onClick={() => {
                deleteLeave(id)
              }}
            >
              確定
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant='outline' className='w-full'>
              取消，讓我想想
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default Delete
