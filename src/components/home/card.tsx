import clsx from "clsx"
import { IconPinFilled, IconCalendarTime, IconCalendarOff } from "@tabler/icons-react"
import { Announcement } from "@/types"
import Link from "next/link"

const CardCP = ({ data }: { data: Announcement }) => {
    return (
        <Link
            href={`/post/${data.link}`}
            className='mt-2 block h-36 w-full rounded-xl bg-main-color p-2 shadow-md'
        >
            <div className='relative h-full'>
                <div
                    className={clsx(
                        "absolute right-0 top-0 rounded-full bg-white p-1 text-red-500",
                        data.sticky ? "block" : "hidden"
                    )}
                >
                    {data.sticky ? <IconPinFilled size={20} /> : ""}
                </div>
                <div className='p-1'>{data.category}</div>
                <div className='h-12 px-1 text-left md:text-center'>{data.title}</div>
                {/* <div className=''>{data.link}</div> */}
                <div className='flex w-full items-center px-1 md:justify-center'>
                    <IconCalendarTime size={20} />
                    <div className='pr-1'>{data.date}</div>
                    <IconCalendarOff size={20} />
                    <div className='pl-1'>{data.deadline}</div>
                </div>
                <div className='absolute bottom-0 right-0 rounded-lg bg-white px-1'>
                    {data.unit}
                </div>
            </div>
        </Link>
    )
}

export default CardCP
