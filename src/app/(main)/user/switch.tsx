"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"

import * as Select from "@radix-ui/react-select"
import { IconChevronDown, IconChevronUp, IconLoader2, IconSelector } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"

type Sem = {
  year: string
  sem: string
}

const Switch = () => {
  const [year, setYear] = useState(Cookie.get("cookie_year"))
  const [sem, setSem] = useState(Cookie.get("cookie_sem"))
  // const [data, setData] = useState<Sem[]>([])
  const router = useRouter()

  // useEffect(() => {
  //     const fetchData = async () => {
  //         let year = new Date().getFullYear()
  //         let sem = "1"
  //         const month = new Date().getMonth() + 1
  //         console.log("year", year)
  //         console.log("month", month)
  //         if (month >= 8) {
  //             // Cookie.set("cookie_year", (year - 1911).toString(), { expires: 7 })
  //             // console.log("cookie_year", year - 1911)
  //             year = year - 1911
  //         } else {
  //             // Cookie.set("cookie_year", (year - 1912).toString(), { expires: 7 })
  //             // console.log("cookie_year", year - 1912)
  //             year = year - 1912
  //         }
  //         // 判斷上下學期
  //         // year 8 ~ 12 || year+1 1 ~ 2
  //         // year 2 ~ 7
  //         if (month >= 8 || month <= 2) {
  //             // Cookie.set("cookie_sem", "1", { expires: 7 })
  //             // console.log("cookie_sem", 1)
  //             sem = "1"
  //         } else {
  //             // Cookie.set("cookie_sem", "2", { expires: 7 })
  //             // console.log("cookie_sem", 2)
  //             sem = "2"
  //         }
  //         const res = await fetch(`/api/credit?year=${year}&sem=${sem}`, {
  //             method: "GET",
  //             headers: {
  //                 "Content-Type": "application/json",
  //                 Authorization: `Bearer ${Cookie.get("token")}`,
  //             },
  //         })

  //         const data = await res.json()

  //         for (let i = 0; i < data.length; i++) {
  //             setData((prev) => [
  //                 ...prev,
  //                 {
  //                     year: data[i].year,
  //                     sem: data[i].sem,
  //                 },
  //             ])
  //         }
  //     }

  //     fetchData()
  // }, [])

  // useEffect(() => {
  //     console.log(year, sem)
  // }, [year, sem])

  const { isLoading, isError, data } = useQuery<Sem[]>({
    queryKey: ["credit"],
    queryFn: async () => {
      let year = new Date().getFullYear()
      let sem = "1"
      const month = new Date().getMonth() + 1
      console.log("year", year)
      console.log("month", month)
      if (month >= 8) {
        // Cookie.set("cookie_year", (year - 1911).toString(), { expires: 7 })
        // console.log("cookie_year", year - 1911)
        year = year - 1911
      } else {
        // Cookie.set("cookie_year", (year - 1912).toString(), { expires: 7 })
        // console.log("cookie_year", year - 1912)
        year = year - 1912
      }
      // 判斷上下學期
      // year 8 ~ 12 || year+1 1 ~ 2
      // year 2 ~ 7
      if (month >= 8 || month <= 1) {
        // Cookie.set("cookie_sem", "1", { expires: 7 })
        // console.log("cookie_sem", 1)
        sem = "1"
      } else {
        // Cookie.set("cookie_sem", "2", { expires: 7 })
        // console.log("cookie_sem", 2)
        sem = "2"
      }
      const res = await fetch(`/api/credit?year=${year}&sem=${sem}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookie.get("token")}`
        }
      })
      const data = await res.json()
      return data
    }
  })

  const ChangeYearSem = (value: string) => {
    const year = value.split("-")[0]
    const sem = value.split("-")[1]
    setYear(year)
    setSem(sem)
    Cookie.set("cookie_year", year, { expires: 7 })
    Cookie.set("cookie_sem", sem, { expires: 7 })

    // 重新整理()
    router.refresh()
  }

  return (
    <Select.Root
      defaultValue={`${year}-${sem}`}
      onValueChange={(value) => {
        ChangeYearSem(value)
      }}
    >
      <Select.Trigger
        className='flex w-full cursor-pointer items-center rounded-xl p-2 focus-visible:outline-none md:border'
        title='點擊切換學年度'
        aria-controls='下拉選單'
      >
        <Select.Icon asChild>
          <IconSelector className='mr-2 stroke-purple-500' />
        </Select.Icon>
        <Select.Value>
          {isLoading ? (
            <IconLoader2 className='mx-1 animate-spin' />
          ) : (
            <>
              {data?.map((item, index) => {
                if (item.year === year && item.sem === sem) {
                  return `${item.year}-${item.sem} 學年度`
                }
              })}
            </>
          )}
        </Select.Value>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className='rounded-md border bg-card-background p-2 shadow-md'>
          <Select.ScrollUpButton className='flex items-center justify-center'>
            <IconChevronUp />
          </Select.ScrollUpButton>
          <Select.Viewport>
            {data?.map((item, index) => (
              <Select.Item
                key={index}
                value={`${item.year}-${item.sem}`}
                className='cursor-pointer rounded-md p-1 outline-none hover:bg-gray-200 dark:hover:bg-black'
              >
                <Select.ItemText>{`${item.year}-${item.sem} 學年度`}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
            <Select.Separator />
          </Select.Viewport>
          <Select.ScrollDownButton className='flex items-center justify-center'>
            <IconChevronDown />
          </Select.ScrollDownButton>
          <Select.Arrow />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export default Switch
