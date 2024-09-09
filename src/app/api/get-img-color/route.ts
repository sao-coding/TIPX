import { NextRequest, NextResponse } from 'next/server'

import getImgColor from '@/utils/img-color'

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get('url') || ''

  const color = await getImgColor(url)

  switch (color) {
    case 'URL parameter is required':
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    case 'Failed to process image':
      return NextResponse.json({ color: '#f97316' }, { status: 200 })
    default:
      return NextResponse.json({ color }, { status: 200 })
  }
}
