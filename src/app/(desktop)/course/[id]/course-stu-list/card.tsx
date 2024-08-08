import React from 'react'
import Image from 'next/image'

import Fancybox from '@/components/ui/fancybox'
import { CourseStuList } from '@/types'
import { IconGenderBigender, IconMail, IconStar, IconUserCircle } from '@tabler/icons-react'
const Card = ({ data }: { data: CourseStuList }) => {
  const [isImgError, setIsImgError] = React.useState(false)

  return (
    <>
      <div className='mb-2 w-full border-b'>
        <div className='flex w-full p-2'>
          <div className='p-2'>
            {isImgError ? (
              <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                <IconUserCircle size={75} />
              </div>
            ) : (
              <Fancybox
                options={{
                  Carousel: {
                    infinite: false
                  }
                }}
              >
                <a href={data.img} data-fancybox data-caption={data.name}>
                  <Image
                    src={data.img}
                    alt='大頭貼'
                    width='0'
                    height='0'
                    sizes='fill'
                    loading='lazy'
                    placeholder='blur'
                    blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAABLCAYAAABJNhZ0AAAAKklEQVR42u3KMQ0AMAgAsKF8NvCCOLDATdq70ZX/LYQoiqIoiqIoigfiANYf04f83WXIAAAAAElFTkSuQmCC'
                    onError={() => setIsImgError(true)}
                    className='h-[100px] w-[75px] rounded-md object-cover shadow-md'
                  />
                </a>
              </Fancybox>
            )}
          </div>
          <div className='flex flex-grow items-center p-2 md:flex-grow-0'>
            <div className='w-full'>
              <div className='flex flex-wrap items-center justify-between p-1'>
                <div className='flex items-center'>
                  <IconUserCircle />
                  <div className='pl-1'>姓名:{data.name}</div>
                </div>
                <div className='flex items-center'>
                  <IconGenderBigender />
                  <div className='pl-1'>性別:{data.gender}</div>
                </div>
              </div>
              <div className='flex items-center p-1'>
                <IconStar />
                <div className='pl-1'>學號:{data.id}</div>
              </div>
              <div className='flex flex-wrap items-center justify-between'>
                <a
                  href={`mailto:${data.email[0]}`}
                  className='text-main-color-3 hover:bg-main-color-3 flex items-center rounded-md p-1 hover:text-white'
                >
                  <IconMail />
                  <div className='pl-1'>個人信箱</div>
                </a>

                <a
                  href={`mailto:${data.email[1]}`}
                  className='text-main-color-3 hover:bg-main-color-3 flex items-center rounded-md p-1 hover:text-white'
                >
                  <IconMail />
                  <div className='pl-1'>學校信箱</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Card
