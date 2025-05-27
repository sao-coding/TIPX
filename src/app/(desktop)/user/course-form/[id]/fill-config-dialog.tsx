'use client'

import { Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface FillConfigDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  fillOption: string
  onFillOptionChange: (value: string) => void
  onConfirm: () => void
}

export function FillConfigDialog({
  isOpen,
  onOpenChange,
  fillOption,
  onFillOptionChange,
  onConfirm
}: FillConfigDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>設定填寫選項</DialogTitle>
          <DialogDescription>選擇要填入的選項，將會對所有問題填入相同的選項</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='fill-option'>選擇填寫選項：</Label>
            <Select value={fillOption} onValueChange={onFillOptionChange}>
              <SelectTrigger>
                <SelectValue placeholder='選擇選項' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='A'>A - 第一個選項</SelectItem>
                <SelectItem value='B'>B - 第二個選項</SelectItem>
                <SelectItem value='C'>C - 第三個選項</SelectItem>
                <SelectItem value='D'>D - 第四個選項</SelectItem>
                <SelectItem value='E'>E - 第五個選項</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={onConfirm}>
              <Zap className='mr-2 h-4 w-4' />
              確認填寫
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
