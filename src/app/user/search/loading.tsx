import { IconUserCircle } from "@tabler/icons-react"

const Loading = () => {
    return (
        <div className='h-[118px] rounded-xl border p-2 flex items-center relative'>
            <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                <IconUserCircle size={75} />
            </div>
            <div className='px-2 space-y-3'>
                <div className='h-3 w-20 rounded-full bg-neutral-500'></div>
                <div className='h-3 w-20 rounded-full bg-neutral-500'></div>
                <div className='h-3 w-28 rounded-full bg-neutral-500'></div>
                <div className='h-3 w-44 rounded-full bg-neutral-500'></div>
            </div>
            {/* <div className='absolute top-2 right-2 px-1 bg-neutral-500 rounded-lg font-mono w-20 h-6'></div> */}
        </div>
    )
}

export default Loading
