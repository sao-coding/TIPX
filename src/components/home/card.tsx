import clsx from "clsx"
import { IconPinFilled, IconCalendarTime, IconCalendarOff } from "@tabler/icons-react"
import { Post } from "@/types"

const Card = ({ data }: { data: Post }) => {
    return (
        <>
            <div className='mt-2 h-36 w-full rounded-xl bg-main-color p-2'>
                <div className='relative h-full'>
                    <div
                        className={clsx(
                            "absolute right-0 top-0 rounded-full bg-white p-1",
                            data.sticky ? "text-red-500" : "hidden"
                        )}
                    >
                        {data.sticky ? <IconPinFilled size={20} /> : ""}
                    </div>
                    <div className='p-1'>{data.category}</div>
                    <div className=''>{data.title}</div>
                    {/* <div className=''>{data.link}</div> */}
                    <div className='flex items-center'>
                        <IconCalendarTime size={20} />
                        <div className='pr-1'>{data.date}</div>
                        {/* </div>
                    <div className='flex items-center'> */}
                        <IconCalendarOff size={20} />
                        <div className='pl-1'>{data.deadline}</div>
                    </div>
                    <div className='absolute bottom-0 right-0 rounded-lg bg-white px-1'>
                        {data.unit}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card
