import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"

const HomePage = () => {
  return (
    <div className='grid min-h-screen grid-cols-7'>
      <div className='col-span-1 flex flex-col gap-2 p-2'>
        <Logo className='my-4 h-8 w-full' />
        <Button variant='ghost'>個人資料</Button>
        <Button variant='ghost'>線上請假</Button>
      </div>
      <div className='col-span-5 border'>內容</div>
      <div className='col-span-1'>3</div>
    </div>
  )
}

export default HomePage
