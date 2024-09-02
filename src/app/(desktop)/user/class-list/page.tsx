'use client'
import Title from '@/components/Title'
import Avatar from '@/components/ui/avatar'
import Fancybox from '@/components/ui/fancybox'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { Student } from '@/types'
import { IconUserCircle } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const ClassListPage = () => {
  const { isLoading, data } = useQuery<Student[]>({
    queryKey: ['class-list'],
    queryFn: async () => {
      const { data } = await api.get('/class-list')
      return data
    }
  })

  const titleData = {
    title: '班級名單',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <div
                key={item.userId}
                className='flex w-full gap-2 rounded-xl border bg-background1 p-2 md:justify-between'
              >
                <div className='flex items-center'>
                  <Fancybox
                    options={{
                      Carousel: {
                        infinite: false
                      }
                    }}
                  >
                    <a href={item.img} data-fancybox data-caption={item.name}>
                      <Avatar
                        src={item.img}
                        width={75}
                        height={100}
                        alt={item.name}
                        fallback={
                          <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                            <IconUserCircle size={75} />
                          </div>
                        }
                      />
                    </a>
                  </Fancybox>
                </div>
                <div className='flex flex-col justify-between'>
                  <div>
                    <div>{item.userId}</div>
                    <div>{item.name}</div>
                    <div>{item.gender}</div>
                  </div>
                  {/* <button className=' bg-main-color-2 rounded-lg hover:text-main-color-2 hover:bg-white transition duration-300 px-2 py-1 hover:border-main-color-2 border border-main-color-2'>
                                    詳細資料
                                </button> */}
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  )
}

export default ClassListPage
