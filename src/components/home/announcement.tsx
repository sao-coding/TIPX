"use client"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import Card from "@/components/home/card"
import Loading from "@/components/home/loading"
import { Post } from "@/types"

const HomePage = () => {
    const [data, setData] = useState<Post[]>([])
    const [hasMore, setHasMore] = useState(true)

    const fetchData = async () => {
        const res = await fetch(`/api/post?id=${data.length}&limit=10`)
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

export default HomePage
