import { NextRequest, NextResponse } from 'next/server'

import getImgColor from '@/utils/img-color'

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get('url') || ''

  const color = await getImgColor(url)

  return NextResponse.json({ color })
}
