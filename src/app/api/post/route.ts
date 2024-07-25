// 學校公告
import { NextRequest, NextResponse } from 'next/server'

import getPost from '@/utils/post'

export const GET = async (req: NextRequest) => {
  // 獲取公告 全部貼文
  // 獲取除了校外公告的全部貼文
  const searchParams = req.nextUrl.searchParams
  if (searchParams.get('type') === 'all') {
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || undefined
    const mode = searchParams.get('mode') || 'all'
    const exclude = searchParams.get('exclude') || ''
    const PostListAll = await getPost('all', undefined, page, limit, mode, exclude)

    return NextResponse.json(PostListAll)
  }

  if (searchParams.get('type') === 'one' && searchParams.get('id')) {
    const id = Number(searchParams.get('id'))
    const Post = await getPost('one', id)

    return NextResponse.json(Post)
  }
}
