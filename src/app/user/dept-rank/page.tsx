"use client"
import Cookie from "js-cookie"
import toast from "react-hot-toast"

import Fancybox from "@/components/fancybox"
import Title from "@/components/Title"
import Avatar from "@/components/ui/avatar"
import { FinalGradeRankClass } from "@/types"
// import { useState, useEffect } from "react"
import { IconCrown, IconStar, IconUserCircle, IconUserStar } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

const DeptRankPage = () => {
  const { data, isLoading, isError } = useQuery<FinalGradeRankClass[]>({
    queryKey: [
      "dept-rank",
      Cookie.get("cookie_year"),
      Cookie.get("cookie_sem"),
      Cookie.get("cookie_userid")
    ],
    queryFn: async () => {
      const notify = toast.loading("資料量大，請稍等")
      const data = []
      for (let i = 1; i <= 3; i++) {
        const res = await fetch(
          `/api/dept-rank?year=${Cookie.get("cookie_year")}&sem=${Cookie.get(
            "cookie_sem"
          )}&classid=${i}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        data.push(await res.json())
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      // 如果data裡面的物件都是空值，就拋出錯誤
      if (data.every((item) => Object.keys(item).length === 0)) {
        toast.error("資料載入失敗", { id: notify })
        throw new Error("沒有資料")
      }

      toast.success("資料讀取成功", { id: notify })

      return data.flat()
    },
    refetchOnWindowFocus: false
  })

  const title = {
    title: "系排名",
    position: "text-center",
    close: true
  }

  return (
    <>
      <div className='mb-2 flex w-full flex-col items-center justify-center px-2'>
        <Title title={title} />
        {isError && (
          <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
            <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
              <div className='text-2xl'>伺服器過載，請稍後再試</div>
              <button
                className='rounded-md bg-main-color-1 p-2 text-xl'
                onClick={
                  // 重新整理
                  () => location.reload()
                }
              >
                重新整理
              </button>
            </div>
          </div>
        )}
        {isLoading && (
          <>
            {Array.from(Array(7).keys()).map((index) => (
              <div
                className='mb-2 flex h-[116px] w-full animate-pulse items-center justify-between rounded-xl border bg-card-background p-2'
                key={index}
              >
                <div className='flex items-center'>
                  <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                    <IconUserCircle size={75} />
                  </div>
                  <div>
                    <div className='m-2 mb-5 h-3 w-20 rounded-full bg-slate-200'></div>
                    <div className='m-2 h-3 w-20 rounded-full bg-slate-200'></div>
                  </div>
                </div>
                <div className='h-full flex-1 md:mr-8 md:flex-none'>
                  <div className='mt-4 flex h-full items-center justify-center'>
                    <div className='m-1 h-3 w-11 rounded bg-slate-200 md:m-4'></div>
                    <div className='m-1 h-3 w-11 rounded bg-slate-200 md:m-4'></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        {/* 依分數排序 如果是 0 就排在最後 */}
        {!isError &&
          data &&
          data.length > 0 &&
          data
            .sort((a, b) => {
              if (a.data.avg === 0) {
                return 1
              } else if (b.data.avg === 0) {
                return -1
              } else {
                return b.data.avg - a.data.avg
              }
            })
            .map((item, index) => (
              <div
                className='relative mb-2 flex w-full items-center justify-between rounded-xl border bg-card-background p-2'
                key={item.userid}
              >
                {/* <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                    <IconUserCircle size={75} />
                                </div> */}
                {/* 如果是前三名，就顯示皇冠 */}
                {index < 3 && (
                  <div className='absolute right-0 top-0 p-2'>
                    <IconCrown size={25} className='fill-amber-500' />
                  </div>
                )}
                <div className='flex items-center'>
                  <Fancybox
                    options={{
                      Carousel: {
                        infinite: false
                      }
                    }}
                  >
                    <a href={item.img} data-fancybox='images' data-caption={item.name}>
                      <Avatar
                        src={item.img}
                        width={75}
                        height={100}
                        alt='大頭貼'
                        fallback={
                          <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                            <IconUserCircle size={75} />
                          </div>
                        }
                      />
                    </a>
                  </Fancybox>
                  <div className='p-2'>
                    <div className='p-1'>{item.userid}</div>
                    <div className='p-1'>{item.name}</div>
                  </div>
                </div>
                <div className='flex items-center font-mono'>
                  {/* <div className='p-1'>{item.data.year}</div>
                                <div className='p-1'>{item.data.sem}</div> */}
                  <div className='mr-1 flex flex-col items-center px-1 md:flex-row'>
                    <IconUserStar className='animate-pulse stroke-yellow-500' />
                    {/* 我想要格式長這樣 00.00 */}
                    <div>{item.data.conduct.score.toFixed(2).toString().padStart(5, "0")}</div>
                  </div>
                  <div className='mr-1 flex flex-col items-center px-1 md:flex-row'>
                    <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                    <div>{item.data.avg.toFixed(2).toString().padStart(5, "0")}</div>
                  </div>
                  <div className='px-1 text-lg font-bold'>
                    {(index + 1).toString().padStart(3, "0")}
                  </div>
                  <div className='absolute bottom-0 right-0 px-3 text-lg font-bold'>
                    {item.data.rank.toString().padStart(2, "0")}
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* {isError && (
                <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='text-2xl'>{errorMsg}</div>
                    </div>
                </div>
            )} */}
    </>
  )
}

export default DeptRankPage
