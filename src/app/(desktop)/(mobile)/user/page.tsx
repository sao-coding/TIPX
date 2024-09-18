import { cookies } from 'next/headers'
import Link from 'next/link'
import clsx from 'clsx'

import Switch from '@/components/LeftSidebar/switch'
import { USER_LINKS } from '@/config/links'
import { prisma } from '@/lib/prisma'
import api from '@/lib/server-api'
import { User } from '@/types'
import getClassName from '@/utils/class-name'
import getImgColor from '@/utils/img-color'

import Info from './info'
import Logout from './logout'

const getUserData = async () => {
  const { data: user } = await api.get<User>('user', {
    headers: {
      Authorization: `Bearer ${cookies().get('accessToken')?.value || ''}`
    }
  })
  const color = await getImgColor(user.img)
  const userClassName = await getClassName(user.userid)
  const settings = await prisma.userSettings.findFirst({
    where: {
      userId: user.userid
    }
  })

  const role = await prisma.user.findUnique({
    where: {
      id: user.userid
    },
    select: {
      role: true
    }
  })

  return { user, color, userClassName, role: role?.role || 'USER', settings }
}

const UserPage = async () => {
  const { user, color, userClassName, role, settings } = await getUserData()

  return (
    <div className='mb-16'>
      <Info
        user={user}
        color={color}
        userClassName={userClassName.class}
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
      />
      <Switch mobile />
      <div className='mt-2 md:hidden'>
        {/* 功能清單 */}
        <ul className='grid grid-cols-2 gap-2'>
          {USER_LINKS.map(
            (group, index) =>
              // 跳過 index 0 的一般資訊
              index > 0 &&
              group.links.map((link, _) =>
                link.text === '查詢用戶' && role === 'USER' ? null : (
                  <li key={_}>
                    <Link
                      href={link.href}
                      className='block h-10 rounded-sm border bg-background1 p-2'
                    >
                      <div className='flex items-center gap-2'>
                        <link.icon className={clsx(link.color, link.className)} />
                        <span>{link.text}</span>
                      </div>
                    </Link>
                  </li>
                )
              )
          )}
          <li>
            <Logout />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserPage
