'use client'

import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { IconLogo } from '@/components/icons/logo'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { USER_LINKS } from '@/config/links'
import { useMediaQuery } from '@/hooks/use-media-query'
import { IconChevronDown, IconHistoryToggle } from '@tabler/icons-react'

const LeftSidebar = () => {
  const isDesktop = useMediaQuery('(min-width: 640px)')

  return (
    <>
      <div className='hidden h-dvh w-20 flex-col md:flex xl:w-[250px]'>
        <div className='py-6'>
          <IconLogo className='h-12 w-full' />
        </div>
        <ScrollArea>
          <div className='flex flex-col gap-2 px-4 pb-6'>
            {USER_LINKS.map((group, index) => (
              // 用group分組 collapsible 顯示
              <React.Fragment key={index}>
                {group.group !== '一般資訊' ? (
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Collapsible>
                          <CollapsibleTrigger className='group w-full rounded-xl p-2 hover:bg-accent hover:text-accent-foreground'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2'>
                                <IconHistoryToggle className='text-primary' />
                                <span className='block sm:hidden xl:block'>{group.group}</span>
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
                                      className='block w-full rounded-xl p-2 hover:bg-accent hover:text-accent-foreground'
                                    >
                                      <div className='flex items-center gap-2'>
                                        <link.icon className={clsx(link.color, link.className)} />
                                        <span className='block sm:hidden xl:block'>
                                          {link.text}
                                        </span>
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
                ) : (
                  <>
                    {group.links.map((link, index) => (
                      <TooltipProvider key={index} delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={link.href}
                              className='block w-full rounded-xl p-2 hover:bg-accent hover:text-accent-foreground'
                            >
                              <div className='flex items-center gap-2'>
                                <link.icon className={clsx(link.color, link.className)} />
                                <span className='block sm:hidden xl:block'>{link.text}</span>
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side='right'>{link.text}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

export default LeftSidebar
