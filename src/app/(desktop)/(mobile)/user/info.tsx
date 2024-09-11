import UserBanner from '@/components/UserBanner'
import { User } from '@/types'
import { UserSettings } from '@prisma/client'
import { IconSchool } from '@tabler/icons-react'

import Board from './board'

const Info = ({
  user,
  color,
  userClassName,
  settings
}: {
  user: User
  color: string
  userClassName: string
  settings: UserSettings
}) => {
  return (
    <UserBanner user={user} color={color} settings={settings}>
      <div className='flex items-center justify-center gap-2 border-y p-4 md:mt-14 md:justify-start'>
        <span className='flex items-center gap-1 font-bold'>
          <IconSchool />
          班級
        </span>
        {userClassName}
      </div>
      <div className='md:px-1'>
        <ul className='grid grid-cols-3'>
          <Board />
        </ul>
      </div>
    </UserBanner>
  )
}

export default Info
