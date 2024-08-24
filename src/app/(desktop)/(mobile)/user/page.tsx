import { IconCalendar } from '@tabler/icons-react'

const UserPage = () => {
  return (
    <div className='relative overflow-hidden rounded-lg bg-background1'>
      <div className='h-32'>
        {/* https://cdn.sao-x.com/cover/003.webp */}
        {/* object-position: 50% 25%; */}
        <img src='https://i.imgur.com/xSL4INZ.jpeg' className='h-full w-full object-cover' />
      </div>
      {/* <IconUser className='absolute left-0 right-0 top-20 mx-auto h-24 w-24 rounded-full bg-secondary p-1' /> */}
      {/* https://blog.sao-x.com/img/avatar.jpg */}
      <div className='absolute left-0 right-0 top-20'>
        <img
          src='https://blog.sao-x.com/img/avatar.jpg'
          className='mx-auto h-24 w-24 rounded-full bg-secondary p-1'
        />
      </div>
      <div className='pb-4 pt-16'>
        <h1 className='text-center text-2xl font-bold'>欒文皓</h1>
      </div>
      <div className='flex items-center border-y p-4'>
        <span className='flex items-center gap-1 font-bold'>
          <IconCalendar className='h-4 w-4' />
          註冊時間
        </span>
        <span className='ml-auto'>{new Date().toLocaleString()}</span>
      </div>
      <div className='p-4'>
        <ul>
          <li>職位: 工程師</li>
          <li>部門: 技術部</li>
          <li>電話: 0912345678</li>
          <li>信箱: only@sao-x.com</li>
        </ul>
      </div>
    </div>
  )
}

export default UserPage
