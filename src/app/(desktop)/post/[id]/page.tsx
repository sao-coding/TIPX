import Close from '@/components/Close'
import { Post } from '@/types'
import getPost from '@/utils/post'
import { IconCalendarOff, IconCalendarTime } from '@tabler/icons-react'

const PostPage = async ({ params }: { params: { id: string } }) => {
  const post = (await getPost('one', Number(params.id))) as Post

  return (
    <>
      <div className=''>
        {post && (
          <div className=''>
            <div className='relative'>
              <Close />
              <h1 className='mb-2 ml-10 line-clamp-2 h-16 text-xl font-bold md:text-2xl'>
                {post.title}
              </h1>
            </div>
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
          </div>
        )}
      </div>
    </>
  )
}

export default PostPage
