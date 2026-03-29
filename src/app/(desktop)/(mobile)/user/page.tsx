import { cookies } from 'next/headers'
import Link from 'next/link'
import clsx from 'clsx'

import Ads from '@/components/Ads'
import Switch from '@/components/LeftSidebar/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { USER_LINKS } from '@/config/links'
import { prisma } from '@/lib/prisma'
import api from '@/lib/server-api'
import { User } from '@/types'
import getClassName from '@/utils/class-name'
import getImgColor from '@/utils/img-color'
import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react'

import Info from './info'
import Logout from './logout'

const getUserData = async () => {
  const { data: user } = await api.get<User>('user', {
    headers: {
      Authorization: `Bearer ${(await cookies()).get('accessToken')?.value || ''}`
    }
  })
  const color = await getImgColor(user.img)
  const userClassName = await getClassName(user.userid)
  console.log(user)
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
      <Alert className='mt-2' variant='destructive'>
        <IconAlertTriangle className='size-4' />
        <AlertTitle>畢業帳號注意事項</AlertTitle>
        <AlertDescription>
          畢業<span className='font-mono'> Google </span>帳號會被學校刪除，若想畢業後也能登入
          <span className='font-mono'> TIPX </span>，請設定
          <Link href='/user/settings' className='text-blue-600 underline dark:text-blue-400'>
            密碼
          </Link>
          ，以便日後登入。
        </AlertDescription>
      </Alert>
      {/* 畢業留言 */}
      <Alert className='mt-2 bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'>
        <IconInfoCircle className='size-4 !text-blue-500' />
        <AlertTitle>我畢業啦 🎉🎊</AlertTitle>
        <AlertDescription>
          <Link href='/graduation-message' className='text-blue-600 underline dark:text-blue-400'>
            點擊這裡查看畢業留言
          </Link>
        </AlertDescription>
      </Alert>
      <div className='mt-2 md:hidden'>
        {/* 功能清單 */}
        <ul className='grid grid-cols-2 gap-2'>
          {USER_LINKS.map(
            (group, index) =>
              // 跳過 index 0 的一般資訊
              index > 0 &&
              group.links.map((link, _) =>
                (link.text === '查詢用戶' && role === 'USER') ||
                (link.text === '日誌中心' && role !== 'SUPER_ADMIN') ? null : (
                  <li key={_}>
                    <Link
                      href={link.href}
                      className='block h-10 rounded-sm border bg-background1 p-2'
                    >
                      <div className='flex items-center gap-2'>
                        <link.icon className={clsx(link.color, link.className)} />
                        <span className='line-clamp-1'>{link.text}</span>
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
        <Ads
          className='mt-2'
          dataAdFormat='autorelaxed'
          dataAdClient='ca-pub-2271001084588765'
          dataAdSlot='6194124244'
        />
      </div>
    </div>
  )
}

export default UserPage
