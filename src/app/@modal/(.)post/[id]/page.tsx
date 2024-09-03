'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import api from '@/lib/api'
import { Post } from '@/types'
import { useQuery } from '@tanstack/react-query'

const PostModal = ({ params }: { params: { id: string } }) => {
  const id = params.id
  const router = useRouter()
  const path = usePathname()

  const { isLoading, isError, data } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: async () => {
      //   const res = await fetch(`/api/post?type=one&id=${id}`)
      //   const json = await res.json()
      //   if (!res.ok) throw new Error('沒有這篇公告')
      //   return json
      const { data } = await api.get(`/post?type=one&id=${id}`)
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
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent closeButton={false}>{data?.title}</DialogContent>
      </Dialog>
    </>
  )
}

export default PostModal
