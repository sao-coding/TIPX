'use client'

import { useCallback, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

import {
  CONFIGURED_FILL_SUGGESTIONS,
  RANDOM_FILL_SUGGESTIONS,
  VALIDATION_RULES
} from '@/config/course-form-constants'
import api from '@/lib/api'
import { CourseForm, CourseFormSection } from '@/types'

const getRandomSuggestion = (suggestions: string[]): string => {
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

const generateConfiguredAnswers = (
  form: CourseFormSection[],
  fillOption: string
): Record<string, string> => {
  const answers: Record<string, string> = {}
  form.forEach((section) => {
    section.questions.forEach((question) => {
      const availableOption =
        question.options.find((opt) => opt.value === fillOption) || question.options[0]
      answers[question.id] = availableOption.value
    })
    if (section.suggestion) {
      answers[section.suggestion] = getRandomSuggestion(CONFIGURED_FILL_SUGGESTIONS)
    }
  })
  return answers
}

const generateRandomAnswers = (form: CourseFormSection[]): Record<string, string> => {
  const answers: Record<string, string> = {}
  form.forEach((section) => {
    section.questions.forEach((question) => {
      const randomIndex = Math.floor(Math.random() * question.options.length)
      answers[question.id] = question.options[randomIndex].value
    })
    if (section.suggestion) {
      answers[section.suggestion] = getRandomSuggestion(RANDOM_FILL_SUGGESTIONS)
    }
  })
  return answers
}

const createQuestionToSectionMap = (form: CourseFormSection[]): Map<string, string> => {
  const map = new Map<string, string>()
  form.forEach((section) => {
    section.questions.forEach((question) => {
      map.set(question.id, section.id)
    })
  })
  return map
}

export const useCourseForm = (data: CourseForm | undefined) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})

  const questionToSectionMap = useMemo(() => {
    if (!data) return new Map<string, string>()
    return createQuestionToSectionMap(data.form)
  }, [data])

  const fillConfigured = useCallback(
    (fillOption: string) => {
      if (!data) return
      const configuredAnswers = generateConfiguredAnswers(data.form, fillOption)
      setFormData(configuredAnswers)
      setCompletedSections(new Set(data.form.map((s) => s.id)))
      toast.success(`已填入選項 ${fillOption} 的答案`)
    },
    [data]
  )

  const fillRandom = useCallback(() => {
    if (!data) return
    const randomAnswers = generateRandomAnswers(data.form)
    setFormData(randomAnswers)
    setCompletedSections(new Set(data.form.map((s) => s.id)))
    toast.success('已隨機填寫問卷')
  }, [data])

  const clearForm = () => {
    setFormData({})
    setCompletedSections(new Set())
    toast.success('已清除問卷填寫')
  }

  const handleInputChange = useCallback(
    (key: string, value: string) => {
      if (!data) return

      const newFormData = { ...formData, [key]: value }
      setFormData(newFormData)

      const updatedErrors: Record<string, boolean> = { ...validationErrors }
      let hasChangesInErrors = false

      // Clear error for the current key if it was previously marked as error
      if (updatedErrors[key]) {
        updatedErrors[key] = false
        hasChangesInErrors = true
      }

      // Re-evaluate validation rules that might be affected by this change
      for (const rule of VALIDATION_RULES) {
        const currentAnswer = newFormData[rule.questionId]
        const isRuleTriggered = currentAnswer && rule.triggeringAnswers.includes(currentAnswer)
        const isDependentFieldEmpty =
          !newFormData[rule.dependentFieldId] || newFormData[rule.dependentFieldId].trim() === ''

        if (isRuleTriggered && isDependentFieldEmpty) {
          if (!updatedErrors[rule.dependentFieldId]) {
            updatedErrors[rule.dependentFieldId] = true
            hasChangesInErrors = true
          }
        } else {
          if (updatedErrors[rule.dependentFieldId]) {
            updatedErrors[rule.dependentFieldId] = false
            hasChangesInErrors = true
          }
        }
      }

      if (hasChangesInErrors) {
        setValidationErrors(updatedErrors)
      }

      const sectionId = questionToSectionMap.get(key)
      if (sectionId) {
        const section = data.form.find((s) => s.id === sectionId)
        if (section) {
          const sectionQuestions = section.questions.map((q) => q.id)
          const allAnswered = sectionQuestions.every((qId) => newFormData[qId])
          if (allAnswered) {
            setCompletedSections((prev) => new Set([...prev, section.id]))
          } else {
            setCompletedSections((prev) => {
              const newSet = new Set(prev)
              newSet.delete(section.id)
              return newSet
            })
          }
        }
      }
    },
    [data, formData, questionToSectionMap, validationErrors]
  )

  const handleSubmit = async () => {
    if (!data) return

    const allQuestions = data.form.flatMap((section) => section.questions.map((q) => q.id))
    const totalQuestions = allQuestions.length
    const answeredQuestions = allQuestions.filter((qId) => formData[qId]).length

    if (answeredQuestions < totalQuestions) {
      toast.error(`尚有 ${totalQuestions - answeredQuestions} 題問題未完成，請填寫所有問題。`)
      return
    }

    const errors: Record<string, boolean> = {}
    for (const rule of VALIDATION_RULES) {
      const answer = formData[rule.questionId]
      if (answer && rule.triggeringAnswers.includes(answer)) {
        if (!formData[rule.dependentFieldId] || formData[rule.dependentFieldId].trim() === '') {
          errors[rule.dependentFieldId] = true
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error('部分必填建議尚未填寫。')
      return
    }

    setValidationErrors({})
    setIsSubmitting(true)
    try {
      const { data: res } = await api.post(`course-form/${data.id}`, {
        CLASS_NO: data.classId,
        STAFF_ID: data.teacherId,
        OP_NO: data.courseId,
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
    } catch (error) {
      toast.error('問卷提交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    completedSections,
    isSubmitting,
    validationErrors,
    fillConfigured,
    fillRandom,
    clearForm,
    handleInputChange,
    handleSubmit
  }
}
