'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
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
import api from '@/lib/api'
import getCurrentYearSem from '@/utils/current-year-sem'
import { IconLoader2, IconSelector } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import { Skeleton } from '../ui/skeleton'

type Sem = {
  year: string
  sem: string
}

const Switch = ({ mobile }: { mobile?: boolean }) => {
  const [year, setYear] = React.useState(Cookies.get('year'))
  const [sem, setSem] = React.useState(Cookies.get('sem'))
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 1280px)')

  React.useEffect(() => {
    console.log('isDesktop', isDesktop)
  }, [isDesktop])

  const { isLoading, isError, data } = useQuery<Sem[]>({
    queryKey: ['credit'],
    queryFn: async () => {
      const { currentYear, currentSem } = getCurrentYearSem()
      // const res = await fetch(`/api/credit?year=${currentYear}&sem=${currentSem}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      // const data = await res.json()
      // return data
      const { data } = await api.get(`/credit?year=${currentYear}&sem=${currentSem}`)
      return data
    }
  })

  const ChangeYearSem = (value: string) => {
    const year = value.split('-')[0]
    const sem = value.split('-')[1]
    setYear(year)
    setSem(sem)
    Cookies.set('year', year, { expires: site.cookies.expires })
    Cookies.set('sem', sem, { expires: site.cookies.expires })

    // 重新整理()
    console.log('重新整理')
    router.refresh()
  }

  return (
    <>
      {isDesktop === null && (
        <div className='mt-2 flex h-10 items-center p-2'>
          <Skeleton className='h-5 w-full' />
        </div>
      )}
      {/* 桌機版 */}
      {(isDesktop || mobile) && (
        <Select defaultValue={`${year}-${sem}`} onValueChange={(value) => ChangeYearSem(value)}>
          <SelectTrigger
            className={clsx(
              'mt-2 w-full',
              isLoading && 'cursor-not-allowed',
              mobile && 'bg-background1'
            )}
          >
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
          <SelectContent side={mobile ? 'top' : 'bottom'}>
            {data?.map((item, index) => (
              <SelectItem key={index} value={`${item.year}-${item.sem}`}>
                {`${item.year}-${item.sem} 學年度`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {/* 筆電版 */}
      {isDesktop === false && !mobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='mt-2 flex w-full justify-center rounded-sm p-2 hover:bg-accent hover:text-accent-foreground'>
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
      )}
    </>
  )
}

export default Switch
