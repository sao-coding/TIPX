"use client"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import Card from "@/components/home/card"
import Loading from "@/components/home/loading"
import { Announcement } from "@/types"

const AnnouncementCP = () => {
    const [data, setData] = useState<Announcement[]>([])
    const [hasMore, setHasMore] = useState(true)

    const fetchData = async () => {
        const res = await fetch(`/api/post?type=all&id=${data.length}&limit=10`)
        const json = await res.json()
        if (json.length === 0) {
            setHasMore(false)
            return
        }
        setData([...data, ...json])
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <>
            <InfiniteScroll
                dataLength={data.length}
                next={fetchData}
                hasMore={hasMore}
                loader={Array.from(Array(5).keys()).map((index) => (
                    <Loading key={index} />
                ))}
                endMessage={
                    <div className='mt-2 rounded-xl border bg-white text-center text-2xl font-bold shadow-md'>
                        已經到底啦~
                    </div>
                }
            >
                {data.map((item) => (
                    <Card key={item.link} data={item} />
                ))}
            </InfiniteScroll>
        </>
    )
}

export default AnnouncementCP
