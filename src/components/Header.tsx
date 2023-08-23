import Link from "next/link"
import Logo from "@/components/logo"
import { NAV_LINKS } from "@/config/links"

const Header = async () => {
    return (
        <header className='fixed z-10 hidden h-14 w-full items-center justify-between bg-main-color-3 px-2 md:flex'>
            <div className='flex items-center'>
                <Link href='/'>
                    <Logo className='h-10 w-40 fill-white/80' />
                </Link>
            </div>
            <div className='flex items-center'>
                {NAV_LINKS.map((link) => (
                    <Link
                        href={link.href}
                        key={link.href}
                        className='relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-0 after:rounded-full after:bg-main-color-1 after:transition-all after:duration-300 after:ease-in-out after:content-[""] hover:after:w-full'
                    >
                        <div className='mx-1 flex items-center justify-center'>
                            <link.icon size={26} className='stroke-white/80' />
                            <div className='px-1 text-white/80'>{link.text}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </header>
    )
}

export default Header
