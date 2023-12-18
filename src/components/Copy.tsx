"use client"

import { IconCopy } from "@tabler/icons-react"
import toCopy from "@/utils/copy"

const Copy = () => {
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
