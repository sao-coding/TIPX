import Link from "next/link"
import Logo from "@/components/logo"
import { NAV_LINKS } from "@/config/links"

const Header = async () => {
    return (
        <header className='fixed top-3 z-10 mx-auto h-14 max-w-5xl hidden md:flex items-center justify-between rounded-2xl blur-background backdrop-blur-md shadow-sm px-4 py-2 inset-x-0 saturate-100 transition-colors duration-500'>
            <div className='flex items-center'>
                <Link href='/'>
                    <Logo className='h-8 w-40 fill-black dark:fill-white' />
                </Link>
            </div>
            <div className='flex items-center'>
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        title={link.text}
                        className='relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-0 after:rounded-full after:bg-black dark:after:bg-white after:transition-all after:duration-300 after:ease-in-out after:content-[""] hover:after:w-full'
                    >
                        <div className='mx-1 flex items-center justify-center'>
                            <link.icon size={26} />
                            <div className='px-1'>{link.text}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </header>
    )
}

export default Header
