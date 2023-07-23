import Fancybox from "@/components/fancybox"
import { cookies } from "next/headers"
import Avatar from "@/components/ui/avatar"
import clsx from "clsx"
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
                        <div className='absolute right-0 top-0 rounded-md bg-amber-500 px-1 font-bold text-neutral-200'>
                            {data.status}
                        </div>
                        <div className='absolute bottom-0 right-0 rounded-md bg-amber-500 px-1 text-neutral-200'>
                            {data.userid}
                        </div>
                        <div className='py-1 pl-4'>
                            <div className='flex items-center'>
                                <div className='pr-1'>{data.name}</div>
                                <div className='pl-1'>{data.enName}</div>
                            </div>
                            <div className=''>{data.IDnumber}</div>
                            <div className=''>{data.major}</div>
                            <div className='flex items-center'>
                                <div className='pr-1'>{data.dept}</div>
                                <div className='pl-1'>{data.es}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mb-2 rounded-xl border p-2'>
                    <div className='py-1'>
                        <div className='flex items-center'>
                            <IconId />
                            <div className='px-1'>{data.IDnumber}</div>
                        </div>
                        <div className='flex items-center'>
                            <IconGenderBigender />
                            <div className='px-1'>{data.gender}</div>
                        </div>
                        <div className='flex items-center'>
                            <IconCake />
                            <div className='px-1'>
                                {data.birthday ? formatDate(data.birthday) : "未填寫"}
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <IconBuildingSkyscraper />
                            <div className='px-1'>{data.birthplace}</div>
                        </div>
                        <div className='flex items-center'>
                            <IconDeviceMobile />
                            <div className='px-1'>{data.phone}</div>
                        </div>
                        <div className=''>{data.address}</div>
                        <div className=''>{data.homePhone}</div>
                        <div className=''>{data.date}</div>
                        <div className=''>{data.previousEducation}</div>
                    </div>
                </div>
                <div className='mb-2 rounded-xl border p-2'>
                    <div className='py-1'>
                        <div className='flex items-center'>
                            <div className=''>{data.parentName}</div>
                            <div className='px-1'>{data.parentJob}</div>
                        </div>
                        <div className=''>{data.parentAddress}</div>
                        <div className=''>{data.parentPhone}</div>
                    </div>
                </div>
                <div className='rounded-xl border p-2'>
                    <div className='py-1'>
                        <div className=''>{data.desc}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserAboutPage
