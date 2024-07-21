import Link from 'next/link'
import clsx from 'clsx'

import { IconLogo } from '@/components/icons/logo'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { USER_LINKS } from '@/config/links'
import getSearchAuth from '@/utils/search-auth'
import {
  IconBookDownload,
  IconChevronDown,
  IconHistoryToggle,
  IconInfoCircle
} from '@tabler/icons-react'

import Hw from './hw'
const HomePage = async () => {
  const searchAuth = await getSearchAuth('D11019139')

  const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

  return (
    <div className='flex h-dvh'>
      <div className='flex h-dvh w-20 flex-col xl:w-[250px]'>
        <div className='bg-background py-6'>
          <IconLogo className='h-12 w-full' />
        </div>
        <ScrollArea>
          <div className='flex flex-col gap-2 px-2 pb-6'>
            {USER_LINKS.map((group, index) => (
              // 用group分組 collapsible 顯示
              <>
                {group.group !== '一般資訊' ? (
                  <Collapsible key={index}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
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
                        </TooltipTrigger>
                        <TooltipContent>{group.group}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <CollapsibleContent>
                      {group.links.map((link, index) => (
                        <TooltipProvider key={index}>
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
                            <TooltipContent>{link.text}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
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
              </>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className='flex-1 border-x'>
        <div className='mx-auto h-dvh max-w-[800px] bg-background1'></div>
      </div>
      <div className='h-dvh w-[350px] p-4'>
        <div className='overflow-hidden rounded-xl'>
          <header className='flex items-center justify-between bg-background1'>
            <div className='flex items-center gap-1.5 px-3 py-2'>
              <IconBookDownload />
              未完成作業
            </div>
            <div className='flex items-center'>
              <AlertDialog>
                <AlertDialogTrigger className='px-3 py-2'>
                  <IconInfoCircle />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>這些是你尚未完成的作業，請盡快完成。</AlertDialogTitle>
                    <AlertDialogDescription>
                      這個小工具會自動幫你列出尚未完成的作業，
                      <br />
                      但結束時間已過的作業也會列出來，請注意。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                    <AlertDialogAction>確定</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </header>
          <div className='h-56 bg-background2'>
            <Hw />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
