'use client'

import React from 'react'

import AttendanceRecordPage from '@/components/attendance-record'

const CourseAttendanceRecordPage = ({ params }: { params: { id: string } }) => {
  return <AttendanceRecordPage id={params.id} />
}

export default CourseAttendanceRecordPage
