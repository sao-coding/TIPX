import React from 'react'
import clsx from 'clsx'

import Avatar from '@/components/ui/avatar'
import Copy from '@/components/ui/copy'
import Fancybox from '@/components/ui/fancybox'
import { Student } from '@prisma/client'
import { IconBrandLine, IconGenderBigender, IconUserCircle } from '@tabler/icons-react'

import ClassName from './class-name'
import Info from './info'

const Card = React.forwardRef<HTMLDivElement, { student: Student }>(({ student }, ref) => {
  const status: { [key: string]: string } = {
    新生未註冊: 'bg-gray-500',
    在學: 'bg-green-500',
    休學: 'bg-yellow-500',
    退學: 'bg-red-500',
    畢業: 'bg-blue-500'
  }

  return (
    <div
      ref={ref}
      className='relative flex items-center gap-2 rounded-sm border bg-background1 p-2'
    >
      <div
        className={clsx(
          'absolute right-0 top-0 m-2 rounded-sm px-2 font-bold text-neutral-200',
          status[student.status]
        )}
      >
        {student.status}
      </div>
      <Fancybox
        options={{
          Carousel: {
            infinite: false
          }
        }}
      >
        <a href={student.img} data-fancybox='images' data-caption={student.name}>
          <Avatar
            src={student.img}
            width={75}
            height={100}
            alt='大頭貼'
            fallback={
              <div className='flex h-[100px] w-[75px] items-center justify-center rounded-sm shadow-md'>
                <IconUserCircle size={75} />
              </div>
            }
          />
        </a>
      </Fancybox>
      <div className='flex-grow'>
        <div className='flex items-center space-x-1'>
          <div>{student.userId}</div>
          <Copy />
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-1'>
            <div className='flex items-center space-x-1'>
              {student.name !== '' ? (
                <>
                  <div>{student.name}</div>
                  <Copy />
                </>
              ) : (
                <div className='text-gray-400'>未填寫姓名</div>
              )}
            </div>
            <IconGenderBigender />
            {student.gender !== '' ? (
              <>
                <div>{student.gender}</div>
              </>
            ) : (
              <div className='text-gray-400'>未知</div>
            )}
          </div>
          <Info userId={student.userId} />
          {/* <button className='bg-blue-500 text-white px-2 rounded-md -mr-2'>查詢</button> */}
        </div>
        <ClassName userid={student.userId} />
        {/* {item.major} */}
        <div className='flex items-center space-x-1'>
          <IconBrandLine />
          {student.lineId !== '' ? (
            <>
              <div>{student.lineId}</div>
              <Copy />
            </>
          ) : (
            <div className='text-gray-400'>未填寫 Line ID</div>
          )}
        </div>
      </div>
    </div>
  )
})

Card.displayName = 'Card'

export default Card
