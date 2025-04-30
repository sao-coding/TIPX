'use client'

import { useCallback, use } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import Ads from '@/components/Ads'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { Post } from '@/types'
import {
  IconCalendarOff,
  IconCalendarTime,
  IconDownload,
  IconLink,
  IconPaperclip,
  IconShare
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const PostModal = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params)
  const id = params.id
  const router = useRouter()
  const path = usePathname()

  const { isLoading, data } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      //   const res = await fetch(`/api/post?type=one&id=${id}`)
      //   const json = await res.json()
      //   if (!res.ok) throw new Error('沒有這篇公告')
      //   return json
      const { data } = await api.get(`post?type=one&id=${id}`)
      return data
    }
  })

  const dismiss = useCallback(() => {
    router.back()
  }, [router])

  const Share = (title: string, text: string, url: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: title + '\n',
          url: url
        })
        .then(() => {
          toast.success('分享成功')
        })
        .catch((error) => {
          toast.error('分享失敗')
          console.log(error)
        })
    } else {
      toast.error('Web Share API 不支援')
    }
  }

  return (
    <>
      <Dialog defaultOpen onOpenChange={(open) => !open && dismiss()}>
        <DialogContent
          // closeButton={false}
          className='flex h-full w-full flex-col p-0 md:max-w-3xl'
        >
          {isLoading ? (
            <div className='relative'>
              <Loading />
            </div>
          ) : (
            <>
              <div className='h-14'>
                <h1 className='mr-6 line-clamp-2 px-3 pt-3 text-xl font-bold md:text-2xl'>
                  {data?.title}
                </h1>
              </div>
              <div className='overflow-y-auto p-3 md:p-6'>
                <div className='flex justify-between'>
                  <div className=''>
                    <div className='flex items-center gap-2'>
                      <div>{data?.unit}</div>
                      <div className='text-blue-500'>
                        <a href={`mailto:${data?.publisher.email}`}>{data?.publisher.name}</a>
                      </div>
                    </div>
                    {data?.category}
                  </div>
                  <div className=''>
                    <div className='flex items-center gap-1'>
                      <IconCalendarTime size={20} />
                      <div>{data?.date}</div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <IconCalendarOff size={20} />
                      <div>{data?.deadline}</div>
                    </div>
                  </div>
                </div>
                <div className='whitespace-pre-line break-words md:p-1'>{data?.content}</div>
                <Ads
                  dataAdFormat='fluid'
                  dataAdLayoutKey='-fb+5w+4e-db+86'
                  dataAdClient='ca-pub-2271001084588765'
                  dataAdSlot='9510191337'
                />
                <div className='flex w-full justify-end gap-2'>
                  <a
                    href={`https://netinfo.takming.edu.tw/tip/post/post_OneShow.php?SerialItem=${data?.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    來源: <span className='text-blue-500'>德明 TIP</span>
                  </a>
                  <button
                    className='flex items-center rounded-md px-1'
                    onClick={() => {
                      Share(data?.title ?? '', data?.content ?? '', path)
                    }}
                  >
                    <IconShare />
                    {/* 分享 */}
                  </button>
                </div>
                <div className='mt-1 rounded-xl border-2 border-dashed p-1 md:h-[10vh] md:overflow-y-auto md:border md:border-solid'>
                  {(data?.file?.length ?? 0 > 0) ? (
                    <>
                      {data?.file.map((item) => (
                        <div key={item.title} className='flex items-center'>
                          <IconPaperclip size={20} />
                          <div className='pl-1'>{item.title}</div>
                          <a href={item.link} target='_blank' rel='noreferrer' className='p-1'>
                            <IconDownload className='bg-main-color-1 rounded-md p-1' />
                          </a>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className='flex items-center'>
                      <IconPaperclip size={20} />
                      <div className='pl-1 text-gray-500'>沒有附件</div>
                    </div>
                  )}
                  {data?.link ? (
                    <div className='flex items-center'>
                      <IconLink size={20} />
                      <a
                        href={data.link}
                        target='_blank'
                        rel='noreferrer'
                        className='pl-1 text-blue-500'
                      >
                        點及此處前往
                      </a>
                    </div>
                  ) : (
                    <div className='flex items-center'>
                      <IconLink size={20} />
                      <div className='pl-1 text-gray-500'>沒有連結</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostModal
