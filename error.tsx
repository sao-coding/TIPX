'use client'

// import Link from 'next/link'

// const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
//   return (
//     <>
//       <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-background'>
//         <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
//           <div className='text-2xl font-bold'>發生錯誤</div>
//           <div className='text-xl font-bold'>{error.message}</div>
//           <Link
//             href='https://tk-tipx.github.io/upptime/'
//             className='bg-main-color-1 rounded-md px-1'
//           >
//             查看系統狀態
//           </Link>
//           <button className='bg-main-color-1 rounded-md px-1' onClick={() => reset()}>
//             重新整理
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }

'use client'

const Error = () => {
  return <div>Oops, error!</div>
}

export default Error
