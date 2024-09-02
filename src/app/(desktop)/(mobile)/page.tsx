// import React from 'react'
// import { getServerSession } from 'next-auth'

// import authOptions from '@/lib/auth'

// import getSearchAuth from '@/utils/search-auth'
import PostList from './post-list'
const HomePage = async () => {
  // const searchAuth = await getSearchAuth('D11019139')
  // const session = await getServerSession(authOptions)
  // console.log({ session })
  return (
    <>
      <PostList />
    </>
  )
}

export default HomePage
