import { IconUserCircle } from "@tabler/icons-react"

const Loading = () => {
    return (
        <div className='w-full p-2'>
            <div className='user-info animate-pulse rounded-xl border bg-slate-50 p-2 shadow-md'>
                <div className='relative flex items-center'>
                    <div className='flex items-center'>
                        <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                            <IconUserCircle size={75} />
                        </div>
                    </div>
                    <div className='grid grid-flow-col grid-rows-4 gap-3 py-[3px] pl-4'>
                        <div className='flex items-center'>
                            <div className='mr-1 h-3 w-20 rounded-full bg-slate-200'></div>
                            <div className='ml-1 h-3 w-20 rounded-full bg-slate-200'></div>
                        </div>
                        <div className='h-3 w-28 rounded-full bg-slate-200'></div>
                        <div className='h-3 w-28 rounded-full bg-slate-200'></div>
                        <div className='flex items-center'>
                            <div className='mr-1 h-3 w-20 rounded-full bg-slate-200'></div>
                            <div className='ml-1 h-3 w-20 rounded-full bg-slate-200'></div>
                        </div>
                    </div>
                    <div className='absolute right-0 top-0 h-6 w-10 rounded-md bg-slate-200 px-1'></div>
                    <div className='absolute bottom-0 right-0 h-6 w-24 rounded-md bg-slate-200 px-1'></div>
                </div>
            </div>
        </div>
    )
}

export default Loading
