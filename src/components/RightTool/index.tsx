import Ads from '@/components/Ads'
import { Calendar } from '@/components/ui/calendar'

import HwTool from './hw-tool'

const RightTool = () => {
  return (
    <div className='space-y-4'>
      <HwTool />
      <div className='flex w-full justify-center rounded-sm bg-background1'>
        <Calendar
          className='w-full'
          classNames={{
            months: 'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
            month: 'space-y-4 w-full flex flex-col',
            table: 'w-full h-full border-collapse space-y-1',
            head_row: '',
            row: 'w-full mt-2',
            day_today:
              'bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
          }}
        />
      </div>
      <Ads
        dataAdFormat='autorelaxed'
        dataAdClient='ca-pub-2271001084588765'
        dataAdSlot='6194124244'
      />
    </div>
  )
}

export default RightTool
