import Footer from '@/components/Footer'
import LeftSidebar from '@/components/LeftSidebar'

import Hw from './hw'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className='flex h-dvh'>
        <LeftSidebar />
        <div className='h-dvh flex-1 overflow-auto border-x p-3 md:p-6'>
          <div className='mx-auto max-w-[800px]'>{children}</div>
        </div>
        <div className='hidden h-dvh w-[350px] p-4 lg:block'>
          <Hw />
        </div>
        <Footer />
      </div>
    </>
  )
}
