'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { GraduationStandard } from '@/types'

export default function GraduationProgress({
  status,
  data
}: {
  status: string
  data: GraduationStandard | undefined
}) {
  const isSuccess = status === 'success'
  const isLoading = status === 'pending'
  const isError = status === 'error'

  const [graduationRequirements, setGraduationRequirements] = useState({
    minimumRequiredCredits: 0,
    minimumElectiveCredits: 0,
    minimumGeneralEducationCredits: 0
  })

  const [currentCredits, setCurrentCredits] = useState({
    totalCredits: 0,
    totalRequiredCredits: 0,
    totalElectiveCredits: 0,
    totalGeneralCredits: 0
  })

  const [percentages, setPercentages] = useState({
    totalCreditsPercentage: 0,
    electiveCreditsPercentage: 0,
    generalCreditsPercentage: 0
  })

  useEffect(() => {
    if (isSuccess && data) {
      setGraduationRequirements(data.graduationRequirements)
      setCurrentCredits(data.currentCredits)

      // Calculate percentages
      const totalPercent = Math.min(
        100,
        Math.round(
          (data.currentCredits.totalCredits / data.graduationRequirements.minimumRequiredCredits) *
            100
        )
      )

      const electivePercent = Math.min(
        100,
        Math.round(
          (data.currentCredits.totalElectiveCredits /
            data.graduationRequirements.minimumElectiveCredits) *
            100
        )
      )

      const generalPercent = Math.min(
        100,
        Math.round(
          (data.currentCredits.totalGeneralCredits /
            data.graduationRequirements.minimumGeneralEducationCredits) *
            100
        )
      )

      setPercentages({
        totalCreditsPercentage: totalPercent,
        electiveCreditsPercentage: electivePercent,
        generalCreditsPercentage: generalPercent
      })
    }
  }, [isSuccess, data])

  if (isLoading) {
    const title = ['總學分', '選修學分', '通識學分']
    return (
      <>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className='gap-0.5 space-y-0 pb-2'>
              <CardTitle className='text-lg'>{title[index]}</CardTitle>
              <div className='py-1'>
                <Skeleton className='h-4 w-24' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='my-1 flex items-center justify-between'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-10' />
              </div>
              <Skeleton className='mt-2 h-2 w-full' />
              <div className='mt-4 flex items-center'>
                <Skeleton className='mr-2 h-5 w-5 rounded-full' />
                <Skeleton className='h-4 w-36' />
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>總學分</CardTitle>
          <CardDescription>
            {currentCredits.totalCredits} / {graduationRequirements.minimumRequiredCredits} 學分
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-medium'>完成進度</span>
            <span className='text-sm font-medium'>{percentages.totalCreditsPercentage}%</span>
          </div>
          <Progress value={percentages.totalCreditsPercentage} className='h-2' />
          <div className='mt-4 flex items-center'>
            {percentages.totalCreditsPercentage >= 100 ? (
              <CheckCircle2 className='mr-2 h-5 w-5 text-green-500' />
            ) : (
              <AlertCircle className='mr-2 h-5 w-5 text-amber-500' />
            )}
            <span className='text-sm'>
              {percentages.totalCreditsPercentage >= 100
                ? '已達畢業要求'
                : `還需 ${graduationRequirements.minimumRequiredCredits - currentCredits.totalCredits} 學分`}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>選修學分</CardTitle>
          <CardDescription>
            {currentCredits.totalElectiveCredits} / {graduationRequirements.minimumElectiveCredits}{' '}
            學分
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-medium'>完成進度</span>
            <span className='text-sm font-medium'>{percentages.electiveCreditsPercentage}%</span>
          </div>
          <Progress value={percentages.electiveCreditsPercentage} className='h-2' />
          <div className='mt-4 flex items-center'>
            {percentages.electiveCreditsPercentage >= 100 ? (
              <CheckCircle2 className='mr-2 h-5 w-5 text-green-500' />
            ) : (
              <AlertCircle className='mr-2 h-5 w-5 text-amber-500' />
            )}
            <span className='text-sm'>
              {percentages.electiveCreditsPercentage >= 100
                ? '已達選修要求'
                : `還需 ${graduationRequirements.minimumElectiveCredits - currentCredits.totalElectiveCredits} 學分`}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>通識學分</CardTitle>
          <CardDescription>
            {currentCredits.totalGeneralCredits} /{' '}
            {graduationRequirements.minimumGeneralEducationCredits} 學分
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-medium'>完成進度</span>
            <span className='text-sm font-medium'>{percentages.generalCreditsPercentage}%</span>
          </div>
          <Progress value={percentages.generalCreditsPercentage} className='h-2' />
          <div className='mt-4 flex items-center'>
            {percentages.generalCreditsPercentage >= 100 ? (
              <CheckCircle2 className='mr-2 h-5 w-5 text-green-500' />
            ) : (
              <AlertCircle className='mr-2 h-5 w-5 text-amber-500' />
            )}
            <span className='text-sm'>
              {percentages.generalCreditsPercentage >= 100
                ? '已達通識要求'
                : `還需 ${graduationRequirements.minimumGeneralEducationCredits - currentCredits.totalGeneralCredits} 學分`}
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
