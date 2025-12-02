'use client'

import { CheckCircle } from 'lucide-react'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { CourseFormSection } from '@/types'

import { QuestionItem } from './question-item'
import { SuggestionTextarea } from './suggestion-textarea'

interface FormSectionProps {
  section: CourseFormSection
  sectionIndex: number
  isCompleted: boolean
  formData: Record<string, string>
  onValueChange: (key: string, value: string) => void
  validationErrors: Record<string, boolean>
}

export function FormSection({
  section,
  sectionIndex,
  isCompleted,
  formData,
  onValueChange,
  validationErrors
}: FormSectionProps) {
  // Skip empty sections (like section1 in the data)
  if (!section.title || section.questions.length === 0) {
    return null
  }

  return (
    <AccordionItem value={section.id} className='border-0'>
      <Card>
        <AccordionTrigger className='px-6 py-4 hover:no-underline'>
          <div className='flex items-center gap-3'>
            {isCompleted && <CheckCircle className='h-5 w-5 text-green-500' />}
            <span className='text-left font-semibold'>{section.title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className='pt-0'>
            <div className='space-y-6'>
              {section.questions.map((question, questionIndex) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  formData={formData}
                  onValueChange={onValueChange}
                />
              ))}

              {section.suggestion && (
                <SuggestionTextarea
                  suggestionId={section.suggestion}
                  formData={formData}
                  onValueChange={onValueChange}
                  isInvalid={validationErrors[section.suggestion]}
                />
              )}
            </div>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  )
}
