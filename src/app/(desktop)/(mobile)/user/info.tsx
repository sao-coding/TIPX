'use client'

import UserBanner from '@/components/UserBanner'
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
    <UserBanner user={user} color={color}>
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
    </UserBanner>
  )
}

export default Info
