import Avatar from "@/components/ui/avatar"
import { IconUserCircle } from "@tabler/icons-react"

const InfoPage = () => {
    return (
        <>
            <div className='w-full p-2'>
                <div className='pb-2 text-4xl font-bold w-full text-center'>貢獻</div>
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
                        <div className='font-bold'>Umar-Turdiev</div>
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
                        <div className='font-bold'>Meriser</div>
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
