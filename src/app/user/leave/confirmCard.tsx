import { useState } from "react"
import { LeaveItem } from "@/types"
import clsx from "clsx"

const ConfirmCard = ({
    leave, // setLeave,
}: {
    leave: LeaveItem
    // setLeave: React.Dispatch<React.SetStateAction<LeaveItem[]>>
}) => {
    const [status, setStatus] = useState(false)

    return (
        <label
            htmlFor={leave.value}
            className={clsx(
                "block w-full border p-2 rounded-xl mb-2 relative",
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
            <div className='absolute top-2 right-2 bg-main-color-3 text-white rounded-lg px-1'>{`第${leave.id}節`}</div>
            <div className=''>{leave.name}</div>
            <div className=''>{leave.courseID}</div>
        </label>
    )
}

export default ConfirmCard
