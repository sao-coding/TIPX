'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

import * as Tabs from '@radix-ui/react-tabs'

import LeaveType from './leave'
import List from './list'

const LeaveTabs = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || '請假'
  const [activeTab, setActiveTab] = useState(tab)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.replace(`/user/leave?tab=${value}`)
  }

  return (
    <Tabs.Root defaultValue='請假' onValueChange={handleTabChange} value={activeTab}>
      <div className='md:bg-card-background sticky left-0 top-0 z-10 bg-background md:top-[68px]'>
        <Tabs.List className='border-main-color-3 relative -mt-2 flex justify-around border-b py-1'>
          <Tabs.Trigger className='peer/tabs-請假 w-full p-2' value='請假' id={'tabs-請假'}>
            請假
          </Tabs.Trigger>
          <Tabs.Trigger className='peer/tabs-列表 w-full p-2' value='列表' id={'tabs-列表'}>
            列表
          </Tabs.Trigger>
          <motion.div
            id='tabs-line'
            className='border-main-color-2 absolute bottom-0 left-0 flex h-1 w-1/2 border-b-[3px] duration-300 ease-in-out peer-aria-selected/tabs-列表:translate-x-full peer-aria-selected/tabs-請假:translate-x-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Tabs.List>
      </div>
      <Tabs.Content className='rounded-b-md pt-2' value='請假' aria-labelledby='請假' id='請假'>
        <LeaveType />
      </Tabs.Content>
      <Tabs.Content className='rounded-b-md pt-2' value='列表' aria-labelledby='列表' id='列表'>
        <List />
      </Tabs.Content>
    </Tabs.Root>
  )
}

export default LeaveTabs
