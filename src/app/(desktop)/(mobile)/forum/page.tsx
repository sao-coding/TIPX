import Title from '@/components/Title'

const Forum = () => {
  // 正在開發中
  const titleData = {
    title: '聊天',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='text-2xl'>正在開發中</div>
      </div>
    </>
  )
}

export default Forum
