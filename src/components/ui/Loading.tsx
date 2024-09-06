import { cn } from '@/lib/utils'
import { IconLoader2 } from '@tabler/icons-react'

const Loading = ({ className }: { className?: string }) => {
  return (
    // <div className='absolute left-0 top-0 flex h-dvh w-full items-center justify-center'>
    <div
      className={cn(
        'absolute left-0 top-0 flex h-dvh w-full items-center justify-center',
        className
      )}
    >
      <IconLoader2 className='mx-auto h-10 w-10 animate-spin' />
    </div>
  )
}

export default Loading
