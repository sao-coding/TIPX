'use client'

import React from 'react'

const MobileTimeTable = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className='' ref={ref}>
      手機版課表
    </div>
  )
})

MobileTimeTable.displayName = 'MobileTimeTable'

export default MobileTimeTable
