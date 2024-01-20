"use client"

import toCopy from "@/utils/copy"
import { IconCopy } from "@tabler/icons-react"

const Copy = () => {
  return (
    <button
      className='rounded-md p-px hover:bg-main-color-2 focus:outline-none'
      onClick={(e) => toCopy(e)}
    >
      <IconCopy size={20} />
    </button>
  )
}

export default Copy
