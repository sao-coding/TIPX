import { cookies } from "next/headers"
import Fancybox from "@/components/fancybox"
import Avatar from "@/components/ui/avatar"
import { User } from "@/types"
import {
    IconUserCircle,
    IconId,
    IconGenderBigender,
    IconCake,
    IconBuildingSkyscraper,
    IconDeviceMobile,
} from "@tabler/icons-react"
import { site } from "@/config/site"
import BottomToUpTransitionView from "@/components/transition/BottomToUpTransitionView"

const getData = async () => {
    const res = await fetch(`${site.url}/api/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("token")?.value}`,
            Cookie: cookies().toString(),
        },
    })

    return await res.json()
}

const UserAboutPage = async () => {
    const data: User = await getData()
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
                                <div className='flex items-center space-x-2'>
                                    <div>{data.name}</div>
                                    <div>{data.enName}</div>
                                </div>
                                <div>{data.IDnumber}</div>
                                <div>{data.major}</div>
                                <div className='flex items-center space-x-2'>
                                    <div>{data.dept}</div>
                                    <div>{data.es}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BottomToUpTransitionView>
                <BottomToUpTransitionView custom={1}>
                    <div className='mb-2 rounded-xl border p-2'>
                        <div className='py-1'>
                            <div className='flex items-center space-x-1'>
                                <IconId />
                                <div>{data.IDnumber}</div>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <IconGenderBigender />
                                <div>{data.gender}</div>
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
                            <div>{data.address}</div>
                            <div>{data.homePhone}</div>
                            <div>{data.date}</div>
                            <div>{data.previousEducation}</div>
                        </div>
                    </div>
                </BottomToUpTransitionView>
                <BottomToUpTransitionView custom={2}>
                    <div className='mb-2 rounded-xl border p-2'>
                        <div className='py-1'>
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
                            <div>{data.desc}</div>
                        </div>
                    </div>
                </BottomToUpTransitionView>
            </div>
        </>
    )
}

export default UserAboutPage
