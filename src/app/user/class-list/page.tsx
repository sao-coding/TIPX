import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import Fancybox from "@/components/fancybox"
import Avatar from "@/components/ui/avatar"
import Title from "@/components/Title"
import getClassList from "@/utils/class-list"
import { IconUserCircle } from "@tabler/icons-react"

const ClassListPage = async () => {
    const tite = {
        title: "班級名單",
        position: "text-center",
        close: true,
    }

    const session = await getServerSession(authOptions)

    const item = await getClassList(session?.user.studentID ?? "")

    return (
        <div className='px-2 w-full mb-2'>
            <Title title={tite} />
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                {item.length > 0 &&
                    item.map((item) => (
                        <div
                            key={item.id}
                            className='p-2 border rounded-xl flex justify-between w-full'
                        >
                            <div className='flex items-center'>
                                <Fancybox
                                    options={{
                                        Carousel: {
                                            infinite: false,
                                        },
                                    }}
                                >
                                    <a href={item.img} data-fancybox data-caption={item.name}>
                                        <Avatar
                                            src={item.img}
                                            width={75}
                                            height={100}
                                            alt={item.name}
                                            fallback={
                                                <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                                    <IconUserCircle size={75} />
                                                </div>
                                            }
                                        />
                                    </a>
                                </Fancybox>
                            </div>
                            <div className='flex flex-col justify-between'>
                                <div>
                                    <div>{item.id}</div>
                                    <div>{item.name}</div>
                                    <div>{item.gender}</div>
                                </div>
                                {/* <button className=' bg-main-color-2 rounded-lg hover:text-main-color-2 hover:bg-white transition duration-300 px-2 py-1 hover:border-main-color-2 border border-main-color-2'>
                                    詳細資料
                                </button> */}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ClassListPage
