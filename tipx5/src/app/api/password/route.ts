import { NextRequest, NextResponse } from 'next/server'

import getAuth from '@/lib/get-auth'
import { prisma } from '@/lib/prisma'
// import getPasseord from '@/utils/password'

// 學校tip取得密碼
// export const GET = async (req: NextRequest) => {
//   const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
//   const auth = await getAuth(accessToken)

//   const searchParams = req.nextUrl.searchParams

//   const userid = searchParams.get('userid') ?? auth?.userId
//   const password = await getPasseord(userid ?? '')

//   return NextResponse.json({ password })
// }

// 獲取密碼
export const GET = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        password: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }

    return NextResponse.json({ password: user.password })
  } catch (error) {
    console.error('Error fetching password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 創建密碼
export const POST = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { password } = body

  // 密碼驗證
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/
  if (!passwordRegex.test(password)) {
    return NextResponse.json(
      {
        status: 'error',
        message: '密碼必須包含至少一個字母和一個數字，且長度至少為6個字元'
      },
      { status: 400 }
    )
  }

  try {
    await prisma.user.update({
      where: { id: auth.userId },
      data: {
        password: password
      }
    })
  } catch (error) {
    console.error('Error creating password:', error)
    return NextResponse.json({ status: 'error', message: '創建密碼失敗' }, { status: 500 })
  }

  return NextResponse.json({ status: 'success', message: '密碼創建成功' }, { status: 200 })
}

// 更新密碼
export const PATCH = async (req: NextRequest) => {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '') || ''
  const auth = await getAuth(accessToken)

  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { oldPassword, newPassword } = body

  // 新密碼驗證
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/
  if (!passwordRegex.test(newPassword)) {
    return NextResponse.json(
      {
        status: 'error',
        message: '新密碼必須包含至少一個字母和一個數字，且長度至少為6個字元'
      },
      { status: 400 }
    )
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId }
    })

    if (user?.password !== oldPassword) {
      return NextResponse.json({ status: 'error', message: '舊密碼不正確' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: auth.userId },
      data: {
        password: newPassword
      }
    })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json({ status: 'error', message: '更新密碼失敗' }, { status: 500 })
  }

  return NextResponse.json({ status: 'success', message: '密碼更新成功' }, { status: 200 })
}
