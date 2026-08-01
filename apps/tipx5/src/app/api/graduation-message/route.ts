import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'

export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)
  // 顯示畢業感言
  const messages = await prisma.graduationMessage.findMany({
    orderBy: { createdAt: 'desc' }
  })

  //  若是 role 是 USER 就把 userId 換成 anonymous
  if (auth?.role === 'USER') {
    messages.forEach((message) => {
      message.userId = 'anonymous'
    })
  }

  console.log('畢業感言', messages)

  return NextResponse.json({
    satus: 'success',
    messages: '畢業感言已成功獲取',
    data: messages
  })
}

export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  //   只要有登入都可以提交畢業感言
  if (!auth) {
    return NextResponse.json(
      {
        status: 'error',
        message: '未授權訪問，請先登入'
      },
      { status: 401 }
    )
  }

  // 提交畢業感言
  const { message } = await req.json()

  if (!message || message.trim() === '') {
    return NextResponse.json(
      {
        status: 'error',
        message: '留言內容不能為空'
      },
      { status: 400 }
    )
  }

  const newMessage = await prisma.graduationMessage.create({
    data: {
      content: message,
      userId: auth.userId
    }
  })

  return NextResponse.json({
    status: 'success',
    message: '畢業感言已成功提交',
    data: newMessage
  })
}
