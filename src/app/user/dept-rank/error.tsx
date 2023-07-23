"use client" // Error components must be Client Components

import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div>
            <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                <div className='flex h-full w-full flex-col items-center justify-center'>
                    <div className='text-2xl'>獲取資料失敗</div>
                    <button
                        className='rounded-md bg-main-color p-2 text-xl'
                        onClick={
                            // Attempt to recover by trying to re-render the segment
                            () => reset()
                        }
                    >
                        重新整理
                    </button>
                </div>
            </div>
        </div>
    )
}
