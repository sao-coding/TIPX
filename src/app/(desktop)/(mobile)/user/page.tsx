import clsx from 'clsx'
import { cookies } from 'next/headers'
import { verifyJwt } from '@/lib/jwt'

import { USER_LINKS } from '@/config/links'
import { IconClock, IconListDetails, IconSchool, IconUserStar } from '@tabler/icons-react'
import Info from './info'
import getUser from '@/utils/user'
import getAuth from '@/lib/get-auth'
import getImgColor from '@/utils/img-color'
import getClassName from '@/utils/class-name'
import api from '@/lib/api'
import { ClassName } from '@/types'

const getUserData = async () => {
  const { data: user } = await api.get('/user')
  console.log('user', user)
  // const { data: color } = await api.get(`/color-get?url=${user.img}`)
  // const { data: userClassName } = await api.get<ClassName>('/class-name')
  return { user }
}

const UserPage = async () => {
  // const accessToken = cookies().get('accessToken')?.value || ''
  // const auth = await getAuth(accessToken)
  // const user = await getUser(auth?.userId || '')
  // const color = await getImgColor(user.img)
  // const userClassName = await (await getClassName(auth?.userId || '')).class
  const { user } = await getUserData()
  // cookies().set('userid', 'D11019139')
  const userid = cookies().get('userid')?.value || ''
  console.log('##########userid', userid)

  return (
    <div className='mb-16'>
      {/* <Info user={user} color={color} userClassName={userClassName.class} /> */}
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
                <li key={_} className='h-10 rounded-sm border bg-background1 p-2'>
                  <div className='flex items-center gap-2'>
                    <link.icon className={clsx(link.color, link.className)} />
                    <span>{link.text}</span>
                  </div>
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default UserPage
