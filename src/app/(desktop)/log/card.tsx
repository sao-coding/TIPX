import React from 'react'
import Link from 'next/link'

import Avatar from '@/components/ui/avatar'
import Fancybox from '@/components/ui/fancybox'
import { Log } from '@/types'
import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandArc,
  IconBrandChrome,
  IconBrandEdge,
  IconBrandFirefox,
  IconBrandSafari,
  IconBrandUbuntu,
  IconBrandWindows,
  IconGhost3,
  IconWorld
} from '@tabler/icons-react'

const Card = React.forwardRef<HTMLDivElement, { student: Log }>(({ student }, ref) => {
  const browserIcon = (browser: string) => {
    switch (browser) {
      case 'Chrome':
        return <IconBrandChrome size={20} />
      case 'Firefox':
        return <IconBrandFirefox size={20} />
      case 'Mobile Safari':
        return <IconBrandSafari size={20} />
      case 'Edge':
        return <IconBrandEdge size={20} />
      case 'Opera':
        return <IconBrandArc size={20} />
      default:
        return <IconWorld size={20} />
    }
  }

  const osIcon = (os: string) => {
    switch (os) {
      case 'Windows':
        return <IconBrandWindows size={20} />
      case 'Mac OS':
        return <IconBrandApple size={20} />
      case 'iOS':
        return <IconBrandApple size={20} />
      case 'Android':
        return <IconBrandAndroid size={20} />
      case 'Linux':
        return <IconBrandUbuntu size={20} />
      default:
        return <IconGhost3 size={20} />
    }
  }

  return (
    <div
      ref={ref}
      className='relative flex items-center gap-2 rounded-sm border bg-background1 p-2'
    >
      {/* <img
        src={`https://tipfile.takming.edu.tw/stuphoto/${student.avatar}`}
        alt='avatar'
        className='h-12 w-12 rounded-full object-cover'
      /> */}
      <Fancybox
        options={{
          Carousel: {
            infinite: false
          }
        }}
      >
        <a
          href={`https://tipfile.takming.edu.tw/stuphoto/${student.avatar}`}
          data-fancybox='images'
          data-caption={student.user.name}
        >
          <Avatar
            src={`https://tipfile.takming.edu.tw/stuphoto/${student.avatar}`}
            width={75}
            height={100}
            alt='大頭貼'
            fallback={
              <div className='flex h-[100px] w-[75px] items-center justify-center overflow-hidden rounded-sm shadow-md'>
                {}
                <img
                  src={student.user.picture}
                  alt='avatar'
                  className='h-full w-full object-cover'
                />
              </div>
            }
          />
        </a>
      </Fancybox>
      <div className='flex flex-1 justify-between'>
        <div className='flex h-12 flex-col justify-between'>
          <div className=''>{student.userId}</div>
          <div className=''>{student.user.name}</div>
        </div>
        <div className='flex h-12 flex-col justify-between'>
          <div className='flex w-full items-center gap-1 text-sm'>
            {browserIcon(student.browserName)}
            {student.browserName} {student.browserVersion}
          </div>
          <div className='flex w-full items-center gap-1'>
            {osIcon(student.osName)}
            {student.osName} {student.osVersion}
          </div>

          {/* <div className=''>{new Date(student.createdAt).toLocaleDateString()}</div>
        <div className=''>{new Date(student.createdAt).toLocaleTimeString()}</div> */}
        </div>
        <Link
          href={student.path}
          className='absolute right-0 top-0 m-2 rounded-sm bg-primary px-2 font-bold'
        >
          {student.path}
        </Link>
        <div className='absolute bottom-0 right-0 m-2 rounded-sm px-2 font-bold'>
          {new Date(student.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  )
})

Card.displayName = 'Card'

export default Card
