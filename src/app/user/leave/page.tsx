import LeaveTabs from "./tabs"
import Title from "@/components/Title"

const LeavePage = () => {
    const title = {
        title: "線上請假",
        position: "text-center",
        close: true,
    }

    return (
        <div className='w-full md:rounded-md md:bg-white px-4 md:p-4 md:shadow-md'>
            <Title title={title} />
            <LeaveTabs />
        </div>
    )
}

export default LeavePage
