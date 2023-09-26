"use client"

import { useRouter } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"

const Close = () => {
    const router = useRouter()
    return (
        <div
            className='absolute left-0 top-0 flex items-center h-full pl-2 md:hidden'
            onClick={() => router.back()}
        >
            <IconArrowLeft size={24} />
        </div>
    )
}

export default Close
