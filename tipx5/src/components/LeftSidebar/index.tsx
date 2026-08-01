'use client'

import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import Cookies from 'js-cookie'

import Logout from '@/app/(desktop)/(mobile)/user/logout'
import { IconLogo } from '@/components/icons/logo'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { USER_LINKS } from '@/config/links'
import { useMediaQuery } from '@/hooks/use-media-query'
import { IconChevronDown, IconHistoryToggle } from '@tabler/icons-react'

import { Skeleton } from '../ui/skeleton'

import Switch from './switch'

const LeftSidebar = () => {
  const [role, setRole] = React.useState('USER')
  const isDesktop = useMediaQuery('(min-width: 1280px)')

  React.useEffect(() => {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) return
    const payload = accessToken.split('.')[1]
    const decodedPayload = atob(payload)
    const { role } = JSON.parse(decodedPayload)
    console.log('role', role)
    setRole(role)
  }, [])

  return (
    <>
      <div className='hidden h-dvh w-20 flex-col md:flex xl:w-[250px]'>
        <div className='py-6'>
          <IconLogo className='h-12 w-full' />
        </div>
        <ScrollArea>
          <div className='flex flex-col gap-2 px-4 pb-6'>
            <Switch />
            {USER_LINKS.map((group, index) => (
              // 用group分組 collapsible 顯示
              <React.Fragment key={index}>
                {group.group !== '一般資訊' ? (
                  <>
                    {isDesktop === null && (
                      <div className='flex h-10 items-center p-2'>
                        <Skeleton className='h-5 w-full' />
                      </div>
                    )}
                    {isDesktop && (
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Collapsible>
                              <CollapsibleTrigger className='group w-full rounded-sm p-2 hover:bg-accent hover:text-accent-foreground'>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-2'>
                                    <IconHistoryToggle className='text-primary' />
                                    <span>{group.group}</span>
                                  </div>
                                  {/* html 屬性 data-state 若是open則旋轉180度 */}
                                  {/* 過度動畫 */}
                                  <IconChevronDown className='transition-transform group-data-[state=open]:rotate-180' />
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                {group.links.map((link, index) => (
                                  <TooltipProvider key={index} delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Link
                                          href={link.href}
                                          className='block w-full rounded-sm p-2 hover:bg-accent hover:text-accent-foreground'
                                        >
                                          <div className='flex items-center gap-2'>
                                            <link.icon
                                              className={clsx(link.color, link.className)}
                                            />
                                            <span>{link.text}</span>
                                          </div>
                                        </Link>
                                      </TooltipTrigger>
                                      <TooltipContent side='right'>{link.text}</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          </TooltipTrigger>
                          <TooltipContent side='right'>{group.group}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {isDesktop === false && (
                      //  筆電版
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className='flex w-full justify-center rounded-sm p-2 hover:bg-accent hover:text-accent-foreground'>
                            <IconHistoryToggle className='text-primary' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-56' side='right'>
                          <DropdownMenuLabel>歷年資訊</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {group.links.map((link, index) => (
                            <DropdownMenuItem key={index}>
                              <Link href={link.href}>{link.text}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </>
                ) : (
                  <>
                    {group.links.map((link, index) =>
                      (link.text === '查詢用戶' && role === 'USER') ||
                      (link.text === '日誌中心' && role !== 'SUPER_ADMIN') ? null : (
                        <TooltipProvider key={index} delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={link.href}
                                className='flex w-full justify-center rounded-sm p-2 hover:bg-accent hover:text-accent-foreground xl:justify-start'
                              >
                                <div className='flex items-center gap-2'>
                                  <link.icon className={clsx(link.color, link.className)} />
                                  <span className='block md:hidden xl:block'>{link.text}</span>
                                </div>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side='right'>{link.text}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
            <Logout />
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

export default LeftSidebar
