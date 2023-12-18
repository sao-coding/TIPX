"use client"

import { useQuery } from "@tanstack/react-query"
import { ClassName as class_name } from "@/types"

const ClassName = ({ userid }: { userid: string }) => {
    // /api/class-name?userid=
    const { isLoading, data } = useQuery<class_name>({
        queryKey: ["class-name", userid],
        queryFn: async () => {
            const res = await fetch(`/api/class-name?userid=${userid}`)

            return await res.json()
        },
    })
    return (
        <>
            {isLoading ? (
                <div className='animate-pulse w-24 h-4 my-1 bg-gray-300 rounded-full' />
            ) : (
                <div className=''>{data?.class}</div>
            )}
        </>
    )
}

export default ClassName
