import { useState } from "react"
import { Absence } from "@/types"

const CheckBox = ({ absence }: { absence: Absence }) => {
    const [status, setStatus] = useState(absence.status)
    return (
        <div key={absence.id} className='flex items-center space-x-1 w-14'>
            <input
                key={absence.id}
                type='checkbox'
                name={absence.id}
                id={absence.id}
                defaultChecked={absence.status}
                disabled={absence.disabled}
                className='h-4 w-4 text-main-color-1 focus:ring-main-color-1 border-gray-300 rounded'
                onChange={() => {
                    setStatus(!status)
                }}
            />
            <div className={status ? "text-red-500" : "text-green-500"}>
                {status ? "缺席" : "出席"}
            </div>
        </div>
    )
}

export default CheckBox
