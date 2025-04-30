import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { loginWithRedirect } from '@/app/actions'
import { IconLogo } from '@/components/icons/logo'
import IconLogoText from '@/components/icons/logo-text'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { site } from '@/config/site'

import Announcement from './announcement'
import Chart from './chart'
import LoginDialog from './login-dialog'
import TodayCount from './today-count'
import UserCount from './user-count'

// layout.tsx 沒辦法接收到 searchParams，所以要在這裡接收
// export async function generateMetadata(props: {
//   searchParams: Promise<{ redirect: string }>
// }): Promise<Metadata> {
export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ redirect: string }>
}): Promise<Metadata> {
  const searchParamsx = await searchParams
  console.log(searchParamsx)
  let data = {
    title: '登入',
    openGraph: {
      images: [
        {
          url: 'og.png',
          width: 1200,
          height: 630,
          alt: 'TIPX'
        }
      ]
    }
  }

  switch (searchParamsx.redirect) {
    case '/':
      data.title = '首頁'
      data.openGraph.images[0].url = 'og.png'
      data.openGraph.images[0].alt = '首頁'
      break
    case '/timetable':
      data.title = '課表'
      data.openGraph.images[0].url = 'timetable-og.png'
      data.openGraph.images[0].alt = '課表'
      break
    case '/course':
      data.title = '課程'
      data.openGraph.images[0].url = 'course-og.png'
      data.openGraph.images[0].alt = '課程'
      break
    case '/user':
      data.title = '個人'
      data.openGraph.images[0].url = 'user-og.png'
      data.openGraph.images[0].alt = '個人'
      break
  }

  return {
    title: `TIPX | ${data.title}`,
    twitter: {
      title: data.title,
      description: '學生資訊系統',
      card: 'summary_large_image',
      site: '@tipx',
      images: `${site.url}/img/${data.openGraph.images[0].url}`
    },
    openGraph: {
      title: data.title,
      description: '學生資訊系統',
      url: `${site.url}/login?redirect=${searchParamsx.redirect}`,
      images: [
        {
          url: `${site.url}/img/${data.openGraph.images[0].url}`,
          width: data.openGraph.images[0].width,
          height: data.openGraph.images[0].height,
          alt: data.openGraph.images[0].alt
        }
      ]
    }
  }
}

const LoginPage = async (props: { searchParams: Promise<{ redirect: string }> }) => {
  const searchParams = await props.searchParams
  const auth = await loginWithRedirect()
  if (auth) redirect(searchParams.redirect || '/')

  const t = await getTranslations('LoginPage')

  return (
    <div className='relative min-h-screen'>
      {/* <div className='fixed top-0 z-10 mx-auto w-full'>
        <div className='mx-auto bg-red-500 p-2'>
          最新消息：資料庫伺服器異常，若有任何問題請聯絡開發者，因為網路不穩定
        </div>
      </div> */}
      <div className='fixed left-0 top-0 h-screen w-screen bg-slate-900'></div>
      <div className='shape1 fixed left-0 top-0 h-screen w-screen bg-gradient-to-br from-primary to-amber-500'></div>
      <div className='shape2 fixed right-0 top-0 h-screen w-screen bg-gradient-to-br from-primary to-amber-500 opacity-50'></div>
      <div className='relative mx-auto mb-4 w-11/12 space-y-4 pt-36 sm:w-[400px] lg:ml-24 lg:max-w-lg'>
        <Card className='relative w-full'>
          <IconLogo className='absolute -top-12 left-0 right-0 mx-auto h-24 w-24 fill-slate-500 dark:fill-white' />
          <CardHeader className='text-center'>
            <CardTitle className='mb-6 mt-10'>
              <IconLogoText className='h-10 w-full' />
            </CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginDialog />
          </CardContent>
        </Card>
        <div className='flex space-x-4'>
          <Card className='w-1/2'>
            <CardHeader>
              <CardDescription>{t('user-count')}</CardDescription>
              <CardTitle>
                <UserCount />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className='w-1/2'>
            <CardHeader>
              <CardDescription>{t('today-count')}</CardDescription>
              <CardTitle>
                <TodayCount />
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Chart />
          </CardHeader>
        </Card>
      </div>
      <div className='relative bottom-0 right-0 top-0 mx-auto mb-4 w-11/12 sm:w-[400px] lg:fixed lg:right-16 lg:w-[450px] lg:py-36 dpi-125:pb-2'>
        <div className='flex h-96 flex-col rounded-lg bg-card md:h-[50vh] lg:h-full'>
          <div className='border-b p-6 text-2xl font-semibold leading-none tracking-tight'>
            {t('school-announcement')}
          </div>
          <Announcement />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
