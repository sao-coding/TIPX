import { IconPinFilled } from "@tabler/icons-react"

const Loading = () => {
  return (
    <>
      <div className='h-36 w-full border-b p-2 md:rounded-xl md:border-none md:bg-main-color-1 md:shadow-md'>
        <div className='relative h-full animate-pulse'>
          <div className='absolute right-0 top-0 rounded-full bg-neutral-500 p-1'>
            <IconPinFilled size={20} />
          </div>
          <div className='flex h-8 w-20 items-center p-1'>
            <div className='h-4 w-20 rounded-full bg-neutral-500'></div>
          </div>
          <div className='p-1'>
            <div className='h-4 w-full rounded-full bg-neutral-500'></div>
          </div>
          <div className='p-1'>
            <div className='h-4 w-full rounded-full bg-neutral-500'></div>
          </div>
          <div className='flex items-center p-1'>
            <div className='mr-1 h-4 w-28 rounded-full bg-neutral-500'></div>
            <div className='ml-1 h-4 w-28 rounded-full bg-neutral-500'></div>
          </div>
          <div className='absolute bottom-0 right-0 rounded-lg bg-neutral-500 px-1'>
            <div className='h-4 w-20 rounded-full bg-neutral-500'></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Loading
