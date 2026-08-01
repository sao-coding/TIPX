'use client'

import { use, useMemo, useState } from 'react'

import Title from '@/components/Title'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useCourseForm } from '@/hooks/use-course-form'
import api from '@/lib/api'
import { CourseForm, CourseFormSection } from '@/types'
import { useQuery } from '@tanstack/react-query'

const calculateTotalQuestions = (form: CourseFormSection[]): number => {
  return form.reduce((total, section) => total + section.questions.length, 0)
}

import { FillConfigDialog } from './fill-config-dialog'
import { FormSection } from './form-section'
import { ProgressCard } from './progress-card'

const CourseFormPage = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params)
  const { data } = useQuery<CourseForm>({
    queryKey: ['course-form', params.id],
    queryFn: async () => {
      const { data } = await api.get(`course-form/${params.id}`)
      return data.data
    }
  })

  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [fillOption, setFillOption] = useState<string>('A')

  const {
    formData,
    completedSections,
    isSubmitting,
    validationErrors,
    fillConfigured,
    fillRandom,
    clearForm,
    handleInputChange,
    handleSubmit
  } = useCourseForm(data)

  const { totalQuestions, answeredQuestions, progress } = useMemo(() => {
    const total = data ? calculateTotalQuestions(data.form) : 0
    const answered = Object.keys(formData).filter((key) => key.startsWith('q')).length
    const progressValue = total > 0 ? (answered / total) * 100 : 0
    return {
      totalQuestions: total,
      answeredQuestions: answered,
      progress: progressValue
    }
  }, [data, formData])

  const handleConfirmFill = () => {
    fillConfigured(fillOption)
    setIsConfigOpen(false)
  }

  const titleData = {
    title: data?.courseName || '課程表單',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <ProgressCard
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
        progress={progress}
        onConfiguredFill={() => setIsConfigOpen(true)}
        onRandomFill={fillRandom}
        onClearForm={clearForm}
      />
      <Accordion type='multiple' defaultValue={['section1']} className='space-y-4'>
        {data?.form.map((section, sectionIndex) => (
          <FormSection
            key={section.id}
            section={section}
            sectionIndex={sectionIndex}
            isCompleted={completedSections.has(section.id)}
            formData={formData}
            onValueChange={handleInputChange}
            validationErrors={validationErrors}
          />
        ))}
      </Accordion>
      <Button className='mt-4 w-full text-center' onClick={handleSubmit}>
        {isSubmitting ? '提交中...' : '提交問卷'}
      </Button>
      <FillConfigDialog
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        fillOption={fillOption}
        onFillOptionChange={setFillOption}
        onConfirm={handleConfirmFill}
      />
    </>
  )
}

export default CourseFormPage
