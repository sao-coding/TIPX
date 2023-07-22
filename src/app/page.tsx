import AnnouncementCP from "@/components/home/announcement"

const HomePage = () => {
    return (
        <div className='w-full px-3'>
            <div className='mb-2 rounded-xl border bg-white text-center text-2xl font-bold shadow-md'>
                學校公告
            </div>
            <AnnouncementCP />
        </div>
    )
}

export default HomePage
