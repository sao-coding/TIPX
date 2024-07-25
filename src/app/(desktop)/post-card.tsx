import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Announcement } from '@/types'
import { IconCalendarOff, IconCalendarTime, IconCategory, IconPinFilled } from '@tabler/icons-react'

const PostCard = React.forwardRef<HTMLAnchorElement, { post: Announcement }>(({ post }, ref) => {
  return (
    <Link ref={ref} href={`/post/${post.id}`} key={post.id}>
      <motion.div
        className='rounded-lg hover:bg-background2 md:rounded-none'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className='h-36 border-b border-background2 p-2 md:p-7'>
          <div className='relative flex h-full flex-col gap-1 md:justify-between'>
            <div
              className={clsx(
                'absolute right-0 top-0 rounded-full p-1 text-red-500',
                post.sticky ? 'block' : 'hidden'
              )}
            >
              {post.sticky ? <IconPinFilled size={20} /> : ''}
            </div>
            <div className='flex items-center gap-1'>
              <IconCategory size={20} />
              <p className='text-gray-500'>{post.category}</p>
            </div>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h2 className='line-clamp-2 h-12 font-bold md:line-clamp-1 md:text-xl'>
                    {post.title}
                  </h2>
                </TooltipTrigger>
                <TooltipContent>{post.title}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className='flex items-center gap-4 text-gray-500'>
              <div className='flex items-center'>
                <IconCalendarTime size={20} />
                <div className='pl-1'>{post.date}</div>
              </div>
              <div className='flex items-center'>
                <IconCalendarOff size={20} />
                <div className='pl-1'>{post.deadline}</div>
              </div>
            </div>
            <div className='absolute bottom-0 right-0 rounded-lg px-1'>{post.unit}</div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
})

PostCard.displayName = 'PostCard'

export default PostCard
