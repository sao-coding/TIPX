import React from 'react'

import { Student } from '@prisma/client'

const Card = React.forwardRef<HTMLDivElement, { student: Student }>(({ student }, ref) => {
  return (
    <div ref={ref} className='rounded border border-gray-300 p-4'>
      <h1>{student.name}</h1>
      <p>{student.email}</p>
    </div>
  )
})

Card.displayName = 'Card'

export default Card
