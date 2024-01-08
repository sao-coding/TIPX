"use client"

import { useState, useEffect } from "react"
import { IconPaint, IconSelector, IconDeviceDesktop, IconSun, IconMoon } from "@tabler/icons-react"
import { Listbox } from "@headlessui/react"
import Title from "@/components/Title"

const SettingsPage = () => {
    const [theme, setTheme] = useState("system")

    useEffect(() => {
        if (localStorage.theme === "dark") {
            setTheme("dark")
        } else if (localStorage.theme === "light") {
            setTheme("light")
        } else {
            setTheme("system")
        }
    }, [])

    const title = {
        title: "設定",
        position: "text-center",
        close: true,
    }

    return (
        <>
            {/* 跟隨系統 明亮模式 暗黑模式 */}
            {/* 主題 */}
            <div className='w-full px-2 mb-2'>
                <Title title={title} />
                <div className='px-2'>
                    <div className='relative flex justify-between items-center'>
                        <div className='flex items-center space-x-2'>
                            <IconPaint className='stroke-pink-500' />
                            <div>主題</div>
                        </div>
                        <Listbox
                            value={theme}
                            onChange={(e) => {
                                setTheme(e)
                                // document.documentElement.classList.add("dark")
                                if (e === "dark") {
                                    document.documentElement.classList.add("dark")
                                    localStorage.setItem("theme", e)
                                } else if (e === "light") {
                                    document.documentElement.classList.remove("dark")
                                    localStorage.setItem("theme", e)
                                } else {
                                    // 跟隨系統
                                    // 判斷系統主題
                                    localStorage.removeItem("theme")
                                    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                                        // 系統暗黑模式
                                        document.documentElement.classList.add("dark")
                                    } else {
                                        // 系統明亮模式
                                        document.documentElement.classList.remove("dark")
                                    }
                                }
                            }}
                        >
                            <Listbox.Button className='bg-card-background rounded-lg p-1 flex items-center justify-start md:border h-8'>
                                <IconSelector />
                                {theme === "system" && (
                                    <div className='flex items-center space-x-1'>
                                        <IconDeviceDesktop />
                                        <div>跟隨系統</div>
                                    </div>
                                )}
                                {theme === "light" && (
                                    <div className='flex items-center space-x-1'>
                                        <IconSun className='text-orange-500' />
                                        <div>明亮模式</div>
                                    </div>
                                )}
                                {theme === "dark" && (
                                    <div className='flex items-center space-x-1'>
                                        <IconMoon className='text-yellow-500' />
                                        <div>暗黑模式</div>
                                    </div>
                                )}
                            </Listbox.Button>
                            <Listbox.Options className='bg-card-background shadow-md p-2 rounded-lg absolute top-10 right-0 z-10 flex flex-col space-y-2'>
                                <Listbox.Option value='system'>
                                    <div className='flex items-center space-x-1'>
                                        <IconDeviceDesktop />
                                        <div>跟隨系統</div>
                                    </div>
                                </Listbox.Option>
                                <Listbox.Option value='light'>
                                    <div className='flex items-center space-x-1'>
                                        <IconSun className='text-orange-500' />
                                        <div>明亮模式</div>
                                    </div>
                                </Listbox.Option>
                                <Listbox.Option value='dark'>
                                    <div className='flex items-center space-x-1'>
                                        <IconMoon className='text-yellow-500' />
                                        <div>暗黑模式</div>
                                    </div>
                                </Listbox.Option>
                            </Listbox.Options>
                        </Listbox>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SettingsPage
