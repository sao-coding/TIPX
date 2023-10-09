import AnnouncementCP from "@/app/components/announcement"
import Title from "@/components/Title"

const HomePage = () => {
    const title = {
        title: "學校公告",
        position: "text-center",
        close: false,
    }
    return (
        <>
            <div className='w-full px-3 pb-2 mb-14'>
                {/* <div className='mb-2 md:rounded-xl md:border md:bg-white text-center text-2xl font-bold md:shadow-sm border-b'>
                學校公告
            </div> */}
                <Title title={title} />
                <AnnouncementCP />
            </div>
        </>
    )
}

export default HomePage
