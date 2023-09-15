import Link from "next/link"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { cookies } from "next/headers"
import Fancybox from "@/components/fancybox"
import Avatar from "@/components/ui/avatar"
import getUser from "@/utils/user"
import getLineID from "@/utils/lineid"
import { User } from "@/types"
import {
    IconUserCircle,
    IconBrandLine,
    IconId,
    IconGenderBigender,
    IconCake,
    IconBuildingSkyscraper,
    IconDeviceMobile,
    IconDeviceLandlinePhone,
    IconHomeLink,
    IconTicket,
} from "@tabler/icons-react"
import { site } from "@/config/site"
import BottomToUpTransitionView from "@/components/transition/BottomToUpTransitionView"

// const getData = async () => {
//     const res = await fetch(`${site.url}/api/user`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${cookies().get("token")?.value}`,
//             Cookie: cookies().toString(),
//         },
//     })

//     return await res.json()
// }

const UserAboutPage = async () => {
    const session = await getServerSession(authOptions)
    const data: User = await getUser(session?.user.studentID as string)
    const lineID = await getLineID(session?.user.studentID as string)
    const formatDate = (date: string) => {
        // 0900928 -> 90/09/28
        // 若年份開頭為 0，則刪除 0

        let year = date.slice(0, 3)
        if (year[0] === "0") {
            year = year.slice(1)
        }
        const month = date.slice(3, 5)
        const day = date.slice(5, 7)

        return `${year}/${month}/${day}`
    }

    return (
        <>
            <div className='w-full p-2'>
                <BottomToUpTransitionView custom={0}>
                    <div className='mb-2 rounded-xl border p-2'>
                        <div className='relative flex items-center'>
                            <Fancybox
                                options={{
                                    Carousel: {
                                        infinite: false,
                                    },
                                }}
                            >
                                <a href={data.img} data-fancybox data-caption={data?.name}>
                                    <Avatar
                                        src={data.img}
                                        width={75}
                                        height={100}
                                        alt={data.name}
                                        fallback={
                                            <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                                                <IconUserCircle size={75} />
                                            </div>
                                        }
                                    />
                                </a>
                            </Fancybox>
                            <div className='absolute right-0 top-0 rounded-md bg-main-color-3 px-1 font-bold text-neutral-200'>
                                {data.status}
                            </div>
                            <div className='absolute bottom-0 right-0 rounded-md bg-main-color-3 px-1 text-neutral-200'>
                                {data.userid}
                            </div>
                            <div className='py-1 pl-4'>
                                <div>{data.name}</div>
                                <div>{data.enName}</div>
                                <div>{data.major}</div>
                                <div className='flex items-center space-x-2'>
                                    <div>{data.dept}</div>
                                    <div>{data.es + "　"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BottomToUpTransitionView>
                <BottomToUpTransitionView custom={1}>
                    <div className='mb-2 rounded-xl border p-2'>
                        <div className='py-1'>
                            <h1 className='text-xl font-bold mb-1'>基本資料</h1>
                            <div className='flex items-center space-x-1'>
                                <IconBrandLine />
                                <div>{lineID ? lineID.lineid : "未填寫 Line ID"}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconGenderBigender />
                                <div>{data.gender}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconId />
                                <div>{data.IDnumber}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconCake />
                                <div>{data.birthday ? formatDate(data.birthday) : "未填寫"}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconBuildingSkyscraper />
                                <div>{data.birthplace}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconDeviceMobile />
                                <div>{data.phone}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconDeviceLandlinePhone />
                                <div>{data.homePhone}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconHomeLink />
                                <div>{data.address}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconTicket />
                                <div>{data.date} 入學</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke-width='1.5'
                                    stroke='currentColor'
                                    className='w-6 h-6'
                                >
                                    <path
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        d='M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5'
                                    />
                                </svg>
                                <div>{data.previousEducation}</div>
                            </div>
                        </div>
                    </div>
                </BottomToUpTransitionView>
                <BottomToUpTransitionView custom={2}>
                    <div className='mb-2 rounded-xl border p-2'>
                        <div className='py-1'>
                            <h1 className='text-xl font-bold mb-1'>家長資料</h1>
                            <div className='flex items-center space-x-1'>
                                <div>{data.parentName}</div>
                                <div>{data.parentJob}</div>
                            </div>
                            <div>{data.parentAddress}</div>
                            <div>{data.parentPhone}</div>
                        </div>
                    </div>
                </BottomToUpTransitionView>
                <BottomToUpTransitionView custom={3}>
                    <div className='rounded-xl border p-2'>
                        <div className='py-1'>
                            <h1 className='text-xl font-bold mb-1'>自傳</h1>
                            <div className='whitespace-pre-line'>{data.desc}</div>
                        </div>
                    </div>
                </BottomToUpTransitionView>
            </div>
        </>
    )
}

export default UserAboutPage
