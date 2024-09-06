import { User } from '@/types'
import { UserSettings } from '@prisma/client'
import { IconGenderFemale, IconGenderMale } from '@tabler/icons-react'

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
        {/* https://cdn.sao-x.com/cover/003.webp */}
        {/* object-position: 50% 25%; */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img
          src='https://i.imgur.com/xSL4INZ.jpeg'
          className='h-full w-full object-cover'
          alt='cover'
        /> */}
        {settings.banner !== '' && (
          <img
            src='https://i.imgur.com/xSL4INZ.jpeg'
            className='h-full w-full object-cover'
            alt='cover'
          />
        )}
        <div className='bottom-0 hidden h-16 w-full bg-gradient-to-t from-[#171717]/80 to-transparent md:absolute md:block md:h-16'></div>
      </div>
      {/* <IconUser className='absolute left-0 right-0 top-20 mx-auto h-24 w-24 rounded-full bg-secondary p-1' /> */}
      {/* https://blog.sao-x.com/img/avatar.jpg */}
      <div className='absolute left-0 right-0 top-20 md:top-24'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          // src='https://blog.sao-x.com/img/avatar.jpg'
          src={settings.avatar !== '' ? settings.avatar : user.img}
          // https://tipfile.takming.edu.tw/stuphoto/D11019139.JPG
          // src='https://tipfile.takming.edu.tw/stuphoto/D11019139.JPG'
          className='mx-auto h-24 w-24 rounded-full bg-secondary object-cover p-1 md:ml-4'
          alt={user.name}
        />
      </div>

      <div className='top-0 flex justify-center pb-4 pt-14 md:absolute md:ml-32 md:mt-28 md:p-0 md:pt-2'>
        <div className='relative'>
          <h1 className='text-center text-2xl font-bold text-white md:text-left'>{user.name}</h1>
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
