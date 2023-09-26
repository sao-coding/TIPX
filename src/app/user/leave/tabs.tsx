"use client"

import * as Tabs from "@radix-ui/react-tabs"
import { motion } from "framer-motion"
import Leave from "./leave"
import List from "./list"

const LeaveTabs = () => {
    return (
        <Tabs.Root defaultValue='請假'>
            <div className='sticky left-0 top-0 bg-slate-50 z-10 md:bg-white md:top-14'>
                <Tabs.List className='flex justify-around border-b border-main-color-3 relative py-1 -mt-2'>
                    <Tabs.Trigger
                        className='w-full p-2 peer/tabs-請假'
                        value='請假'
                        id={"tabs-請假"}
                    >
                        請假
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className='w-full p-2 peer/tabs-列表'
                        value='列表'
                        id={"tabs-列表"}
                    >
                        列表
                    </Tabs.Trigger>
                    <motion.div
                        id='tabs-line'
                        className='absolute bottom-0 left-0 h-1 border-b-[3px] border-main-color-2 flex w-1/2 peer-aria-selected/tabs-請假:translate-x-0 peer-aria-selected/tabs-列表:translate-x-full duration-300 ease-in-out'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                </Tabs.List>
            </div>
            <Tabs.Content
                className='mb-14 rounded-b-md pt-2'
                value='請假'
                aria-labelledby='請假'
                id='請假'
            >
                <Leave />
            </Tabs.Content>
            <Tabs.Content
                className='mb-14 rounded-b-md pt-2'
                value='列表'
                aria-labelledby='列表'
                id='列表'
            >
                <List />
            </Tabs.Content>
        </Tabs.Root>
    )
}

export default LeaveTabs
