import { X } from 'lucide-react'

import Close from '@/components/Close'
import { Post } from '@/types'
import getPost from '@/utils/post'
import { IconCalendarOff, IconCalendarTime } from '@tabler/icons-react'

const PostPage = async ({ params }: { params: { id: string } }) => {
  const post = (await getPost('one', Number(params.id))) as Post

  return (
    <>
      {post && (
        <>
          <Close className='absolute left-auto right-4 top-4 block h-auto rounded-sm p-0 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
            <X className='h-4 w-4' />
          </Close>
          <h1 className='mb-4 mr-6 line-clamp-2 h-14 border-b text-xl font-bold md:mr-0 md:text-2xl'>
            {post.title}
          </h1>
          <div className='flex justify-between'>
            <div className=''>
              <div className='flex items-center gap-2'>
                <div>{post.unit}</div>
                <div className='text-blue-500'>
                  <a href={`mailto:${post.publisher.email}`}>{post.publisher.name}</a>
                </div>
              </div>
              {post.category}
            </div>
            <div className=''>
              <div className='flex items-center gap-1'>
                <IconCalendarTime size={20} />
                <div>{post.date}</div>
              </div>
              <div className='flex items-center gap-1'>
                <IconCalendarOff size={20} />
                <div>{post.deadline}</div>
              </div>
            </div>
          </div>
          <p className='whitespace-pre-line break-words'>{post.content}</p>
          <div className='flex w-full justify-end'>
            <a
              href={`https://netinfo.takming.edu.tw/tip/post/post_OneShow.php?SerialItem=${post.id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              來源: <span className='text-blue-500'>德明 TIP</span>
            </a>
          </div>
        </>
      )}
    </>
  )
}

export default PostPage
