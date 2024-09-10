import sharp from 'sharp'

const getImgColor = async (url: string) => {
  if (!url) {
    return '#f97316'
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const image = sharp(buffer)
    const { dominant } = await image.stats()
    console.log({ dominant })

    const color = `#${dominant.r.toString(16).padStart(2, '0')}${dominant.g.toString(16).padStart(2, '0')}${dominant.b.toString(16).padStart(2, '0')}`

    // return NextResponse.json({ color }, { status: 200 })
    return color
  } catch (error) {
    console.error('Error processing image:', error)
    // return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
    // 因為沒有照片回傳預設值
    return '#f97316'
  }
}

export default getImgColor
