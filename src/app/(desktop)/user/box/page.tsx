'use client'

import Title from '@/components/Title'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'

const BoxPage = () => {
  const titleData = {
    title: '資源',
    children: ''
  }

  const downloadBuildingTOEICSkillsPPT = async () => {
    await api.post('/download')
    window.open('https://sao-x.com/file/Building TOEIC Skills_PPT.zip')
  }

  return (
    <>
      <Title {...titleData} />
      {/* Building TOEIC Skills_PPT */}
      {/* /file/Building TOEIC Skills_PPT.zip */}
      {/* 資源下載 */}
      {/* Building TOEIC Skills PPT 課本內容加答案 */}
      <div className='flex items-center justify-between'>
        <Label>Building TOEIC Skills PPT 課本內容加答案</Label>
        <Button onClick={downloadBuildingTOEICSkillsPPT}>資源下載</Button>
      </div>
    </>
  )
}

export default BoxPage
