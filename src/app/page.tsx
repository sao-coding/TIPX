import Announcement from "@/components/home/announcement"
import LoadingPage from "@/app/loading"
import InfiniteScroll from "react-infinite-scroll-component"
import Card from "@/components/home/card"
import { Post } from "@/types"

const HomePage = () => {
    return (
        <div className='w-full p-3'>
            <div className='rounded-xl border bg-white text-center text-2xl font-bold shadow-md'>
                學校公告
            </div>
            <Announcement />
        </div>
    )
}

export default HomePage
