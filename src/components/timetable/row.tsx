import { OutTimeTable } from "@/types"

const row = ({ data }: { data: OutTimeTable }) => {
    const item = () => {
        const item = []
        for (let i = 0; i < 14; i++) {
            item.push(
                <div className='table-row' key={i}>
                    {data?.timetable[i].map((item, index) => (
                        <div
                            className='pb-6 relative table-cell bg-main-color p-2 border-r border-t border-main-color-3 first:border-l-0 last:border-r-0'
                            key={index}
                        >
                            <div className='absolute bottom-1 right-1 table-cell bg-[#ffffff6c] whitespace-nowrap text-center px-1 rounded-md'>
                                <div className=''>{i + 1}</div>
                            </div>
                            {item.map((item, index) => (
                                <div className='text-center' key={index}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )
        }
        return item
    }
    return <>{item()}</>
}

export default row
