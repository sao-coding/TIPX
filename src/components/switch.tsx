'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { site } from '@/config/site'
import { useMediaQuery } from '@/hooks/use-media-query'
import getCurrentYearSem from '@/utils/current-year-sem'
import { IconLoader2, IconSelector } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

type Sem = {
  year: string
  sem: string
}

const Switch = () => {
  const [year, setYear] = useState(Cookies.get('cookie_year'))
  const [sem, setSem] = useState(Cookies.get('cookie_sem'))
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 640px)')

  const { isLoading, isError, data } = useQuery<Sem[]>({
    queryKey: ['credit'],
    queryFn: async () => {
      const { currentYear, currentSem } = getCurrentYearSem()
      const res = await fetch(
        `/api/credit?year=${currentYear}&sem=${currentSem}&userid=D10919101`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await res.json()
      return data
    }
  })

  const ChangeYearSem = (value: string) => {
    const year = value.split('-')[0]
    const sem = value.split('-')[1]
    setYear(year)
    setSem(sem)
    Cookies.set('cookie_year', year, { expires: site.cookie.expires })
    Cookies.set('cookie_sem', sem, { expires: site.cookie.expires })

    // 重新整理()
    router.refresh()
  }

  return (
    <>
      <Select defaultValue={`${year}-${sem}`} onValueChange={(value) => ChangeYearSem(value)}>
        <SelectTrigger className='mt-2 hidden w-full xl:flex'>
          <SelectValue>
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
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {data?.map((item, index) => (
            <SelectItem key={index} value={`${item.year}-${item.sem}`}>
              {`${item.year}-${item.sem} 學年度`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='flex w-full justify-center rounded-xl p-2 hover:bg-accent hover:text-accent-foreground xl:hidden'>
            <IconSelector className='stroke-purple-500' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' side='right'>
          <DropdownMenuLabel>學年度</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={`${year}-${sem}`} onValueChange={ChangeYearSem}>
            {data?.map((item, index) => (
              <DropdownMenuRadioItem key={index} value={`${item.year}-${item.sem}`}>
                {`${item.year}-${item.sem} 學年度`}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default Switch
