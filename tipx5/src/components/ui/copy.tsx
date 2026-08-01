'use client'

import toCopy from '@/utils/copy'
import { IconCopy } from '@tabler/icons-react'

const Copy = () => {
  return (
    <button
      className='hover:bg-main-color-2 rounded-md p-px focus:outline-none'
      onClick={(e) => toCopy(e)}
    >
      <IconCopy size={20} />
    </button>
  )
}

export default Copy
