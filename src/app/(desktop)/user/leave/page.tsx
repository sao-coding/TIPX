'use client'

import { parseAsString, useQueryState } from 'nuqs'

import Ads from '@/components/Ads'
import Close from '@/components/Close'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import Leave from './leave'
import List from './list'

const LeavePage = () => {
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault('請假'))

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const TabsListData = [
    { label: '請假', value: '請假', component: <Leave /> },
    { label: '列表', value: '列表', component: <List /> }
  ]

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
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
          <Ads
            dataAdFormat='autorelaxed'
            dataAdClient='ca-pub-2271001084588765'
            dataAdSlot='6194124244'
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default LeavePage
