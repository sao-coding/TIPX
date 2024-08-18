// import Title from '@/components/Title'

import LeaveTabs from './tabs'

const LeavePage = () => {
  const title = {
    title: '線上請假',
    position: 'text-center',
    close: true
  }

  return (
    <div className=''>
      <LeaveTabs />
    </div>
  )
}

export default LeavePage
