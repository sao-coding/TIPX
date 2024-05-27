"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Cookie from "js-cookie"

import { site } from "@/config/site"
import getCurrentYearSem from "@/utils/current-year-sem"
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
  const router = useRouter()

  const { isLoading, isError, data } = useQuery<Sem[]>({
    queryKey: ["credit"],
    queryFn: async () => {
      const { currentYear, currentSem } = getCurrentYearSem()
      const res = await fetch(`/api/credit?year=${currentYear}&sem=${currentSem}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
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
    Cookie.set("cookie_year", year, { expires: site.cookie.expires })
    Cookie.set("cookie_sem", sem, { expires: site.cookie.expires })

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
