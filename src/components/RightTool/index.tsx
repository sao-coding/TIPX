import { Calendar } from '@/components/ui/calendar'

import HwTool from './hw-tool'

const RightTool = () => {
  return (
    <div className='space-y-4'>
      <HwTool />
      <div className='flex w-full justify-center rounded-xl bg-background1'>
        <Calendar
          className='w-full'
          classNames={{
            months: 'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
            month: 'space-y-4 w-full flex flex-col',
            table: 'w-full h-full border-collapse space-y-1',
            head_row: '',
            row: 'w-full mt-2'
          }}
        />
      </div>
    </div>
  )
}

export default RightTool
