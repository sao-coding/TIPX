const Loading = () => {
  return (
    <div className='absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2'>
      <div className='flex h-full w-full items-center justify-center'>
        <div className='cat'>
          <div className='cat__body'></div>
          <div className='cat__body'></div>
          <div className='cat__tail'></div>
          <div className='cat__head'></div>
        </div>
      </div>
    </div>
  )
}

export default Loading
