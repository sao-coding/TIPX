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
        status === true && 'border-primary/80 bg-background2'
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
      <div className='inline border-b border-primary'>{leave.name}</div>
      <div>{leave.teacher}</div>
    </label>
  )
}

export default ConfirmCard
