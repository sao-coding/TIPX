'use client'

import { User } from '@/types'
import { IconClock, IconListDetails, IconSchool, IconUserStar } from '@tabler/icons-react'

const Info = ({
  user,
  color,
  userClassName
}: {
  user: User
  color: string
  userClassName: string
}) => {
  return (
    <div className='relative overflow-hidden rounded-lg bg-background1'>
      <div className='relative h-32 md:h-40' style={{ backgroundColor: color }}>
        {/* https://cdn.sao-x.com/cover/003.webp */}
        {/* object-position: 50% 25%; */}
        <img src='https://i.imgur.com/xSL4INZ.jpeg' className='h-full w-full object-cover' />
        <div className='bottom-0 hidden h-16 w-full bg-gradient-to-t from-background/80 to-transparent md:absolute md:block md:h-16'></div>
      </div>
      {/* <IconUser className='absolute left-0 right-0 top-20 mx-auto h-24 w-24 rounded-full bg-secondary p-1' /> */}
      {/* https://blog.sao-x.com/img/avatar.jpg */}
      <div className='absolute left-0 right-0 top-20 md:top-24'>
        <img
          src='https://blog.sao-x.com/img/avatar.jpg'
          // https://tipfile.takming.edu.tw/stuphoto/D11019139.JPG
          // src='https://tipfile.takming.edu.tw/stuphoto/D11019139.JPG'
          className='mx-auto h-24 w-24 rounded-full bg-secondary object-cover p-1 md:ml-4'
        />
      </div>

      <div className='top-0 pb-4 pt-14 md:absolute md:ml-32 md:mt-28 md:p-0'>
        <h1 className='text-center text-2xl font-bold md:text-left'>{user.name}</h1>
      </div>
      <div className='flex items-center justify-center gap-2 border-y p-4 md:mt-14 md:justify-start'>
        <span className='flex items-center gap-1 font-bold'>
          <IconSchool />
          班級
        </span>
        {userClassName}
      </div>
      <div className='md:px-1'>
        <ul className='grid grid-cols-3'>
          <li className='p-2'>
            <div className='flex items-center justify-between'>
              <div className=''>缺曠次數</div>
              <IconListDetails size={20} className='stroke-blue-500' />
            </div>
            <div className='flex items-center gap-1 text-2xl'>
              <span>0</span>
              <span>次</span>
            </div>
          </li>
          <li className='border-x p-2'>
            <div className='flex items-center justify-between'>
              <div className=''>缺曠時數</div>
              <IconClock size={20} className='stroke-green-500' />
            </div>
            <div className='flex items-center gap-1 text-2xl'>
              <span>0</span>
              <span>小時</span>
            </div>
          </li>
          <li className='p-2'>
            <div className='flex items-center justify-between'>
              <div className=''>目前操行</div>
              <IconUserStar size={20} className='stroke-yellow-500' />
            </div>
            <div className='flex items-center gap-1 text-2xl'>
              <span>0</span>
              <span>分</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Info
