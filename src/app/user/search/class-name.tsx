"use client"

import { ClassName as class_name } from "@/types"
import { useQuery } from "@tanstack/react-query"

const ClassName = ({ userid }: { userid: string }) => {
  // /api/class-name?userid=
  const { isLoading, data } = useQuery<class_name>({
    queryKey: ["class-name", userid],
    queryFn: async () => {
      const res = await fetch(`/api/class-name?userid=${userid}`)

      return await res.json()
    }
  })
  return (
    <>
      {isLoading ? (
        <div className='my-1 h-4 w-24 animate-pulse rounded-full bg-gray-300' />
      ) : (
        <>
          {data?.class !== "" ? (
            <div>{data?.class}</div>
          ) : (
            <div className='text-gray-400'>無班級</div>
          )}
        </>
      )}
    </>
  )
}

export default ClassName
