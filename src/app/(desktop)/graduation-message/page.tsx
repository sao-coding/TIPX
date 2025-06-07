'use client'

import React from 'react'
import toast from 'react-hot-toast'

import Title from '@/components/Title'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { IconLoader2 } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type Comment = {
  id: string
  userId: string
  content: string
  createdAt: string
}

const GraduationMessagePage = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const queryClient = useQueryClient()

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ['graduationMessages'],
    queryFn: async () => {
      const { data } = await api.get('graduation-message')

      return data.data
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const message = formData.get('message') as string

    if (message.trim() === '') {
      toast.error('留言內容不能為空')
      setIsSubmitting(false)
      return
    }

    try {
      console.log('提交的留言:', message)
      const { data } = await api.post('graduation-message', { message })

      if (data.status === 'success') {
        toast.success('留言提交成功')
        // 更新留言列表
        queryClient.invalidateQueries({ queryKey: ['graduationMessages'] })
        // 清空表單
        const form = e.currentTarget
        if (form) {
          form.reset()
        }
      } else {
        toast.error(data.message || '留言提交失敗')
      }
    } catch (error) {
      toast.error('留言提交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  const messages = [
    '感謝大家使用這個 TIPX 系統，這是我在大學期間的專案。',
    '希望這個系統能夠幫助到你們，讓你們的上傳作業和查詢成績還有請假等功能更加方便。',
    '如果有任何問題或建議，歡迎隨時聯繫我。但由於我已經畢業，可能無法及時修復系統中的問題。',
    '祝大家畢業快樂，前程似錦！'
  ]

  const titleData = {
    title: '畢業感言',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <div className='space-y-4 p-4'>
        <div className='space-y-4'>
          {messages.map((msg, index) => (
            <p key={index} className='leading-relaxed'>
              {msg}
            </p>
          ))}
        </div>
        <div className='space-y-2'>
          <h2 className='mb-1 text-lg font-semibold'>歡迎留言(預設匿名)</h2>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder='請輸入您的留言'
              name='message'
              required
              disabled={isSubmitting}
            />
            <div className='mt-2 flex justify-end'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <IconLoader2 className='size-4 animate-spin' />
                    提交中...
                  </>
                ) : (
                  '提交留言'
                )}
              </Button>
            </div>
          </form>
          {/* 顯示訊息區域 */}
          <div className='space-y-2'>
            {comments &&
              comments.map((comment) => (
                <Card key={comment.id} className='transition-shadow hover:shadow-md'>
                  <CardContent className='pt-6'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-muted-foreground'>
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className='text-sm leading-relaxed'>{comment.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default GraduationMessagePage
