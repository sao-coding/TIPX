import { cookies } from "next/headers"
import { IconCoins, IconStar } from "@tabler/icons-react"
import clsx from "clsx"
import Title from "@/components/Title"
import { SemGrade } from "@/types"
import { site } from "@/config/site"
import ScaleTransitionView from "@/components/transition/ScaleTransitionView"

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

    const title = {
        title: "科目成績",
        position: "text-center",
        close: true,
    }

    return (
        <div className='w-full px-2 mb-2'>
            <Title title={title} />
            <div className='grid w-full grid-cols-2 gap-2'>
                {data?.map((item, index) => (
                    <ScaleTransitionView key={index} custom={index}>
                        <div className='relative rounded-xl border p-2' key={index}>
                            <div
                                className={clsx(
                                    "absolute right-0 top-0 m-1 rounded-md px-1 font-bold text-white",
                                    typeColor[item.type]
                                )}
                            >
                                {item.type}
                            </div>
                            <div>{item.id}</div>
                            <div className='overflow-ellipsis line-clamp-1'>{item.name}</div>
                            <div>{item.category}</div>
                            <div className='flex items-center space-x-1'>
                                <IconCoins className='animate-pulse stroke-yellow-500' />
                                <div>{item.credit}</div>
                                <IconStar className='animate-pulse stroke-yellow-500' />
                                <div>{item.midtermGrade}</div>
                                <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                                <div>{item.finalGrade}</div>
                            </div>
                            <div className='overflow-ellipsis line-clamp-1'>{item.class}</div>
                        </div>
                    </ScaleTransitionView>
                ))}
            </div>
        </div>
    )
}

export default FinalGradePage
