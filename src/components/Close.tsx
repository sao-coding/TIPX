"use client"

import { useRouter } from "next/navigation"

import { cx } from "@/lib/utils"
import { IconArrowLeft } from "@tabler/icons-react"

const Close = ({ className }: { className?: string }) => {
  const router = useRouter()
  const handleBack = () => {
    if (window.history.length < 2) {
      router.push("/")
    } else {
      router.back()
    }
  }

  return (
    <button
      // className='absolute left-0 top-0 flex h-full items-center pl-2 md:hidden'
      className={cx("absolute left-0 top-0 flex h-full items-center pl-2 md:hidden", className)}
      onClick={handleBack}
    >
      <IconArrowLeft size={26} />
    </button>
  )
}

export default Close
