import Ads from '@/components/Ads'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <Ads
        className='my-2'
        dataAdFormat='autorelaxed'
        dataAdClient='ca-pub-2271001084588765'
        dataAdSlot='6194124244'
      />
    </>
  )
}
