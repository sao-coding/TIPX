import { X } from 'lucide-react'

import Ads from '@/components/Ads'
import Close from '@/components/Close'
import { Post } from '@/types'
import getPost from '@/utils/post'
import {
  IconCalendarOff,
  IconCalendarTime,
  IconDownload,
  IconLink,
  IconPaperclip
} from '@tabler/icons-react'

const PostPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params
  const post = (await getPost('one', Number(params.id))) as Post

  return (
    <>
      {post && (
        <>
          <Close className='absolute left-auto right-4 top-4 block h-auto rounded-sm p-0 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
            <X className='h-4 w-4' />
          </Close>
          <h1 className='mb-4 mr-6 line-clamp-2 border-b text-xl font-bold md:mr-0 md:text-2xl'>
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
          <div className='whitespace-pre-line break-words'>{post.content}</div>
          <Ads
            dataAdFormat='fluid'
            dataAdLayoutKey='-fb+5w+4e-db+86'
            dataAdClient='ca-pub-2271001084588765'
            dataAdSlot='9510191337'
          />
          <div className='flex w-full justify-end'>
            <a
              href={`https://netinfo.takming.edu.tw/tip/post/post_OneShow.php?SerialItem=${post.id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              來源: <span className='text-blue-500'>德明 TIP</span>
            </a>
          </div>
          <div className='mt-1 rounded-xl border-2 border-dashed p-1 md:h-[10vh] md:overflow-y-auto md:border md:border-solid'>
            {(post.file?.length ?? 0 > 0) ? (
              <>
                {post.file.map((item) => (
                  <div key={item.title} className='flex items-center'>
                    <IconPaperclip size={20} />
                    <div className='pl-1'>{item.title}</div>
                    <a href={item.link} target='_blank' rel='noreferrer' className='p-1'>
                      <IconDownload className='bg-main-color-1 rounded-md p-1' />
                    </a>
                  </div>
                ))}
              </>
            ) : (
              <div className='flex items-center'>
                <IconPaperclip size={20} />
                <div className='pl-1 text-gray-500'>沒有附件</div>
              </div>
            )}
            {post.link ? (
              <div className='flex items-center'>
                <IconLink size={20} />
                <a href={post.link} target='_blank' rel='noreferrer' className='pl-1 text-blue-500'>
                  點及此處前往
                </a>
              </div>
            ) : (
              <div className='flex items-center'>
                <IconLink size={20} />
                <div className='pl-1 text-gray-500'>沒有連結</div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default PostPage
