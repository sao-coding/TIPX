'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'

import Title from '@/components/Title'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Announcement } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useDrag } from '@use-gesture/react'

import PostCard from './post-card'
import PostCardAd from './post-card-ad'

const Loading = () => {
  return (
    <div className='flex h-36 flex-col gap-1 border-b border-background3 p-2 md:justify-between md:p-7'>
      <Skeleton className='my-1 h-4 w-20 bg-background2' />
      <div className='flex h-12 flex-col justify-around md:h-auto'>
        <Skeleton className='h-4 w-full bg-background2' />
        <Skeleton className='block h-4 w-full bg-background2 md:hidden' />
      </div>
      <Skeleton className='my-1 h-4 w-1/2 bg-background2' />
    </div>
  )
}

// 設定 Tabs 可以透過手勢滑動切換分頁
const PostList = () => {
  const { ref, inView } = useInView()

  const [position, setPosition] = React.useState({
    x: 0,
    dx: 0
  })

  const [mode, setMode] = React.useState<'inside' | 'outside' | 'sticky'>('inside')
  const [exclude, setExclude] = React.useState<'sticky' | 'inside' | 'outside' | ''>('sticky')
  const t = useTranslations('HomePage')
  const limit = 10
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    Announcement[]
  >({
    queryKey: ['announcement', mode, exclude],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `/api/post?type=all&page=${pageParam}&limit=${limit}&mode=${mode}&exclude=${exclude}`
      )
      return res.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      //   console.log({
      //     lastPage,
      //     allPages
      //   })
      return lastPage.length === limit ? allPages.length + 1 : undefined
    }
  })

  // // 滑動切換 3 種分頁 先判斷目前的分頁為何
  const bind = useDrag(({ movement: [x], direction: [dx] }) => {
    console.log({ x, dx })
    // setPosition({ x, dx })；
    if (Math.abs(x) > 10) {
      if (dx > 0) {
        if (mode === 'inside') {
          setMode('sticky')
          setExclude('')
        } else if (mode === 'outside') {
          setMode('inside')
          setExclude('sticky')
        } else if (mode === 'sticky') {
          setMode('outside')
          setExclude('sticky')
        }
      }
      if (dx < 0) {
        if (mode === 'inside') {
          setMode('outside')
          setExclude('sticky')
        } else if (mode === 'outside') {
          setMode('sticky')
          setExclude('')
        } else if (mode === 'sticky') {
          setMode('inside')
          setExclude('sticky')
        }
      }
    }
  })

  React.useEffect(() => {
    console.log({ inView, hasNextPage })
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const TabsListData = [
    { label: t('school-announcement'), value: 'inside' },
    { label: t('outside-announcement'), value: 'outside' },
    { label: t('sticky-announcement'), value: 'sticky' }
  ]

  const titleData = {
    title: t('title'),
    close: false,
    children: (
      <TabsList className='w-full'>
        {TabsListData.map((item) => (
          <TabsTrigger key={item.value} value={item.value} className='w-full'>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    )
  }

  // 新增一個渲染帖子列表的函數，包含廣告
  const renderPostsWithAds = (posts: Announcement[]) => {
    const postsWithAds: JSX.Element[] = []

    posts.forEach((post, index) => {
      // 添加文章
      postsWithAds.push(
        <React.Fragment key={post.id}>
          {index === posts.length - 1 ? (
            <PostCard ref={ref} post={post} />
          ) : (
            <PostCard post={post} />
          )}
        </React.Fragment>
      )

      // 每五篇文章後添加一個廣告
      if ((index + 1) % 5 === 0) {
        postsWithAds.push(
          <React.Fragment key={`ad-${index}`}>
            <PostCardAd />
          </React.Fragment>
        )
      }
    })

    return postsWithAds
  }

  return (
    <>
      <div className='sticky top-0 z-10 hidden items-center gap-2'>
        <span className='bg-background'>X:{position.x}</span>
        <span className='bg-background'>DX:{position.dx}</span>
      </div>
      <Tabs
        value={mode}
        onValueChange={(value) => {
          setMode(value as 'inside' | 'outside' | 'sticky')
          setExclude(value === 'inside' ? 'sticky' : value === 'outside' ? 'sticky' : '')
        }}
      >
        <Title {...titleData} />
        <div className='touch-manipulation' {...bind()}>
          <TabsContent value='inside'>
            <div className='overflow-hidden md:rounded-lg md:bg-background1'>
              {isSuccess && data.pages.map((page: Announcement[]) => renderPostsWithAds(page))}
              {isFetchingNextPage || !data
                ? Array.from(Array(10).keys()).map((index) => <Loading key={index} />)
                : !hasNextPage && (
                    <div className='my-4 text-center text-gray-500'>沒有更多公告了</div>
                  )}
            </div>
          </TabsContent>
          <TabsContent value='outside'>
            <div className='overflow-hidden md:rounded-lg md:bg-background1'>
              {isSuccess && data.pages.map((page: Announcement[]) => renderPostsWithAds(page))}
              {isFetchingNextPage || !data
                ? Array.from(Array(10).keys()).map((index) => <Loading key={index} />)
                : !hasNextPage && (
                    <div className='my-4 text-center text-gray-500'>沒有更多公告了</div>
                  )}
            </div>
          </TabsContent>
          <TabsContent value='sticky'>
            <div className='overflow-hidden md:rounded-lg md:bg-background1'>
              {isSuccess && data.pages.map((page: Announcement[]) => renderPostsWithAds(page))}
              {isFetchingNextPage || !data
                ? Array.from(Array(10).keys()).map((index) => <Loading key={index} />)
                : !hasNextPage && (
                    <div className='my-4 text-center text-gray-500'>沒有更多公告了</div>
                  )}
            </div>
          </TabsContent>
        </div>
        <div className='h-14 md:h-0'></div>
      </Tabs>
    </>
  )
}

export default PostList
