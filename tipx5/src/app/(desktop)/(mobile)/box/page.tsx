'use client'

import Link from 'next/link'
import { type AxiosError } from 'axios'
import toast from 'react-hot-toast'

import Title from '@/components/Title'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'

const BoxPage = () => {
  const titleData = {
    title: '資源',
    children: ''
  }

  const downloadBuildingTOEICSkillsPPT = async (name: string) => {
    try {
      // await api.post('/download', { name })
      // window.open('https://sao-x.com/files/Building TOEIC Skills_PPT.zip')
      const { data } = await api.post('/download', { name })
      if (data.status === 'success') {
        window.open(`https://sao-x.com/files/${name}.zip`)
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      console.log('err', err)
      if (err.response?.data.message) {
        toast.error('請先登入')
      }
    }
  }

  return (
    <>
      <Title {...titleData} />
      {/* Building TOEIC Skills_PPT */}
      {/* /file/Building TOEIC Skills_PPT.zip */}
      {/* 資源下載 */}
      {/* Building TOEIC Skills PPT 課本內容加答案 */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label>(大一) Building TOEIC Skills PPT 課本內容加答案</Label>
          <Button onClick={() => downloadBuildingTOEICSkillsPPT('Building TOEIC Skills_PPT')}>
            資源下載
          </Button>
        </div>
        <div className='flex items-center justify-between'>
          <Label>(大二) 環球觀點與多元文化的交響樂章 課本</Label>
          <Button onClick={() => downloadBuildingTOEICSkillsPPT('環球觀點與多元文化的交響樂章')}>
            資源下載
          </Button>
        </div>
        <div className='flex justify-end'>
          <Link href='login' className='border-b border-blue-500 text-blue-500'>
            去登入
          </Link>
        </div>
      </div>
    </>
  )
}

export default BoxPage
