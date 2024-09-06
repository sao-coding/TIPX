'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Close from '@/components/Close'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// import * as Tabs from '@radix-ui/react-tabs'
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

  const TabsListData = [
    { label: '請假', value: '請假', component: <LeaveType /> },
    { label: '列表', value: '列表', component: <List /> }
  ]

  return (
    <Tabs onValueChange={handleTabChange} value={activeTab}>
      <div className='mb-2 flex flex-col items-center gap-3 md:flex-row'>
        <div className='relative w-full'>
          <Close />
          <h1 className='w-full text-center text-2xl font-bold md:text-left'>線上請假</h1>
        </div>
        <TabsList className='w-full'>
          {TabsListData.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className='w-full'>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {TabsListData.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.component}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default LeaveTabs
