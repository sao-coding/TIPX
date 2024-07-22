import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { IconLogo } from '@/components/icons/logo'
import LeftSidebar from '@/components/LeftSidebar'
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

  return (
    <div className='flex h-dvh'>
      <LeftSidebar />
      <div className='flex-1 border-x'>
        <div className='mx-auto h-dvh max-w-[800px] bg-background1'></div>
      </div>
      <div className='h-dvh w-[350px] p-4'>
        <Hw />
      </div>
    </div>
  )
}

export default HomePage
