import { cookies } from 'next/headers'

import Copy from '@/components/ui/copy'
import UserBanner from '@/components/UserBanner'
import { prisma } from '@/lib/prisma'
import api from '@/lib/server-api'
import { User } from '@/types'
import getClassName from '@/utils/class-name'
import formatDatetime from '@/utils/format-datetime'
import getImgColor from '@/utils/img-color'
import getLineID from '@/utils/lineid'
import {
  IconBrandLine,
  IconBuildingSkyscraper,
  IconCake,
  IconDeviceLandlinePhone,
  IconDeviceMobile,
  IconHomeLink,
  IconId,
  IconSchool,
  IconTicket
} from '@tabler/icons-react'

const getUserData = async () => {
  const { data: user } = await api.get<User>('user?type=about', {
    headers: {
      Authorization: `Bearer ${(await cookies()).get('accessToken')?.value || ''}`
    }
  })
  const color = await getImgColor(user.img)
  const userClassName = await getClassName(user.userid)
  const lineId = await getLineID(user.userid)
  const settings = await prisma.userSettings.findFirst({
    where: {
      userId: user.userid
    }
  })

  return { user, color, userClassName, settings, lineId }
}

const UserAboutPage = async () => {
  const { user, color, userClassName, settings, lineId } = await getUserData()

  return (
    <div className='space-y-2'>
      <UserBanner
        user={user}
        color={color}
        settings={
          settings ?? {
            id: '',
            theme: 'system',
            location: false,
            avatar: '',
            banner: '',
            userId: ''
          }
        }
      >
        <div className='flex items-center justify-center gap-2 border-y p-4 md:mt-14 md:justify-start'>
          <span className='flex items-center gap-1 font-bold'>
            <IconSchool />
            班級
          </span>
          {userClassName.class}
        </div>
        <div className='p-4'>
          <h2 className='text-xl font-bold'>基本資料</h2>
          <div className='flex items-center space-x-1'>
            <IconBrandLine />
            {lineId.lineId ? (
              <>
                <div className='rounded-md bg-primary px-2 text-neutral-200'>{lineId.lineId}</div>
                <Copy />
              </>
            ) : (
              <div className='text-gray-400'>未填寫 Line ID</div>
            )}
          </div>
          <div className='flex items-center space-x-1'>
            <IconId />
            <div>{user.IDnumber}</div>
            <Copy />
          </div>
          <div className='flex items-center space-x-1'>
            <IconCake />
            {user.birthday ? (
              <>
                <div>{formatDatetime('birthday', user.birthday)}</div>
                <Copy />
              </>
            ) : (
              <div className='text-gray-400'>未填寫生日</div>
            )}
          </div>
          <div className='flex items-center space-x-1'>
            <IconBuildingSkyscraper />
            <div>{user.birthplace}</div>
          </div>
          <div className='flex items-center space-x-1'>
            <IconDeviceMobile />
            <div>{user.phone}</div>
            <Copy />
          </div>
          <div className='flex items-center space-x-1'>
            <IconDeviceLandlinePhone />
            <div>{user.homePhone}</div>
            <Copy />
          </div>
          <div className='flex items-center space-x-1'>
            <IconTicket />
            <div>{user.date} 入學</div>
          </div>
          <div className='flex items-center space-x-1'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.8'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5'
              />
            </svg>
            <div>{user.previousEducation}</div>
          </div>
          <div className='flex items-center space-x-1'>
            <IconHomeLink />
            <div>{user.address}</div>
            <Copy />
          </div>
        </div>
      </UserBanner>
      <div className='rounded-lg bg-background1 p-4'>
        <div className=''>
          <h2 className='text-xl font-bold'>家長資料</h2>
          <div className='flex items-center space-x-1'>
            <div>{user.parentName}</div>
            <div>{user.parentJob}</div>
          </div>
          <div>{user.parentAddress}</div>
          <div>{user.parentPhone}</div>
        </div>
        <hr className='my-4 border-2 border-dashed' />
        <div className=''>
          <h2 className='text-xl font-bold'>自傳</h2>
          <div className='whitespace-pre-line'>{user.desc}</div>
        </div>
      </div>
    </div>
  )
}

export default UserAboutPage
