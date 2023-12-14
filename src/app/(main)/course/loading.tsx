import Title from "@/components/Title"

const Loading = () => {
    const title = {
        title: "課程",
        position: "text-center",
        close: false,
    }

    return (
        <div className='w-full rounded-md px-2 pb-2 mb-14 md:bg-white md:p-4 md:shadow-md'>
            <Title title={title} />
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                {Array.from(Array(12).keys()).map((index) => (
                    <div key={index}>
                        <div className='flex flex-col space-y-2 rounded-lg border p-2 ripple h-20 w-full justify-between'>
                            <div className='animate-pulse bg-gray-300 rounded-lg h-5 w-1/2'></div>
                            <div className='flex justify-between h-4'>
                                <div className='animate-pulse bg-gray-300 rounded-lg w-1/2'></div>
                                <div className='animate-pulse bg-gray-300 rounded-lg w-1/4'></div>
                            </div>
                        </div>
                        <div className='h-7 rounded-lg border ripple mt-1 w-full flex justify-center items-center'>
                            <div className='animate-pulse bg-gray-300 rounded-lg h-3 w-10'></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Loading
