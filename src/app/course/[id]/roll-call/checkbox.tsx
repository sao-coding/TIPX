import { useState } from "react"

import { Absence } from "@/types"

const CheckBox = ({ absence }: { absence: Absence }) => {
  const [status, setStatus] = useState(absence.status)
  return (
    <div key={absence.id} className='flex w-14 items-center space-x-1'>
      <input
        key={absence.id}
        type='checkbox'
        name={absence.id}
        id={absence.id}
        defaultChecked={absence.status}
        disabled={absence.disabled}
        className='h-4 w-4 rounded border-gray-300 text-main-color-1 focus:ring-main-color-1'
        onChange={() => {
          setStatus(!status)
        }}
      />
      <div className={status ? "text-red-500" : "text-green-500"}>{status ? "缺席" : "出席"}</div>
    </div>
  )
}

export default CheckBox
