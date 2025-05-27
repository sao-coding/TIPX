'use client'

import { use, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

import Title from '@/components/Title'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { CourseForm } from '@/types'
import { useQuery } from '@tanstack/react-query'

import { FillConfigDialog } from './fill-config-dialog'
import { FormSection } from './form-section'
import { ProgressCard } from './progress-card'

const CourseFormPage = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params)
  const { status, data } = useQuery<CourseForm>({
    queryKey: ['course-form', params.id],
    queryFn: async () => {
      const { data } = await api.get(`course-form/${params.id}`)
      return data.data
    }
  })

  // submit ing
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [fillOption, setFillOption] = useState<string>('A')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const totalQuestions =
    data?.form.reduce((total, section) => total + section.questions.length, 0) || 0
  const answeredQuestions = Object.keys(formData).filter((key) => key.startsWith('q')).length
  const progress = (answeredQuestions / totalQuestions) * 100

  useEffect(() => {
    console.log('formData', formData)
    console.log('completedSections', completedSections)
  }, [formData])

  const isSuccess = status === 'success'
  const isLoading = status === 'pending'

  const fillConfigured = () => {
    const configuredAnswers: Record<string, string> = {}

    data?.form.forEach((section) => {
      section.questions.forEach((question) => {
        const availableOption =
          question.options.find((opt) => opt.value === fillOption) || question.options[0]
        configuredAnswers[question.id] = availableOption.value
      })

      if (section.suggestion) {
        const suggestions = [
          '感謝老師的用心教學，課程安排得很好。',
          '課程設計完善，評量方式公平合理。',
          '教學方法多元化，能夠有效促進學習。',
          '老師態度親切，關心學生學習狀況。',
          '這門課程讓我獲益良多，非常推薦。'
        ]
        configuredAnswers[section.suggestion] =
          suggestions[Math.floor(Math.random() * suggestions.length)]
      }
    })

    setFormData(configuredAnswers)
    setCompletedSections(new Set(data?.form.map((s) => s.id)))
    setIsConfigOpen(false)

    // toast({
    //   title: `已填入選項 ${fillOption}`,
    //   description: `所有問題已填入選項 ${fillOption} 的答案`
    // })
    toast.success(`已填入選項 ${fillOption} 的答案`)
  }

  const fillRandom = () => {
    const randomAnswers: Record<string, string> = {}

    data?.form.forEach((section) => {
      section.questions.forEach((question) => {
        const randomIndex = Math.floor(Math.random() * question.options.length)
        randomAnswers[question.id] = question.options[randomIndex].value
      })

      if (section.suggestion) {
        const suggestions = [
          '課程內容豐富，教學方式多元。',
          '希望能增加更多實作練習。',
          '整體而言表現良好。',
          '建議可以調整教學進度。',
          '感謝老師的用心指導。'
        ]
        randomAnswers[section.suggestion] =
          suggestions[Math.floor(Math.random() * suggestions.length)]
      }
    })

    setFormData(randomAnswers)
    setCompletedSections(new Set(data?.form.map((s) => s.id)))

    toast.success('已隨機填寫問卷')
  }

  const clearForm = () => {
    setFormData({})
    setCompletedSections(new Set())

    toast.success('已清除問卷填寫')
  }

  const handleInputChange = (key: string, value: string): void => {
    if (!data) return

    setFormData((prevData) => ({
      ...prevData,
      [key]: value
    }))

    const questionId = key.startsWith('q') ? key : null

    if (questionId) {
      const sectionIndex = data.form.findIndex((section) =>
        section.questions.some((q) => q.id === questionId)
      )
      if (sectionIndex !== -1) {
        const section = data.form[sectionIndex]
        const sectionQuestions = section.questions.map((q) => q.id)
        const answeredInSection = sectionQuestions.filter(
          (qId) => formData[qId] || qId === questionId
        )

        if (answeredInSection.length === sectionQuestions.length) {
          setCompletedSections((prev) => new Set([...prev, section.id]))
        }
      }
    }
  }

  const handleSubmit = async () => {
    if (!data) return

    // if (key === 'q17' && (value === 'D' || value === 'E') && !formData['textarea4']) {
    if (
      (formData['q17'] === 'D' && !formData['textarea4']) ||
      (formData['q17'] === 'E' && !formData['textarea4'])
    ) {
      toast.error('請針對第四部分教學態度第17題提供文字說明')
      return
    }

    const { data: res } = await api.post(`course-form/${params.id}`, {
      CLASS_NO: data.classId,
      STAFF_ID: data.teacherId,
      OP_NO: data.courseId,
      // RGNO: data.rgno,
      // DIVCODE: data.divCode,
      S_YEAR: Cookies.get('year'),
      S_SEM: Cookies.get('sem'),
      rowid: data.id,
      ...formData
    })

    if (res.status === 'success') {
      toast.success('問卷提交成功')
      setFormData({})
      setCompletedSections(new Set())
    } else {
      toast.error(res.message || '問卷提交失敗')
    }
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
        onConfirm={fillConfigured}
      />
    </>
  )
}

export default CourseFormPage
