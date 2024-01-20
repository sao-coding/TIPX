import React from "react"
import clsx from "clsx"

import Copy from "@/components/Copy"
import Fancybox from "@/components/fancybox"
import Avatar from "@/components/ui/avatar"
import { student } from "@prisma/client"
import { IconBrandLine, IconGenderBigender, IconUserCircle } from "@tabler/icons-react"

import ClassName from "./class-name"
import Info from "./info"

const Card = React.forwardRef<HTMLDivElement, { student: student }>(({ student }, ref) => {
  const status: { [key: string]: string } = {
    新生未註冊: "bg-gray-500",
    在學: "bg-green-500",
    休學: "bg-yellow-500",
    退學: "bg-red-500",
    畢業: "bg-blue-500"
  }

  return (
    <div ref={ref} className='relative flex items-center rounded-xl border p-2'>
      <div
        className={clsx(
          "absolute right-2 top-2 rounded-md px-1 font-bold text-neutral-200",
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
              <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                <IconUserCircle size={75} />
              </div>
            }
          />
        </a>
      </Fancybox>
      <div className='flex-grow px-2'>
        <div className='flex items-center space-x-1'>
          <div>{student.userid}</div>
          <Copy />
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-1'>
            <div className='flex items-center space-x-1'>
              {student.name !== "" ? (
                <>
                  <div>{student.name}</div>
                  <Copy />
                </>
              ) : (
                <div className='text-gray-400'>未填寫姓名</div>
              )}
            </div>
            <IconGenderBigender />
            {student.gender !== "" ? (
              <>
                <div>{student.gender}</div>
              </>
            ) : (
              <div className='text-gray-400'>未知</div>
            )}
          </div>
          <Info student={student} />
          {/* <button className='bg-blue-500 text-white px-2 rounded-md -mr-2'>查詢</button> */}
        </div>
        <ClassName userid={student.userid} />
        {/* {item.major} */}
        <div className='flex items-center space-x-1'>
          <IconBrandLine />
          {student.lineid !== "" ? (
            <>
              <div>{student.lineid}</div>
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

Card.displayName = "Card"

export default Card
