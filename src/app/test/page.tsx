"use client"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Post } from "@/types"

const Test: React.FC = () => {
    const [data, setData] = useState<Post[]>([])
    const [hasMore, setHasMore] = useState(true)

    const fetchData = async () => {
        const res = await fetch(`/api/post?id=${data.length}&limit=20`)
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
        <div>
            <h1>Infinite Scroll Example</h1>
            <InfiniteScroll
                dataLength={data.length}
                next={fetchData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<h4>End of the list</h4>}
            >
                {data.map((item, index) => (
                    <div key={index}>
                        <div className=''>{index}</div>
                        <div className=''>{item.title}</div>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
}

export default Test
