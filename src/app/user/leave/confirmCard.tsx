import { useState } from "react"
import { LeaveItem } from "@/types"
import clsx from "clsx"

const ConfirmCard = ({
    leave, // setLeave,
    i,
}: {
    leave: LeaveItem
    i: number
    // setLeave: React.Dispatch<React.SetStateAction<LeaveItem[]>>
}) => {
    const [status, setStatus] = useState(false)

    return (
        <label
            htmlFor={leave.id}
            className={clsx(
                "block w-full border p-2 rounded-md mb-2 relative",
                status && "bg-main-color-2"
            )}
        >
            <input
                type='checkbox'
                name={leave.id}
                id={leave.id}
                className='absolute bottom-2 right-2'
                value={leave.value}
                onChange={(e) => {
                    setStatus(e.target.checked)
                }}
            />
            <div className='absolute top-2 right-2 bg-main-color-3 text-white rounded-lg px-1'>{`第${
                i + 1
            }節`}</div>
            <div className=''>{leave.name}</div>
            <div className=''>{leave.value}</div>
        </label>
    )
}

export default ConfirmCard
