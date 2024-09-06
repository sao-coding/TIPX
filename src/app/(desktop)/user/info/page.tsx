import { IconLogo } from '@/components/icons/logo'
import { BorderBeam } from '@/components/magicui/BorderBeam'
import { Meteors } from '@/components/magicui/Meteors'
import Title from '@/components/Title'

const InfoPage = () => {
  const titleData = {
    title: '關於',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      <div className='space-y-4'>
        <div className='relative flex w-full justify-between overflow-hidden rounded-xl p-4'>
          <span className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10'>
            TIPX
          </span>
          <IconLogo className='h-24 w-24' />
          <BorderBeam duration={10} />
          <Meteors />
        </div>
        <h1 className='text-center text-4xl font-bold'>警告</h1>
        <div className='text-center'>
          此網站為非官方網站，為個人作品
          <br />
          不代表任何學校或組織的意見
          <br />
          使用本網站 <span className='rounded-lg bg-primary/50 px-1 py-0.5'>tipx.sao-x.com</span>
          <div className='text-red-500'>若有任何損失，本網站概不負責！</div>
        </div>
      </div>
    </>
  )
}

export default InfoPage
