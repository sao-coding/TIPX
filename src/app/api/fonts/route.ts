import { NextRequest, NextResponse } from 'next/server'
import Fontmin from 'fontmin'
import path from 'path'

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const text = searchParams.get('text') || ''
  // public\fonts\筑紫A丸by_宁静之雨.ttf
  // console.log(fs.readdirSync(path.resolve('./public/fonts')))
  const fontmin = new Fontmin()
    // .src('public/fonts/筑紫A丸by_宁静之雨.ttf')
    // 使用絕對路徑
    .src(path.resolve('./public/fonts/筑紫A丸by_宁静之雨.ttf'))
    .use(Fontmin.glyph({ text }))
  const font = await fontmin.runAsync()
  //   console.log('font', font)
  //   font [
  //     <File "筑紫A丸by_宁静之雨.ttf" <Buffer 00 01 00 00 00 0b 00 80 00 03 00 30 47 50 4f 53 a6 23 7a 43 00 00 00 bc 00 00 00 ea 4f 53 2f 32 60 4e 34 f7 00 00 01 a8 00 00 00 60 63 6d 61 70 1b 4f ... 4082 more bytes>>
  //   ]。
  //   font
  // 输出 font 对象以检查其结构

  type fontFile = {
    contents: Buffer
  }

  // 假设 font[0] 是一个包含 Buffer 的对象
  const fontFile = font[0] as unknown as fontFile

  // 如果 fontFile 是一个对象且包含 buffer 属性
  // 请根据实际结构调整获取数据的方式
  if (fontFile && fontFile.contents) {
    const buffer = fontFile.contents
    const response = new NextResponse(buffer, {
      headers: {
        'Content-Type': 'font/ttf', // 根据实际字体类型设置
        'Content-Disposition': 'attachment; filename="font.ttf"' // 设置文件名
      }
    })
    return response
  } else {
    // 如果没有正确的 buffer 内容
    return new NextResponse('Error: Font file data not found', { status: 500 })
  }
}
