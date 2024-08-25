import { NextRequest, NextResponse } from 'next/server'

import api from '@/lib/api'

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await api.get(url, {
      responseType: 'arraybuffer'
    })

    const contentType = response.headers['content-type']

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}
