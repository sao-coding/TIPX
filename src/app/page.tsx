import Link from "next/link"
import clsx from "clsx"

import IconLogoText from "@/components/icons/logo-text"
import { USER_LINKS } from "@/config/links"
import getSearchAuth from "@/utils/search-auth"
import { IconBookDownload } from "@tabler/icons-react"

import Hw from "./hw"
const HomePage = async () => {
  const searchAuth = await getSearchAuth("D11019139")

  const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

  return (
    <div className='flex h-dvh'>
      <div className='relative h-dvh w-[250px] space-y-2 overflow-auto'>
        <div className='sticky top-0 z-10 bg-background py-6'>
          <IconLogoText className='h-8 w-full' />
        </div>
        <div className='flex flex-col gap-2 px-2 pb-6'>
          {USER_LINKS.map((link, index) =>
            // 若為查詢用戶 && 日誌中心，則要判斷是否顯示
            (link.text === "查詢用戶" && !searchAuth) ||
            (link.text === "日誌中心" && "D11019139" !== process.env.ADMINSTUDENTID) ||
            (link.text === "註冊名單" && "D11019139" !== process.env.ADMINSTUDENTID) ? null : (
              <Link
                key={index}
                href={link.href}
                className='block w-full rounded-xl p-2 hover:bg-accent hover:text-accent-foreground'
              >
                <div className='flex items-center'>
                  <link.icon className={clsx(link.color, link.className)} />
                  <div className='ml-2'>{link.text}</div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
      <div className='flex-1 border'>內容</div>
      <div className='h-dvh w-[350px] p-4'>
        <div className='overflow-hidden rounded-xl'>
          <header className='flex items-center gap-1 bg-background1 px-3 py-2'>
            <IconBookDownload className='h-6 w-6' />
            未完成作業
          </header>
          <div className='h-56 bg-background2'>
            <Hw />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
