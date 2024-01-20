"use client"

import { useState } from "react"
import clsx from "clsx"

import { LeaveItem } from "@/types"

const ConfirmCard = ({
  leave // setLeave,
}: {
  leave: LeaveItem
  // setLeave: React.Dispatch<React.SetStateAction<LeaveItem[]>>
}) => {
  const [status, setStatus] = useState(false)

  return (
    <label
      htmlFor={leave.value}
      className={clsx(
        "relative mb-2 block w-full rounded-xl border p-2",
        status && "bg-main-color-2"
      )}
    >
      <input
        type='checkbox'
        name={leave.value}
        id={leave.value}
        className='absolute bottom-2 right-2'
        value={leave.courseID}
        onChange={(e) => {
          setStatus(e.target.checked)
        }}
      />
      <div className='absolute right-2 top-2 rounded-lg bg-main-color-3 px-1 text-white'>{`第${leave.id}節`}</div>
      <div className=''>{leave.name}</div>
      <div className=''>{leave.courseID}</div>
    </label>
  )
}

export default ConfirmCard
