'use client'
import Title from '@/components/Title'
import Loading from '@/components/ui/Loading'
import api from '@/lib/api'
import { Calendar } from '@/types'
import { useQuery } from '@tanstack/react-query'

const ClassListPage = () => {
  const { isLoading, data } = useQuery<Calendar[]>({
    queryKey: ['calendar'],
    queryFn: async () => {
      const { data } = await api.get('calendar')
      return data.data
    }
  })

  const titleData = {
    title: '行事曆',
    children: ''
  }

  //   {
  //   "status": "success",
  //   "message": "取得行事曆成功",
  //   "data": [
  //     {
  //       "title": "114學年行事曆-教育部114.3.14 臺教技(四)字第1140027649號核備-114.7月份行政會議修正",
  //       "link": "https://secretary.takming.edu.tw/var/file/4/1004/img/847811182.pdf"
  //     },
  //     {
  //       "title": "114學年行事曆 (114.3.14 教育部核備)",
  //       "link": "https://secretary.takming.edu.tw/var/file/4/1004/img/915063092.pdf"
  //     },
  //     {
  //       "title": "113學年行事曆 教育部113.3.4核備 -113.11.4 行政會議後修正",
  //       "link": "https://secretary.takming.edu.tw/var/file/4/1004/img/248589024.pdf"
  //     },
  //     {
  //       "title": "113學年行事曆 (113.3.8 教育部核備)",
  //       "link": "https://secretary.takming.edu.tw/var/file/4/1004/img/53/128594306.pdf"
  //     },
  //     {
  //       "title": "112學年度行事曆 (112.3.9 教育部核備112.11.6 行政會議修正)",
  //       "link": "https://secretary.takming.edu.tw/var/file/4/1004/img/53/495936820.pdf"
  //     }
  //   ]
  // }

  return (
    <>
      <Title {...titleData} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className='flex flex-col gap-2'>
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <a
                key={item.link}
                href={item.link}
                target='_blank'
                rel='noopener noreferrer'
                className='truncate rounded-lg border bg-background1 p-4 hover:bg-accent hover:underline'
              >
                {item.title}
              </a>
            ))}
        </div>
      )}
    </>
  )
}

export default ClassListPage
