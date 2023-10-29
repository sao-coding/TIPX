"use client"

import { IconCopy } from "@tabler/icons-react"
import toast from "react-hot-toast"

const Copy = () => {
    const toCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // 複製到剪貼簿
        try {
            navigator.clipboard.writeText(e.currentTarget.parentElement?.textContent as string)
            toast.success("已複製")
        } catch (err) {
            toast.error("複製失敗")
        }
    }
    return (
        <button
            className='p-px rounded-md hover:bg-main-color-2 focus:outline-none'
            onClick={(e) => toCopy(e)}
        >
            <IconCopy size={20} />
        </button>
    )
}

export default Copy
