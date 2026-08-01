'use client'

import { Settings, Shuffle, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ProgressCardProps {
  answeredQuestions: number
  totalQuestions: number
  progress: number
  onConfiguredFill: () => void
  onRandomFill: () => void
  onClearForm: () => void
}

export function ProgressCard({
  answeredQuestions,
  totalQuestions,
  progress,
  onConfiguredFill,
  onRandomFill,
  onClearForm
}: ProgressCardProps) {
  return (
    <Card className='sticky top-0 z-10 mb-6 shadow-lg'>
      <CardHeader>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <CardTitle className='text-lg'>填寫進度</CardTitle>
          </div>
          <div className='flex flex-wrap gap-2 sm:self-center'>
            <Button onClick={onConfiguredFill} variant='outline' size='sm'>
              <Settings className='mr-2 h-4 w-4' />
              一鍵填寫
            </Button>
            <Button onClick={onRandomFill} variant='outline' size='sm'>
              <Shuffle className='mr-2 h-4 w-4' />
              隨機填寫
            </Button>
            <Button onClick={onClearForm} variant='outline' size='sm'>
              <Trash2 className='mr-2 h-4 w-4' />
              清除
            </Button>
          </div>
        </div>
        <div className='mt-2'>
          <div className='mb-1 text-sm text-muted-foreground'>
            已完成 {answeredQuestions} / {totalQuestions} 題
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>
    </Card>
  )
}
