'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface SuggestionTextareaProps {
  suggestionId: string
  formData: Record<string, string>
  onValueChange: (suggestionId: string, value: string) => void
}

export function SuggestionTextarea({
  suggestionId,
  formData,
  onValueChange
}: SuggestionTextareaProps) {
  return (
    <div className='space-y-3 border-t pt-4'>
      <Label htmlFor={suggestionId} className='text-sm font-medium'>
        對此部份的建議：（請以中文或英文書寫）
      </Label>
      <Textarea
        id={suggestionId}
        placeholder='請輸入您的建議...'
        value={formData[suggestionId] || ''}
        onChange={(e) => onValueChange(suggestionId, e.target.value)}
        className='min-h-[80px]'
      />
    </div>
  )
}
