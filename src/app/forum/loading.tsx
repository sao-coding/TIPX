import clsx from "clsx"

import { IconUser } from "@tabler/icons-react"

const Loading = ({ index }: { index: number }) => {
  return (
    <div
      className={clsx(
        "mb-2 flex animate-pulse flex-col",
        index % 2 === 0 ? "items-end" : "items-start"
      )}
    >
      <div className='flex items-center px-1 py-1'>
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-300'>
          <IconUser />
        </div>

        {/* <div className='ml-1 bg-slate-200 w-14 h-4 rounded-full'></div> */}
      </div>
      <div className='h-10 w-40 max-w-xl whitespace-pre-line break-words rounded-2xl border bg-card-background p-2'></div>
      {/* <div className='m-1 bg-slate-200 w-28 h-3 rounded-full'></div> */}
    </div>
  )
}

export default Loading
