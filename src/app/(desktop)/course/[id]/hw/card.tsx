import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast, { useToasterStore } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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
import Dropzone from '@/components/ui/dropzone'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Hw } from '@/types'
import {
  IconCalendarOff,
  IconCalendarTime,
  IconDownload,
  IconDownloadOff,
  IconPaperclip,
  IconSlash,
  IconUpload
} from '@tabler/icons-react'

const Card = ({ data, studentID }: { data: Hw; studentID: string }) => {
  const [file, setFile] = useState<File | null>(null)
  const [onDrop, setOnDrop] = useState(false)
  const { toasts } = useToasterStore()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const TOAST_LIMIT = 2
  // Enforce Limit
  // FIXME: 改成匯入 React
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
      .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) removal without animation
  }, [toasts])

  // const trackDownloadFile = (course: string, title: string) => {
  //   return `${studentID} - ${course} - ${title}`
  // }

  // const trackDownloadHw = (course: string, title: string) => {
  //   return `${studentID} - ${course} - ${title}`
  // }

  // const trackUploadHw = (course: string, title: string) => {
  //   return `${studentID} - ${course} - ${title}`
  // }

  const formatTime = (time: string) => {
    // 202306151300
    const year = time.slice(0, 4)
    const month = time.slice(4, 6)
    const day = time.slice(6, 8)
    const hour = time.slice(8, 10)
    const min = time.slice(10, 12)
    return `${year}/${month}/${day} ${hour}:${min}`
  }

  const download = (id: string) => {
    const hw = `https://netinfo.takming.edu.tw/tip/download_file_2.php?filename=${id}`
    window.location.href = hw
  }
  // TODO: 上傳功能實作
  const upload = async (event: React.FormEvent<HTMLFormElement>, id: string) => {
    event.preventDefault()
    const toastId = toast.loading('上傳中...')
    const bodyContent = new FormData()
    bodyContent.append('id', id)
    bodyContent.append('userfile', file as Blob)

    const res = await fetch('/api/hw', {
      method: 'POST',
      body: bodyContent
    })

    const json = await res.json()
    if (json.status === 'success') {
      toast.success('上傳成功', { id: toastId })
      // umami.track('作業上傳', {
      //   data: trackUploadHw(course, data.title)
      // })
    } else if (json.status === 'error') {
      toast.error(json.message, { id: toastId })
    } else {
      toast.error('上傳失敗', { id: toastId })
    }
  }

  const handleFileChange = (file: File) => {
    setFile(file)
  }

  return (
    <div className='w-full border-b px-2 py-3 hover:bg-background2 md:p-7'>
      <div className='relative'>
        <div
          className={clsx(
            'absolute right-0 top-0 rounded-md px-2 py-1 text-sm text-white md:text-base',
            data.status === '已繳交' ? 'bg-green-600' : 'bg-red-600'
          )}
        >
          {data.status}
        </div>
        <div className='flex justify-between'>
          <div>
            <h1 className='line-clamp-1 text-lg font-bold md:text-xl'>{data.title}</h1>
            <div className='flex items-center space-x-1 text-sm text-neutral-500'>
              <IconCalendarTime size={20} />
              <div>{formatTime(data.start)}</div>
            </div>
            <div className='flex items-center space-x-1 text-sm text-neutral-500'>
              <IconCalendarOff size={20} />
              <div>{formatTime(data.end)}</div>
            </div>
            <div className='flex items-center space-x-1 text-neutral-500'>
              <IconPaperclip size={20} />
              <div>附件</div>
              <button
                className={clsx(
                  'rounded-sm bg-background3 p-1 text-foreground hover:bg-foreground hover:text-background3',
                  data.file === '' ? 'cursor-not-allowed' : ''
                )}
                disabled={data.file === ''}
                onClick={() => {
                  if (data.file !== '') {
                    // umami.track('附件下載', {
                    //   data: trackDownloadFile(course, data.title)
                    // })
                    download(data.file)
                  }
                }}
              >
                {data.file === '' ? <IconDownloadOff size={20} /> : <IconDownload size={20} />}
              </button>
            </div>
          </div>
          <div className='sm flex items-end space-x-2'>
            {isDesktop ? (
              <Dialog>
                <DialogTrigger
                  className={clsx(
                    'relative rounded-sm bg-background3 p-1 text-foreground hover:bg-foreground hover:text-background3',
                    data.upload === '' ? 'cursor-not-allowed' : ''
                  )}
                  disabled={data.upload === ''}
                >
                  <IconUpload />
                  {data.upload === '' && (
                    <IconSlash
                      className='absolute left-0 top-0 h-full w-full rotate-[100deg] stroke-[1.4]'
                      size={20}
                    />
                  )}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>作業上傳</DialogTitle>
                    <DialogDescription>{data.title}</DialogDescription>
                  </DialogHeader>
                  {file && (
                    <div className='flex items-center space-x-2'>
                      <IconPaperclip />
                      <div>{file.name}</div>
                    </div>
                  )}
                  <Dropzone
                    classNameWrapper='h-40'
                    className='h-40'
                    dropMessage='拖曳檔案至此上傳'
                    handleOnDrop={(files) => {
                      if (files) {
                        setFile(files[0])
                      }
                    }}
                  />
                  <Button>上傳檔案</Button>
                </DialogContent>
              </Dialog>
            ) : (
              <Drawer>
                <DrawerTrigger
                  className={clsx(
                    'relative rounded-sm bg-background3 p-1 text-foreground hover:bg-foreground hover:text-background3',
                    data.upload === '' ? 'cursor-not-allowed' : ''
                  )}
                  disabled={data.upload === ''}
                >
                  <IconUpload />
                  {data.upload === '' && (
                    <IconSlash
                      className='absolute left-0 top-0 h-full w-full rotate-[100deg] stroke-[1.4]'
                      size={20}
                    />
                  )}
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>作業上傳</DrawerTitle>
                    <DrawerDescription>{data.title}</DrawerDescription>
                  </DrawerHeader>
                  <div className='space-y-2 px-4'>
                    {file && (
                      <div className='flex items-center space-x-2'>
                        <IconPaperclip />
                        <div>{file.name}</div>
                      </div>
                    )}
                    <Dropzone
                      classNameWrapper='h-40'
                      className='h-40'
                      dropMessage='拖曳檔案至此上傳'
                      handleOnDrop={(files) => {
                        if (files) {
                          setFile(files[0])
                        }
                      }}
                    />
                  </div>
                  <DrawerFooter>
                    <Button>上傳檔案</Button>
                    <DrawerClose asChild>
                      <Button variant='outline'>取消</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
            {/* 如果未繳交 cursor-not-allowed */}
            <button
              className={clsx(
                'rounded-sm bg-background3 p-1 text-foreground hover:bg-foreground hover:text-background3',
                data.download === '' ? 'cursor-not-allowed' : ''
              )}
              disabled={data.download === ''}
              onClick={() => {
                if (data.download !== '') {
                  // umami.track('作業下載', {
                  //   data: trackDownloadHw(course, data.title)
                  // })
                  download(data.download)
                }
              }}
            >
              {data.download === '' ? <IconDownloadOff /> : <IconDownload />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
