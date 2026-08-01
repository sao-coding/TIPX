'use client'

import React from 'react'

import AttendanceRecordPage from '@/components/attendance-record'
import Title from '@/components/Title'

const CourseAttendanceRecordPage = () => {
  const titleData = {
    title: '請假缺曠記錄',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <AttendanceRecordPage />
    </>
  )
}

export default CourseAttendanceRecordPage
