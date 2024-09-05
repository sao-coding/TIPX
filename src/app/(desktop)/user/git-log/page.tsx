import { Commit } from 'git-log'

import Title from '@/components/Title'
import getGitLog from '@/utils/git-log'

const GitLogPage = async () => {
  const data: Commit[] = await getGitLog()

  let lastYear = new Date(data[0].date).getFullYear()
  let lastMonth =
    new Date(
      new Date(data[0].date).toLocaleString('en-US', {
        timeZone: 'Asia/Taipei'
      })
    ).getMonth() + 1
  console.log('###', lastMonth)

  const titleData = {
    title: '更新日誌',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      {/* 提交總次數: {data.length} */}
      <div className='sticky left-0 top-0 z-10 pb-2 md:p-0'>
        <div className='mb-2 w-full rounded-xl border bg-background p-2 text-center'>
          <div className='flex items-center justify-center space-x-16'>
            <div>提交總次數: {data.length}</div>
            <div>
              耗時:{' '}
              {Math.floor(
                (new Date(data[0].date).getTime() -
                  new Date(data[data.length - 1].date).getTime()) /
                  1000 /
                  60 /
                  60 /
                  24
              )}{' '}
              天
            </div>
          </div>
          <div>
            最後提交時間:{' '}
            {new Date(data[0].date).toLocaleString('zh-TW', {
              timeZone: 'Asia/Taipei'
            })}
          </div>
        </div>
      </div>
      {data && (
        <div className='pl-2'>
          <ul className='flex flex-col space-y-2 border-l-4 border-primary p-2 md:pr-0'>
            {data.map((item, index) => (
              // 依照年分月份分類
              <>
                {/* {new Date(item.date).getFullYear() !==
                                    new Date(data[0].date).getFullYear() && (
                                    <>
                                        <li className='text-center text-xl font-bold'>
                                            {new Date(item.date).getFullYear()}
                                        </li>
                                        <li className='text-center text-xl font-bold'>
                                            {new Date(item.date).getMonth() + 1} 月
                                        </li>
                                    </>
                                )} */}
                {/* 轉 utc+8 在判斷月份 */}
                {/* {console.log(
                                    "###",
                                    item.subject,
                                    "lastMonth:",
                                    lastMonth,
                                    new Date(item.date).getMonth() + 1,
                                    new Date(item.date).getHours()
                                )} */}
                {new Date(
                  new Date(item.date).toLocaleString('en-US', {
                    timeZone: 'Asia/Taipei'
                  })
                ).getMonth() +
                  1 !==
                  lastMonth &&
                  ((lastMonth =
                    new Date(
                      new Date(item.date).toLocaleString('en-US', {
                        timeZone: 'Asia/Taipei'
                      })
                    ).getMonth() + 1),
                  (
                    <li
                      key={index}
                      className='relative ml-1 px-1 py-2 after:absolute after:-left-[23px] after:top-1/2 after:block after:h-4 after:w-4 after:-translate-y-1/2 after:transform after:rounded-full after:border-4 after:border-orange-900 after:bg-orange-300 after:shadow-lg after:content-[""]'
                    >
                      <div className='relative flex justify-center text-center text-xl font-bold before:absolute before:top-1/2 before:block before:h-0 before:w-full before:border before:content-[""]'>
                        <div className='relative bg-background px-2'>
                          {new Date(item.date).getMonth() + 1} 月
                        </div>
                      </div>
                    </li>
                  ))}

                <li
                  key={item.hash}
                  className='relative ml-1 rounded-xl border p-2 after:absolute after:-left-[23px] after:top-1/2 after:block after:h-4 after:w-4 after:-translate-y-1/2 after:transform after:rounded-full after:border-4 after:border-orange-900 after:bg-orange-300 after:shadow-lg after:content-[""]'
                >
                  <h2>{item.subject}</h2>
                  <p>
                    {new Date(item.date).toLocaleString('zh-TW', {
                      timeZone: 'Asia/Taipei'
                    })}
                  </p>
                </li>
              </>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default GitLogPage
