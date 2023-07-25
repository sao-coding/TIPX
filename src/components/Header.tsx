import Link from "next/link"
import { IconHome, IconBook2, IconCalendarEvent, IconUser } from "@tabler/icons-react"
import Logo from "@/components/logo"

const Header = async () => {
    return (
        <header className='fixed z-10 hidden h-14 w-full items-center justify-between bg-main-color-3 px-2 md:flex'>
            <div className='flex items-center'>
                <Link href='/'>
                    <Logo className='h-10 w-40 fill-black' />
                </Link>
            </div>
            <div className='flex items-center'>
                <Link
                    href='/'
                    className='relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-0 after:rounded-full after:bg-main-color after:transition-all after:duration-300 after:ease-in-out after:content-[""] hover:after:w-full'
                >
                    <div className='mx-1 flex items-center justify-center'>
                        <IconHome size={26} />
                        <div className='px-1'>首頁</div>
                    </div>
                </Link>
                <Link
                    href='/timetable'
                    className='relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-0 after:rounded-full after:bg-main-color after:transition-all after:duration-300 after:ease-in-out after:content-[""] hover:after:w-full'
                >
                    <div className='mx-1 flex items-center justify-center'>
                        <IconCalendarEvent size={26} />
                        <div className='px-1'>課表</div>
                    </div>
                </Link>
                <Link
                    href='/course'
                    className='relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-0 after:rounded-full after:bg-main-color after:transition-all after:duration-300 after:ease-in-out after:content-[""] hover:after:w-full'
                >
                    <div className='mx-1 flex items-center justify-center'>
                        <IconBook2 size={26} />
                        <div className='px-1'>修課</div>
                    </div>
                </Link>
                <Link
                    href='/user'
                    className='relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-0 after:rounded-full after:bg-main-color after:transition-all after:duration-300 after:ease-in-out after:content-[""] hover:after:w-full'
                >
                    <div className='mx-1 flex items-center justify-center'>
                        <IconUser size={26} />
                        <div className='px-1'>個人</div>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Header
