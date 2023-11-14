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

    return (
        <div className='w-full px-2 mb-2'>
            <Title title={title} />
            {/* 提交總次數: {data.length} */}
            <div className='sticky left-0 top-0 w-full text-center border rounded-xl p-2 mb-2 bg-slate-50'>
                <div className=''>提交總次數: {data.length}</div>
                <div className=''>
                    最後提交時間: {new Date(data[0].date).toLocaleString("zh-TW")}
                </div>
            </div>
            {data && (
                <div className='flex flex-col space-y-2'>
                    {data.map((item) => (
                        <div key={item.hash} className='border rounded-xl p-2'>
                            <h2>{item.subject}</h2>
                            <p>{new Date(item.date).toLocaleString("zh-TW")}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default GitLogPage
