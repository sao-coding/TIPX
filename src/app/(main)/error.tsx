"use client"

import Link from "next/link"

// export default function GlobalError({
//     error,
//     reset,
// }: {
//     error: Error & { digest?: string }
//     reset: () => void
// }) {
//     return (
//         <html>
//             <body>
//                 <h1>發生錯誤</h1>
//                 <div>
//                     <div>{error.message}</div>
//                     <Link href='https://tk-tipx.github.io/upptime/'>查看系統狀態</Link>
//                 </div>
//                 <button onClick={() => reset()}>重新整理</button>
//             </body>
//         </html>
//     )
// }

{
  /* <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
<div className='flex h-full w-full flex-col items-center justify-center'>
    <div className='text-2xl'>{errorMsg}</div>
    <button
        className='rounded-md bg-main-color-1 p-2 text-xl'
        onClick={
            // 重新整理
            () => location.reload()
        }
    >
        重新整理
    </button>
</div>
</div> */
}
const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
  return (
    <>
      <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-background'>
        <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
          <div className='text-2xl font-bold'>發生錯誤</div>
          <div className='text-xl font-bold'>{error.message}</div>
          <Link
            href='https://tk-tipx.github.io/upptime/'
            className='rounded-md bg-main-color-1 px-1'
          >
            查看系統狀態
          </Link>
          <button className='rounded-md bg-main-color-1 px-1' onClick={() => reset()}>
            重新整理
          </button>
        </div>
      </div>
    </>
  )
}

export default Error
