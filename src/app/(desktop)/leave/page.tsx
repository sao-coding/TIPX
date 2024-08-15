// import Title from '@/components/Title'

import LeaveTabs from './tabs'

const LeavePage = () => {
  const title = {
    title: '線上請假',
    position: 'text-center',
    close: true
  }

  return (
    <div className='md:bg-card-background w-full rounded-3xl px-2 md:p-6 md:shadow-md'>
      {/* <Title title={title} /> */}
      <div className='px-2'>
        <LeaveTabs />
      </div>
    </div>
  )
}

export default LeavePage
