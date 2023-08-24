import clsx from "clsx"
import { IconPinFilled, IconCalendarTime, IconCalendarOff } from "@tabler/icons-react"
import { Announcement } from "@/types"
import Link from "next/link"
import React from "react"
import { motion } from "framer-motion"

const CardCP = React.forwardRef<HTMLAnchorElement, { data: Announcement }>(({ data }, ref) => {
    // React.forwardRef<ref 的 type, props 的 type>((props, ref) => {})
    return (
        <Link
            ref={ref}
            href={`/post/${data.link}`}
            className='mb-2 block h-36 w-full md:rounded-xl md:bg-main-color-1 p-2 md:shadow-md border-b md:border-none'
        >
            <motion.div className='relative h-full' whileTap={{ scale: 0.95 }}>
                <div
                    className={clsx(
                        "absolute right-0 top-0 rounded-full bg-white p-1 text-red-500",
                        data.sticky ? "block" : "hidden"
                    )}
                >
                    {data.sticky ? <IconPinFilled size={20} /> : ""}
                </div>
                <motion.div
                    className='p-1'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {data.category}
                </motion.div>
                <motion.div
                    className='h-12 px-1 text-left md:text-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {data.title}
                </motion.div>
                <motion.div
                    className='flex w-full items-center px-1 max-xs:hidden md:justify-center space-x-1'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className='flex items-center'>
                        <IconCalendarTime size={20} />
                        <div className='pl-1'>{data.date}</div>
                    </div>
                    <div className='flex items-center'>
                        <IconCalendarOff size={20} />
                        <div className='pl-1'>{data.deadline}</div>
                    </div>
                </motion.div>
                <motion.div
                    className='absolute -bottom-1 left-0 flex flex-col items-center justify-center px-1 font-mono text-xs xs:hidden'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className='flex items-center'>
                        <IconCalendarTime size={16} />
                        <div className='pl-1'>{data.date}</div>
                    </div>
                    <div className='flex items-center'>
                        <IconCalendarOff size={16} />
                        <div className='pl-1'>{data.deadline}</div>
                    </div>
                </motion.div>
                <motion.div
                    className='absolute bottom-0 right-0 rounded-lg md:bg-white px-1 bg-main-color-1'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {data.unit}
                </motion.div>
            </motion.div>
        </Link>
    )
})

CardCP.displayName = "CardCP"

export default CardCP
