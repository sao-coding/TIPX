import getGitLog from "@/utils/git-log"
import Title from "@/components/Title"
import { Commit } from "git-log"

const GitLogPage = async () => {
    const title = {
        title: "更新日誌",
        position: "text-center",
        close: true,
    }

    const data: Commit[] = await getGitLog()

    let lastYear = new Date(data[0].date).getFullYear()
    let lastMonth =
        new Date(
            new Date(data[0].date).toLocaleString("en-US", { timeZone: "Asia/Taipei" })
        ).getMonth() + 1
    console.log("###", lastMonth)
    return (
        <div className='w-full px-2 mb-2'>
            <Title title={title} />
            {/* 提交總次數: {data.length} */}
            <div className='sticky left-0 top-0 md:top-14 z-10 px-2 pb-2 md:p-0'>
                <div className='w-full text-center border rounded-xl p-2 mb-2 bg-slate-50'>
                    <div className='flex justify-center items-center space-x-16'>
                        <div className=''>提交總次數: {data.length}</div>
                        <div className=''>
                            耗時:{" "}
                            {Math.floor(
                                (new Date(data[0].date).getTime() -
                                    new Date(data[data.length - 1].date).getTime()) /
                                    1000 /
                                    60 /
                                    60 /
                                    24
                            )}{" "}
                            天
                        </div>
                    </div>
                    <div className=''>
                        最後提交時間:{" "}
                        {new Date(data[0].date).toLocaleString("zh-TW", {
                            timeZone: "Asia/Taipei",
                        })}
                    </div>
                </div>
            </div>
            {data && (
                <div className='pl-4'>
                    <ul className='flex flex-col space-y-2 border-l-4 border-main-color-2 p-2 md:pr-0'>
                        {data.map((item, index) => (
                            // 依照年分月份分類
                            <>
                                {/* {new Date(item.date).getFullYear() !==
                                    new Date(data[0].date).getFullYear() && (
                                    <>
                                        <li className='text-center text-xl font-bold'>
                                            {new Date(item.date).getFullYear()}
                                        </li>
                                        <li className='text-center text-xl font-bold'>
                                            {new Date(item.date).getMonth() + 1} 月
                                        </li>
                                    </>
                                )} */}
                                {/* 轉 utc+8 在判斷月份 */}
                                {/* {console.log(
                                    "###",
                                    item.subject,
                                    "lastMonth:",
                                    lastMonth,
                                    new Date(item.date).getMonth() + 1,
                                    new Date(item.date).getHours()
                                )} */}
                                {new Date(
                                    new Date(item.date).toLocaleString("en-US", {
                                        timeZone: "Asia/Taipei",
                                    })
                                ).getMonth() +
                                    1 !==
                                    lastMonth &&
                                    ((lastMonth =
                                        new Date(
                                            new Date(item.date).toLocaleString("en-US", {
                                                timeZone: "Asia/Taipei",
                                            })
                                        ).getMonth() + 1),
                                    (
                                        <li
                                            key={index}
                                            className='ml-1 relative px-1 py-2 after:content-[""] after:block after:w-4 after:h-4 after:rounded-full after:absolute after:-left-[23px] after:top-1/2 after:transform after:-translate-y-1/2 after:bg-main-color-1 after:border-4 after:border-main-color-3 after:shadow-lg'
                                        >
                                            <div className='relative flex justify-center text-center text-xl font-bold before:content-[""] before:block before:w-full before:h-0 before:border before:absolute before:top-1/2'>
                                                <div className='relative bg-slate-50 px-2'>
                                                    {new Date(item.date).getMonth() + 1} 月
                                                </div>
                                            </div>
                                        </li>
                                    ))}

                                <li
                                    key={item.hash}
                                    className='ml-1 relative border rounded-xl p-2 after:content-[""] after:block after:w-4 after:h-4 after:rounded-full after:absolute after:-left-[23px] after:top-1/2 after:transform after:-translate-y-1/2 after:bg-main-color-1 after:border-4 after:border-main-color-3 after:shadow-lg'
                                >
                                    <h2>{item.subject}</h2>
                                    <p>
                                        {new Date(item.date).toLocaleString("zh-TW", {
                                            timeZone: "Asia/Taipei",
                                        })}
                                    </p>
                                </li>
                            </>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default GitLogPage
