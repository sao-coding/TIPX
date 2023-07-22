import Avatar from "@/components/ui/avatar"
import { IconUserCircle } from "@tabler/icons-react"

const InfoPage = () => {
    return (
        <>
            <div className='flex w-full flex-col items-center justify-center p-2'>
                <div className='pb-2 text-4xl font-bold'>貢獻</div>
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
                        className='rounded-md bg-main-color px-1'
                        href='https://github.com/tszhong0411'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        tszhong0411
                    </a>
                </div>
            </div>
        </>
    )
}

export default InfoPage
