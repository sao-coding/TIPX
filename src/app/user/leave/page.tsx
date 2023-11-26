import LeaveTabs from "./tabs"
import Title from "@/components/Title"

const LeavePage = () => {
    const title = {
        title: "線上請假",
        position: "text-center",
        close: true,
    }

    return (
        <div className='w-full md:rounded-md md:bg-white px-2 md:p-4 md:shadow-md'>
            <Title title={title} />
            <div className='px-2'>
                <LeaveTabs />
            </div>
        </div>
    )
}

export default LeavePage
