import { User } from '@/types'
import { UserSettings } from '@prisma/client'
import { IconGenderFemale, IconGenderMale, IconUserCircle } from '@tabler/icons-react'

import Avatar from './ui/avatar'
import Fancybox from './ui/fancybox'

const UserBanner = ({
  user,
  color,
  settings,
  children
}: {
  user: User
  color: string
  settings: UserSettings
  children: React.ReactNode
}) => {
  return (
    <div className='relative overflow-hidden rounded-lg bg-background1'>
      <div className='relative h-32 md:h-40' style={{ backgroundColor: color }}>
        {/* object-position: 50% 25%; */}
        {settings.banner !== '' && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.banner} className='h-full w-full object-cover' alt='cover' />
        )}
        <div className='bottom-0 hidden h-16 w-full bg-gradient-to-t from-[#171717]/50 to-transparent md:absolute md:block md:h-16'></div>
      </div>
      {/* <IconUser className='absolute left-0 right-0 top-20 mx-auto h-24 w-24 rounded-full bg-secondary p-1' /> */}
      <div className='absolute left-0 right-0 top-20 md:top-24'>
        <Fancybox
          options={{
            Carousel: {
              infinite: false
            }
          }}
        >
          <a
            href={settings.avatar !== '' ? settings.avatar : user.img}
            data-fancybox
            data-caption={user.name}
          >
            <Avatar
              src={settings.avatar !== '' ? settings.avatar : user.img}
              alt={user.name}
              className='mx-auto h-24 w-24 rounded-full bg-secondary object-cover p-1 md:ml-4'
              width={96}
              height={96}
              fallback={
                <div className='relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white md:ml-4'>
                  <IconUserCircle className='absolute h-20 w-20' />
                </div>
              }
            />
          </a>
        </Fancybox>
      </div>

      <div className='top-0 flex justify-center pb-4 pt-14 md:absolute md:ml-32 md:mt-28 md:p-0 md:pt-2'>
        <div className='relative'>
          <h1 className='text-center text-2xl font-bold text-black dark:text-white md:text-left md:text-white'>
            {user.name}
          </h1>
          <div className='absolute -right-6 bottom-0 top-0 flex flex-col justify-center'>
            {user.gender === '男' ? (
              <IconGenderMale className='text-blue-500' />
            ) : (
              <IconGenderFemale className='text-pink-500' />
            )}
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default UserBanner
