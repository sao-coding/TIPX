'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Question } from '@/types'

interface QuestionItemProps {
  question: Question
  formData: Record<string, string>
  onValueChange: (questionId: string, value: string) => void
}

export function QuestionItem({ question, formData, onValueChange }: QuestionItemProps) {
  return (
    <div className='space-y-3'>
      <Label className='text-sm font-medium leading-relaxed'>
        {question.id.replace('q', '')}. {question.text}
      </Label>
      <RadioGroup
        value={formData[question.id] || ''}
        onValueChange={(value) => onValueChange(question.id, value)}
        className='grid gap-2'
      >
        {question.options.map((option) => (
          <div key={option.value} className='flex items-center space-x-2'>
            <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
            <Label
              htmlFor={`${question.id}-${option.value}`}
              className='flex-1 cursor-pointer text-sm'
            >
              {option.value}. {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
