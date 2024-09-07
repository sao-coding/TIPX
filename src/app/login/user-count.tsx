'use client'

import React from 'react'
import { collection, getDocs, query } from 'firebase/firestore'

// import Counter from "@/components/transition/Counter"
// import { db } from '@/lib/firebase'
import { IconLoader2 } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const UserCount = () => {
  const {
    isLoading,
    isError,
    data: count
  } = useQuery<number>({
    queryKey: ['login-user-count'],
    queryFn: async () => {
      // const q = query(collection(db, 'users'))
      // const querySnapshot = await getDocs(q)
      // return querySnapshot.size
      const res = await fetch(`/api/analytics?type=user`)
      const data = await res.json()

      return data.count
    }
  })

  return <>{isLoading ? <IconLoader2 className='animate-spin' /> : <>{count}</>}</>
}

export default UserCount
