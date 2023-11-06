import { IconUserCircle } from "@tabler/icons-react"
import Avatar from "@/components/ui/avatar"
import Title from "@/components/Title"
import Count from "./count"

const InfoPage = () => {
    const title = {
        title: "關於",
        position: "text-center",
        close: true,
    }

    return (
        <>
            <div className='w-full px-2'>
                <Title title={title} />
                <Count />
                <h1 className='py-2 text-4xl font-bold w-full text-center'>警告</h1>
                <div className='text-center'>
                    此網站為非官方網站，為個人作品
                    <br />
                    不代表任何學校或組織的意見
                    <br />
                    使用本網站{" "}
                    <span className='bg-main-color-2 px-1 py-0.5 rounded-lg'>tip.sao-x.com</span>
                    <div className='text-red-500'>若有任何損失，本網站概不負責！</div>
                </div>
                <h1 className='py-2 text-4xl font-bold w-full text-center'>貢獻</h1>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    <div className='flex w-full flex-col items-center justify-center'>
                        <Avatar
                            className='h-20 w-20 rounded-full'
                            src='https://avatars.githubusercontent.com/u/75498339'
                            width={75}
                            height={100}
                            alt='大頭貼'
                            fallback={
                                <div className='flex h-20 w-20 items-center justify-center rounded-full shadow-md'>
                                    <IconUserCircle size={75} />
                                </div>
                            }
                        />
                        <div className='font-bold'>Hong</div>
                        <a
                            className='rounded-md bg-main-color-1 px-1'
                            href='https://github.com/tszhong0411'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            tszhong0411
                        </a>
                    </div>
                    <div className='flex w-full flex-col items-center justify-center'>
                        <Avatar
                            className='h-20 w-20 rounded-full'
                            src='https://avatars.githubusercontent.com/u/75288307?v=4'
                            width={75}
                            height={100}
                            alt='大頭貼'
                            fallback={
                                <div className='flex h-20 w-20 items-center justify-center rounded-full shadow-md'>
                                    <IconUserCircle size={75} />
                                </div>
                            }
                        />
                        <div className='font-bold'>UT</div>
                        <a
                            className='rounded-md bg-main-color-1 px-1'
                            href='https://github.com/Umar-Turdiev'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Umar-Turdiev
                        </a>
                    </div>
                    <div className='flex w-full flex-col items-center justify-center'>
                        <Avatar
                            className='h-20 w-20 rounded-full'
                            src='https://avatars.githubusercontent.com/u/86524421?v=4'
                            width={75}
                            height={100}
                            alt='大頭貼'
                            fallback={
                                <div className='flex h-20 w-20 items-center justify-center rounded-full shadow-md'>
                                    <IconUserCircle size={75} />
                                </div>
                            }
                        />
                        <div className='font-bold'>Meri</div>
                        <a
                            className='rounded-md bg-main-color-1 px-1'
                            href='https://github.com/Meriser'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Meriser
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InfoPage
