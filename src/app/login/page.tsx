import { IconLogo } from '@/components/icons/logo'
import IconLogoText from '@/components/icons/logo-text'
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import Announcement from './announcement'
import Chart from './chart'
import LoginDialog from './login-dialog'
import TodayCount from './today-count'
import UserCount from './user-count'
// import { useQuery } from "@tanstack/react-query"

const LoginPage = () => {
  return (
    <div className='min-h-screen'>
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
            <CardDescription>學生資訊系統</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginDialog />
          </CardContent>
        </Card>
        <div className='flex space-x-4'>
          <Card className='w-1/2'>
            <CardHeader>
              <CardDescription>使用者</CardDescription>
              <CardTitle>
                <UserCount />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className='w-1/2'>
            <CardHeader>
              <CardDescription>今日登入</CardDescription>
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
      <div className='dpi-125:pb-2 relative bottom-0 right-0 top-0 mx-auto mb-4 w-11/12 sm:w-[400px] lg:fixed lg:right-16 lg:w-[450px] lg:py-36'>
        <div className='flex h-96 flex-col rounded-lg bg-card md:h-[50vh] lg:h-full'>
          <div className='border-b p-6 text-2xl font-semibold leading-none tracking-tight'>
            學校公告
          </div>
          <Announcement />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
