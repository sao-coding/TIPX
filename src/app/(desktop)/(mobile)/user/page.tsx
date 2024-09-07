import Link from 'next/link'
import clsx from 'clsx'

import Switch from '@/components/LeftSidebar/switch'
import { USER_LINKS } from '@/config/links'
import { prisma } from '@/lib/prisma'
import api from '@/lib/server-api'
import { ClassName, User } from '@/types'

import Info from './info'
import Logout from './logout'

const getUserData = async () => {
  const { data: user } = await api.get<User>('/user')
  const { data: color } = await api.get(`/get-img-color?url=${user.img}`)
  const { data: userClassName } = await api.get<ClassName>('/class-name')
  const settings = await prisma.userSettings.findFirst({
    where: {
      userId: user.userid
    }
  })
  return { user, color, userClassName, settings }
}

const UserPage = async () => {
  const { user, color, userClassName, settings } = await getUserData()

  return (
    <div className='mb-16'>
      <Info
        user={user}
        color={color.color}
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
          {/* {userMenu.map((menu, i) => (
            <li key={i} className='h-10 rounded-sm border bg-background1 p-2'>
              {menu.title}
            </li>
          ))} */}
          {USER_LINKS.map(
            (group, index) =>
              // group.links.map((link, index) => (
              //   <li key={index} className='h-10 rounded-sm border bg-background1 p-2'>
              //     <div className='flex items-center gap-2'>
              //       <link.icon className={clsx(link.color, link.className)} />
              //       <span>{link.text}</span>
              //     </div>
              //   </li>
              // ))
              // 跳過 index 0 的一般資訊
              index > 0 &&
              group.links.map((link, _) => (
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
              ))
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
