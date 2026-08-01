'use client'

import { useState } from 'react'
import clsx from 'clsx'

import { Checkbox } from '@/components/ui/checkbox'
import { LeaveItem } from '@/types'

const ConfirmCard = ({
  leave // setLeave,
}: {
  leave: LeaveItem
  // setLeave: React.Dispatch<React.SetStateAction<LeaveItem[]>>
}) => {
  const [status, setStatus] = useState<boolean | 'indeterminate'>(false)

  return (
    <label
      htmlFor={leave.value}
      className={clsx(
        'relative mb-2 block w-full space-y-2 rounded-sm border bg-background1 p-2',
        status === true && 'border-primary/80 bg-background2',
        leave.absence && 'border-red-500' // Add red border when it's an absence
      )}
    >
      <Checkbox
        name={leave.value}
        id={leave.value}
        className='absolute bottom-2 right-2'
        value={leave.courseID}
        checked={status}
        onCheckedChange={setStatus}
      />
      <div className='absolute right-0 top-0 mr-2 rounded-lg bg-primary px-2 text-white'>{`第${leave.id}節`}</div>
      {/* {leave.absence && (
        <div className='absolute left-0 top-0 ml-2 rounded-lg bg-red-500 px-2 text-white'>曠課</div>
      )} */}
      <div className='inline space-x-2'>
        {leave.absence && (
          <div className='inline-flex rounded-lg bg-red-500 px-2 text-white'>曠課</div>
        )}
        <div className='inline border-b border-primary'>{leave.name}</div>
        {/* 顯示曠課 */}
      </div>

      <div>{leave.teacher}</div>
    </label>
  )
}

export default ConfirmCard
