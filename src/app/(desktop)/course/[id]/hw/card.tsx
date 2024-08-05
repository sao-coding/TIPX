import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { FileUploader } from 'react-drag-drop-files'
import toast, { useToasterStore } from 'react-hot-toast'

import { HwList } from '@/types'
import * as Dialog from '@radix-ui/react-dialog'
import {
  IconCalendarOff,
  IconCalendarTime,
  IconDownload,
  IconDownloadOff,
  IconPaperclip,
  IconSlash,
  IconUpload,
  IconX
} from '@tabler/icons-react'

const Card = ({ data, studentID }: { data: HwList; studentID: string }) => {
  const [file, setFile] = useState<File | null>(null)
  const [onDrop, setOnDrop] = useState(false)
  const { toasts } = useToasterStore()

  const TOAST_LIMIT = 2
  // Enforce Limit
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
    <div className='relative mb-2 w-full border-b'>
      <div
        className={clsx(
          'absolute right-2 top-2 rounded-md p-1 text-white',
          data.status === '已繳交' ? 'bg-green-600' : 'bg-red-600'
        )}
      >
        {data.status}
      </div>
      <div className='flex justify-between p-2'>
        <div>
          <div className='text-lg font-bold'>{data.title}</div>
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
                'bg-main-color-3 hover:text-main-color-3 rounded-md p-1 text-white hover:bg-white',
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
          <Dialog.Root>
            <Dialog.Trigger
              className={clsx(
                'bg-main-color-3 hover:text-main-color-3 relative rounded-md p-1 text-white hover:bg-white',
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
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className='data-[state=open]:animate-overlayShow fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm' />
              <Dialog.Content asChild>
                <motion.div
                  className='bg-card-background data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[85vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg p-4 shadow-lg focus:outline-none'
                  initial={{ opacity: 0, scale: 0.9, y: '-50%', x: '-50%' }}
                  animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                >
                  <Dialog.Close className='absolute right-4 top-4 text-gray-400 hover:text-gray-500'>
                    <IconX />
                  </Dialog.Close>
                  <form
                    name='作業上傳'
                    encType='multipart/form-data'
                    className='flex h-full flex-col items-center space-y-2 p-4'
                    onSubmit={(event) => upload(event, data.upload)}
                  >
                    <h1 className='self-start text-xl'>作業上傳</h1>
                    <h2 className='text-lg font-bold'>{data.title}</h2>
                    <FileUploader
                      handleChange={(file: File) => handleFileChange(file)}
                      onDraggingStateChange={(dragging: boolean) => setOnDrop(dragging)}
                      onTypeError={() => toast.error('不支援的檔案類型')}
                      name='userfile'
                      types={[
                        'doc',
                        'xls',
                        'txt',
                        'ppt',
                        'docx',
                        'xlsx',
                        'pptx',
                        'accdb',
                        'pdf',
                        'xlsm',
                        'zip',
                        'rar'
                      ]}
                      hoverTitle='拖曳檔案至此'
                      classes='w-full h-full block focus:outline-none focus-within:!outline-none'
                    >
                      <div className='h-20 w-full rounded-lg border-2 border-dashed focus:outline-none'>
                        <div className='flex h-full w-full flex-col items-center justify-center space-y-1'>
                          {onDrop ? null : (
                            <>
                              <IconUpload size={40} />
                              <div className='flex items-center'>
                                <IconPaperclip size={20} />
                                {/* 檔案名稱 . 前面的部分 不超過 11 個字 */}
                                {file ? (
                                  <div>
                                    {file.name.split('.')[0].length > 11
                                      ? `${file.name.split('.')[0].slice(0, 11)}... .${
                                          file.name.split('.')[1]
                                        }`
                                      : file.name}
                                  </div>
                                ) : (
                                  <div>上傳 或 拖曳檔案至此</div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </FileUploader>
                    <input
                      type='submit'
                      value='上傳檔案'
                      className='bg-main-color-3 hover:bg-main-color-4 w-full rounded-md p-1 text-white'
                    />
                  </form>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          {/* 如果未繳交 cursor-not-allowed */}
          <button
            className={clsx(
              'bg-main-color-3 hover:text-main-color-3 rounded-md p-1 text-white hover:bg-white',
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
  )
}

export default Card
