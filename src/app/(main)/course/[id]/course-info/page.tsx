"use client"

import { useQuery } from "@tanstack/react-query"
import {
    IconAlertTriangle,
    IconUserStar,
    IconSelect,
    IconChalkboard,
    IconStar,
    IconSlash,
    IconClock,
    IconLanguageHiragana,
    IconArrowAutofitContent,
    IconWand,
    IconCertificate,
    IconCalendarEvent,
} from "@tabler/icons-react"
import clsx from "clsx"
import { CourseInfo } from "@/types"
import BottomToUpTransitionView from "@/components/transition/BottomToUpTransitionView"

const CourseInfoPage = ({ params }: { params: { id: string } }) => {
    const { data, isLoading } = useQuery<CourseInfo>({
        queryKey: ["course-info", params.id],
        queryFn: async () => {
            const res = await fetch(`/api/course-info?course=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            return data
        },
    })

    const typeColor: { [key: string]: string } = {
        必修: "bg-blue-500",
        選修: "bg-green-500",
        通識: "bg-yellow-500",
    }

    return (
        // <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        //     <img src='https://www.lazyweb.com.tw/images/coming_soon.jpg' alt='' />
        // </div>
        <div className=''>
            {isLoading ? (
                <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
                    <div className='flex h-full w-full items-center justify-center'>
                        <div className='cat'>
                            <div className='cat__body'></div>
                            <div className='cat__body'></div>
                            <div className='cat__tail'></div>
                            <div className='cat__head'></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='w-full'>
                    <div className='bg-orange-400/80 text-white/80 text-center p-1 rounded-lg border-l-4 border-orange-500 mb-2'>
                        <IconAlertTriangle className='inline-block mr-1' />
                        警告：本課程資訊爬蟲結果僅供參考
                        <br />
                        請以 TIP 系統為主！
                    </div>
                    {data && (
                        <div className='flex flex-col space-y-2'>
                            <BottomToUpTransitionView>
                                <div className='grid grid-cols-2 gap-1'>
                                    <div className='w-full rounded-lg border p-1 flex items-center'>
                                        <IconUserStar className='mr-1' />
                                        <div>{data.teacher}</div>
                                    </div>
                                    <div className='w-full rounded-lg border p-1 flex items-center'>
                                        <IconSelect className='mr-1' />
                                        <div
                                            className={clsx(
                                                "text-white rounded-lg px-1",
                                                typeColor[data.required]
                                            )}
                                        >
                                            {data.required}
                                        </div>
                                    </div>
                                    <div className='w-full rounded-lg border p-1 flex items-center'>
                                        <IconChalkboard className='mr-1' />
                                        {data.class}
                                    </div>
                                    <div className='w-full rounded-lg border p-1 flex items-center'>
                                        <div className='flex items-center'>
                                            <IconStar className='animate-pulse fill-yellow-500 stroke-yellow-500' />
                                            <IconSlash className='rotate-[160deg] -mx-1' />
                                            <IconClock className='mr-1' />
                                        </div>
                                        <div>{data.credit}</div>
                                    </div>
                                    <div className='w-full rounded-lg border p-1 flex items-center'>
                                        <IconLanguageHiragana className='mr-1' />
                                        <div>{data.foreign === "是" ? "✅" : "❌"}</div>
                                    </div>
                                    <div className='w-full rounded-lg border p-1 flex items-center'>
                                        <IconArrowAutofitContent className='mr-1' />
                                        <div>{data.distance === "是" ? "✅" : "❌"}</div>
                                    </div>
                                </div>
                            </BottomToUpTransitionView>
                            <BottomToUpTransitionView custom={1}>
                                <div className='whitespace-pre-line border p-1 rounded-lg'>
                                    <div className='flex items-center'>
                                        <IconWand className='mr-1' />
                                        <div className='text-lg font-bold'>授課方式：</div>
                                    </div>
                                    {data.method}
                                </div>
                            </BottomToUpTransitionView>
                            <BottomToUpTransitionView custom={2}>
                                <div className='whitespace-pre-line border p-1 rounded-lg'>
                                    <div className='flex items-center'>
                                        <IconCertificate className='mr-1' />
                                        <div className='text-lg font-bold'>評分方式：</div>
                                    </div>
                                    {data.assessment}
                                </div>
                            </BottomToUpTransitionView>
                            <BottomToUpTransitionView custom={3}>
                                <div className='whitespace-pre-line border p-1 rounded-lg'>
                                    <div className='flex items-center'>
                                        <IconCalendarEvent className='mr-1' />
                                        <div className='text-lg font-bold'>每週課程內容：</div>
                                    </div>
                                    {data.content.map((item) => (
                                        <div
                                            className='border-b last:border-b-0 mb-2 pb-2'
                                            key={item.week}
                                        >
                                            <div className=''>{item.week}</div>
                                            <div className=''>{item.content}</div>
                                            <div className=''>{item.remark}</div>
                                        </div>
                                    ))}
                                </div>
                            </BottomToUpTransitionView>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CourseInfoPage
