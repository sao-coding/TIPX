import { cookies } from "next/headers"
import { IconCoins, IconStar } from "@tabler/icons-react"
import clsx from "clsx"
import { SemGrade } from "@/types"
import { site } from "@/config/site"

const getData = async () => {
    const res = await fetch(`${site.url}/api/sem-grade`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies().get("token")?.value}`,
            Cookie: cookies().toString(),
        },
    })

    if (!res.ok) {
        throw new Error("獲取資料失敗")
    }

    return res.json()
}

const FinalGradePage = async () => {
    const data: SemGrade[] = await getData()
    // console.log({ data })
    // 選修 or 必修 or 通識
    const typeColor: { [key: string]: string } = {
        必修: "bg-blue-500",
        選修: "bg-green-500",
        通識: "bg-yellow-500",
    }

    return (
        <div className='w-full p-2'>
            <div className='grid w-full grid-cols-2 gap-2'>
                {data?.map((item, index) => (
                    <div className='relative rounded-xl border p-2 shadow-md'>
                        <div
                            className={clsx(
                                "absolute right-0 top-0 m-1 rounded-md px-1 font-bold text-white",
                                typeColor[item.type]
                            )}
                        >
                            {item.type}
                        </div>
                        <div className=''>{item.id}</div>
                        <div className=''>{item.name}</div>
                        <div className=''>{item.category}</div>

                        {/* <div className='flex items-center'> */}
                        <div className='flex items-center'>
                            <IconCoins className='animate-pulse stroke-yellow-500' />
                            <div className='px-1'>{item.credit}</div>
                            <IconStar className='animate-pulse stroke-yellow-500' />
                            <div className='px-1'>{item.midtermGrade}</div>
                            {/* </div>
                            <div className='flex items-center'> */}
                            <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                            <div className='px-1'>{item.finalGrade}</div>
                        </div>
                        {/* </div> */}
                        <div className=''>{item.class}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FinalGradePage
