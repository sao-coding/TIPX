import { cookies } from "next/headers"
import { IconUserStar, IconStar, IconCrown } from "@tabler/icons-react"
import clsx from "clsx"
import { FinalGradeRank } from "@/types"
import { site } from "@/config/site"
import ScaleTransitionView from "@/components/transition/ScaleTransitionView"

const getData = async () => {
    const res = await fetch(`${site.url}/api/final-grade`, {
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
    const data: FinalGradeRank[] = await getData()
    // 班排前三名顏色
    const rankColor: { [key: number]: string } = {
        1: "text-amber-500",
        2: "text-red-500",
        3: "text-blue-500",
    }

    return (
        <div className='mb-14 w-full p-2'>
            <div className='grid w-full grid-cols-2 gap-2'>
                {data?.map((item, index) => (
                    <ScaleTransitionView key={index} custom={index}>
                        <div className='relative h-24 w-full rounded-xl border p-1 shadow-md'>
                            <div className='absolute left-0 top-0 p-1 text-5xl text-neutral-300'>
                                {item.year}
                            </div>
                            {/* <div className='absolute bottom-0 right-0 pr-2 text-2xl text-neutral-300'>
                                {item.sem}
                            </div> */}
                            <div
                                className={clsx(
                                    "absolute right-0 top-0 p-1 text-4xl font-bold",
                                    rankColor[item.rank]
                                )}
                            >
                                {item.rank === 0 ? "?" : <>{item.rank}</>}
                            </div>
                            <div className='absolute right-0 top-0'>
                                {item.rank <= 3 && item.rank !== 0 && (
                                    <IconCrown className='origin-top-right translate-x-3 translate-y-2 rotate-45 animate-pulse fill-amber-500 stroke-amber-500' />
                                )}
                            </div>
                            <div className='absolute bottom-0 left-0 flex w-full items-center justify-between p-1'>
                                <div className='flex items-center pr-1'>
                                    <IconUserStar className='animate-pulse stroke-yellow-500' />
                                    {item.conduct.score === 0 ? "?" : item.conduct.score.toFixed(2)}
                                </div>
                                <div className='flex items-center pl-1'>
                                    <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                                    {item.avg === 0 ? "?" : item.avg}
                                </div>
                                <div className='px-2 text-2xl text-neutral-300'>{item.sem}</div>
                            </div>
                        </div>
                    </ScaleTransitionView>
                ))}
            </div>
        </div>
    )
}

export default FinalGradePage
