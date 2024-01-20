import Title from "@/components/Title"

const Loading = () => {
  const title = {
    title: "課程",
    position: "text-center",
    close: false
  }

  return (
    <div className='mb-14 w-full rounded-md px-2 pb-2 md:top-[68px] md:bg-card-background md:p-4 md:shadow-md'>
      <Title title={title} />
      <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
        {Array.from(Array(12).keys()).map((index) => (
          <div key={index}>
            <div className='ripple flex h-20 w-full flex-col justify-between space-y-2 rounded-lg border p-2 dark:border-none dark:bg-main-color-1'>
              <div className='h-5 w-1/2 animate-pulse rounded-lg bg-gray-300'></div>
              <div className='flex h-4 justify-between'>
                <div className='w-1/2 animate-pulse rounded-lg bg-gray-300'></div>
                <div className='w-1/4 animate-pulse rounded-lg bg-gray-300'></div>
              </div>
            </div>
            <div className='ripple mt-1 flex h-7 w-full items-center justify-center rounded-lg border'>
              <div className='h-3 w-10 animate-pulse rounded-lg bg-gray-300'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading
